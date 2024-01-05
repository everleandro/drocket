<template >
  <div :class="pickerClass">
    <div v-if="!noTitle && !(onlyYear || onlyMonth)" :class="[color, 'e-picker__title']">
      <div class="e-date-picker-title">
        <slot name="title">
          <div class="e-picker__title__btn e-date-picker-title__year" @click="changeViewMode(store.viewTypeOptions.year)">
            {{ currentYear }}
          </div>
          <div class="e-picker__title__btn e-date-picker-title__date e-picker__title__btn--active">
            <transition :name="store.pickerTransition">
              <div v-html="formattedHeaderDate" :key="formattedHeaderKey"></div>
            </transition>
          </div>
        </slot>
      </div>
    </div>
    <div class="e-picker__body">
      <div>
        <div class="e-date-picker-header">
          <slot name="header" :prev="prevButtonAction" :next="nextButtonAction" :change-view-mode="changeViewMode"
            :page-date="store.pageDate">
            <EButton :icon="iconPrev || icon.arrowLeft" text aria-label="Previous month" x-small
              @click="prevButtonAction()" />

            <div class="e-date-picker-header__value">
              <transition :name="store.globalContentAnimation">
                <div :class="textColor" :key="headerValueKey">
                  <button type="button" @click="changeViewMode()">
                    {{ formattedSubheader() }}
                  </button>
                </div>
              </transition>
            </div>

            <EButton :icon="iconNext || icon.arrowRight" text aria-label="Previous month" x-small
              @click="nextButtonAction()" />
          </slot>
        </div>

        <transition-group :name="store.globalContentAnimation" tag="div" :class="gridContainerClass">
          <div v-show="viewComputed === store.viewTypeOptions.day" :key="keyMonth" class="date-view">
            <div class="grid-header">
              <span v-for="weekDay in daysOfWeek" :key="weekDay" role="week-day" class="grid-header__cell">{{
                weekDay
              }}</span>
            </div>
            <div class="grid-body">
              <span v-for="day in [
                ...visiblePrevMonthDays,
                ...days,
                ...visibleNextMonthDays
              ]" :key="day.timestamp" role="month-day" class="grid-body__cell__cell">
                <button v-ripple="{ center: true }" type="button" :class="dayClasses(day)" @click="selectDate(day)">
                  <span class="e-btn__content">{{ day.date }}</span>
                </button>
              </span>
            </div>
          </div>

          <div v-show="viewComputed === store.viewTypeOptions.month" :key="keyYear" class="month-view">
            <div class="grid-body">
              <span v-for="month in months" :key="month.timestamp" role="month-day" class="grid-body__cell__cell">
                <button v-ripple :class="monthClasses(month)" standard="true" @click="selectMonth(month)">
                  <span class="e-btn__content"> {{ month.month }} </span>
                </button>
              </span>
            </div>
          </div>
          <div v-show="viewComputed === store.viewTypeOptions.year" :key="keyYearPage" class="year-view">
            <div class="grid-body">
              <span v-for="year in years" :key="year.timestamp" role="month-day" class="grid-body__cell__cell">
                <button v-ripple :class="yearClasses(year)" standard="true" @click="selectYear(year)">
                  <span class="e-btn__content"> {{ year.year }} </span>
                </button>
              </span>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>

import { Lng as Lnguage } from '@/locales/index';
import { DatesConfiguration, datePickerViewType, Day, Month, Year, DatePickerProps } from "@/types"
import { ContainerMenuInterface } from '../menu/types';

import { EDIalog } from '@/components/dialog/index.vue';
import EButton from '@/components/button/index.vue'

import UtilDate from '@/utils/date';
import icon from '@/utils/icons';

import { computed, inject, onMounted, reactive, watch } from 'vue';



const textColor = computed(() => {
  return `${props.color}--text`
})

const dialog = inject<EDIalog | undefined>("EDialog", undefined);
const menuContainer = inject<ContainerMenuInterface | undefined>("EMenuContainer", undefined);

const props = withDefaults(defineProps<DatePickerProps>(), {
  color: 'primary',
  lng: 'en',
  disabled: undefined,
  highlighted: undefined,
  view: undefined,
  weekStart: 1
})

const availableRootClasses = {
  landscape: 'e-picker--landscape'
};

const store = reactive({
  pageDate: new Date(),
  localView: datePickerViewType.day,
  selectedDate: new UtilDate(new Date(), props.lng),
  globalContentAnimation: 'tab-transition',
  viewTypeOptions: datePickerViewType,
  pickerTransition: 'picker-transition',
  valueTimestamp: new Date().getTime()
})

const keyMonth = computed(() => {
  return new Date(store.pageDate).getMonth() + '' + store.pageDate.getMonth()
})

const keyYear = computed(() => {
  return store.localView === datePickerViewType.month ? new Date(store.pageDate).getFullYear() + '' + store.pageDate.getFullYear() + '' : 367893
})

const keyYearPage = computed(() => {
  return Math.floor(new Date(store.pageDate).getFullYear() / 12) * 12
})

const emit = defineEmits<{
  (e: 'update:view', value: datePickerViewType): void
  (e: 'update:modelValue', value: Date | string): void
  (e: 'click:day', value: Day): void
}>()

const viewComputed = computed((): datePickerViewType => {
  if (props.onlyYear) {
    return datePickerViewType.year
  } else if (props.onlyMonth) {
    return store.localView === datePickerViewType.day ? datePickerViewType.month : store.localView
  }
  return props.view !== undefined ? props.view : store.localView;
})
const changeView = (value: datePickerViewType) => {
  store.localView = value;
  emit('update:view', value);
}
const changeValue = (value: UtilDate) => {
  updatePageConfiguration(value);
  if (props.closeOnChange) {
    // setTimeout(() => {
    dialog?.close(true)
    menuContainer?.closeMenu()
    // }, 400)
  }
  emit('update:modelValue', value.date);
}

const computedValue = computed(() => {
  return new UtilDate(props.modelValue);
})
const updatePageConfiguration = (utilDate: UtilDate): void => {
  store.selectedDate = utilDate;
  store.pageDate = utilDate.date;
  store.valueTimestamp = utilDate.date.getTime();
}

const visiblePrevMonthDays = computed((): Array<Day> => {
  const utilDate = new UtilDate(store.pageDate).startOfMonth();
  const length = amountVisibleDaysOfPrevMonth.value;
  const result: Day[] = new Array(length);

  for (let i = 1; i <= length; i++) {
    result[length - i] = dayObject(
      utilDate.subtract(1, 'days').date,
      true
    );
  }
  return result;
})

watch(() => props.modelValue, (value: string | number | Date | undefined) => {
  updatePageConfiguration(new UtilDate(value));
})

watch(() => props.view, (value: datePickerViewType | undefined) => {
  if (value)
    changeView(value)
})

const amountVisibleDaysOfPrevMonth = computed((): number => {
  const utilDate = new UtilDate(store.pageDate).startOfMonth();
  const day_number = utilDate.date.getDay();
  const rest = day_number - props.weekStart;
  return rest >= 0 ? rest : 7 + rest;
}
)
const dayObject = (date: Date, forceDisabled: boolean | undefined = undefined): Day => {
  return {
    date: date.getDate(),
    timestamp: date.getTime(),
    isSelected: isSelectedDate(date),
    isDisabled:
      forceDisabled != undefined ? forceDisabled : isDisabledDate(date),
    isHighlighted: isHighlightedDate(date),
    isHighlightStart: isHighlightStart(date),
    isHighlightEnd: isHighlightEnd(date),
    isToday: date.toDateString() === new Date().toDateString(),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
    isSaturday: date.getDay() === 6,
    isSunday: date.getDay() === 0
  };
}
const isSelectedDate = (date: Date): boolean => {
  if (!store.selectedDate) {
    return false;
  }
  return store.selectedDate.date.toDateString() === date.toDateString();
}
const isDisabledDate = (date: Date): boolean => {
  return getDateConfiguration(date, props.disabled);
}

const getDateConfiguration = (
  date: Date,
  configObject: DatesConfiguration | undefined
): boolean => {
  let result = false;
  if (typeof configObject === 'undefined') {
    return false;
  }
  if (typeof configObject.dates !== 'undefined') {
    configObject.dates.forEach((d) => {
      if (date.toDateString() === d.toDateString()) {
        result = true;
        return true;
      }
    });
  }
  if (
    typeof configObject.to !== 'undefined' && configObject.from && configObject.to &&
    ((date > configObject.from &&
      date < configObject.to) ||
      (new UtilDate(date).format('year-YYYY-month-MM-month-DD') === new UtilDate(configObject.from).format('year-YYYY-month-MM-month-DD') ||
        new UtilDate(date).format('year-YYYY-month-MM-month-DD') === new UtilDate(configObject.to).format('year-YYYY-month-MM-month-DD')))
  ) {
    result = true;
  }
  // if (
  //   typeof configObject.from !== 'undefined' &&
  //   configObject.from &&
  //   date > configObject.from
  // ) {
  //   result = true;
  // }
  if (typeof configObject.ranges !== 'undefined') {
    configObject.ranges.forEach((range) => {
      if (
        typeof range.from !== 'undefined' &&
        range.from &&
        typeof range.to !== 'undefined' &&
        range.to
      ) {
        if (date < range.to && date > range.from) {
          result = true;
          return true;
        }
      }
    });
  }
  if (
    typeof configObject.days !== 'undefined' &&
    configObject.days.indexOf(date.getDay()) !== -1
  ) {
    result = true;
  }
  if (
    typeof configObject.daysOfMonth !== 'undefined' &&
    configObject.daysOfMonth.indexOf(date.getDate()) !== -1
  ) {
    result = true;
  }
  if (
    typeof configObject.customPredictor === 'function' &&
    configObject.customPredictor(date)
  ) {
    result = true;
  }
  return result;
}

const isHighlightedDate = (date: Date): boolean => {
  if (isDisabledDate(date)) {
    return false;
  }

  return getDateConfiguration(date, props.highlighted);
}

const isHighlightStart = (date: Date): boolean => {
  return (
    isHighlightedDate(date) &&
    props.highlighted?.from instanceof Date &&
    props.highlighted?.from.getFullYear() === date.getFullYear() &&
    props.highlighted?.from.getMonth() === date.getMonth() &&
    props.highlighted?.from.getDate() === date.getDate()
  );
}

const isHighlightEnd = (date: Date): boolean => {
  return (
    isHighlightedDate(date) &&
    props.highlighted?.to instanceof Date &&
    props.highlighted?.to.getFullYear() === date.getFullYear() &&
    props.highlighted?.to.getMonth() === date.getMonth() &&
    props.highlighted?.to.getDate() === date.getDate()
  );
}

onMounted(() => {
  store.pageDate = props.modelValue ? new Date(props.modelValue) : new Date();
  store.selectedDate = new UtilDate(props.modelValue);
})

const modelValueTimestamp = computed((): number => {
  return props.modelValue ? new Date(props.modelValue).getTime() : 0;
})

const visibleNextMonthDays = computed((): Array<Day> => {
  const utilDate = new UtilDate(store.pageDate).endOfMonth();
  const daysInMonth = utilDate.daysInMonth;

  const amountDaysInLastRow =
    (daysInMonth + amountVisibleDaysOfPrevMonth.value) % 7;
  const length = amountDaysInLastRow > 0 ? 7 - amountDaysInLastRow : 0;
  const result: Array<Day> = [];

  for (let i = 1; i <= length; i++) {
    result.push(dayObject(utilDate.add(1, 'days').date, true));
  }
  return result;
})

const pickerClass = computed(() => {
  return {
    'e-picker e-picker--date': true,
    'e-picker--landscape': props.landscape,
  };

})

const gridContainerClass = computed((): Record<string, boolean> => {
  return {
    'e-date-picker-grid': true,
    'e-date-picker-grid--date': viewComputed.value === store.viewTypeOptions.day,
    'e-date-picker-grid--month': viewComputed.value === store.viewTypeOptions.month
  };
})

const days = computed((): Array<Day> => {
  let days: Array<Day> = [];
  const utilDateObject = new UtilDate(store.pageDate).set(1, 'days');
  const daysInMonth = utilDateObject.daysInMonth;

  for (let i = 0; i < daysInMonth; i++) {
    days.push(dayObject(utilDateObject.date));
    utilDateObject.add(1, 'days');
  }
  return days;
})

const months = computed((): Array<Month> => {
  let months: Array<Month> = [];
  let utilDate = new UtilDate(store.pageDate, props.lng).startOfYear();
  for (let i = 0; i < 12; i++) {
    months.push({
      month: utilDate.monthshortName,
      timestamp: utilDate.date.getTime(),
      isSelected: isSelectedMonth(utilDate.date),
      isDisabled: isDisabledMonth(utilDate.date)
    });
    utilDate.add(1, 'months');
  }
  return months;
})

const years = computed((): Array<Year> => {
  let years: Array<Year> = [];
  const yearStart = Math.floor(store.pageDate.getFullYear() / 12) * 12
  let utilDate = new UtilDate().set(yearStart, 'years').startOfYear();
  for (let i = 0; i < 12; i++) {
    years.push({
      year: utilDate.date.getFullYear(),
      timestamp: utilDate.date.getTime(),
      isSelected: isSelectedYear(utilDate.date),
      isDisabled: isDisabledMonth(utilDate.date)
    });
    utilDate.add(1, 'years');
  }
  return years;
})
const isSelectedMonth = (date: Date): boolean => {
  return (
    !!store.selectedDate &&
    store.selectedDate.date.getFullYear() === date.getFullYear() &&
    store.selectedDate.date.getMonth() === date.getMonth()
  );
}
const isSelectedYear = (date: Date): boolean => {
  return (
    !!store.selectedDate &&
    store.selectedDate.date.getFullYear() === date.getFullYear()
  );
}

const isDisabledMonth = (date: Date): boolean => {
  let disabled = false;
  if (typeof props.disabled === 'undefined') {
    return false;
  }
  if (typeof props.disabled?.to !== 'undefined' && props.disabled?.to) {
    if (
      (date.getMonth() < props.disabled?.to.getMonth() &&
        date.getFullYear() <= props.disabled?.to.getFullYear()) ||
      date.getFullYear() < props.disabled?.to.getFullYear()
    ) {
      disabled = true;
    }
  }
  if (typeof props.disabled?.from !== 'undefined' && props.disabled?.from) {
    if (
      (props.disabled?.from &&
        date.getMonth() > props.disabled?.from.getMonth() &&
        date.getFullYear() >= props.disabled?.from.getFullYear()) ||
      date.getFullYear() > props.disabled?.from.getFullYear()
    ) {
      disabled = true;
    }
  }
  return disabled;
}

const changeViewMode = (viewMode?: datePickerViewType): void => {
  if (!props.onlyYear) {
    store.globalContentAnimation = 'picker-fade-transition';
    if (viewMode) {
      changeView(viewMode)
    } else {
      let result = store.viewTypeOptions.month;
      if (viewComputed.value === store.viewTypeOptions.day) {
        result = store.viewTypeOptions.month
      } else if (viewComputed.value === store.viewTypeOptions.month) {
        result = store.viewTypeOptions.year
      }
      changeView(result)
    }
  }
}

const t = (): Lnguage => {
  return new Lnguage(props.lng, props.weekStart);
}

const daysOfWeek = computed((): Array<string> => {
  return t().weekdaysMin;
})

const currentYear = computed(() => {
  return store.pageDate.getFullYear();
})

const formattedHeaderDate = computed((): string => {
  if (!store.selectedDate) {
    return '&nbsp;';
  }
  return store.selectedDate.setLng(props.lng).format('week-ddd, month-mmm month-D');
})

const formattedHeaderKey = computed((): number => {
  return store.selectedDate?.date.getTime() || 1;
})

const formattedSubheader = (): string => {
  const utilDate = new UtilDate(store.pageDate, props.lng);
  switch (viewComputed.value) {
    case store.viewTypeOptions.day:
      return utilDate.format('month-mmmm year-YYYY');
    case store.viewTypeOptions.month:
      return utilDate.format('year-YYYY');
    case store.viewTypeOptions.year:
      const year = Math.floor(new Date(store.pageDate).getFullYear() / 12) * 12
      return `${year} - ${year + 12}`;
  }
  return ``;
}


const dayClasses = (day: Day): Record<string, boolean> => {
  return {
    [`btn-day e-btn v-ripple-element ${props.color}--text`]: true,
    'btn-day--disabled': day.isDisabled,
    'btn-day--highlighted': day.isHighlighted,
    'btn-day--today': day.isToday,
    'btn-day--selected': day.isSelected,
    'btn-day--weekend': day.isWeekend,
    'btn-day--sat': day.isSaturday,
    'btn-day--sun': day.isSunday,
    'btn-day--highlight-start': day.isHighlightStart,
    'btn-day--highlight-end': day.isHighlightEnd
  };
}

const monthClasses = (month: Month): Record<string, boolean> => {
  return {
    'e-btn v-ripple-element e-btn--size-default e-btn--block': true,
    'e-btn--text': !month.isSelected || month.isDisabled,
    'e-btn--disabled': month.isDisabled,
    [`e-btn--${props.color} e-btn--depressed`]: month.isSelected
  };
}

const yearClasses = (year: Year): Record<string, boolean> => {
  return {
    'e-btn v-ripple-element e-btn--size-default e-btn--block': true,
    'e-btn--text': !year.isSelected || year.isDisabled,
    // 'e-btn--disabled': year.isDisabled,
    [`e-btn--${props.color} e-btn--depressed`]: year.isSelected
  };
}

const nextMonth = () => {
  if (!nextMonthDisabled.value) {
    store.globalContentAnimation = 'tab-transition';
    changeMonth(+1);
  }
}
const previousMonth = () => {
  if (!previousMonthDisabled.value) {
    store.globalContentAnimation = 'tab-reverse-transition';
    changeMonth(-1);
  }
}

const nextMonthDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.from) {
    return false;
  }
  return (
    props.disabled?.from.getMonth() <= store.pageDate.getMonth() &&
    props.disabled?.from.getFullYear() <= store.pageDate.getFullYear()
  );
})

const previousMonthDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.to) {
    return false;
  }
  return (
    props.disabled.to.getMonth() >= store.pageDate.getMonth() &&
    props.disabled.to.getFullYear() >= store.pageDate.getFullYear()
  );
})

const changeMonth = (incrementBy = +1): void => {
  const utilDate = new UtilDate(store.pageDate);
  store.pageDate =
    incrementBy > 0
      ? utilDate.add(incrementBy, 'months').date
      : utilDate.subtract(incrementBy, 'months').date;
}


const changeYear = (incrementBy = +1): void => {
  const utilDate = new UtilDate(store.pageDate);
  store.pageDate =
    incrementBy > 0
      ? utilDate.add(incrementBy, 'years').date
      : utilDate.subtract(incrementBy, 'years').date;
}

const nextButtonAction = (): void => {
  if (viewComputed.value === store.viewTypeOptions.day) {
    nextMonth();
  } else if (viewComputed.value === store.viewTypeOptions.month) {
    nextYear();
  } else {
    nextYearPage();
  }
}
const nextYear = (): void => {
  if (!nextYearDisabled.value) {
    store.globalContentAnimation = 'tab-transition';
    changeYear(1);
  }
}
const nextYearPage = (): void => {
  if (!nextYearPageDisabled.value) {
    store.globalContentAnimation = 'tab-transition';
    changeYear(12);
  }
}
const nextYearDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.from) {
    return false;
  }
  return props.disabled?.from.getFullYear() <= store.pageDate.getFullYear();
})
const nextYearPageDisabled = computed((): boolean => {
  return false
})
const previousYearPageDisabled = computed((): boolean => {
  return false
})

const previousYearDisabled = computed(() => {
  if (!props.disabled || !props.disabled?.to) {
    return false;
  }
  return props.disabled?.to.getFullYear() >= store.pageDate.getFullYear();
})

const previousYear = (): void => {
  if (!previousYearDisabled.value) {
    store.globalContentAnimation = 'tab-reverse-transition';
    changeYear(-1);
  }
}

const previousYearPage = (): void => {
  if (!previousYearPageDisabled.value) {
    store.globalContentAnimation = 'tab-reverse-transition';
    changeYear(-12);
  }
}
const headerValueKey = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.year) {
    return keyYearPage.value
  }
  return viewComputed.value == store.viewTypeOptions.day
    ? store.pageDate.getMonth()
    : store.pageDate.getFullYear();
})

const prevButtonAction = (): void => {
  if (viewComputed.value == store.viewTypeOptions.day) {
    previousMonth();
  } else if (viewComputed.value === store.viewTypeOptions.month) {
    previousYear();
  } else {
    previousYearPage()
  }
}

const selectDate = (day: Day): void => {
  if (day.isDisabled) {
    emit('click:day', day);
  }
  const currentDate = computedValue.value.date;
  const nextDate = new UtilDate(day.timestamp).date;
  store.pickerTransition =
    currentDate > nextDate
      ? 'picker-transition-reverse'
      : 'picker-transition';
  changeValue(new UtilDate(day.timestamp))
}

const selectMonth = (month: Month): void => {
  if (!month.isDisabled) {
    if (props.onlyMonth) {
      changeValue(new UtilDate(month.timestamp))
    } else {
      store.globalContentAnimation = 'picker-fade-transition';
      store.pageDate = new Date(month.timestamp);
      changeView(store.viewTypeOptions.day);
    }
  }
}

const selectYear = (year: Year): void => {
  if (!year.isDisabled) {
    if (props.onlyYear) {
      changeValue(new UtilDate(year.timestamp))
    }
    else {
      store.globalContentAnimation = 'picker-fade-transition';
      store.pageDate = new Date(year.timestamp);
      changeView(store.viewTypeOptions.month);
    }
  }
}
</script>
<style lang="scss" src="./style.scss"></style>