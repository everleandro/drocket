
<template>
    <div class="e-schedule-container">
        <transition name="fade" mode="out-in">
            <div :key="mode" :class="scheduleClass" :style="componentStyle">
                <span>
                    <EProgressLinear v-show="loading" :indeterminate="loading" height="4" />
                </span>
                <div role="col" class="col-hour-info">
                    <div role="cell" class="e-schedule__header">
                        <span v-if="chunk(headerLabels).length > 1" :class="['action-container', `${color}--text`]">
                            <button v-ripple class="e-btn" type="button" @click="changeSubPage('-')">
                                <EIcon :icon="icon.arrowLeft" />
                            </button>
                            <button v-ripple class="e-btn" type="button" @click="changeSubPage('+')">
                                <EIcon :icon="icon.arrowRight" />
                            </button>
                        </span>
                        <span v-else></span>
                    </div>
                    <div role="cell" v-for="(hour, hourIndex) in hourList" :key="hourIndex" class="e-schedule__hour">
                        <span>
                            <span class="hour-label e-vue-input--text">{{ hour }}</span>
                        </span>
                    </div>
                </div>
                <transition-group :name="local.globalContentAnimation">
                    <div v-for="(subPageList, chunkIndex) in chunk(headerLabels)" :key="chunkIndex" class="e-schedule__body"
                        v-show="chunkIndex == local.page">
                        <transition-group :name="local.globalContentAnimation">
                            <div v-for="(data, colIndex) in subPageList" :key="colKey(data)" role="col">
                                <div role="cell" class="e-schedule__header">
                                    <span v-if="computedMode === scheduleMode.schedule">
                                        <EButton class="e-schedule-btn--space" :color="color" text depressed
                                            @click="handleHeaderLabelClick(data.date, data.entityId)">
                                            {{ data.label }}
                                        </EButton>
                                    </span>
                                    <span v-else>
                                        <span data-day-of-week="true"> {{ data.dayOfWeek }}</span>
                                        <EButton class="mt-1 e-schedule-btn--day" :color="color" :text="!data.today"
                                            depressed @click="handleHeaderLabelClick(data.date)">
                                            {{ data.dayOfMonth }}
                                        </EButton>
                                    </span>
                                </div>
                                <div role="cell" v-for="(hour, hourIndex) in hourList" :key="hourIndex"
                                    class="e-schedule__event">
                                    <div v-if="hasEvent({ x: hourIndex, y: colIndex + chunkIndex })"
                                        class="e-schedule__event"
                                        :style="eventStyle({ x: hourIndex, y: colIndex + chunkIndex })">
                                        <slot name="event" :event="getEvent({ x: hourIndex, y: colIndex + chunkIndex })">
                                            <div v-ripple
                                                :class="eventClass(getEvent({ x: hourIndex, y: colIndex + chunkIndex }))"
                                                @click="handleEventClick(getEvent({ x: hourIndex, y: colIndex + chunkIndex }), $event)">
                                                <span class="event-name">{{
                                                    getEvent({ x: hourIndex, y: colIndex + chunkIndex }).name
                                                }}</span>
                                                <span class="event-subtitle">{{
                                                    getEvent({ x: hourIndex, y: colIndex + chunkIndex }).subtitle
                                                }}</span>
                                                <span class="event-footer">{{
                                                    getEvent({ x: hourIndex, y: colIndex + chunkIndex }).footer
                                                }}</span>
                                            </div>
                                        </slot>
                                    </div>
                                    <slot v-else name="empty-slot" :data="getEmptySlotData({ x: hourIndex, y: colIndex })">
                                        <div v-ripple :class="[
                                            `${color}--text`,
                                            'v-ripple-element',
                                            'e-schedule__empty-slot',
                                            'e-btn',
                                            'e-btn--text'
                                        ]" @click="emptySlotClickHandler({ x: hourIndex, y: colIndex }, $event)"></div>
                                    </slot>
                                </div>
                            </div>
                        </transition-group>
                    </div>
                </transition-group>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import type { ScheduleEvent, Space, Point, SlotEvent } from "@/types";
import { scheduleMode } from "@/types";
import { Lng as Lnguage, suportedLng } from '@/locales/index';
import EProgressLinear from '@/components/progress/linear.vue';

import UtilDate from '@/utils/date';
import icon from '@/utils/icons';

import EButton from '@/components/button/index.vue'
import EIcon from '@/components/icon/index.vue'
import { computed, nextTick, onMounted, reactive, watch } from "vue";


export interface Props {
    lng?: suportedLng; color?: string; stickyTopHeader?: string | number; loading?: boolean; scheduleColumn?: string | number;
    rowHeight?: string; step?: number; start?: number; events?: ScheduleEvent[]; scheduleAfterWeek?: boolean;
    end?: number; spaces?: Space[]; selectedSpace?: Space; modelValue: Date; mode?: scheduleMode;
}
const props = withDefaults(defineProps<Props>(),
    {
        lng: 'es', color: 'primary', rowHeight: '97',
        step: 60 * 60, start: 0, events: () => [], stickyTopHeader: 0,
        end: 60 * 60 * 24, spaces: () => []
    })

const local = reactive({
    mode: scheduleMode.day,
    page: 0,
    forceUnanimated: false,
    selectedSpace: <Space | undefined>undefined,
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
    return computedMode.value === scheduleMode.schedule ? data.entityId : data.dayOfWeek + '-' + data.dayOfMonth
}

const modeDay = computed(() => computedMode.value === scheduleMode.day)

const emit = defineEmits<{
    (e: 'update:modelValue', value: Date): void,
    (e: 'update:mode', value: scheduleMode): void,
    (e: 'click:header-label', value: { date: Date, entityId?: number | string }): void,
    (e: 'click:empty-slot', value: { data: SlotEvent, nativeEvent: MouseEvent }): void,
    (e: 'click:event', value: { data: ScheduleEvent, nativeEvent: MouseEvent }): void,
    (e: 'update:selected-space', value: Space | undefined): void,
}>()

const changeValue = (value: Date): void => {
    emit('update:modelValue', value)
}

const changeSubPage = (sign: '+' | '-') => {
    const lastPage = chunk(headerLabels.value).length - 1
    local.globalContentAnimation = sign === '+' ? 'tab-transition' : 'tab-reverse-transition'
    let nextPage = local.page + parseInt(`${sign}1`)
    if (nextPage < 0) nextPage = lastPage
    if (nextPage > lastPage) nextPage = 0
    local.page = nextPage
}

const computedMode = computed((): scheduleMode => {
    return props.mode != undefined ? props.mode : local.mode;
})

const changeMode = (value: scheduleMode) => {
    local.mode = value;
    emit('update:mode', value);
}

const computedSelectedSpace = computed((): Space | undefined => {
    return props.selectedSpace != undefined ? props.selectedSpace : local.selectedSpace;
})

const changeSelectedSpace = (value: Space | undefined) => {
    local.selectedSpace = value;
    emit('update:selected-space', value);
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
watch(() => props.mode, (newValue: scheduleMode | undefined, oldValue: scheduleMode | undefined) => {
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


    if (modeDay.value || computedMode.value === scheduleMode.schedule) {
        events = events.filter(
            ({ start }: ScheduleEvent) => new UtilDate(start).date.getDay() == dateFrom.getDay()
        );
    } else if (computedMode.value === scheduleMode.week) {
        events = events.filter(
            ({ entityId }: ScheduleEvent) => entityId === computedSelectedSpace.value?.id
        );
    }

    events.forEach((event: ScheduleEvent) => {
        const day = props.modelValue.getDay();
        let y = -1;
        if (computedMode.value === scheduleMode.day || computedMode.value === scheduleMode.schedule) {
            y = props.spaces.findIndex(({ id }) => id == event.entityId);
        } else if (computedMode.value === scheduleMode.week) {
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

const getEvent = ({ x, y }: Point) => local.events[x][y]

const getEmptySlotData = ({ x, y }: Point): SlotEvent => {
    const timestamp = props.start + x * props.step;

    const startHours: number = Math.floor(timestamp / 60 / 60);
    const startMinutes: number = Math.floor(timestamp / 60) - startHours * 60;

    const endHours: number = Math.floor((timestamp + props.step) / 60 / 60);
    const endMinutes: number =
        Math.floor((timestamp + props.step) / 60) - endHours * 60;
    const selectedDate: Date = modeDay.value
        ? props.modelValue
        : new UtilDate(props.modelValue).add(y, 'days').date;

    const start = new UtilDate(selectedDate)
        .set(startHours, 'hours')
        .set(startMinutes, 'minutes').date;
    const end = new UtilDate(selectedDate)
        .set(endHours, 'hours')
        .set(endMinutes, 'minutes').date;

    const space: Space = modeDay.value
        ? props.spaces[y]
        : (computedSelectedSpace.value as Space);
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
    const height = parseInt(props.rowHeight) * (displacement == 0 ? 0 : displacement);
    const fillPercent = (from % props.step) / props.step;
    const top = parseInt(props.rowHeight) * fillPercent - 1;
    const backgroundColor = (color || '').indexOf('#') == -1 ? '' : color;

    return { height: `${height}px`, top: `${top}px`, backgroundColor, marginTop: '1px' };
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
    if (computedMode.value === scheduleMode.week) {
        nextTick(() => {
            date && changeValue(date as Date)
            const mode = props.scheduleAfterWeek ? scheduleMode.schedule : scheduleMode.day
            changeMode(mode);
        })
    } else if (computedMode.value === scheduleMode.schedule) {
        changeMode(scheduleMode.week);
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

const componentStyle = computed((): Record<string, string> => (
    { '--row-height': props.rowHeight + 'px', '--header-stiky-top': props.stickyTopHeader + 'px' }
))

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
    } else if (computedMode.value === scheduleMode.week) {
        dayList = t().sliceLangList(t().currentLng.weekdaysShort, day);
    } else if (computedMode.value === scheduleMode.schedule) {
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
    if (computedMode.value === scheduleMode.schedule && props.scheduleColumn) {
        const result = new Array(), length = array.length, size = parseInt(`${props.scheduleColumn}`, 10);
        for (let i = 0; i < length; i += size)
            result.push(array.slice(i, i + size));
        return result;
    } else {
        return [array]
    }
}


</script>
<style lang="scss" src="./style.scss"></style>