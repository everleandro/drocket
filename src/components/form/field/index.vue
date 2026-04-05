<template>
    <div :class="rootClass" :style="fieldStyle">
        <div class="e-field__content" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)">
            <div v-if="hasPrependSlot" class="e-field__prepend" aria-hidden="true">
                <slot name="prepend"></slot>
            </div>

            <div v-if="prependIcon" class="e-field__prepend" aria-hidden="true">
                <div class="e-field__icon e-field__icon--prepend">
                    <EIcon :icon="prependIcon" />
                </div>
            </div>

            <div class="e-field__control" @mousedown="handleControlMousedown" @click="handleControlClick">
                <div class="e-field__overlay" aria-hidden="true"></div>
                <label :id="labelId" :for="id" :class="labelClass" :style="labelStyle">
                    <slot name="label">{{ label }}</slot>
                </label>
                <slot name="control" v-bind="controlSlotProps"></slot>
                <div v-if="!isOutlined" class="e-field__line"></div>
            </div>

            <div v-if="appendIcon" class="e-field__append" aria-hidden="true">
                <div class="e-field__icon e-field__icon--append">
                    <EIcon :icon="appendIcon" />
                </div>
            </div>

            <div v-if="hasAppendSlot" class="e-field__append" aria-hidden="true">
                <slot name="append"></slot>
            </div>
        </div>

        <slot name="details" v-bind="detailsSlotProps">
            <EDetails :id="detailsId" :details="details" :has-error="hasError" :show-details="showDetails" />
        </slot>

    </div>
</template>

<script setup lang="ts">
import * as Vue from "vue";
import { computed, ref, reactive, useSlots, getCurrentInstance, inject, onMounted, onUnmounted, watch } from "vue";
import { useGridCol } from "@/composables/grid-col";
import { useResolvedColor } from "@/composables/color";
import { FORM_KEY, fieldStateClasses, fieldVariantClasses } from "@/components/form/constants";
import EDetails from "@/components/form/details.vue";
import EIcon from "@/components/icon/index.vue";
import { getFocusableElementInRoot, hasFieldValue, isDomFocused, resolveFocusableElement } from "@/utils/field";
import type { FocusableElement } from "@/utils/field";
import { normalizeCssSize } from "@/utils/style";
import type { EField as EFieldContract, FieldConfiguration, FieldLabelBehavior, EFieldProps, FormInjection } from "@/types";

export interface Props extends EFieldProps<unknown> {
    prefix?: string;
    suffix?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
    (e: "focus", value: FocusEvent): void;
    (e: "blur", value: Event): void;
}>();

const instance = getCurrentInstance();

if (!instance) {
    throw new Error("Field must be used within setup().");
}

const slots = useSlots();
const hasPrependSlot = computed(() => Boolean(slots.prepend));
const hasAppendSlot = computed(() => Boolean(slots.append));
const form = inject<FormInjection | undefined>(FORM_KEY, undefined);

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

const getInstanceRootElement = (): HTMLElement | undefined => {
    const element = instance.vnode.el;
    return element instanceof HTMLElement ? element : undefined;
};

const getFocusableElement = (): FocusableElement | undefined => {
    const rootElement = getInstanceRootElement();

    if (!rootElement) return undefined;

    return getFocusableElementInRoot(rootElement, [
        `#${id}`,
        `#${id}-hours`,
        `#${id}-minutes`,
        "input",
        "textarea",
        "select",
        "button",
        '[tabindex]:not([tabindex="-1"])',
    ].join(", "));
};

const configuration = reactive<FieldConfigurationState>({
    labelStyle: {},
    retainColor: false,
    dense: false,
    disabled: false,
    readonly: false,
    outlined: false,
    labelBehavior: undefined,
});

const idBase =
    (Vue as typeof Vue & { useId?: () => string }).useId?.()
    || `e-field-${instance.uid}`;
const id = `${idBase}-input`;
const initialValue = ref(props.modelValue);
const dirty = ref(false);
const touched = ref(false);
const validated = ref(false);
const hovered = ref(false);
const focused = ref(false);
const tableClasses = ref<Array<string>>([]);

const helperMessage = computed(() => props.detail || "");
const externalErrorMessage = computed(() => props.detailErrors?.[0] || "");
const hasValue = computed(() => hasFieldValue(props.modelValue));

const effectiveLabelBehavior = computed<FieldLabelBehavior | undefined>(() => {
    return props.labelBehavior || configuration.labelBehavior;
});

const isLabelInline = computed(() => effectiveLabelBehavior.value === "inline");
const isLabelFloating = computed(() => effectiveLabelBehavior.value === "floating");
const shouldFloatLabel = computed(() => isLabelFloating.value && (focused.value || hasValue.value));
const shouldShowValidation = computed(() => dirty.value || touched.value || validated.value);

const labelClass = computed(() => [
    "e-label",
    "e-field__label",
    isLabelFloating.value && "e-label--floating",
    shouldFloatLabel.value && "e-label--floated",
]);

const validationMessage = computed(() => {
    const rules = props.rules || [];

    for (const rule of rules) {
        const result = rule(props.modelValue);
        if (result !== true) return result;
    }

    return "";
});

const errorMessage = computed(() => {
    return shouldShowValidation.value ? validationMessage.value : "";
});

const hasValidationError = computed(() => Boolean(errorMessage.value));
const hasExternalError = computed(() => Boolean(externalErrorMessage.value));
const hasError = computed(() => hasExternalError.value || hasValidationError.value);

const displayMessage = computed(() => {
    if (externalErrorMessage.value) return externalErrorMessage.value;
    if (errorMessage.value) return errorMessage.value;
    if (props.detailsOnMessageOnly) return "";
    return helperMessage.value;
});

const details = computed(() => displayMessage.value);
const showDetails = computed(() => !!details.value);
const isDisabled = computed(() => Boolean(props.disabled || configuration.disabled));
const isReadonly = computed(() => Boolean(props.readonly || configuration.readonly));
const isOutlined = computed(() => Boolean(props.outlined || configuration.outlined));
const isDense = computed(() => Boolean(props.dense || configuration.dense));

const color = computed(() => {
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

const labelStyle = computed<Record<string, string>>(() => {
    const minWidth = normalizeCssSize(props.labelMinWidth);

    return {
        ...configuration.labelStyle,
        ...(minWidth ? { minWidth } : {}),
    };
});

const fieldStyle = computed<Record<string, string>>(() => {
    const result: Record<string, string> = { ...colorStyles.value };

    if ((props.retainColor || configuration.retainColor) && result["--e-field-color"]) {
        result["--e-field-rest-color"] = result["--e-field-color"];
    }

    return result;
});

const handleHover = (value: boolean): void => {
    hovered.value = value;
};

const isInteractiveControlTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof Element)) return false;

    return Boolean(target.closest([
        "input",
        "textarea",
        "select",
        "button",
        "a[href]",
        "label",
        "[contenteditable='true']",
        "[role='button']",
        "[role='link']",
        "[role='option']",
        "[role='checkbox']",
        "[role='radio']",
        "[data-field-control-ignore-focus]",
    ].join(", ")));
};

const handleControlMousedown = (event: MouseEvent): void => {
    if (isDisabled.value) return;
    if (isInteractiveControlTarget(event.target)) return;

    event.preventDefault();
    focus();
};

const handleControlClick = (event: MouseEvent): void => {
    if (isDisabled.value) return;
    if (isInteractiveControlTarget(event.target)) return;

    focus();
};

const getGridColConfiguration = (): Pick<EFieldContract, "cols" | "xs" | "sm" | "md" | "lg" | "xl"> => ({
    cols: props.cols,
    xs: props.xs,
    sm: props.sm,
    md: props.md,
    lg: props.lg,
    xl: props.xl,
});

const syncFocusedState = (element?: FocusableElement): void => {
    focused.value = element ? isDomFocused(element) : false;
};

const focus = (event?: FocusEvent): void => {
    const eventTarget = event ? resolveFocusableElement(event.target) : undefined;
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

watch(
    () => props.modelValue,
    (value) => {
        dirty.value = !Object.is(value, initialValue.value);
    },
);

watch(hasError, (value) => {
    form?.updateField?.({ hasError: value, uid: instance.uid });
});

watch(
    () => [props.cols, props.xs, props.sm, props.md, props.lg, props.xl] as const,
    () => {
        form?.updateField?.({ uid: instance.uid, ...getGridColConfiguration() });
    },
);

const { gridColClass } = useGridCol(props);

const labelId = computed(() => `${id}-label`);
const hasSupportingText = computed(() => {
    return showDetails.value || Boolean(slots.details);
});
const detailsId = computed(() => {
    return hasSupportingText.value ? `${id}-details` : undefined;
});

const rootClass = computed(() => [
    "e-field",
    "e-field--next",
    isDense.value && fieldVariantClasses.dense,
    isOutlined.value && fieldVariantClasses.outlined,
    isLabelInline.value && fieldVariantClasses.labelInline,
    isLabelFloating.value && fieldVariantClasses.labelFloating,
    isDisabled.value && fieldStateClasses.disabled,
    isReadonly.value && fieldStateClasses.readonly,
    hasError.value && fieldStateClasses.hasError,
    hasValue.value && fieldStateClasses.hasValue,
    hovered.value && fieldStateClasses.hovered,
    shouldFloatLabel.value && fieldStateClasses.labelFloated,
    (props.retainColor || configuration.retainColor) && fieldStateClasses.retainColor,
    focused.value && fieldStateClasses.focused,
    ...tableClasses.value,
    ...gridColClass.value,
].filter(Boolean));

onMounted(() => {
    form?.bindField?.({
        uid: instance.uid,
        focus,
        validate,
        reset,
        resetValidation,
        setConfiguration,
        setTableClasses,
        ...getGridColConfiguration(),
    });

    form?.updateField?.({ uid: instance.uid, hasError: hasError.value });
});

onUnmounted(() => {
    form?.unbindField?.(instance.uid);
});

defineExpose({
    uid: instance.uid,
    dirty,
    hasError,
    blur,
    focus,
    handleBlur,
    handleFocus,
    setConfiguration,
    setTableClasses,
    reset,
    resetValidation,
    validate,
});

const controlSlotProps = computed(() => ({
    controlClass: "e-field__field-control",
    controlId: id,
    detailsId: detailsId.value,
    focus,
    hasError: hasError.value,
    handleBlur,
    handleFocus,
    isDisabled: isDisabled.value,
    isLabelFloating: isLabelFloating.value,
    isReadonly: isReadonly.value,
    shouldFloatLabel: shouldFloatLabel.value,
}));

const detailsSlotProps = computed(() => ({
    details: details.value,
    detailsId: detailsId.value,
    hasError: hasError.value,
    showDetails: showDetails.value,
}));
</script>

<style lang="scss" src="./index.scss"></style>