<template>
    <div
        :class="checkboxClass"
        :style="fieldStyle"
        @mouseenter="handleHover(true)"
        @mouseleave="handleHover(false)"
    >
        <div class="e-checkbox-field__control-shell e-field__control">
            <div class="e-checkbox-field__slot e-field__slot" @click="handleSlotClick">
                <div v-if="showOverlay" class="e-field__overlay"></div>
                <div class="e-checkbox-field__control" :data-focused="focused">
                    <div class="e-checkbox-field__visual" aria-hidden="true">
                        <span class="e-checkbox-field__icon e-icon"><svg
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" role="img"
                            aria-hidden="true" class="e-icon__svg">
                            <path v-if="checkedModel"
                                            d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3Z">
                            </path>
                            <path v-else
                                            d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z">
                            </path>
                        </svg>
                        </span>
                    </div>

                    <input
                        class="e-checkbox-field__input"
                        ref="input"
                        v-model="checkedModel"
                        :value="trueValue"
                        :aria-checked="checkedModel"
                        :id="id"
                        role="checkbox"
                        type="checkbox"
                        :disabled="isControlNonInteractive"
                        :aria-invalid="hasError"
                        :aria-describedby="detailsId"
                        :aria-disabled="isControlNonInteractive"
                        :aria-readonly="isReadonly"
                        @focus="handleFocus"
                        @blur="handleBlur"
                    />
                    <div
                        v-ripple="{ center: true }"
                        class="e-checkbox-field__ripple"
                    ></div>
                </div>
                <label class="e-checkbox-field__label e-label ignore-field-color" :for="id" :style="labelStyle">
                    <slot name="label"> {{ label }} </slot>
                </label>
            </div>
            <EDetails
                :id="detailsId"
                :details="details"
                :has-error="hasError"
                :model-value="modelValue"
                :show-details="showDetails"
            />
        </div>
    </div>
</template>
<script lang="ts" setup>
import type { CheckboxEmits, CheckboxProps, CheckboxValue } from "@/types";
import { ripple } from "@/directives";
import { computed, ref } from "vue";
import { useGridCol } from "@/composables/grid-col";
import { useField } from "@/composables/field";

import EDetails from "@/components/form/details.vue";
const vRipple = { ...ripple };
const props = withDefaults(defineProps<CheckboxProps>(), {
    trueValue: true,
    falseValue: false,
    showOverlay: false,
});

const input = ref<HTMLInputElement | null>(null);

const emit = defineEmits<CheckboxEmits>();

const {
    fieldClass,
    fieldStyle,
    id,
    focused,
    focus,
    blur,
    showDetails,
    details,
    hasError,
    labelStyle,
    handleHover,
    handleBlur,
    handleFocus,
    isDisabled,
    isReadonly,
    validate,
    reset,
    resetValidation,
} = useField<CheckboxValue>();

const { gridColClass } = useGridCol(props);

const checkboxClass = computed(() => [
    ...fieldClass.value,
    "e-checkbox-field",
    checkedModel.value && "e-checkbox-field--active",
    ...gridColClass.value,
].filter(Boolean));

const isControlNonInteractive = computed((): boolean => {
    return isDisabled.value || isReadonly.value;
});

const checkedModel = computed({
    get: (): boolean => props.modelValue === props.trueValue,
    set: (checked: boolean): void => {
        if (isControlNonInteractive.value) {
            if (input.value) input.value.checked = checkedModel.value;
            return;
        }

        emit("update:modelValue", checked ? props.trueValue : props.falseValue);
    },
});

const detailsId = computed((): string | undefined => showDetails.value ? `${id}-details` : undefined);

const isNativeSlotTarget = (target: EventTarget | null): boolean => {
    return target instanceof Element && Boolean(target.closest("input, label"));
};

const handleSlotClick = (event: MouseEvent): void => {
    if (isNativeSlotTarget(event.target)) return;

    focus();

    if (isControlNonInteractive.value) return;

    checkedModel.value = !checkedModel.value;
};

defineExpose({
    focus,
    blur,
    validate,
    reset,
    resetValidation,
    input,
});
</script>
<style lang="scss" src="./style.scss"></style>