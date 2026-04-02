<template>
    <div ref="fieldRoot" :class="timePickerClass" :style="fieldStyle">
        <div class="e-time-picker__control e-field__control">
            <EMenu v-model="opened" full-width hold-focus check-offset :close-on-content-click="false"
                :disable-menu="isDisabled" content-role="presentation">
                <template #activator="{ ref: activatorRef }">
                    <div class="e-time-picker__slot e-field__slot" :ref="activatorRef" @mouseenter="handleHover(true)"
                        @mouseleave="handleHover(false)" @mousedown="handleSlotMousedown($event)"
                        @click="handleSlotClick($event)" @keydown="handleSlotKeydown($event)">
                        <div v-if="prependIcon" class="e-time-picker__prepend e-field__prepend-inner" aria-hidden="true">
                            <div class="e-field__icon e-field__icon--prepend-inner">
                                <EIcon :icon="prependIcon" />
                            </div>
                        </div>
                        <div class="e-field__overlay"></div>
                        <div class="e-time-picker__body e-field__field">
                            <label :id="labelId" :for="`${id}-hours`" :class="[
                                'e-label',
                                {
                                    'e-label--floating': isLabelFloating,
                                    'e-label--floated': shouldFloatLabel,
                                },
                            ]" :style="labelStyle">
                                <slot name="label">{{ label }}</slot>
                            </label>
                            <div :class="timePickerGroupClass" role="group" :aria-labelledby="labelId"
                                :aria-describedby="detailsId">
                                <input ref="hours" :id="`${id}-hours`" class="e-time-picker__input e-time-picker__input--hours input--text" v-model="hourModel"
                                    data-hours :readonly="hourInputReadonly" :disabled="isDisabled" limit="2"
                                    type="text" inputmode="numeric" pattern="[0-9]*" placeholder="00" autocomplete="off"
                                    aria-label="Hours" :aria-describedby="detailsId" @click.stop
                                    @focus="handleTimePickerFocus('hours', $event)"
                                    @blur="handleTimePickerBlur('hours', $event)"
                                    @keydown="handleInputKeydown('hours', $event)" />
                                <div class="e-time-picker__separator">
                                    <slot name="separator"><span>:</span></slot>
                                </div>
                                <input ref="minutes" :id="`${id}-minutes`" class="e-time-picker__input e-time-picker__input--minutes input--text" v-model="minutesModel"
                                    data-minutes :readonly="minutesInputReadonly" :disabled="isDisabled" limit="2"
                                    type="text" inputmode="numeric" pattern="[0-9]*" placeholder="00" autocomplete="off"
                                    aria-label="Minutes" :aria-describedby="detailsId" @click.stop
                                    @focus="handleTimePickerFocus('minutes', $event)"
                                    @blur="handleTimePickerBlur('minutes', $event)"
                                    @keydown="handleInputKeydown('minutes', $event)" />
                            </div>

                        </div>
                        <div class="e-time-picker__append e-time-picker__append--toggle e-field__append-inner" aria-hidden="true">
                            <div class="e-field__icon e-field__icon--append">
                                <EIcon :icon="arrowDown || icon.arrowDown" class="flip-icon" :color="color" />
                            </div>
                        </div>

                        <div v-if="appendIcon" class="e-time-picker__append e-field__append-inner" aria-hidden="true">
                            <div class="e-field__icon e-field__icon--append">
                                <EIcon :icon="appendIcon" />
                            </div>
                        </div>
                        <div v-if="!outlined" class="e-field__line"></div>
                    </div>
                </template>

                <div ref="menuContent" class="e-time-picker__menu-content"
                    @mousedown.capture="handleMenuContentMousedown">
                    <ul class="e-time-picker__menu-list">
                        <li class="e-time-picker__menu-segment">
                            <EButton block text size="small" type="button" :color="color" @mousedown.prevent
                                @click="arrowActions('hours', 'add')">
                                <EIcon :icon="icon.arrowUp" />
                            </EButton>
                            <div class="e-time-picker__menu-value">
                                <transition :name="globalTransition">
                                    <div :key="hourLabel">
                                        {{ hourLabel }}
                                    </div>
                                </transition>
                            </div>
                            <EButton block text size="small" type="button" :color="color" @mousedown.prevent
                                @click="arrowActions('hours', 'subtract')">
                                <EIcon :icon="icon.arrowDown" />
                            </EButton>
                        </li>
                        <li class="e-time-picker__separator e-time-picker__separator--animated" aria-hidden="true">
                            <slot name="separator"><span>:</span></slot>
                        </li>
                        <li class="e-time-picker__menu-segment">
                            <EButton block text size="small" type="button" :color="color" @mousedown.prevent
                                @click="arrowActions('minutes', 'add')">
                                <EIcon :icon="icon.arrowUp" />
                            </EButton>
                            <div class="e-time-picker__menu-value">
                                <transition :name="globalTransition">
                                    <div :key="minutesLabel">
                                        {{ minutesLabel }}
                                    </div>
                                </transition>
                            </div>
                            <EButton block text size="small" type="button" :color="color" @mousedown.prevent
                                @click="arrowActions('minutes', 'subtract')">
                                <EIcon :icon="icon.arrowDown" />
                            </EButton>
                        </li>
                    </ul>
                </div>
            </EMenu>
            <EDetails :id="detailsId" :details="details" :hasError="hasError" :showDetails="showDetails"></EDetails>
        </div>
    </div>
</template>
<script lang="ts" setup>
import UtilDate from '@/utils/date';
import EButton from '@/components/button/index.vue'
import EDetails from '@/components/form/details.vue'
import EIcon from '@/components/icon/index.vue'
import EMenu from '@/components/menu/index.vue'
import { useGridCol } from "@/composables/grid-col"
import { useField } from "@/composables/field"
import type { TimePickerEmits, TimePickerProps as TimePickerComponentProps } from '@/types/time-picker'

import icon from '@/utils/icons';
import { ref, computed, nextTick, onUnmounted } from 'vue';

const opened = ref(false);

const props = withDefaults(defineProps<TimePickerComponentProps>(), { minutesStep: 15, hoursStep: 1 });

const fieldRoot = ref<HTMLElement | null>(null)
const minutes = ref<HTMLInputElement>()
const hours = ref<HTMLInputElement>()
const menuContent = ref<HTMLElement | null>(null)
const skipBlurClose = ref(false)
const skipBlurCloseTimer = ref<number>()
const hourDraft = ref<string | null>(null)
const minutesDraft = ref<string | null>(null)
const globalTransition = ref('picker-transition')

const emit = defineEmits<TimePickerEmits>()

const { fieldClass, focused, id, showDetails, color, fieldStyle,
    details, labelStyle, handleHover, focus, blur, isDisabled, isReadonly,
    handleBlur: handleFieldBlur, validate, reset, resetValidation, hasError,
    isLabelFloating, shouldFloatLabel } = useField()
const { gridColClass } = useGridCol(props)

const model = computed({
    get: () => props.modelValue,
    set: (value: Date | string) => emit('update:modelValue', value),
})

const resolveModelDate = (value: Date | string): Date | null => {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value)
    }

    if (typeof value === 'string' && value.trim().length === 0) {
        return null
    }

    const parsedDate = new Date(value)
    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

const normalizedModelDate = computed(() => resolveModelDate(model.value))
const resolvedModelDate = computed(() => normalizedModelDate.value ?? new Date())

const hourLabel = computed(() => getFormattedSegmentValue('hours'))
const minutesLabel = computed(() => getFormattedSegmentValue('minutes'))
const hourInputReadonly = computed(() => Boolean(isReadonly.value || props.hourReadonly))
const minutesInputReadonly = computed(() => Boolean(isReadonly.value || props.minuteReadonly || props.minReadonly))
const labelId = computed(() => `${id}-label`)
const detailsId = computed(() => showDetails.value ? `${id}-details` : undefined)

const timePickerClass = computed(() => {
    const result = [...fieldClass.value, 'e-time-picker', ...gridColClass.value]
    opened.value && result.push('e-time-picker--is-open')
    return result
})

const resolvedInputAlign = computed(() => props.inputAlign ?? (shouldFloatLabel.value ? 'start' : 'end'))

const timePickerGroupClass = computed(() => [
    "e-time-picker__group  e-field__field-control",
    `e-time-picker__group--${resolvedInputAlign.value}`,
])

const openMenu = (): void => {
    if (isDisabled.value) return
    opened.value = true
}

const closeMenu = (): void => {
    opened.value = false
}

const setCompositeFocus = (value: boolean): void => {
    focused.value = value
}

const resolveBlurTarget = (event: FocusEvent): HTMLElement | null => {
    if (event.relatedTarget instanceof HTMLElement) return event.relatedTarget
    return document.activeElement instanceof HTMLElement ? document.activeElement : null
}

const openComposite = (timeKey: 'hours' | 'minutes', event?: FocusEvent): void => {
    getTimeDraft(timeKey).value = getNormalizedSegmentValue(timeKey)
    openMenu()

    if (focused.value) return

    setCompositeFocus(true)

    if (event) {
        emit('focus', event)
    }
}

const closeComposite = (event?: FocusEvent): void => {
    closeMenu()
    setCompositeFocus(false)

    if (event) {
        handleFieldBlur(event)
    }
}

const focusInput = (timeKey: 'hours' | 'minutes'): void => {
    if (timeKey === 'hours') {
        hours.value?.focus()
        return
    }

    minutes.value?.focus()
}

const scheduleInputFocus = (timeKey: 'hours' | 'minutes'): void => {
    nextTick(() => {
        focusInput(timeKey)
    })
}

const openFromActivator = (): void => {
    openMenu()
    scheduleInputFocus('hours')
}

const clearSkipBlurCloseGuard = (): void => {
    skipBlurClose.value = false

    if (skipBlurCloseTimer.value) {
        clearTimeout(skipBlurCloseTimer.value)
        skipBlurCloseTimer.value = undefined
    }
}

const arrowActions = (timeKey: 'minutes' | 'hours', actionKey: 'subtract' | 'add'): void => {
    const amount = timeKey === 'minutes' ? props.minutesStep : props.hoursStep
    const baseDate = resolvedModelDate.value
    const day = baseDate.getDate()

    const dateResult = new UtilDate(baseDate)[actionKey](amount, timeKey).set(day, 'days').date
    globalTransition.value = dateResult > baseDate ? 'picker-transition' : 'picker-transition-reverse'
    model.value = dateResult
    syncTimeDraft(timeKey, dateResult)
}

const getTimeDraft = (timeKey: 'hours' | 'minutes'): typeof hourDraft => {
    return timeKey === 'hours' ? hourDraft : minutesDraft
}

const getFormattedSegmentValue = (timeKey: 'hours' | 'minutes', value: Date | string = model.value): string => {
    const resolvedDate = resolveModelDate(value)
    if (!resolvedDate) return ''
    return new UtilDate(resolvedDate).format(timeKey === 'hours' ? 'hour-hh' : 'minutes-mm')
}

const getNormalizedSegmentValue = (timeKey: 'hours' | 'minutes', value: Date | string = model.value): string => {
    const localValue = getFormattedSegmentValue(timeKey, value)
    const parsedValue = Number.parseInt(localValue, 10)
    if (Number.isNaN(parsedValue)) return ''
    return `${parsedValue}`
}

const syncTimeDraft = (timeKey: 'hours' | 'minutes', value: Date | string = model.value): void => {
    const draft = getTimeDraft(timeKey)
    if (draft.value === null) return
    draft.value = getNormalizedSegmentValue(timeKey, value)
}

const handleTimePickerFocus = (timeKey: 'hours' | 'minutes', event: FocusEvent): void => {
    if (isDisabled.value) return

    openComposite(timeKey, event)
}

const clampTimeValue = (value: number, timeKey: 'hours' | 'minutes'): number => {
    const min = 0
    const max = timeKey === 'hours' ? 23 : 59
    return Math.min(max, Math.max(min, value))
}

const setTimeSegment = (timeKey: 'hours' | 'minutes', value: string | number): void => {
    if (isDisabled.value) return
    if (timeKey === 'hours' && hourInputReadonly.value) return
    if (timeKey === 'minutes' && minutesInputReadonly.value) return

    const rawValue = `${value ?? ''}`.replace(/\D/g, '').slice(0, 2)
    getTimeDraft(timeKey).value = rawValue
    if (!rawValue.length) return

    const parsedValue = Number.parseInt(rawValue, 10)
    if (Number.isNaN(parsedValue)) return

    const dateResult = new UtilDate(resolvedModelDate.value).set(clampTimeValue(parsedValue, timeKey), timeKey).date
    model.value = dateResult

    if (timeKey === 'hours' && rawValue.length === 2) {
        scheduleInputFocus('minutes')
    }
}

const hourModel = computed({
    get: (): string => hourDraft.value ?? hourLabel.value,
    set: (value: string | number) => setTimeSegment('hours', value),
})

const minutesModel = computed({
    get: (): string => minutesDraft.value ?? minutesLabel.value,
    set: (value: string | number) => setTimeSegment('minutes', value),
})

const isTimePickerFocusTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false
    return Boolean(fieldRoot.value?.contains(target) || menuContent.value?.contains(target))
}

const handleTimePickerBlur = (timeKey: 'hours' | 'minutes', event: FocusEvent): void => {
    getTimeDraft(timeKey).value = null

    nextTick(() => {
        if (skipBlurClose.value) {
            setCompositeFocus(true)
            return
        }

        const nextFocusedElement = resolveBlurTarget(event)

        if (isTimePickerFocusTarget(nextFocusedElement)) {
            setCompositeFocus(true)
            return
        }

        closeComposite(event)
    })
}

const isInputTarget = (event: Event): boolean => {
    const target = event.target
    return target instanceof HTMLElement && Boolean(target.closest('input'))
}

const handleSlotClick = (event: Event): void => {
    if (isInputTarget(event)) return
    if (isDisabled.value) return

    openFromActivator()
}

const handleSlotMousedown = (event: MouseEvent): void => {
    if (isInputTarget(event)) return
    event.preventDefault()
}

const handleMenuContentMousedown = (): void => {
    skipBlurClose.value = true

    skipBlurCloseTimer.value && clearTimeout(skipBlurCloseTimer.value)
    skipBlurCloseTimer.value = window.setTimeout(() => {
        clearSkipBlurCloseGuard()
    }, 0)
}

const handleSlotKeydown = (event: KeyboardEvent): void => {
    if (isInputTarget(event)) return

    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault()
        openFromActivator()
    }
}

const handleInputKeydown = (timeKey: 'hours' | 'minutes', event: KeyboardEvent): void => {
    if (event.key === 'Enter' && timeKey === 'hours') {
        event.preventDefault()
        focusInput('minutes')
        return
    }

    if (event.key === 'Enter' && timeKey === 'minutes') {
        event.preventDefault()
        closeMenu()
        return
    }

    if (event.key === 'ArrowRight' && timeKey === 'hours') {
        event.preventDefault()
        focusInput('minutes')
        return
    }

    if (event.key === 'ArrowLeft' && timeKey === 'minutes') {
        event.preventDefault()
        focusInput('hours')
        return
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault()
        arrowActions(timeKey, 'add')
        return
    }

    if (event.key === 'ArrowDown') {
        event.preventDefault()
        arrowActions(timeKey, 'subtract')
        return
    }

    if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
    }
}

onUnmounted(() => {
    clearSkipBlurCloseGuard()
})

defineExpose({
    focus,
    blur,
    validate,
    reset,
    resetValidation,
    hours,
    minutes,
})

</script>
<style lang="scss" src="./style.scss"></style>