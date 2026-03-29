<template>
    <div :class="radioGroupClass" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <div class="e-field__control">
            <div class="e-field__slot ">
                <div v-if="showOverlay" class="e-field__overlay"></div>
                <label :id="labelId" :class="[
                    'e-label',
                    {
                        'e-label--floating': isLabelFloating,
                        'e-label--floated': shouldFloatLabel,
                    },
                ]" :style="labelStyle">
                    <slot name="label"> {{ label }} </slot>
                </label>
                <div role="radiogroup" :aria-labelledby="labelId" :aria-describedby="detailsId" :aria-invalid="hasError"
                    :aria-disabled="isDisabled" :aria-readonly="isReadonly" class="e-field--radio-group__field">
                    <slot></slot>
                </div>
                <div v-if="!outlined && !flat" class="e-field__line"></div>
            </div>
            <EDetails :id="detailsId" :details="details" :hasError="hasError" :modelValue="modelValue" :showDetails="showDetails" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, reactive, watch } from "vue";
import type { ERadio, ERadioType, FieldBaseProps, FieldConfiguration } from "@/types"
import { normalizeCssSize } from "@/utils/style"

import EDetails from '@/components/form/details.vue'
import { RADIO_GROUP_KEY } from "./constants"

export interface Props extends FieldBaseProps<ERadioType> {
    mandatory?: boolean;
    modelValue: ERadioType;
    row?: boolean;
    showOverlay?: boolean;
    flat?: boolean;
}
import { useField } from "@/composables/field"
import { useGridCol } from "@/composables/grid-col"
const props = withDefaults(defineProps<Props>(), {
    showOverlay: false,
})

const { fieldClass, id, isDisabled, isReadonly, isLabelFloating, shouldFloatLabel, showDetails, hasError,
    handleBlur, details, labelStyle, handleHover, handleFocus, configuration } = useField()

const labelId = computed(() => `${id}-label`)
const detailsId = computed((): string | undefined => showDetails.value ? `${id}-details` : undefined)
const shouldRowFloatLabel = computed(() => Boolean(props.row && shouldFloatLabel.value))

const { gridColClass } = useGridCol(props, 'e-field')

const radioGroupClass = computed(() => {
    const result = [...fieldClass.value, 'e-field--selection-controls e-field e-field--radio-group', ...gridColClass.value]
    props.row ? result.push('e-field--radio-group--row') : result.push('e-field--radio-group--column')
    return result
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: ERadioType): void
    (e: 'focus', event: FocusEvent): void
    (e: 'blur', event: Event): void
}>()

const state = reactive<{ radioChilds: Array<Partial<ERadio>> }>({ radioChilds: [] })
const hasSelectedRadio = computed(() => {
    return state.radioChilds.some((radio) => Object.is(radio.modelValue, props.modelValue))
})
const canInitializeMandatoryValue = computed(() => {
    return props.mandatory && !isDisabled.value && !isReadonly.value && !hasSelectedRadio.value
})

const radioConfiguration = computed((): FieldConfiguration => {
    const nextConfiguration: FieldConfiguration = {
        retainColor: Boolean(props.retainColor || configuration.retainColor),
        disabled: Boolean(props.disabled || configuration.disabled),
        readonly: Boolean(props.readonly || configuration.readonly),
    }

    const labelMinWidth = normalizeCssSize(props.labelMinWidth)
    const inheritedLabelStyle = configuration.labelStyle ? { ...configuration.labelStyle } : {}

    if (labelMinWidth) {
        inheritedLabelStyle.minWidth = labelMinWidth
    }

    if (Object.keys(inheritedLabelStyle).length > 0) {
        nextConfiguration.labelStyle = inheritedLabelStyle
    }

    const resolvedColor = props.color || configuration.color

    if (resolvedColor) {
        nextConfiguration.color = resolvedColor
    }

    return nextConfiguration
})

const applyRadioConfiguration = (component?: Partial<ERadio>): void => {
    if (component) {
        component.setConfiguration?.(radioConfiguration.value)
        return
    }

    state.radioChilds.forEach((vueComponent) => {
        vueComponent.setConfiguration?.(radioConfiguration.value)
    })
}

const bindRadio = (component: Partial<ERadio>) => {
    state.radioChilds.push(component)
    applyRadioConfiguration(component)
}

const unbindRadio = (uid: number) => {
    const index = state.radioChilds.findIndex((c) => c.uid === uid);
    (index > -1) && (state.radioChilds.splice(index, 1))
}
const changeModelValue = (value: ERadioType): void => emit('update:modelValue', value)

provide(RADIO_GROUP_KEY, { bindRadio, unbindRadio, handleFocus, handleBlur, changeModelValue, modelValue: computed(() => props.modelValue), name: id });

onMounted(() => init())

watch(radioConfiguration, () => applyRadioConfiguration(), { deep: true, immediate: true })

const init = async (): Promise<void> => {
    await nextTick()

    if (!canInitializeMandatoryValue.value) return

    const firstRadioValue = state.radioChilds[0]?.modelValue

    if (firstRadioValue === undefined) return

    changeModelValue(firstRadioValue)
}

</script>
<style lang="scss" src="./style.scss"></style>
  