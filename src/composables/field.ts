import * as Vue from "vue";
import { FORM_KEY } from "@/components/form/constants";
import { fieldClasses } from "@/components/form/constants";
import { useResolvedColor } from "@/composables/color";
import { normalizeCssSize } from "@/utils/style";
import type {
  FieldClassKey,
  FieldConfiguration,
  FieldLabelBehavior,
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

type FocusableElement = {
  focus: () => void;
  blur?: () => void;
};

type PropDrivenFieldClassKey = Extract<
  FieldClassKey,
  "dense" | "disabled" | "labelInline" | "outlined" | "readonly"
>;

const propDrivenClassKeys: Array<PropDrivenFieldClassKey> = [
  "disabled",
  "readonly",
  "outlined",
  "labelInline",
  "dense",
];

const fieldFocusRefKeys = ["input", "hours", "minutes"] as const;

const isElementNode = (value: unknown): value is Element => {
  return typeof Element !== "undefined" && value instanceof Element;
};

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

  const resolveFocusableElement = (
    target: unknown,
  ): FocusableElement | undefined => {
    if (!target) return undefined;

    if (Array.isArray(target)) {
      for (const item of target) {
        const element = resolveFocusableElement(item);
        if (element) return element;
      }
      return undefined;
    }

    if (
      typeof target === "object" &&
      target !== null &&
      "focus" in target &&
      typeof (target as FocusableElement).focus === "function"
    ) {
      return target as FocusableElement;
    }

    if (typeof target === "object" && target !== null && "$el" in target) {
      return resolveFocusableElement((target as { $el?: unknown }).$el);
    }

    return undefined;
  };

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

    const element = rootElement.querySelector<HTMLElement>(selector);
    return element ? resolveFocusableElement(element) : undefined;
  };

  const isDomFocused = (element?: FocusableElement): boolean => {
    if (!element || typeof document === "undefined") return false;
    return isElementNode(element) && document.activeElement === element;
  };

  const syncFocusedState = (element?: FocusableElement): void => {
    focused.value = element ? isDomFocused(element) : false;
  };

  const helperMessage = computed((): string => props.detail || "");
  const externalErrorMessage = computed(
    (): string => props.detailErrors?.[0] || "",
  );
  const hasValue = computed((): boolean => {
    const value = props.modelValue;

    if (value === undefined || value === null) return false;
    if (typeof value === "string") return value.length > 0;
    if (Array.isArray(value)) return value.length > 0;

    return true;
  });
  const effectiveLabelBehavior = computed<FieldLabelBehavior | undefined>(
    () => props.labelBehavior || configuration.labelBehavior,
  );
  const isLabelFloating = computed((): boolean => {
    return effectiveLabelBehavior.value === "floating" && !props.labelInline;
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
    const result = propDrivenClassKeys.reduce<Array<string>>((classes, key) => {
      const isActive =
        key === "dense"
          ? isDense.value
          : key === "disabled"
            ? isDisabled.value
            : key === "readonly"
              ? isReadonly.value
              : key === "outlined"
                ? isOutlined.value
                : Boolean(props[key]);

      if (isActive) classes.push(fieldClasses[key]);

      return classes;
    }, []);

    if (hasError.value) result.push(fieldClasses.hasError);
    if (hasValue.value) result.push(fieldClasses.hasValue);
    if (hovered.value) result.push(fieldClasses.hovered);
    if (isLabelFloating.value) result.push(fieldClasses.labelFloating);
    if (shouldFloatLabel.value) result.push(fieldClasses.labelFloated);
    if (props.retainColor || configuration.retainColor) {
      result.push(fieldClasses.retainColor);
    }
    if (focused.value) result.push(fieldClasses.focused);

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
