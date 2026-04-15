<template>
    <EField ref="field" v-bind="fieldProps" :class="radioGroupClass">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template #default="{ detailsId, slotClass, handleBlur, handleFocus, hasError, isDisabled, isReadonly }">
            <div class="e-radio-group-field__control e-field__control">
                <div class="e-radio-group-field__slot e-field__slot">
                    <div v-if="showOverlay" class="e-field__overlay"></div>
                    <div
                        role="radiogroup"
                        :class="resolveGroupClass(slotClass, { handleBlur, handleFocus, isDisabled, isReadonly })"
                        :aria-invalid="hasError"
                        :aria-disabled="isDisabled"
                        :aria-readonly="isReadonly"
                        :aria-describedby="detailsId"
                    >
                        <slot></slot>
                    </div>
                </div>
            </div>
        </template>

        <template #details="slotProps">
            <EDetails
                :id="slotProps.detailsId"
                :details="slotProps.details"
                :has-error="slotProps.hasError"
                :model-value="modelValue"
                :show-details="slotProps.showDetails"
            />
        </template>
    </EField>
</template>
  
<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, onMounted, provide, reactive, ref, watch, useSlots } from "vue";
import type { ERadio, ERadioType, SelectionFieldBaseProps, FieldConfiguration } from "@/types";
import { normalizeCssSize } from "@/utils/style";
import { useFieldIntegration } from "@/composables/field-integration";
import EDetails from "@/components/form/details.vue";
import EField from "@/components/form/field/index.vue";
import { RADIO_GROUP_KEY } from "./constants";

export interface Props extends SelectionFieldBaseProps<ERadioType> {
    mandatory?: boolean;
    modelValue: ERadioType;
    row?: boolean;
    showOverlay?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    showOverlay: false,
});

const slots = useSlots();
const { fieldProps, passThroughSlots } = useFieldIntegration<ERadioType>(props, slots, {
    omitSlots: ["default", "details"],
});

const radioGroupClass = computed(() => {
    const result = ["e-radio-group-field"];
    if (props.row) {
        result.push("e-radio-group-field--row");
    } else {
        result.push("e-radio-group-field--column");
    }
    return result;
});

const emit = defineEmits<{
    (e: "update:modelValue", value: ERadioType): void
    (e: "focus", event: FocusEvent): void
    (e: "blur", event: Event): void
}>();
const instance = getCurrentInstance();

const state = reactive<{ radioChilds: Array<Partial<ERadio>> }>({ radioChilds: [] });
const effectiveDisabled = ref(false);
const effectiveReadonly = ref(false);
const focusHandler = ref<(event?: FocusEvent) => void>();
const blurHandler = ref<(event?: Event) => void>();

const hasSelectedRadio = computed(() => {
    return state.radioChilds.some((radio) => Object.is(radio.modelValue, props.modelValue));
});
const canInitializeMandatoryValue = computed(() => {
    return props.mandatory && !effectiveDisabled.value && !effectiveReadonly.value && !hasSelectedRadio.value;
});

const radioConfiguration = computed((): FieldConfiguration => {
    const nextConfiguration: FieldConfiguration = {
        retainColor: Boolean(props.retainColor),
        disabled: Boolean(effectiveDisabled.value),
        readonly: Boolean(effectiveReadonly.value),
    }

    const labelMinWidth = normalizeCssSize(props.labelMinWidth);
    const inheritedLabelStyle: Record<string, string> = {};

    if (labelMinWidth) {
        inheritedLabelStyle.minWidth = labelMinWidth;
    }

    if (Object.keys(inheritedLabelStyle).length > 0) {
        nextConfiguration.labelStyle = inheritedLabelStyle;
    }

    const resolvedColor = props.color;

    if (resolvedColor) {
        nextConfiguration.color = resolvedColor;
    }

    return nextConfiguration;
});

const applyRadioConfiguration = (component?: Partial<ERadio>): void => {
    if (component) {
        component.setConfiguration?.(radioConfiguration.value);
        return;
    }

    state.radioChilds.forEach((vueComponent) => {
        vueComponent.setConfiguration?.(radioConfiguration.value);
    });
};

const bindRadio = (component: Partial<ERadio>) => {
    state.radioChilds.push(component);
    applyRadioConfiguration(component);
};

const unbindRadio = (uid: number) => {
    const index = state.radioChilds.findIndex((c) => c.uid === uid);
    (index > -1) && (state.radioChilds.splice(index, 1));
};

const changeModelValue = (value: ERadioType): void => emit("update:modelValue", value);

const handleGroupFocus = (event?: FocusEvent): void => {
    focusHandler.value?.(event);
    if (event) {
        emit("focus", event);
    }
};

const handleGroupBlur = (event?: Event): void => {
    blurHandler.value?.(event);
    if (event) {
        emit("blur", event);
    }
};

const resolveGroupClass = (
    slotClass: string | Array<string> | Record<string, boolean> | undefined,
    slotState: {
        handleBlur: (event?: Event) => void;
        handleFocus: (event?: FocusEvent) => void;
        isDisabled: boolean;
        isReadonly: boolean;
    },
): Array<string | Array<string> | Record<string, boolean> | undefined> => {
    effectiveDisabled.value = slotState.isDisabled;
    effectiveReadonly.value = slotState.isReadonly;
    focusHandler.value = slotState.handleFocus;
    blurHandler.value = slotState.handleBlur;

    return ["e-radio-group-field__group", slotClass];
};

provide(RADIO_GROUP_KEY, {
    bindRadio,
    unbindRadio,
    handleFocus: handleGroupFocus,
    handleBlur: handleGroupBlur,
    changeModelValue,
    modelValue: computed(() => props.modelValue),
    name: `e-radio-group-${instance?.uid ?? "unknown"}`,
});

onMounted(() => init());

watch(radioConfiguration, () => applyRadioConfiguration(), { deep: true, immediate: true });

const init = async (): Promise<void> => {
    await nextTick();

    if (!canInitializeMandatoryValue.value) return;

    const firstRadioValue = state.radioChilds[0]?.modelValue;

    if (firstRadioValue === undefined) return;

    changeModelValue(firstRadioValue);
};

</script>
<style lang="scss" src="./style.scss"></style>
  