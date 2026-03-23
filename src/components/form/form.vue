<template>
    <form ref="form" :class="mergedClass" :style="mergedStyle" v-on:submit="submit">
        <slot></slot>
    </form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: "EForm"
})
</script>
  
<script lang="ts" setup>
import { FORM_KEY } from '@/components/form/constants';
import { useGridRow } from '@/composables/grid-row';
import type { EField, ElevationProps, FieldConfiguration, FieldLabelBehavior, RowProps } from '@/types';
import { getColorContrastCssValue, getColorCssValue, normalizeCssSize } from '@/utils/style';
import { computed, nextTick, provide, reactive, ref, watch } from 'vue';

export interface Props extends RowProps, ElevationProps {
    modelValue?: boolean | undefined
    lazy?: boolean
    focusFirstInvalid?: boolean
    validateOnSubmit?: boolean
    outlined?: boolean
    disabled?: boolean
    readonly?: boolean
    labelBehavior?: FieldLabelBehavior
    labelMinWidth?: string | number
    retainColor?: boolean
    fieldColor?: string
    color?: string
    table?: boolean
    tableLineColor?: string
    tableCellBackgroundColor?: string
    tableFieldColor?: string
    tableLineOpacity?: string | number
}

const props = withDefaults(defineProps<Props>(), { modelValue: undefined})
const form = ref<HTMLFormElement | null>(null)

const { gridRowClass, gridRowStyle } = useGridRow(props)

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', value: SubmitEvent): void
    (e: 'submit-invalid', value: SubmitEvent): void
}>()

const state = reactive({
    fieldsChild: new Array<Partial<EField>>(),
    fieldsChildError: new Array<boolean>(),
});

const effectiveConfiguration = computed<FieldConfiguration>(() => {
    const configuration: FieldConfiguration = {
        retainColor: Boolean(props.retainColor),
        dense: Boolean(props.dense),
        disabled: Boolean(props.disabled),
        readonly: Boolean(props.readonly),
        outlined: Boolean(props.outlined),
        labelBehavior: props.labelBehavior,
    }

    const labelMinWidth = normalizeCssSize(props.labelMinWidth)

    if (labelMinWidth) {
        configuration.labelStyle = { minWidth: labelMinWidth }
    }

    const resolvedFieldColor = props.fieldColor || props.color

    if (resolvedFieldColor) {
        configuration.color = resolvedFieldColor
    }

    return configuration
})

const formClass = computed(() => {
    const result: Array<string> = ['e-form']
    props.outlined && result.push('e-form--outlined')
    props.disabled && result.push('e-form--disabled')
    props.readonly && result.push('e-form--readonly')
    props.table && result.push('e-form--table')
    props.elevation && result.push(`e-elevation--${props.elevation}`)
    return result
})

const formStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}

    if (!props.table) {
        return result
    }

    const legacyTableLineColor = !props.tableLineColor && !props.fieldColor ? props.color : undefined
    const resolvedTableLineColor = props.tableLineColor || legacyTableLineColor
    const resolvedTableCellBackgroundColor = props.tableCellBackgroundColor || props.tableFieldColor

    const resolvedLineColor = getColorCssValue(resolvedTableLineColor)
    const resolvedCellBackgroundColor = getColorCssValue(resolvedTableCellBackgroundColor)
    const resolvedLegacyContrastCellBackgroundColor = getColorContrastCssValue(legacyTableLineColor, {
        fallbackContrast: 'var(--e-color-surface-1, white)',
    })
    const resolvedLineOpacity = props.tableLineOpacity

    result['--e-form-table-line-color'] = resolvedLineColor || 'var(--e-contrast-surface-1, rgba(0, 0, 0, 0.87))'
    result['--e-form-table-field-bg'] = resolvedCellBackgroundColor || resolvedLegacyContrastCellBackgroundColor || 'var(--e-color-surface-1, white)'

    if (resolvedLineOpacity !== undefined && resolvedLineOpacity !== null && resolvedLineOpacity !== '') {
        result['--e-form-table-line-opacity'] = String(resolvedLineOpacity)
    }

    return result
})

const effectiveGridRowStyle = computed<Record<string, string>>(() => {
    const result = { ...gridRowStyle.value }

    if (props.table && !result['--e-grid-gap']) {
        result['--e-grid-gap'] = '1px'
    }

    return result
})

const mergedClass = computed<Array<string>>(() => [
    ...formClass.value,
    ...gridRowClass.value,
])

const mergedStyle = computed<Record<string, string>>(() => ({
    ...formStyle.value,
    ...effectiveGridRowStyle.value,
}))

watch(() => state.fieldsChildError, (val: Array<boolean>) => {
    const valid = !val.find((e) => !!e)
    changeValue(valid)
}, { deep: true })

const submit = async (event: Event): Promise<void> => {
    event.preventDefault()

    if (props.validateOnSubmit) {
        const valid = await validate()

        if (!valid) {
            emit('submit-invalid', event as SubmitEvent)
            return
        }
    }

    emit('submit', event as SubmitEvent)
}

const bindField = (component: Partial<EField>) => {
    state.fieldsChild.push(component);
    state.fieldsChildError.push(Boolean(component.hasError));
    component.setConfiguration?.(effectiveConfiguration.value);
}

const unbindField = (uid: number) => {
    const index = state.fieldsChild.findIndex((c) => c.uid === uid);
    if (index > -1) {
        state.fieldsChild.splice(index, 1);
        state.fieldsChildError.splice(index, 1);
    }
}

const updateField = (component: Partial<EField>) => {
    const index = state.fieldsChild.findIndex((c) => c.uid === component.uid);
    if (index > -1) {
        state.fieldsChildError.splice(index, 1, Boolean(component.hasError))
    }
}

provide(FORM_KEY, {
    bindField,
    unbindField,
    updateField
});

const changeValue = (value: boolean): void => {
    emit('update:modelValue', value)
}

const reset = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.reset?.();
    });
}

const resetValidation = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.resetValidation?.();
    });
}

const setConfiguration = (): void => {
    state.fieldsChild.forEach((vueComponent) => {
        vueComponent.setConfiguration?.(effectiveConfiguration.value);
    });
}

watch(effectiveConfiguration, () => setConfiguration(), { deep: true, immediate: true })

const getFirstInvalidField = (): Partial<EField> | undefined => {
    const invalidIndex = state.fieldsChildError.findIndex(Boolean)
    return invalidIndex >= 0 ? state.fieldsChild[invalidIndex] : undefined
}

const validate = async (): Promise<boolean> => {
    let valid = true;
    state.fieldsChild.forEach((vueComponent) => {
        if (!vueComponent.validate?.()) {
            //form is not valid if almost one field is invalid 
            valid = false
        }
    });
    await nextTick()

    if (!valid && props.focusFirstInvalid) {
        getFirstInvalidField()?.focus?.()
    }

    return valid
}

defineExpose({ validate, reset, resetValidation })

</script>
<style lang="scss" src="./style.scss"></style>