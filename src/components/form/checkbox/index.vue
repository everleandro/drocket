<template>
    <div :class="checkboxClass" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <div class="e-field__control">
            <div v-if="!hideOverlay" class="e-field__overlay"></div>
            <div class="e-field__slot">
                <div :class="['e-field--selection-controls__field']" :data-focused="controlFocused">
                    <span aria-hidden="true" class="e-icon" :class="checkboxColor"><svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24" role="img" aria-hidden="true" class="e-icon__svg">
                            <path v-if="checked"
                                d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z">
                            </path>
                            <path v-else
                                d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z">
                            </path>
                        </svg>
                    </span>

                    <input v-if="mounted" ref="input" :aria-checked="checked" :id="id" role="checkbox" type="checkbox"
                        @input="change" :value="checked" @focus="handleCheckboxFocus" @blur="handleCheckboxBlur" />
                    <div v-ripple="{ center: true }" class="e-field--selection-controls__ripple" :class="checkboxColor"
                        @click="change"></div>
                </div>
                <label v-if="mounted" :class="[textColor, 'e-label']" :for="id">
                    <slot name="label"> {{ label }} </slot>
                </label>
            </div>
            <EDetails :details="details" :modelValue="modelValue" :textColor="textColor" :showDetails="showDetails" />
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useGrid } from "@/composables/grid"
import { useField } from "@/composables/field"

import EDetails from '@/components/form/details.vue'

export interface Props {
    disabled?: boolean; dense?: boolean; readonly?: boolean; trueValue?: string | number | boolean;
    labelInline?: boolean; detail?: string; outlined?: boolean; label?: string | number;
    falseValue?: string | number | boolean; modelValue: boolean | string | number; color?: string;
    detailErrors?: Array<string>; detailsOnMessageOnly?: boolean; retainColor?: boolean; hideOverlay?: boolean;
    rules?: Array<(param: any) => string | boolean>; cols?: string | number; xs?: string | number;
    sm?: string | number; md?: string | number; lg?: string | number; xl?: string | number;
}
const props = withDefaults(defineProps<Props>(), { trueValue: true, falseValue: false })
const controlFocused = ref(false)
const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | boolean): void
}>()

const checkboxClass = computed(() => {
    return [...fieldClass.value, ' e-field--selection-controls', 'e-checkbox-field', ...gridClass.value]
})

const { fieldClass, id, showDetails, textColor, details, handleHover, handleBlur, handleFocus, configuration, mounted } = useField()
const { gridClass } = useGrid('e-field')

const checkboxColor = computed(() => {
    const color = props.color || configuration.color
    return textColor.value || color ? `${color}--text` : ''
})
const checked = computed(() => {
    return props.modelValue === props.trueValue;
})

const handleCheckboxFocus = (evt: FocusEvent): void => {
    controlFocused.value = true
    handleFocus(evt)
}

const handleCheckboxBlur = (evt: FocusEvent): void => {
    controlFocused.value = false
    handleBlur(evt)
}
const change = (): void => {
    if (!props.readonly) {
        const value = checked.value ? props.falseValue : props.trueValue;
        emit('update:modelValue', value)
    }
}
</script>
<style lang="scss" src="./style.scss"></style>