<template>
  <EField ref="field" v-bind="fieldProps" class="e-text-field">
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>

    <template v-if="hasPrependContent" #prepend>
      <div
        v-if="hasPrependSlot"
        class="e-text-field__prepend e-field__prepend-inner"
      >
        <slot name="prepend"></slot>
      </div>
      <div
        v-if="prependIcon"
        class="e-text-field__prepend e-field__prepend-inner"
      >
        <div class="e-field__icon e-field__icon--prepend-inner">
          <EIcon :icon="prependIcon" />
        </div>
      </div>
    </template>

    <template v-if="hasAppendContent" #append>
      <div v-if="appendIcon" class="e-text-field__append e-field__append-inner">
        <div class="e-field__icon e-field__icon--append">
          <EIcon :icon="appendIcon" />
        </div>
      </div>
      <div
        v-if="hasAppendSlot"
        class="e-text-field__append e-field__append-inner"
      >
        <slot name="append"></slot>
      </div>
    </template>

    <template
      #control="{
        controlId,
        detailsId,
        handleBlur,
        handleFocus,
        hasError,
        isDisabled,
        isLabelFloating,
        shouldFloatLabel,
      }"
    >
      <div
        v-if="prefix"
        class="e-text-field__prefix e-field__prefix"
        aria-hidden="true"
        @click="focus"
      >
        {{ prefix }}
      </div>

      <input
        ref="input"
        :id="controlId"
        :value="inputValue"
        :readonly="textInputReadonly"
        :disabled="isDisabled"
        class="e-text-field__input input--text e-field__field-control"
        :maxlength="limit"
        :style="inputStyle"
        :type="type"
        :placeholder="resolvePlaceholder(isLabelFloating, shouldFloatLabel)"
        :name="name"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :spellcheck="spellcheck"
        :autocapitalize="autocapitalize"
        :enterkeyhint="enterkeyhint"
        :aria-invalid="hasError"
        :aria-describedby="detailsId"
        :aria-disabled="isDisabled"
        :aria-readonly="textInputReadonly"
        @blur="handleBlur"
        @change="handleChange"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
        @keyup="handleKeyup"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      />

      <div
        v-if="suffix"
        class="e-text-field__suffix e-field__suffix"
        aria-hidden="true"
        @click="focus"
      >
        {{ suffix }}
      </div>

      <transition name="scale">
        <div
          v-show="canClear"
          class="e-text-field__clear e-field__append-inner"
        >
          <div class="e-field__icon e-field__icon--clear">
            <EButton
              :icon="iconClear || icon.clear"
              size="x-small"
              text
              @click.stop.prevent="clear"
            />
          </div>
        </div>
      </transition>
    </template>

    <template #details="slotProps">
      <EDetails
        :counter="counter"
        :details="slotProps.details"
        :has-error="slotProps.hasError"
        :model-value="modelValue"
        :limit="limit"
        :id="slotProps.detailsId"
        :show-details="slotProps.showDetails"
      />
    </template>
  </EField>
</template>

<script setup lang="ts">
import icon from "@/utils/icons";

import { useTextInput } from "@/composables/text-input";
import type {
  EField as EFieldContract,
  EFieldProps,
  TextInputEmits,
  TextInputElement,
  TextInputInputMode,
  TextInputValue,
  UseTextInputProps,
} from "@/types";

import EButton from "@/components/button/index.vue";
import EIcon from "@/components/icon/index.vue";
import EDetails from "@/components/form/details.vue";
import EField from "@/components/form/field/index.vue";
import { computed, ref, useSlots } from "vue";

export interface Props extends UseTextInputProps<TextInputValue> {
  counter?: boolean;
  suffix?: string;
  prefix?: string;
  inputmode?: TextInputInputMode;
}

type FieldInstance = Pick<
  EFieldContract,
  "focus" | "reset" | "resetValidation" | "validate"
> & {
  blur?: () => void;
};

const props = withDefaults(defineProps<Props>(), {
  inputAlign: "start",
  type: "text",
  modelModifiers: () => ({}),
  spellcheck: false,
});

const emit = defineEmits<TextInputEmits>();
const slots = useSlots();
const hasPrependSlot = computed(() => !!slots.prepend);
const hasAppendSlot = computed(() => !!slots.append);
const field = ref<FieldInstance | null>(null);
const input = ref<TextInputElement | null>(null);
const hasPrependContent = computed(
  () => hasPrependSlot.value || Boolean(props.prependIcon),
);
const hasAppendContent = computed(
  () => hasAppendSlot.value || Boolean(props.appendIcon),
);

const fieldProps = computed<EFieldProps<unknown>>(() => ({
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
    props.clearable &&
    !props.disabled &&
    !(props.readonly || props.inputReadonly) &&
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    `${props.modelValue}`.length > 0,
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
  isReadonly: textInputReadonly,
  handleInput,
  handleChange,
  handleKeydown,
  handleKeyup,
  handleCompositionStart,
  handleCompositionEnd,
  clear,
  select,
} = useTextInput({
  props,
  emit,
  input,
  focus,
  canClear,
});

defineExpose({
  focus,
  blur,
  input,
  select,
  validate: () => field.value?.validate() ?? true,
  reset: () => field.value?.reset(),
  resetValidation: () => field.value?.resetValidation?.(),
});
</script>
<style lang="scss" src="./style.scss"></style>
