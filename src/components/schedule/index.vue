
<template>
    <div class="e-schedule-container">
        <transition name="fade" mode="out-in">
            <div :key="mode" :class="scheduleClass" :style="scheduleStyle" role="region"
                aria-label="Schedule" :aria-busy="loading ? 'true' : 'false'">
                <span>
                    <EProgressLinear v-show="loading" :indeterminate="loading" height="4" />
                </span>
                <div class="e-schedule__column col-hour-info">
                    <div class="e-schedule__header e-schedule__cell">
                        <span v-if="chunk(headerLabels).length > 1" class="action-container">
                            <button v-ripple class="e-btn" type="button" aria-label="Previous schedule page"
                                title="Previous schedule page" @click="changeSubPage('-')">
                                <EIcon :icon="icon.arrowLeft" />
                            </button>
                            <button v-ripple class="e-btn" type="button" aria-label="Next schedule page"
                                title="Next schedule page" @click="changeSubPage('+')">
                                <EIcon :icon="icon.arrowRight" />
                            </button>
                        </span>
                        <span v-else></span>
                    </div>
                    <div v-for="(hour, hourIndex) in hourList" :key="hourIndex" class="e-schedule__hour e-schedule__cell">
                        <span>
                            <span class="hour-label e-vue-input--text">{{ hour }}</span>
                        </span>
                    </div>
                </div>
                <transition :name="local.globalContentAnimation" mode="out-in">
                    <div :key="schedulePageKey" class="e-schedule__body">
                        <div v-for="(data, colIndex) in visibleHeaderLabels" :key="colKey(data)" class="e-schedule__column">
                            <div class="e-schedule__header e-schedule__cell">
                                <span v-if="computedMode === ScheduleMode.schedule">
                                    <EButton class="e-schedule-btn--space" :color="color" text depressed
                                        :aria-label="scheduleHeaderAriaLabel(data)"
                                        @click="handleHeaderLabelClick(data.date, data.entityId)">
                                        {{ data.label }}
                                    </EButton>
                                </span>
                                <span v-else>
                                    <span data-day-of-week="true"> {{ data.dayOfWeek }}</span>
                                    <EButton class="mt-1 e-schedule-btn--day" :color="color" :text="!data.today"
                                        :aria-current="data.today ? 'date' : undefined"
                                        :aria-label="calendarHeaderAriaLabel(data)"
                                        depressed @click="handleHeaderLabelClick(data.date)">
                                        {{ data.dayOfMonth }}
                                    </EButton>
                                </span>
                            </div>
                            <div v-for="(hour, hourIndex) in hourList" :key="hourIndex"
                                class="e-schedule__event-cell e-schedule__cell">
                                <div v-if="hasEvent(getVisibleEventPoint(hourIndex, colIndex))"
                                    class="e-schedule__event"
                                    :style="eventStyle(getVisibleEventPoint(hourIndex, colIndex))">
                                    <slot name="event" :event="getEvent(getVisibleEventPoint(hourIndex, colIndex))">
                                        <button v-ripple type="button"
                                            :aria-label="eventAriaLabel(getEvent(getVisibleEventPoint(hourIndex, colIndex)))"
                                            :class="eventClass(getEvent(getVisibleEventPoint(hourIndex, colIndex)))"
                                            @click="handleEventClick(getEvent(getVisibleEventPoint(hourIndex, colIndex)), $event)">
                                            <span class="event-name">{{
                                                getEvent(getVisibleEventPoint(hourIndex, colIndex)).name
                                            }}</span>
                                            <span class="event-subtitle">{{
                                                getEvent(getVisibleEventPoint(hourIndex, colIndex)).subtitle
                                            }}</span>
                                            <span class="event-footer">{{
                                                getEvent(getVisibleEventPoint(hourIndex, colIndex)).footer
                                            }}</span>
                                        </button>
                                    </slot>
                                </div>
                                <slot v-else name="empty-slot" :data="getEmptySlotData(getVisibleEmptyPoint(hourIndex, colIndex))">
                                    <button v-ripple type="button" :aria-label="emptySlotAriaLabel(getEmptySlotData(getVisibleEmptyPoint(hourIndex, colIndex)))"
                                        :class="[
                                        'v-ripple-element',
                                        'e-schedule__empty-slot',
                                        'e-btn',
                                        'e-btn--text'
                                    ]" @click="emptySlotClickHandler(getVisibleEmptyPoint(hourIndex, colIndex), $event)"></button>
                                </slot>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import type { ScheduleEvent, ScheduleSpace, Point, ScheduleSlotEvent } from "@/types";
import { ScheduleMode } from "@/types";
import { Lng as Lnguage, suportedLng } from '@/locales/index';
import EProgressLinear from '@/components/progress/linear.vue';
import { useResolvedColor } from '@/composables/color';
import { normalizeCssSize } from '@/utils/style';

import UtilDate from '@/utils/date';
import icon from '@/utils/icons';

import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import { computed, nextTick, onMounted, reactive, watch } from "vue";


export interface Props {
    lng?: suportedLng; color?: string; stickyTopHeader?: string | number; loading?: boolean; scheduleColumn?: string | number;
    rowHeight?: string; step?: number; start?: number; events?: ScheduleEvent[]; scheduleAfterWeek?: boolean;
    end?: number; spaces?: ScheduleSpace[]; selectedSpace?: ScheduleSpace; modelValue: Date; mode?: ScheduleMode;
}
const props = withDefaults(defineProps<Props>(),
    {
        lng: 'en', color: 'primary', rowHeight: '97',
        step: 60 * 60, start: 0, events: () => [], stickyTopHeader: 0,
        end: 60 * 60 * 24, spaces: () => []
    })

const local = reactive({
    mode: ScheduleMode.day,
    page: 0,
    forceUnanimated: false,
    selectedSpace: <ScheduleSpace | undefined>undefined,
    events: new Array<Array<ScheduleEvent>>(),
    globalContentAnimation: 'tab-transition'
})

const scheduleClass = computed(() => {
    const classes = ['e-schedule']
    modeDay.value && classes.push('e-schedule--day')
    if (props.stickyTopHeader) classes.push('e-schedule--header-stiky')
    if (props.loading) classes.push('e-schedule--loading')
    return classes
})

const colKey = (data: any) => {
    return computedMode.value === ScheduleMode.schedule ? data.entityId : data.dayOfWeek + '-' + data.dayOfMonth
}

const modeDay = computed(() => computedMode.value === ScheduleMode.day)

const emit = defineEmits<{
    (e: 'update:modelValue', value: Date): void,
    (e: 'update:mode', value: ScheduleMode): void,
    (e: 'click:header-label', value: { date: Date, entityId?: number | string }): void,
    (e: 'click:empty-slot', value: { data: ScheduleSlotEvent, nativeEvent: MouseEvent }): void,
    (e: 'click:event', value: { data: ScheduleEvent, nativeEvent: MouseEvent }): void,
    (e: 'update:selected-space', value: ScheduleSpace | undefined): void,
}>()

const changeValue = (value: Date): void => {
    emit('update:modelValue', value)
}

const changeSubPage = (sign: '+' | '-') => {
    const lastPage = headerChunks.value.length - 1
    local.globalContentAnimation = sign === '+' ? 'tab-transition' : 'tab-reverse-transition'
    let nextPage = local.page + parseInt(`${sign}1`)
    if (nextPage < 0) nextPage = lastPage
    if (nextPage > lastPage) nextPage = 0
    local.page = nextPage
}

const computedMode = computed((): ScheduleMode => {
    return props.mode != undefined ? props.mode : local.mode;
})

const changeMode = (value: ScheduleMode) => {
    local.mode = value;
    emit('update:mode', value);
}

const computedSelectedSpace = computed((): ScheduleSpace | undefined => {
    return props.selectedSpace != undefined ? props.selectedSpace : local.selectedSpace;
})

const resolvedSelectedSpace = computed((): ScheduleSpace | undefined => {
    return computedSelectedSpace.value ?? props.spaces[0]
})

const changeSelectedSpace = (value: ScheduleSpace | undefined) => {
    local.selectedSpace = value;
    emit('update:selected-space', value);
}

const formatScheduleTime = (value: Date | string): string => {
    return new UtilDate(value).format('hour-hh:minutes-mm')
}

const eventAriaLabel = (event: ScheduleEvent): string => {
    const footer = event.footer ? `, ${String(event.footer)}` : ''
    return `${event.name}, ${formatScheduleTime(event.start)} to ${formatScheduleTime(event.end)}${footer}`
}

const emptySlotAriaLabel = (slot: ScheduleSlotEvent): string => {
    return `Create event for ${String(slot.entityId ?? 'schedule')} from ${formatScheduleTime(slot.start)} to ${formatScheduleTime(slot.end)}`
}

const scheduleHeaderAriaLabel = (data: { label: string }) => {
    return `Open schedule column ${data.label}`
}

const calendarHeaderAriaLabel = (data: { dayOfWeek: string; dayOfMonth: string | number }) => {
    return `Open ${data.dayOfWeek} ${data.dayOfMonth}`
}

watch(() => props.selectedSpace, () => setLocalEvents())
watch(() => props.modelValue, (value, oldValue) => {
    const reverse = new UtilDate(value).date > new UtilDate(oldValue).date
    if (local.forceUnanimated) {
        local.forceUnanimated = false
        local.globalContentAnimation = ''
    }
    else
        local.globalContentAnimation = reverse ? 'tab-transition' : 'tab-reverse-transition'
    setLocalEvents()
})
watch(() => props.mode, (newValue: ScheduleMode | undefined, oldValue: ScheduleMode | undefined) => {
    if (oldValue !== newValue) {
        local.globalContentAnimation = ""
        local.page = 0
        setLocalEvents()
    }
})
watch(() => props.scheduleColumn, () => {
    local.page = 0
})

watch(() => props.events, () => setLocalEvents(), { deep: true })

const setLocalEvents = (): void => {

    const result: Array<Array<ScheduleEvent>> = [];
    const dateFrom = new UtilDate(props.modelValue).setTime(0, 0, 0).date;
    const dateTo = new UtilDate(props.modelValue)
        .setTime(23, 59, 59)
        .add(6, 'days').date;

    let events = props.events.filter(
        ({ start }: ScheduleEvent) => new UtilDate(start).date > dateFrom && new UtilDate(start).date < dateTo
    );

    if (modeDay.value) {
        events = events.filter(
            ({ start, entityId }: ScheduleEvent) => (new UtilDate(start).date.getDay() == dateFrom.getDay()) && (entityId === resolvedSelectedSpace.value?.id)

        );
    } else if (computedMode.value === ScheduleMode.schedule) {
        events = events.filter(
            ({ start }: ScheduleEvent) => new UtilDate(start).date.getDay() == dateFrom.getDay()
        );
    } else if (computedMode.value === ScheduleMode.week) {
        events = events.filter(
            ({ entityId }: ScheduleEvent) => entityId === resolvedSelectedSpace.value?.id
        );
    }

    events.forEach((event: ScheduleEvent) => {
        const day = props.modelValue.getDay();
        event.subtitle ??= new UtilDate(event.start).format('hour-hh:minutes-mm') + ' - ' + new UtilDate(event.end).format('hour-hh:minutes-mm');
        let y = -1;
        if (modeDay.value) y = 0;
        else if (computedMode.value === ScheduleMode.schedule) {
            y = props.spaces.findIndex(({ id }) => id == event.entityId);
        } else if (computedMode.value === ScheduleMode.week) {
            y = new UtilDate(event.start).date.getDay();
            y = y < day ? 7 - day + y : y - day;
        }
        if (y !== -1) {
            const timePassed = secondsByDate(new UtilDate(event.start).date);
            const x = Math.floor(timePassed / props.step);

            if (result[x]) {
                result[x][y] = event;
            } else {
                result[x] = [];
                result[x][y] = event;
            }
        }
    });

    local.events = result;
}

const secondsByDate = (date: Date): number => date.getSeconds() + date.getMinutes() * 60 + date.getHours() * 60 * 60 - props.start

const toPointIndex = (value: string | number): number => Number(value)

const getEventPoint = (
    hourIndex: string | number,
    colIndex: string | number,
    chunkIndex: string | number,
): Point => ({ x: toPointIndex(hourIndex), y: toPointIndex(colIndex) + toPointIndex(chunkIndex) })

const currentChunkOffset = computed(() => {
    if (computedMode.value !== ScheduleMode.schedule || !props.scheduleColumn) return 0
    return local.page * parseInt(`${props.scheduleColumn}`, 10)
})

const getVisibleEventPoint = (
    hourIndex: string | number,
    colIndex: string | number,
): Point => ({ x: toPointIndex(hourIndex), y: toPointIndex(colIndex) + currentChunkOffset.value })

const getEmptyPoint = (hourIndex: string | number, colIndex: string | number): Point => ({
    x: toPointIndex(hourIndex),
    y: toPointIndex(colIndex),
})

const getVisibleEmptyPoint = (hourIndex: string | number, colIndex: string | number): Point => ({
    x: toPointIndex(hourIndex),
    y: toPointIndex(colIndex) + currentChunkOffset.value,
})

const getEvent = ({ x, y }: Point) => local.events[x][y]

const getEmptySlotData = ({ x, y }: Point): ScheduleSlotEvent => {
    const timestamp = props.start + x * props.step;

    const startHours: number = Math.floor(timestamp / 60 / 60);
    const startMinutes: number = Math.floor(timestamp / 60) - startHours * 60;

    const endHours: number = Math.floor((timestamp + props.step) / 60 / 60);
    const endMinutes: number =
        Math.floor((timestamp + props.step) / 60) - endHours * 60;
    const selectedDate: Date = modeDay.value || computedMode.value === ScheduleMode.schedule
        ? props.modelValue
        : new UtilDate(props.modelValue).add(y, 'days').date;

    const start = new UtilDate(selectedDate)
        .set(startHours, 'hours')
        .set(startMinutes, 'minutes').date;
    const end = new UtilDate(selectedDate)
        .set(endHours, 'hours')
        .set(endMinutes, 'minutes').date;

    const space: ScheduleSpace = computedMode.value === ScheduleMode.schedule
        ? props.spaces[y]
        : (resolvedSelectedSpace.value as ScheduleSpace);
    return {
        entityId: space?.id,
        start,
        end,
        color: 'primary',
        name: ""
    };
}

const emptySlotClickHandler = (point: Point, nativeEvent: MouseEvent): void => {
    emit('click:empty-slot', { data: getEmptySlotData(point), nativeEvent });
}

const eventStyle = (point: Point): Record<string, string> => {
    const { start, end, color } = getEvent(point);
    const from = secondsByDate(new UtilDate(start).date);
    const to = secondsByDate(new UtilDate(end).date);
    const displacement = ((to - from) / props.step)
    const height = rowHeightNumber.value * (displacement == 0 ? 0 : displacement);
    const fillPercent = (from % props.step) / props.step;
    const top = rowHeightNumber.value * fillPercent - 1;
    const backgroundColor = (color || '').indexOf('#') == -1 ? '' : color;

    return { height: `${height}px`, top: `${top}px`, backgroundColor, marginTop: '0' };
}

const handleEventClick = (event: ScheduleEvent, nativeEvent: MouseEvent): void => {
    emit('click:event', { data: event, nativeEvent });
}


const hasEvent = ({ x, y }: Point): boolean => {
    return !!local.events?.[x]?.[y];
}

const eventClass = (event: ScheduleEvent): string => {
    const { color } = event;
    const extraClass = color.indexOf('#') == -1 ? color : '';
    return ['e-schedule__event-container', extraClass].join(' ').trim();
}


const handleHeaderLabelClick = (date: Date, entityId?: number | string): void => {
    local.forceUnanimated = true
    if (computedMode.value === ScheduleMode.week) {
        nextTick(() => {
            date && changeValue(date as Date)
            const mode = props.scheduleAfterWeek ? ScheduleMode.schedule : ScheduleMode.day
            changeMode(mode);
        })
    } else if (computedMode.value === ScheduleMode.schedule) {
        changeMode(ScheduleMode.week);
        const space = props.spaces.find(({ id }) => id == entityId);
        changeSelectedSpace(space)
    }
    emit('click:header-label', { entityId, date })
}

onMounted(() => {
    setLocalEvents();
})

const t = (): Lnguage => {
    return new Lnguage(props.lng, 1);
}

const normalizedRowHeight = computed(() => normalizeCssSize(props.rowHeight) || '97px')
const normalizedStickyTopHeader = computed(() => normalizeCssSize(props.stickyTopHeader) || '0px')
const rowHeightNumber = computed(() => {
    const parsed = Number.parseFloat(normalizedRowHeight.value)
    return Number.isNaN(parsed) ? 97 : parsed
})

const { colorStyles } = useResolvedColor({
    color: computed(() => props.color),
    colorVar: '--e-schedule-color',
})

const scheduleStyle = computed((): Record<string, string> => ({
    ...colorStyles.value,
    '--row-height': normalizedRowHeight.value,
    '--header-stiky-top': normalizedStickyTopHeader.value,
}))

const hourList = computed((): Array<string> => {
    const result: Array<string> = [];
    let incompleteList = true;
    let count = 0;
    while (incompleteList) {
        const timestamp = props.start + count++ * props.step;
        let hours: string | number = Math.floor(timestamp / 60 / 60);
        let minutes: string | number = Math.floor(timestamp / 60) - hours * 60;
        minutes = minutes || '00';
        hours = hours <= 9 ? `0${hours}` : hours;
        result.push(`${hours}:${minutes}`);
        incompleteList = timestamp < props.end;
    }
    return result;
})

const headerLabels = computed((): Array<Record<string, any>> => {
    const day = props.modelValue.getDay();
    let dayList: Array<string> = [];
    if (modeDay.value) {
        dayList = [t().currentLng.weekdaysShort[day]];
    } else if (computedMode.value === ScheduleMode.week) {
        dayList = t().sliceLangList(t().currentLng.weekdaysShort, day);
    } else if (computedMode.value === ScheduleMode.schedule) {
        return props.spaces.map(({ label, id }) => ({ label, entityId: id, date: new Date(props.modelValue) }));
    }

    return dayList.map((d, i) => {
        const date: Date = new Date(
            new Date(props.modelValue).setDate(props.modelValue.getDate() + i)
        );
        const today = date.toDateString() === new Date().toDateString()
        return { dayOfWeek: d, dayOfMonth: date.getDate(), today, date }
    });

})
const chunk = (array: Array<Record<string, any>>) => {
    if (computedMode.value === ScheduleMode.schedule && props.scheduleColumn) {
        const result = new Array(), length = array.length, size = parseInt(`${props.scheduleColumn}`, 10);
        for (let i = 0; i < length; i += size)
            result.push(array.slice(i, i + size));
        return result;
    } else {
        return [array]
    }
}

const headerChunks = computed(() => chunk(headerLabels.value))

const visibleHeaderLabels = computed(() => headerChunks.value[local.page] ?? headerChunks.value[0] ?? [])

const schedulePageKey = computed(() => {
    const dateKey = new UtilDate(props.modelValue).setTime(0, 0, 0).date.toISOString()
    const labelsKey = visibleHeaderLabels.value.map(colKey).join('|')
    return `${computedMode.value}:${dateKey}:${local.page}:${labelsKey}`
})

watch(headerChunks, (chunks) => {
    const lastPage = chunks.length - 1
    if (local.page > lastPage) {
        local.page = Math.max(lastPage, 0)
    }
}, { immediate: true })


</script>
<style lang="scss" src="./style.scss"></style>