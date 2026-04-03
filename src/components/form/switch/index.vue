<template>
    <div :class="switchClass" :style="fieldStyle" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
        <div class="e-field__control">
            <div class="e-field__slot" @click="handleSlotClick">
                <div v-if="showOverlay" class="e-field__overlay"></div>
                <label class="e-label" :for="id" :style="labelStyle">
                    <slot name="label"> {{ label }} </slot>
                </label>
                <div class="e-field__selection-control e-field__control-wrapper" :data-focused="focused">
                    <input ref="input" v-model="checkedModel" :value="trueValue" :aria-checked="checkedModel" :id="id" role="switch" type="checkbox"
                        :disabled="isControlNonInteractive" :aria-invalid="hasError" :aria-describedby="detailsId" :aria-disabled="isControlNonInteractive"
                        :aria-readonly="isReadonly" :aria-busy="isLoading || undefined" @focus="handleFocus" @blur="handleBlur" />
                    <div class="e-field__selection-ripple"></div>
                    <div class="e-field-switch__track"></div>
                    <div class="e-field-switch__thumb">
                        <template v-if="mounted">
                            <div v-show="isLoading" aria-hidden="true"
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
            <EDetails :id="detailsId" :details="details" :hasError="hasError" :model-value="modelValue" :show-details="showDetails" />
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { useGridCol } from "@/composables/grid-col"
import { useField } from "@/composables/field"
import type { SwitchProps, SwitchValue } from "@/types/switch"

import EDetails from '@/components/form/details.vue'

import { computed, ref } from "vue";

const props = withDefaults(defineProps<SwitchProps>(), {
    falseValue: false,
    trueValue: true,
    showOverlay: false,
})
const input = ref<HTMLInputElement | null>(null)

const { fieldClass, id, showDetails, details, fieldStyle, labelStyle, focused, mounted,
    handleHover, handleBlur, handleFocus, isDisabled, isReadonly, hasError,
    focus, blur, validate, reset, resetValidation } = useField<SwitchValue>()

const emit = defineEmits({
    'update:modelValue': (_value: SwitchValue) => true,
    focus: (_value: FocusEvent) => true,
    blur: (_value: Event) => true,
})

const { gridColClass } = useGridCol(props)
const isLoading = computed((): boolean => Boolean(props.loading))

const switchClass = computed((): Array<string> => {
    const classes = [...fieldClass.value, 'e-field-switch', 'e-field--selection-controls', ...gridColClass.value]
    checkedModel.value && classes.push('e-field-switch--active')
    isLoading.value && classes.push('e-field-switch--loading')
    return classes
})
const isControlNonInteractive = computed((): boolean => {
    return isDisabled.value || isReadonly.value || isLoading.value
})
const checkedModel = computed({
    get: (): boolean => props.modelValue === props.trueValue,
    set: (checked: boolean): void => {
        if (isControlNonInteractive.value) {
            if (input.value) input.value.checked = checkedModel.value
            return
        }

        emit('update:modelValue', checked ? props.trueValue : props.falseValue)
    },
})
const detailsId = computed((): string | undefined => showDetails.value ? `${id}-details` : undefined)

const isNativeSlotTarget = (target: EventTarget | null): boolean => {
    return target instanceof Element && Boolean(target.closest('input, label'))
}

const handleSlotClick = (event: MouseEvent): void => {
    if (isNativeSlotTarget(event.target)) return

    focus()

    if (isControlNonInteractive.value) return

    checkedModel.value = !checkedModel.value
}

defineExpose({
    focus,
    blur,
    validate,
    reset,
    resetValidation,
    input,
})

</script>
<style lang="scss" src="./style.scss"></style>
  