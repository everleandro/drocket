<template>
    <div :class="timePickerClass">
        <div class="e-field__control" v-click-outside="handleOutsideMenu">
            <div class="e-field__slot" @mouseenter="handleHover(true)" @mouseleave="handleHover(false)"
                @click.self="opened = !opened">
                <div v-if="prependIcon" class="e-field__prepend-inner" @click="handleClickPrependIcon">
                    <div class="e-field__icon e-field__icon--prepend-inner">
                        <EIcon v-if="mounted" :icon="prependIcon" />
                    </div>
                </div>
                <div class="e-field__overlay"></div>
                <div class="e-time-picker__fields">
                    <label v-if="mounted" :for="`${id}-hours`" :class="[textColor, 'e-label']" :style="labelStyle">
                        <slot name="label">{{ label }}</slot>
                    </label>
                    <input v-if="mounted" ref="hours" :id="`${id}-hours`" class="input--text" :value="hourLabel" data-hours
                        readonly limit="2" type="number" placeholder="00" autocomplete="off" max="24" min="0"
                        @focus="handleFocus" @blur="handleBlur" />
                    <div class="e-time-picker__separator">
                        <slot name="separator"><span class="mt-n1">:</span></slot>
                    </div>
                    <input v-if="mounted" ref="minutes" :id="`${id}-minutes`" class="input--text" step="15" data-minutes
                        :value="minutesLabel" readonly limit="2" type="number" placeholder="00" autocomplete="off" max="59"
                        min="0" @focus="handleFocus" @blur="handleBlur" />
                    <div class="e-field__append-inner" @click="opened = !opened">
                        <div class="e-field__icon e-field__icon--append">
                            <EIcon v-if="mounted" :icon="icon.arrowDown" class="flip-icon" />
                        </div>
                    </div>
                </div>

                <div v-if="appendIcon" class="e-field__append-inner" @click="handleClickAppendIcon">
                    <div class="e-field__icon e-field__icon--append">
                        <EIcon v-if="mounted" :icon="appendIcon" />
                    </div>
                </div>
                <div v-if="!outlined" class="e-field__line"></div>
                <div class="e-menu">
                    <transition name="fade">
                        <ul v-show="opened" class="e-menu__content white">
                            <li>
                                <EButton block text small type="button" @click="arrowActions('hours', 'add')">
                                    <EIcon v-if="mounted" :icon="icon.arrowUp" />
                                </EButton>
                                <div class="time-info">
                                    <transition :name="globalTransition">
                                        <div :key="hourLabel">
                                            {{ hourLabel }}
                                        </div>
                                    </transition>
                                </div>
                                <EButton block text small type="button" @click="arrowActions('hours', 'subtract')">
                                    <EIcon v-if="mounted" :icon="icon.arrowDown" />
                                </EButton>
                            </li>
                            <div class="e-time-picker__separator e-time-picker__separator--animated">
                                <slot name="separator"><span>:</span></slot>
                            </div>
                            <li>
                                <EButton block text small type="button" @click="arrowActions('minutes', 'add')">
                                    <EIcon v-if="mounted" :icon="icon.arrowUp" />
                                </EButton>
                                <div class="time-info">
                                    <transition :name="globalTransition">
                                        <div :key="minutesLabel">
                                            {{ minutesLabel }}
                                        </div>
                                    </transition>
                                </div>
                                <EButton block text small type="button" @click="arrowActions('minutes', 'subtract')">
                                    <EIcon v-if="mounted" :icon="icon.arrowDown" />
                                </EButton>
                            </li>
                        </ul>
                    </transition>
                </div>
            </div>
            <EDetails :details="details" :textColorClass="textColor" :showDetails="showDetails"></EDetails>
        </div>
    </div>
</template>
<script lang="ts" setup>
import UtilDate from '@/utils/date';
import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import { useGrid } from "@/composables/grid"
import { useField } from "@/composables/field"
import { IconPath } from '@/types'

import icon from '@/utils/icons';

export interface Props {
    arrowDown?: IconPath; disabled?: boolean; dense?: boolean; readonly?: boolean; hoursStep?: number
    labelInline?: boolean; detail?: string; outlined?: boolean; label?: string | number; retainColor?: boolean;
    modelValue: Date | string; color?: string; appendIcon?: string; hourReadonly?: boolean;
    detailErrors?: Array<string>; detailsOnMessageOnly?: boolean; minReadonly?: boolean; minutesStep?: number;
    labelMinWidth?: string; prependIcon?: IconPath; rules?: Array<(param: any) => string | boolean>;
    cols?: string | number; xs?: string | number; sm?: string | number; md?: string | number;
    lg?: string | number; xl?: string | number;
}
import { ref, watch, onUnmounted, computed, nextTick } from 'vue';

const opened = ref(false);

const props = withDefaults(defineProps<Props>(), { minutesStep: 15, hoursStep: 1 });

const minutes = ref<HTMLInputElement>()
const hours = ref()
const globalTransition = ref('picker-transition')

const emit = defineEmits<{
    (e: 'click:prepend'): void, (e: 'click:append'): void, (e: 'blur', value: Event): void,
    (e: 'update:modelValue', value: string | Date): void,
    (e: 'focus', value: Event): void,
    (e: 'blur', value: Event): void
}>()

const { fieldClass, dirty, focused, id, showDetails, textColor, color,
    details, labelStyle, handleHover, handleClickPrependIcon,
    handleClickAppendIcon, mounted } = useField()
const { gridClass } = useGrid('e-field')

watch(() => opened.value, (val: boolean) => {
    if (val) {
        document.addEventListener("keydown", handleExcListener);
        focused.value = true;
    }
    else
        document.removeEventListener("keydown", handleExcListener);
})

onUnmounted(() => {
    document.removeEventListener("keydown", handleExcListener);
})

const hourLabel = computed(() => new UtilDate(props.modelValue).format('hour-hh'))
const minutesLabel = computed(() => new UtilDate(props.modelValue).format('minutes-mm'))

const timePickerClass = computed(() => {
    const result = [...fieldClass.value, 'e-time-picker', ...gridClass.value]
    opened.value && result.push('e-time-picker--is-open')
    return result
})

const arrowActions = (timeKey: 'minutes' | 'hours', actionKey: 'subtract' | 'add'): void => {
    const amount = timeKey === 'minutes' ? props.minutesStep : props.hoursStep
    const day = new Date(props.modelValue).getDate()

    const dateResult = new UtilDate(props.modelValue)[actionKey](amount, timeKey).set(day, 'days').date
    globalTransition.value = dateResult > new Date(props.modelValue) ? 'picker-transition' : 'picker-transition-reverse'
    changeValue(dateResult)
}



const handleOutsideMenu = (): void => {
    dirty.value = true;
    closeMenu()
}

const handleFocus = (event: Event) => {
    focused.value = true;
    opened.value = true
    emit('focus', event)
}

const handleExcListener = ({ key }: KeyboardEvent): void => {
    if (key === "Escape") {
        closeMenu()

    }
}

const changeValue = (value: Date | string) => {
    emit('update:modelValue', value)
}

const handleBlur = (event: Event) => {
    dirty.value = true;
    nextTick(() => {
        if (!opened.value) {
            emit('blur', event)
            // closeMenu()
        }
    })
}

const closeMenu = (): void => {
    opened.value = false;
    minutes.value?.blur()
    hours.value?.blur()
    focused.value = false;
}

</script>
<style lang="scss" src="./style.scss"></style>