<template>
    <div :class="swithcClass" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <div class="e-field__control">
            <div class="e-field__slot" @click="change">
                <div v-if="!hideOverlay" class="e-field__overlay"></div>
                <label v-if="mounted" :class="[textColor, 'e-label']" :for="id" :style="labelStyle">
                    <slot name="label"> {{ label }} </slot>
                </label>
                <div :class="['e-field--selection-controls__field', switchColor]" :data-focused="focused">
                    <input v-if="mounted" :value="modelValue" :aria-checked="active" :id="id" role="switch" type="checkbox"
                        aria-disabled="false" @focus="handleFocus" @blur="handleBlur" />
                    <div :class="['e-field--selection-controls__ripple', switchColor]"></div>
                    <div :class="['e-field-switch__track', switchColor]"></div>
                    <div class="e-field-switch__thumb">
                        <template v-if="mounted">
                            <div v-show="loading" role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                class="e-progress-circular e-progress-circular--visible e-progress-circular--indeterminate"
                                style="height: 16px; width: 16px">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    viewBox="22.857142857142858 22.857142857142858 45.714285714285715 45.714285714285715"
                                    style="transform: rotate(0deg)">
                                    <circle fill="transparent" cx="45.714285714285715" cy="45.714285714285715" r="20"
                                        stroke-width="5.714285714285714" stroke-dasharray="125.664"
                                        stroke-dashoffset="125.66370614359172px" class="e-progress-circular__overlay">
                                    </circle>
                                </svg>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
            <EDetails :details="details" :textColor="textColor" :showDetails="showDetails" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { useGrid } from "@/composables/grid"
import { useField } from "@/composables/field"

import EDetails from '@/components/form/details.vue'

import { computed } from "vue";

export interface Props {
    disabled?: boolean; dense?: boolean; readonly?: boolean; color?: string; loading?: boolean
    labelInline?: boolean; detail?: string; outlined?: boolean; label?: string | number;
    detailErrors?: Array<string>; detailsOnMessageOnly?: boolean; appendIcon?: string; retainColor?: boolean;
    labelMinWidth?: string; prependIcon?: string; rules?: Array<(param: any) => string | boolean>;
    cols?: string | number; xs?: string | number; sm?: string | number; md?: string | number; hideOverlay?: boolean;
    lg?: string | number; xl?: string | number; modelValue: string | number | boolean;
    trueValue?: boolean | string | number, falseValue?: boolean | string | number
}
const props = withDefaults(defineProps<Props>(), { falseValue: false, trueValue: true })

const { fieldClass, id, showDetails, textColor, configuration, details, labelStyle, focused, mounted,
    handleHover, handleBlur, handleFocus } = useField()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean | string | number): void
}>()

const { gridClass } = useGrid('e-field')

const switchColor = computed(() => {
    const color = props.color || configuration.color
    return textColor.value || color ? `${color}--text` : ''
})

const swithcClass = computed((): Array<string> => {
    const classes = [...fieldClass.value, 'e-field-switch', 'e-field--selection-controls', ...gridClass.value]
    active.value && classes.push('e-field-switch--active')
    return classes
})
const active = computed((): boolean => props.modelValue === props.trueValue)


const change = (): void => {
    if (!props.readonly)
        emit('update:modelValue', active.value ? props.falseValue : props.trueValue)
}

</script>
<style lang="scss" src="./style.scss"></style>
  