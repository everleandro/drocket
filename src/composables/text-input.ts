import { computed, onMounted, ref, type ComputedRef, type Ref } from "vue";

import type {
  TextInputElement,
  TextInputEmits,
  TextInputKeyEventPayload,
  TextInputModelModifiers,
  TextInputValue,
  TextInputValueEventPayload,
  UseTextInputProps,
} from "@/types";

export interface UseTextInputOptions {
  props: Readonly<UseTextInputProps<TextInputValue>>;
  emit: TextInputEmits;
  input: Ref<TextInputElement | null>;
  focus: () => void;
  canClear: ComputedRef<boolean>;
}

export const normalizeTextInputValue = (value: TextInputValue): string => {
  return value == null ? "" : `${value}`;
};

export const applyTextInputModelModifiers = (
  rawValue: string,
  modifiers: TextInputModelModifiers,
): TextInputValue => {
  let normalizedValue = modifiers.trim ? rawValue.trim() : rawValue;

  if (modifiers.number) {
    const parsedValue = Number.parseFloat(normalizedValue);
    return Number.isNaN(parsedValue) ? normalizedValue : parsedValue;
  }

  return normalizedValue;
};

export const createTextInputValuePayload = <EventType extends Event>(
  rawValue: string,
  event: EventType,
  modifiers: TextInputModelModifiers,
): TextInputValueEventPayload<EventType> => {
  return {
    rawValue,
    value: applyTextInputModelModifiers(rawValue, modifiers),
    event,
  };
};

export const createTextInputKeyPayload = (
  event: KeyboardEvent,
  modifiers: TextInputModelModifiers,
): TextInputKeyEventPayload => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
  const rawValue = target?.value ?? "";

  return {
    rawValue,
    value: applyTextInputModelModifiers(rawValue, modifiers),
    event,
  };
};

export const shouldSyncTextInputOnInput = (
  modifiers: TextInputModelModifiers,
  isComposing: boolean,
): boolean => {
  return !isComposing && !modifiers.lazy;
};

export const shouldSyncTextInputOnChange = (
  modifiers: TextInputModelModifiers,
): boolean => {
  return Boolean(modifiers.lazy);
};

export const useTextInput = ({
  props,
  emit,
  input,
  focus,
  canClear,
}: UseTextInputOptions) => {
  const isComposing = ref(false);
  const modelModifiers = computed(() => props.modelModifiers ?? {});
  const isReadonly = computed(() =>
    Boolean(props.readonly || props.inputReadonly),
  );
  const inputValue = computed(() =>
    normalizeTextInputValue(props.modelValue ?? null),
  );

  const emitModelValue = (value: TextInputValue): void => {
    emit("update:modelValue", value);
  };

  const getTargetValue = (event: Event): string => {
    const target = event.target as TextInputElement | null;
    return target?.value ?? "";
  };

  const handleInput = (event: Event): void => {
    const rawValue = getTargetValue(event);

    emit(
      "input",
      createTextInputValuePayload(rawValue, event, modelModifiers.value),
    );

    if (!shouldSyncTextInputOnInput(modelModifiers.value, isComposing.value)) {
      return;
    }

    emitModelValue(
      applyTextInputModelModifiers(rawValue, modelModifiers.value),
    );
  };

  const handleChange = (event: Event): void => {
    const rawValue = getTargetValue(event);

    emit(
      "change",
      createTextInputValuePayload(rawValue, event, modelModifiers.value),
    );

    if (!shouldSyncTextInputOnChange(modelModifiers.value)) return;

    emitModelValue(
      applyTextInputModelModifiers(rawValue, modelModifiers.value),
    );
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    const payload = createTextInputKeyPayload(event, modelModifiers.value);
    emit("keydown", payload);

    if (event.key === "Enter") {
      emit("keydown:enter", payload);
    }
  };

  const handleKeyup = (event: KeyboardEvent): void => {
    emit("keyup", createTextInputKeyPayload(event, modelModifiers.value));
  };

  const handleCompositionStart = (event: CompositionEvent): void => {
    isComposing.value = true;
    emit(
      "compositionstart",
      createTextInputValuePayload(
        getTargetValue(event),
        event,
        modelModifiers.value,
      ),
    );
  };

  const handleCompositionEnd = (event: CompositionEvent): void => {
    const rawValue = getTargetValue(event);
    isComposing.value = false;

    emit(
      "compositionend",
      createTextInputValuePayload(rawValue, event, modelModifiers.value),
    );

    if (!shouldSyncTextInputOnInput(modelModifiers.value, false)) return;

    emitModelValue(
      applyTextInputModelModifiers(rawValue, modelModifiers.value),
    );
  };

  const clear = (): void => {
    if (!canClear.value) return;

    const inputPayload = createTextInputValuePayload(
      "",
      new Event("input"),
      modelModifiers.value,
    );

    emit("input", inputPayload);
    emitModelValue(inputPayload.value);

    if (shouldSyncTextInputOnChange(modelModifiers.value)) {
      emit(
        "change",
        createTextInputValuePayload("", new Event("change"), modelModifiers.value),
      );
    }

    emit("click:clear");
    focus();
  };

  const select = (): void => {
    input.value?.select();
  };

  onMounted(() => {
    if (props.autofocus) {
      focus();
    }
  });

  return {
    isComposing,
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
  };
};