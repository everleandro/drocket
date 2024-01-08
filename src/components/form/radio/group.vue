<template>
    <div :class="radioGroupClass" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <div class="e-field__control">
            <div class="e-field__slot ">
                <div v-if="!hideOverlay" class="e-field__overlay"></div>
                <label :class="[textColor, 'e-label']" :style="labelStyle">
                    <slot name="label"> {{ label }} </slot>
                </label>
                <div role="radiogroup" :aria-labelledby="id" class="e-field--radio-group__field">
                    <slot></slot>
                </div>
                <div v-if="!outlined && !flat" class="e-field__line"></div>
            </div>
            <EDetails :details="details" :modelValue="modelValue" :textColor="textColor" :showDetails="showDetails" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, reactive, watch } from "vue";
import { Radio, radioType } from "@/types"

import EDetails from '@/components/form/details.vue'

export interface Props {
    mandatory?: boolean, modelValue: radioType, row?: boolean, label?: string,
    labelMinWidth?: string, disabled?: boolean, color?: string, retainColor?: boolean; hideOverlay?: boolean;
    readonly?: boolean, outlined?: boolean, dense?: boolean; inputReadonly?: boolean
    labelInline?: boolean; detail?: string; detailErrors?: Array<string>; flat?: boolean;
    detailsOnMessageOnly?: boolean; rules?: Array<(param: any) => string | boolean>;
    cols?: string | number; xs?: string | number; sm?: string | number;
    md?: string | number; lg?: string | number; xl?: string | number;
}
import { useField } from "@/composables/field"
import { useGrid } from "@/composables/grid"
const props = defineProps<Props>()

const { fieldClass, id, showDetails, handleBlur, textColor, details, labelStyle, handleHover, handleFocus, configuration } = useField()

const { gridClass } = useGrid('e-field')

const radioGroupClass = computed(() => {
    const result = [...fieldClass.value, 'e-field--selection-controls e-field e-field--radio-group', ...gridClass.value]
    props.row ? result.push('e-field--radio-group--row') : result.push('e-field--radio-group--column')
    return result
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: radioType): void
}>()

watch(() => configuration.color, (value: string) => setConfiguration('color', value))
watch(() => props.color, (value: string = 'primary') => setConfiguration('color', value))

const state = reactive({ radioChilds: new Array<Partial<Radio>>() })

const setConfiguration = (key?: string, value?: any): void => {
    state.radioChilds.forEach((vueComponent) => {
        const configuration: Record<string, any> = {}
        if (key && value) {
            configuration[key] = value;
        } else {
            props.labelMinWidth && (configuration.labelStyle = { minWidth: `${props.labelMinWidth}px` })
            props.color && (configuration.color = props.color)
        }
        vueComponent.setConfiguration?.(configuration);
    });
}

const bindRadio = (component: Partial<Radio>) => state.radioChilds.push(component)

const unbindRadio = (uid: number) => {
    const index = state.radioChilds.findIndex((c) => c.uid === uid);
    (index > -1) && (state.radioChilds.splice(index, 1))
}
const changeModelValue = (value: radioType): void => emit('update:modelValue', value)

provide("ERadioGroup", { bindRadio, unbindRadio, handleFocus, handleBlur, changeModelValue, modelValue: computed(() => props.modelValue) });

onMounted(() => init())

const init = async (): Promise<void> => {
    setConfiguration()
    await nextTick()
    props.mandatory && changeModelValue(state.radioChilds[0]?.modelValue)
}

</script>
<style lang="scss" src="./style.scss"></style>
  