import { fieldClasses } from "@/components/form/constants";
import type { classKey, Form } from "@/types";
import {
  ref,
  reactive,
  onMounted,
  inject,
  getCurrentInstance,
  computed,
  ComputedRef,
  watch,
} from "vue";
export default function useField(useFormInjection = true) {
  const props = ref(getCurrentInstance()?.props);
  const mounted = ref(false);
  const dirty = ref(false);
  const hovered = ref(false);
  const configuration = reactive({
    labelStyle: {},
    color: "primary",
    retainColor: false,
  });

  const focused = ref(false);

  const id = `${Math.floor(Math.random() * 999999)}-input`;

  const fieldClass = computed((): Array<string> => {
    const keys = Object.keys(fieldClasses);
    const result = keys
      .filter((key) => !!props?.value?.[key])
      .map((key) => fieldClasses[key as classKey]);
    result.push(textColor.value);
    hasError.value && result.push(fieldClasses.hasError);
    hovered.value && result.push(fieldClasses.hovered);
    if (props.value?.retainColor || configuration.retainColor) {
      result.push(fieldClasses.retainColor);
    }
    focused.value && result.push(fieldClasses.focused);
    return [...result, "e-field"];
  });

  const labelStyle = computed((): Record<string, string> => {
    return props.value?.labelMinWidth
      ? {
          ...configuration.labelStyle,
          minWidth: `${props.value.labelMinWidth}px`,
        }
      : { ...configuration.labelStyle };
  });

  const details = computed((): string => {
    const errorFromProps: Array<string> = (props.value?.detailErrors ||
      []) as Array<string>;
    const errorFromRule: string = errorMessage.value as string;
    return hasError.value
      ? errorFromProps[0] || errorFromRule
      : (props.value?.detail as string);
  });
  const errorMessage = computed((): string | boolean => {
    const rules = (props.value?.rules || []) as Array<
      (val: any) => string | true
    >;
    const _function = rules.find(
      (rule: (param: any) => string | true) =>
        rule(props.value?.modelValue) !== true
    );
    return _function?.(props.value?.modelValue) || "";
  });

  const hasError: ComputedRef<boolean> = computed((): boolean => {
    const errorFromProps: Array<string> = (props.value?.detailErrors ||
      []) as Array<string>;
    const result = !!(dirty.value && errorMessage.value) || !!errorFromProps[0];
    if (useFormInjection)
      form?.updateField?.({ hasError: result, uid: uid || -1 });
    return result;
  });

  const showDetails = computed((): boolean => {
    return !!details.value;
  });

  const showClearable = computed((): boolean => {
    const clearable: boolean = props.value?.clearable as boolean;
    return clearable && `${props.value?.modelValue || ""}`.length > 0;
  });

  const color = computed((): string => {
    let result = (props.value?.color as string) || configuration.color || "";
    props.value?.disabled && (result = "disabled");
    dirty.value && errorMessage.value && (result = "error");
    return result;
  });

  const inputStyle = computed((): Record<string, string> => {
    return { textAlign: props.value?.inputAlign as string };
  });

  const textColor = computed((): string => {
    if (hasError.value) return "error--text";
    return hovered.value ||
      focused.value ||
      props.value?.retainColor ||
      configuration.retainColor
      ? `${color.value}--text`
      : "";
  });

  watch(
    () => props.value?.modelValue,
    () => (dirty.value = true)
  );

  const handleClickPrependIcon = (event: FocusEvent): void => {
    getCurrentInstance()?.emit("click:prepend", event);
    setInputFocus(event);
  };

  const handleHover = (value: boolean): boolean => (hovered.value = value);

  const setInputFocus = (event?: FocusEvent): void => {
    focused.value = true;
    getCurrentInstance()?.emit("focus", event);
  };

  const handleClickAppendIcon = (event: FocusEvent): void => {
    getCurrentInstance()?.emit("click:append", event);
    setInputFocus(event);
  };

  const handleFocus = (event?: FocusEvent): void => {
    focused.value = true;
    getCurrentInstance()?.emit("focus", event);
  };

  const handleBlur = (event?: Event): void => {
    focused.value = false;
    dirty.value = true;
    getCurrentInstance()?.emit("blur", event);
  };

  const setConfiguration = (value: Record<string, any>): void => {
    value.labelStyle && (configuration.labelStyle = value.labelStyle);
    value.color && (configuration.color = value.color);
    configuration.retainColor = Boolean(value.retainColor);
  };

  const form = inject<Partial<Form> | undefined>("EForm", undefined);
  const uid = getCurrentInstance()?.uid;

  const validate = () => {
    dirty.value = true;
    //return true if valid
    return !hasError.value;
  };

  const reset = () => {
    dirty.value = false;
  };

  onMounted(() => {
    mounted.value = true;
    if (useFormInjection)
      form?.bindField?.({ validate, reset, uid: uid || -1, setConfiguration });
  });

  return {
    fieldClass,
    mounted,
    id,
    dirty,
    focused,
    errorMessage,
    hasError,
    inputStyle,
    showClearable,
    showDetails,
    hovered,
    details,
    labelStyle,
    color,
    textColor,
    handleHover,
    setInputFocus,
    handleFocus,
    handleBlur,
    configuration,
    handleClickAppendIcon,
    handleClickPrependIcon,
    setConfiguration,
  };
}
