<template>
    <EField ref="field" v-bind="fieldProps" class="e-textarea">
        <template v-if="$slots.prepend" #prepend>
            <slot name="prepend"></slot>
        </template>

        <template v-if="$slots.append" #append>
            <slot name="append"></slot>
        </template>

        <template #control="{
            controlClass, controlId, detailsId, handleBlur,
            handleFocus, hasError, isDisabled,
            isLabelFloating, isReadonly, shouldFloatLabel,
        }">

            <textarea ref="input" :id="controlId" :value="inputValue" :rows="rows" :maxlength="limit" :name="name"
                :readonly="isReadonly" :disabled="isDisabled" :autocomplete="autocomplete"
                :placeholder="resolvePlaceholder(isLabelFloating, shouldFloatLabel)" :spellcheck="spellcheck"
                :autocapitalize="autocapitalize" :enterkeyhint="enterkeyhint" :aria-invalid="hasError"
                :aria-describedby="detailsId" :aria-disabled="isDisabled" :aria-readonly="isReadonly"
                :class="['e-textarea__input', controlClass]" :style="inputStyle" @blur="handleBlur"
                @change="handleChange" @focus="handleFocus" @input="handleInput" @keydown="handleKeydown"
                @keyup="handleKeyup" @compositionstart="handleCompositionStart"
                @compositionend="handleCompositionEnd"></textarea>

        </template>

        <template #details="slotProps">
            <slot name="details" v-bind="slotProps">
                <EDetails :id="slotProps.detailsId" :counter="counter" :details="slotProps.details"
                    :has-error="slotProps.hasError" :limit="limit" :model-value="modelValue"
                    :show-details="slotProps.showDetails" />
            </slot>
        </template>
    </EField>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from "vue";

import EDetails from "@/components/form/details.vue";
import EField from "@/components/form/field/index.vue";
import { useTextInput } from "@/composables/text-input";
import type {
    EFieldProps,
    TextInputEmits,
    TextInputElement,
    TextInputValue,
    UseTextInputProps,
} from "@/types";
import type { EField as EFieldContract } from "@/types";

export interface Props extends UseTextInputProps<TextInputValue> {
    counter?: boolean;
    prefix?: string;
    rows?: number | string;
    suffix?: string;
}

type FieldInstance = Pick<EFieldContract, "focus" | "reset" | "resetValidation" | "validate"> & {
    blur?: () => void;
};

const props = withDefaults(defineProps<Props>(), {
    inputAlign: "start",
    modelModifiers: () => ({}),
    rows: 3,
    spellcheck: false,
});

const emit = defineEmits<TextInputEmits>();

useSlots();

const field = ref<FieldInstance | null>(null);
const input = ref<TextInputElement | null>(null);

const fieldProps = computed<EFieldProps<unknown>>(() => ({
    appendIcon: props.appendIcon,
    color: props.color,
    cols: props.cols,
    dense: props.dense,
    detail: props.detail,
    detailErrors: props.detailErrors,
    detailsOnMessageOnly: props.detailsOnMessageOnly,
    disabled: props.disabled,
    label: props.label,
    labelBehavior: props.labelBehavior,
    labelMinWidth: props.labelMinWidth,
    lg: props.lg,
    md: props.md,
    modelValue: props.modelValue,
    outlined: props.outlined,
    prependIcon: props.prependIcon,
    readonly: props.readonly,
    retainColor: props.retainColor,
    rules: props.rules as EFieldProps<unknown>["rules"],
    sm: props.sm,
    xl: props.xl,
    xs: props.xs,
}));

const inputStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {};

    if (props.inputAlign) {
        result.textAlign = String(props.inputAlign);
    }

    return result;
});

const focus = (): void => {
    field.value?.focus?.();
};

const blur = (): void => {
    field.value?.blur?.();
};

const canClear = computed(() => {
    return Boolean(
        props.clearable
        && !props.disabled
        && !(props.readonly || props.inputReadonly)
        && (props.modelValue !== undefined && props.modelValue !== null && `${props.modelValue}`.length > 0),
    );
});

const resolvePlaceholder = (
    isLabelFloating: boolean,
    shouldFloatLabel: boolean,
): string | undefined => {
    if (!props.placeholder) return undefined;
    if (!isLabelFloating) return props.placeholder;

    return shouldFloatLabel ? props.placeholder : undefined;
};

const {
    inputValue,
    handleChange,
    handleCompositionEnd,
    handleCompositionStart,
    handleInput,
    handleKeydown,
    handleKeyup,
} = useTextInput({
    props,
    emit,
    input,
    focus,
    canClear,
});

const select = (): void => {
    input.value?.select();
};

defineExpose({
    blur,
    focus,
    input,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
    select,
    validate: () => field.value?.validate() ?? true,
});
</script>

<style lang="scss" src="./index.scss"></style>
