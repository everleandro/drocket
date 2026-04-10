<template>
    <EField ref="field" v-bind="resolvedFieldProps" :class="timePickerClass">
        <template v-for="(_, name) in passThroughSlots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps ?? {}"></slot>
        </template>

        <template #append-inner>
            <slot name="append-inner"></slot>
            <div class="e-time-picker__toggle" aria-hidden="true">
                <EIcon :icon="arrowDown || icon.arrowDown" class="flip-icon" />
            </div>
        </template>

        <template #default="{ inputId, detailsId, slotClass, handleBlur, handleFocus, hasError, isDisabled, frameEl }">

            <div :class="['e-time-picker__body', slotClass]" role="group" :aria-labelledby="`${inputId}-label`"
                :aria-describedby="detailsId">
                <input :id="inputId" ref="hours" v-model="hourModel"
                    class="e-time-picker__input input--text" data-hours
                    :readonly="hourInputReadonly" :disabled="isDisabled" maxlength="2" type="text" inputmode="numeric"
                    pattern="[0-9]*" placeholder="00" autocomplete="off" aria-label="Hours" :aria-invalid="hasError"
                    :aria-describedby="detailsId" :aria-disabled="isDisabled" :aria-readonly="hourInputReadonly"
                   @focus="handleFocus"
                    @blur="handleBlur"/>

                <div class="e-time-picker__separator">
                    <slot name="separator"><span>:</span></slot>
                </div>

                <input :id="`${inputId}-minutes`" ref="minutes" v-model="minutesModel"
                    class="e-time-picker__input input--text" data-minutes
                    :readonly="minutesInputReadonly" :disabled="isDisabled" maxlength="2" type="text"
                    inputmode="numeric" pattern="[0-9]*" placeholder="00" autocomplete="off" aria-label="Minutes"
                    :aria-invalid="hasError" :aria-describedby="detailsId" :aria-disabled="isDisabled"
                    :aria-readonly="minutesInputReadonly"
                    @focus="handleFocus"
                    @blur="handleBlur"/>
            </div>


            <EMenu :activator="frameEl" v-model="opened" full-width check-offset :disable-menu="props.disabled"
                content-role="presentation">
                <div ref="menuContent" class="e-time-picker__menu-content">
                    <div class="time-row">
                        <EButton block text size="small" type="button" tabindex="-1"
                            @click="arrowActions('hours', 'add')">
                            <EIcon :icon="icon.arrowUp" />
                        </EButton>
                        <EButton block text size="small" type="button" tabindex="-1"
                            @click="arrowActions('minutes', 'add')">
                            <EIcon :icon="icon.arrowUp" />
                        </EButton>
                    </div>
                    <div class="time-row">
                        <transition :name="globalTransition">
                            <div :key="hourLabel">
                                {{ hourLabel }}
                            </div>
                        </transition>
                        <slot name="separator"><span>:</span></slot>
                        <transition :name="globalTransition">
                            <div :key="minutesLabel">
                                {{ minutesLabel }}
                            </div>
                        </transition>

                    </div>
                    <div class="time-row">
                        <EButton block text size="small" type="button" tabindex="-1"
                            @click="arrowActions('hours', 'subtract')">
                            <EIcon :icon="icon.arrowDown" />
                        </EButton>
                        <EButton block text size="small" type="button" tabindex="-1"
                            @click="arrowActions('minutes', 'subtract')">
                            <EIcon :icon="icon.arrowDown" />
                        </EButton>
                    </div>

                </div>
            </EMenu>
        </template>
    </EField>
</template>

<script lang="ts" setup>
import { computed, nextTick, onUnmounted, ref, useSlots } from "vue";

import UtilDate from "@/utils/date";
import icon from "@/utils/icons";
import { useFieldIntegration } from "@/composables/field-integration";
import type {
    TimePickerEmits,
    TimePickerProps as TimePickerComponentProps,
    TimePickerValue,
} from "@/types/time-picker";

import EButton from "@/components/button/index.vue";
import EField from "@/components/form/field/index.vue";
import EIcon from "@/components/icon/index.vue";
import EMenu from "@/components/menu/index.vue";

const props = withDefaults(defineProps<TimePickerComponentProps>(), {
    minutesStep: 15,
    hoursStep: 1,
});

const emit = defineEmits<TimePickerEmits>();
const slots = useSlots();

const { blur, field, fieldProps, focus, passThroughSlots } = useFieldIntegration<TimePickerValue>(props, slots, {
    omitSlots: ["append-inner", "default"],
});

const opened = ref(false);
const controlRoot = ref<HTMLElement | null>(null);
const menuContent = ref<HTMLElement | null>(null);
const hours = ref<HTMLInputElement | null>(null);
const minutes = ref<HTMLInputElement | null>(null);
const skipBlurClose = ref(false);
const skipBlurCloseTimer = ref<number>();
const hourDraft = ref<string | null>(null);
const minutesDraft = ref<string | null>(null);
const globalTransition = ref("picker-transition");
const isCompositeFocused = ref(false);

const resolvedFieldProps = computed(() => ({
    ...fieldProps.value,
    focusWithin: opened.value,
    prependIcon: undefined,
    appendIcon: undefined,
}));

const model = computed({
    get: () => props.modelValue,
    set: (value: Date | string) => emit("update:modelValue", value),
});

const resolveModelDate = (value: Date | string): Date | null => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value);
    }

    if (typeof value === "string" && value.trim().length === 0) {
        return null;
    }

    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const normalizedModelDate = computed(() => resolveModelDate(model.value));
const resolvedModelDate = computed(() => normalizedModelDate.value ?? new Date());

const timePickerClass = computed(() => {
    const result = ["e-time-picker"];

    if (opened.value) result.push("e-time-picker--is-open");

    return result;
});

const hourLabel = computed(() => getFormattedSegmentValue("hours"));
const minutesLabel = computed(() => getFormattedSegmentValue("minutes"));
const hourInputReadonly = computed(() => Boolean(props.readonly || props.hourReadonly));
const minutesInputReadonly = computed(() => Boolean(props.readonly || props.minuteReadonly || props.minReadonly));

const openMenu = (): void => {
    if (props.disabled) return;
    opened.value = true;
};

const closeMenu = (): void => {
    opened.value = false;
};

const resolveBlurTarget = (event: FocusEvent): HTMLElement | null => {
    if (event.relatedTarget instanceof HTMLElement) return event.relatedTarget;
    return document.activeElement instanceof HTMLElement ? document.activeElement : null;
};

const getTimeDraft = (timeKey: "hours" | "minutes") => {
    return timeKey === "hours" ? hourDraft : minutesDraft;
};

const getFormattedSegmentValue = (
    timeKey: "hours" | "minutes",
    value: Date | string = model.value,
): string => {
    const resolvedDate = resolveModelDate(value);

    if (!resolvedDate) return "";

    return new UtilDate(resolvedDate).format(timeKey === "hours" ? "hour-hh" : "minutes-mm");
};

const getNormalizedSegmentValue = (
    timeKey: "hours" | "minutes",
    value: Date | string = model.value,
): string => {
    const localValue = getFormattedSegmentValue(timeKey, value);
    const parsedValue = Number.parseInt(localValue, 10);

    if (Number.isNaN(parsedValue)) return "";

    return `${parsedValue}`;
};

const syncTimeDraft = (
    timeKey: "hours" | "minutes",
    value: Date | string = model.value,
): void => {
    const draft = getTimeDraft(timeKey);

    if (draft.value === null) return;

    draft.value = getNormalizedSegmentValue(timeKey, value);
};

const focusInput = (timeKey: "hours" | "minutes"): void => {
    if (timeKey === "hours") {
        hours.value?.focus();
        return;
    }

    minutes.value?.focus();
};

const scheduleInputFocus = (timeKey: "hours" | "minutes"): void => {
    nextTick(() => {
        focusInput(timeKey);
    });
};

const openFromActivator = (): void => {
    openMenu();
    scheduleInputFocus("hours");
};

const clearSkipBlurCloseGuard = (): void => {
    skipBlurClose.value = false;

    if (skipBlurCloseTimer.value) {
        clearTimeout(skipBlurCloseTimer.value);
        skipBlurCloseTimer.value = undefined;
    }
};

const arrowActions = (timeKey: "minutes" | "hours", actionKey: "subtract" | "add"): void => {
    const amount = timeKey === "minutes" ? props.minutesStep : props.hoursStep;
    const baseDate = resolvedModelDate.value;
    const day = baseDate.getDate();
    const dateResult = new UtilDate(baseDate)[actionKey](amount, timeKey).set(day, "days").date;

    globalTransition.value = dateResult > baseDate ? "picker-transition" : "picker-transition-reverse";
    model.value = dateResult;
    syncTimeDraft(timeKey, dateResult);
};

const openComposite = (
    timeKey: "hours" | "minutes",
    event: FocusEvent,
    handleFieldFocus: (event?: FocusEvent) => void,
): void => {
    getTimeDraft(timeKey).value = getNormalizedSegmentValue(timeKey);
    openMenu();

    if (isCompositeFocused.value) return;

    isCompositeFocused.value = true;
    handleFieldFocus(event);
};

const closeComposite = (
    handleFieldBlur: (event?: Event) => void,
    event?: FocusEvent,
): void => {
    closeMenu();
    isCompositeFocused.value = false;
    handleFieldBlur(event);
};

const clampTimeValue = (value: number, timeKey: "hours" | "minutes"): number => {
    const min = 0;
    const max = timeKey === "hours" ? 23 : 59;
    return Math.min(max, Math.max(min, value));
};

const setTimeSegment = (timeKey: "hours" | "minutes", value: string | number): void => {
    if (props.disabled) return;
    if (timeKey === "hours" && hourInputReadonly.value) return;
    if (timeKey === "minutes" && minutesInputReadonly.value) return;

    const rawValue = `${value ?? ""}`.replace(/\D/g, "").slice(0, 2);

    getTimeDraft(timeKey).value = rawValue;

    if (!rawValue.length) return;

    const parsedValue = Number.parseInt(rawValue, 10);

    if (Number.isNaN(parsedValue)) return;

    const dateResult = new UtilDate(resolvedModelDate.value)
        .set(clampTimeValue(parsedValue, timeKey), timeKey)
        .date;

    model.value = dateResult;

    if (timeKey === "hours" && rawValue.length === 2) {
        scheduleInputFocus("minutes");
    }
};

const hourModel = computed({
    get: (): string => hourDraft.value ?? hourLabel.value,
    set: (value: string | number) => setTimeSegment("hours", value),
});

const minutesModel = computed({
    get: (): string => minutesDraft.value ?? minutesLabel.value,
    set: (value: string | number) => setTimeSegment("minutes", value),
});

const isTimePickerFocusTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;

    return Boolean(controlRoot.value?.contains(target) || menuContent.value?.contains(target));
};



const isInputTarget = (event: Event): boolean => {
    const target = event.target;
    return target instanceof HTMLElement && Boolean(target.closest("input"));
};

const handleSlotClick = (event: Event): void => {
    if (isInputTarget(event)) return;
    if (props.disabled) return;

    openFromActivator();
};

const handleSlotMousedown = (event: MouseEvent): void => {
    if (isInputTarget(event)) return;
    event.preventDefault();
};

const handleMenuContentMousedown = (): void => {
    skipBlurClose.value = true;

    if (skipBlurCloseTimer.value) {
        clearTimeout(skipBlurCloseTimer.value);
    }

    skipBlurCloseTimer.value = window.setTimeout(() => {
        clearSkipBlurCloseGuard();
    }, 0);
};


defineExpose({
    focus,
    blur,
    validate: () => field.value?.validate() ?? true,
    reset: () => field.value?.reset(),
    resetValidation: () => field.value?.resetValidation?.(),
    hours,
    minutes,
});
</script>

<style lang="scss" src="./style.scss"></style>