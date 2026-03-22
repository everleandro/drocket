<template>
  <div :class="textFieldClass">
    <div class="e-field__control">
      <div
        class="e-field__slot"
        @mouseenter="handleHover(true)"
        @mouseleave="handleHover(false)"
      >
        <div
          v-if="prependIcon"
          class="e-field__prepend-inner"
          aria-hidden="true"
        >
          <div class="e-field__icon e-field__icon--prepend-inner">
            <EIcon :icon="prependIcon" />
          </div>
        </div>
        <div class="e-field__overlay"></div>
        <div v-if="mounted" class="e-text-field__slot e-field__field">
          <label
            :for="id"
            :class="[
              textColor,
              'e-label',
              {
                'e-label--floating': isLabelFloating,
                'e-label--floated': shouldFloatLabel,
              },
            ]"
            :style="labelStyle"
          >
            <slot name="label">{{ label }}</slot>
          </label>
          <div
            v-if="prefix"
            :class="[textColor, 'e-field__prefix']"
            aria-hidden="true"
          >
            {{ prefix }}
          </div>

          <input
            ref="input"
            :id="id"
            :value="inputValue"
            :readonly="isReadonly"
            :disabled="disabled"
            class="input--text"
            :maxlength="limit"
            :style="inputStyle"
            :type="type"
            :placeholder="resolvedPlaceholder"
            :name="name"
            :autocomplete="autocomplete"
            :inputmode="inputmode"
            :spellcheck="spellcheck"
            :autocapitalize="autocapitalize"
            :enterkeyhint="enterkeyhint"
            :aria-invalid="hasError"
            :aria-describedby="detailsId"
            :aria-disabled="disabled"
            :aria-readonly="isReadonly"
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
            :class="[textColor, 'e-field__suffix']"
            aria-hidden="true"
          >
            {{ suffix }}
          </div>
        </div>
        <transition name="scale">
          <div v-show="canClear" class="e-field__append-inner">
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
        <div
          v-if="appendIcon"
          class="e-field__append-inner"
          aria-hidden="true"
        >
          <div class="e-field__icon e-field__icon--append">
            <EIcon :icon="appendIcon" />
          </div>
        </div>
        <div v-if="!outlined" class="e-field__line"></div>
      </div>
      <EDetails
        :counter="counter"
        :details="details"
        :hasError="hasError"
        :modelValue="modelValue"
        :limit="limit"
        :textColor="textColor"
        :id="detailsId"
        :showDetails="showDetails"
      >
      </EDetails>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IconPath } from "@/types";
import icon from "@/utils/icons";

import {
  useTextInput,
} from "@/composables/text-input";
import type {
  TextInputEmits,
  TextInputInputMode,
  TextInputValue,
  UseTextInputProps,
} from "@/types";

import { useGridCol } from "@/composables/grid-col";
import { useField } from "@/composables/field";

import EButton from "@/components/button/index.vue";
import EIcon from "@/components/icon/index.vue";
import EDetails from "@/components/form/details.vue";
import { computed, ref } from "vue";

export interface Props extends UseTextInputProps<TextInputValue> {
  counter?: boolean;
  suffix?: string;
  prefix?: string;
  inputmode?: TextInputInputMode;
}

const props = withDefaults(defineProps<Props>(), {
  inputAlign: "start",
  type: "text",
  modelModifiers: () => ({}),
  spellcheck: false,
});

const emit = defineEmits<TextInputEmits>();

const input = ref<HTMLInputElement | null>(null);

const {
  fieldClass,
  inputStyle,
  id,
  focus,
  blur,
  hasError,
  showClearable,
  showDetails,
  textColor,
  isLabelFloating,
  mounted,
  details,
  labelStyle,
  handleHover,
  handleBlur,
  handleFocus,
  shouldFloatLabel,
  validate,
  reset,
  resetValidation,
} = useField<TextInputValue>();

const { gridColClass } = useGridCol(props);
const textFieldClass = computed(() => [
  ...fieldClass.value,
  "e-text-field",
  ...gridColClass.value,
]);
const hasSupportingText = computed(
  () => showDetails.value || Boolean(props.counter || props.limit),
);
const resolvedPlaceholder = computed(() => {
  if (!props.placeholder) return undefined;
  if (!isLabelFloating.value) return props.placeholder;

  return shouldFloatLabel.value ? props.placeholder : undefined;
});
const detailsId = computed(() =>
  hasSupportingText.value ? `${id}-details` : undefined,
);
const canClear = computed(
  () => showClearable.value && !props.disabled && !isReadonly.value,
);
const {
  inputValue,
  isReadonly,
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
  select,
  validate,
  reset,
  resetValidation,
  input,
});
</script>
<style lang="scss" src="./style.scss"></style>
