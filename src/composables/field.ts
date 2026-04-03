import * as Vue from "vue";
import { FORM_KEY } from "@/components/form/constants";
import { fieldStateClasses, fieldVariantClasses } from "@/components/form/constants";
import { useResolvedColor } from "@/composables/color";
import { getFocusableElementInRoot, hasFieldValue, isDomFocused, resolveFocusableElement } from "@/utils/field";
import { normalizeCssSize } from "@/utils/style";
import type { FocusableElement } from "@/utils/field";
import type {
  FieldConfiguration,
  FieldLabelBehavior,
  FieldVariantKey,
  UseFieldProps,
} from "@/types";
import {
  ref,
  reactive,
  onMounted,
  inject,
  getCurrentInstance,
  computed,
  ComputedRef,
  watch,
  onUnmounted,
} from "vue";

type FieldEmit = (event: string, ...args: Array<unknown>) => void;

type FieldConfigurationState = {
  labelStyle: Record<string, string>;
  color?: string;
  retainColor: boolean;
  dense: boolean;
  disabled: boolean;
  readonly: boolean;
  outlined: boolean;
  labelBehavior?: FieldLabelBehavior;
};

type PropDrivenFieldVariantKey = Extract<FieldVariantKey, "dense" | "outlined">;

const propDrivenVariantKeys: Array<PropDrivenFieldVariantKey> = [
  "outlined",
  "dense",
];

const fieldFocusRefKeys = ["input", "hours", "minutes"] as const;

export function useField<TValue = unknown>(useFormInjection = true) {
  const instance = getCurrentInstance();

  if (!instance) {
    throw new Error("useField must be called from within setup().");
  }

  const props = instance.props as UseFieldProps<TValue>;
  const emit = instance.emit as FieldEmit;
  const uid = instance.uid;
  const initialValue = ref(props.modelValue);
  const mounted = ref(false);
  const dirty = ref(false);
  const touched = ref(false);
  const validated = ref(false);
  const hovered = ref(false);
  const configuration = reactive<FieldConfigurationState>({
    labelStyle: {},
    retainColor: false,
    dense: false,
    disabled: false,
    readonly: false,
    outlined: false,
    labelBehavior: undefined,
  });

  const focused = ref(false);
  const tableClasses = ref<Array<string>>([]);

  const idBase =
    (Vue as typeof Vue & { useId?: () => string }).useId?.() ||
    `e-field-${uid}`;
  const id = `${idBase}-input`;

  const form = inject(FORM_KEY, undefined);

  const getInstanceRootElement = (): HTMLElement | undefined => {
    const element = instance.vnode.el;
    return element instanceof HTMLElement ? element : undefined;
  };

  const getFocusableElement = (): FocusableElement | undefined => {
    for (const refKey of fieldFocusRefKeys) {
      const element = resolveFocusableElement(instance.refs[refKey]);
      if (element) return element;
    }

    const rootElement = getInstanceRootElement();
    if (!rootElement) return undefined;

    const selector = [
      `#${id}`,
      `#${id}-hours`,
      `#${id}-minutes`,
      "input",
      "textarea",
      "select",
      "button",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    return getFocusableElementInRoot(rootElement, selector);
  };

  const syncFocusedState = (element?: FocusableElement): void => {
    focused.value = element ? isDomFocused(element) : false;
  };

  const helperMessage = computed((): string => props.detail || "");
  const externalErrorMessage = computed(
    (): string => props.detailErrors?.[0] || "",
  );
  const hasValue = computed((): boolean => hasFieldValue(props.modelValue));
  const effectiveLabelBehavior = computed<FieldLabelBehavior | undefined>(
    () => props.labelBehavior || configuration.labelBehavior,
  );
  const isLabelInline = computed((): boolean => {
    return effectiveLabelBehavior.value === "inline";
  });
  const isLabelFloating = computed((): boolean => {
    return effectiveLabelBehavior.value === "floating";
  });
  const shouldFloatLabel = computed((): boolean => {
    return isLabelFloating.value && (focused.value || hasValue.value);
  });
  const pristine = computed((): boolean => !dirty.value);
  const shouldShowValidation = computed((): boolean => {
    return dirty.value || touched.value || validated.value;
  });

  const validationMessage = computed((): string => {
    const rules = props.rules || [];
    const modelValue = props.modelValue as TValue;

    for (const rule of rules) {
      const result = rule(modelValue);
      if (result !== true) return result;
    }

    return "";
  });

  const errorMessage = computed((): string => {
    return shouldShowValidation.value ? validationMessage.value : "";
  });

  const hasExternalError = computed((): boolean => {
    return Boolean(externalErrorMessage.value);
  });

  const hasValidationError = computed((): boolean => {
    return Boolean(errorMessage.value);
  });

  const displayMessage = computed((): string => {
    if (externalErrorMessage.value) return externalErrorMessage.value;
    if (errorMessage.value) return errorMessage.value;
    if (props.detailsOnMessageOnly) return "";
    return helperMessage.value;
  });

  const hasError: ComputedRef<boolean> = computed((): boolean => {
    return hasExternalError.value || hasValidationError.value;
  });

  const isDisabled = computed((): boolean => {
    return Boolean(props.disabled || configuration.disabled);
  });

  const isReadonly = computed((): boolean => {
    return Boolean(props.readonly || configuration.readonly);
  });

  const isOutlined = computed((): boolean => {
    return Boolean(props.outlined || configuration.outlined);
  });

  const isDense = computed((): boolean => {
    return Boolean(props.dense || configuration.dense);
  });

  const fieldClass = computed((): Array<string> => {
    const result = propDrivenVariantKeys.reduce<Array<string>>((classes, key) => {
      const isActive =
        key === "dense"
          ? isDense.value
          : key === "outlined"
            ? isOutlined.value
            : false;

      if (isActive) classes.push(fieldVariantClasses[key]);

      return classes;
    }, []);

    if (isDisabled.value) result.push(fieldStateClasses.disabled);
    if (isReadonly.value) result.push(fieldStateClasses.readonly);
    if (hasError.value) result.push(fieldStateClasses.hasError);
    if (hasValue.value) result.push(fieldStateClasses.hasValue);
    if (hovered.value) result.push(fieldStateClasses.hovered);
    if (isLabelInline.value) result.push(fieldVariantClasses.labelInline);
    if (isLabelFloating.value) result.push(fieldVariantClasses.labelFloating);
    if (shouldFloatLabel.value) result.push(fieldStateClasses.labelFloated);
    if (props.retainColor || configuration.retainColor) {
      result.push(fieldStateClasses.retainColor);
    }
    if (focused.value) result.push(fieldStateClasses.focused);

    return [...result, "e-field", ...tableClasses.value];
  });

  const getGridColConfiguration = () => ({
    cols: props.cols,
    xs: props.xs,
    sm: props.sm,
    md: props.md,
    lg: props.lg,
    xl: props.xl,
  });

  const labelStyle = computed((): Record<string, string> => {
    const minWidth = normalizeCssSize(props.labelMinWidth);

    return {
      ...configuration.labelStyle,
      ...(minWidth ? { minWidth } : {}),
    };
  });

  const details = computed((): string => {
    return displayMessage.value;
  });

  const showDetails = computed((): boolean => {
    return !!details.value;
  });

  const showClearable = computed((): boolean => {
    return Boolean(props.clearable) && hasValue.value;
  });

  const color = computed((): string => {
    let result = props.color || configuration.color || "";
    if (isDisabled.value) result = "disabled";
    if (hasError.value) result = "error";
    return result;
  });

  const { colorStyles } = useResolvedColor({
    color,
    colorVar: "--e-field-color",
    contrastVar: "--e-field-contrast",
  });

  const inputStyle = computed((): Record<string, string> => {
    return props.inputAlign ? { textAlign: props.inputAlign } : {};
  });

  const fieldStyle = computed((): Record<string, string> => {
    const result: Record<string, string> = { ...colorStyles.value };
    const shouldRetainColor = props.retainColor || configuration.retainColor;

    if (shouldRetainColor && result["--e-field-color"]) {
      result["--e-field-rest-color"] = result["--e-field-color"];
    }

    return result;
  });

  watch(
    () => props.modelValue,
    (value) => {
      dirty.value = !Object.is(value, initialValue.value);
    },
  );

  watch(hasError, (value) => {
    if (useFormInjection) {
      form?.updateField?.({ hasError: value, uid });
    }
  });

  watch(
    () => [props.cols, props.xs, props.sm, props.md, props.lg, props.xl] as const,
    () => {
      if (useFormInjection) {
        form?.updateField?.({ uid, ...getGridColConfiguration() });
      }
    },
  );

  const handleHover = (value: boolean): void => {
    hovered.value = value;
  };

  const focus = (event?: FocusEvent): void => {
    const eventTarget = event
      ? resolveFocusableElement(event.target)
      : undefined;
    const element = eventTarget || getFocusableElement();

    if (eventTarget) {
      syncFocusedState(eventTarget);
    } else if (element) {
      element.focus();
      syncFocusedState(element);
    } else {
      focused.value = true;
    }

    if (event) emit("focus", event);
  };

  const blur = (): void => {
    const element = getFocusableElement();

    if (element?.blur) {
      element.blur();
    }

    syncFocusedState();
  };

  const handleFocus = (event?: FocusEvent): void => {
    focus(event);
  };

  const handleBlur = (event?: Event): void => {
    focused.value = false;
    touched.value = true;
    if (event) emit("blur", event);
  };

  const setConfiguration = (value: FieldConfiguration): void => {
    configuration.labelStyle = value.labelStyle ? { ...value.labelStyle } : {};
    configuration.color = value.color;
    configuration.retainColor = Boolean(value.retainColor);
    configuration.dense = Boolean(value.dense);
    configuration.disabled = Boolean(value.disabled);
    configuration.readonly = Boolean(value.readonly);
    configuration.outlined = Boolean(value.outlined);
    configuration.labelBehavior = value.labelBehavior;
  };

  const setTableClasses = (value: Array<string>): void => {
    tableClasses.value = [...value];
  };

  const validate = (): boolean => {
    validated.value = true;
    touched.value = true;
    return !hasError.value;
  };

  const resetValidation = (): void => {
    touched.value = false;
    validated.value = false;
  };

  const reset = (): void => {
    initialValue.value = props.modelValue;
    dirty.value = false;
    resetValidation();
  };

  onMounted(() => {
    mounted.value = true;
    if (useFormInjection) {
      form?.bindField?.({
        focus,
        validate,
        reset,
        resetValidation,
        uid,
        setConfiguration,
        setTableClasses,
        ...getGridColConfiguration(),
      });
      form?.updateField?.({ hasError: hasError.value, uid });
    }
  });

  onUnmounted(() => {
    if (useFormInjection) form?.unbindField?.(uid);
  });

  return {
    fieldClass,
    mounted,
    id,
    dirty,
    pristine,
    touched,
    focused,
    helperMessage,
    hasValue,
    errorMessage,
    validationMessage,
    externalErrorMessage,
    displayMessage,
    hasExternalError,
    hasValidationError,
    hasError,
    isDense,
    isDisabled,
    isReadonly,
    isOutlined,
    isLabelFloating,
    inputStyle,
    fieldStyle,
    showClearable,
    showDetails,
    shouldFloatLabel,
    hovered,
    details,
    labelStyle,
    color,
    handleHover,
    focus,
    blur,
    handleFocus,
    handleBlur,
    configuration,
    setConfiguration,
    validate,
    reset,
    resetValidation,
  };
}
