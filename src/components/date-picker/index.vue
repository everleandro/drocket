<template>
  <div :class="pickerClass">
    <div
      v-if="!noTitle && !(onlyYear || onlyMonth)"
      :class="[color, 'e-picker__title']"
    >
      <div class="e-date-picker-title">
        <slot name="title">
          <div
            class="e-picker__title__btn e-date-picker-title__year"
            @click="changeViewMode(store.viewTypeOptions.year)"
          >
            {{ currentYear }}
          </div>
          <div
            class="e-picker__title__btn e-date-picker-title__date e-picker__title__btn--active"
          >
            <transition :name="store.pickerTransition">
              <div v-html="formattedHeaderDate" :key="formattedHeaderKey"></div>
            </transition>
          </div>
        </slot>
      </div>
    </div>
    <div class="e-picker__body">
      <div aria-live="polite" aria-atomic="true" class="e-picker__live-region">
        {{ liveAnnouncement }}
      </div>
      <div>
        <div class="e-date-picker-header">
          <slot
            name="header"
            :prev="prevButtonAction"
            :next="nextButtonAction"
            :change-view-mode="changeViewMode"
            :page-date="store.pageDate"
          >
            <EButton
              :icon="iconPrev || icon.arrowLeft"
              text
              :aria-label="prevButtonLabel"
              size="x-small"
              :disabled="prevDisabled"
              :aria-disabled="prevDisabled"
              @click="prevButtonAction()"
            />

            <div class="e-date-picker-header__value">
              <transition :name="store.globalContentAnimation">
                <div :class="textColor" :key="headerValueKey">
                  <button
                    type="button"
                    :aria-label="headerButtonLabel"
                    @click="changeViewMode()"
                  >
                    {{ formattedSubheader() }}
                  </button>
                </div>
              </transition>
            </div>

            <EButton
              :icon="iconNext || icon.arrowRight"
              text
              :aria-label="nextButtonLabel"
              size="x-small"
              :disabled="nextDisabled"
              :aria-disabled="nextDisabled"
              @click="nextButtonAction()"
            />
          </slot>
        </div>

        <transition-group
          :name="store.globalContentAnimation"
          tag="div"
          :class="gridContainerClass"
        >
          <div
            v-show="viewComputed === store.viewTypeOptions.day"
            :key="keyMonth"
            class="date-view"
            role="grid"
            :aria-label="formattedSubheader()"
            @keydown="handleDayGridKeydown"
          >
            <div class="grid-header" role="row">
              <span
                v-for="weekDay in daysOfWeek"
                :key="weekDay"
                role="columnheader"
                :aria-label="weekDay"
                class="grid-header__cell"
                >{{ weekDay }}</span
              >
            </div>
            <div class="grid-body">
              <span
                v-for="day in [
                  ...visiblePrevMonthDays,
                  ...days,
                  ...visibleNextMonthDays,
                ]"
                :key="day.timestamp"
                role="gridcell"
                :aria-selected="day.isSelected"
                :aria-current="day.isToday ? 'date' : undefined"
                class="grid-body__cell__cell"
              >
                <DatePickerGridButton
                  v-bind="dayGridButtonProps(day)"
                  :button-class="dayClasses(day)"
                  @click="selectDate(day)"
                >
                  {{ day.date }}
                </DatePickerGridButton>
              </span>
            </div>
          </div>

          <div
            v-show="viewComputed === store.viewTypeOptions.month"
            :key="keyYear"
            class="month-view"
            role="grid"
            :aria-label="formattedSubheader()"
            @keydown="handleMonthGridKeydown"
          >
            <div class="grid-body">
              <span
                v-for="month in months"
                :key="month.timestamp"
                role="gridcell"
                :aria-selected="month.isSelected"
                :aria-current="month.isCurrent ? 'date' : undefined"
                class="grid-body__cell__cell"
              >
                <DatePickerGridButton
                  v-bind="
                    selectableGridButtonProps(
                      month.isSelected,
                      month.isDisabled,
                      month.isCurrent,
                    )
                  "
                  :button-class="monthClasses(month)"
                  @click="selectMonth(month)"
                >
                  {{ month.month }}
                </DatePickerGridButton>
              </span>
            </div>
          </div>
          <div
            v-show="viewComputed === store.viewTypeOptions.year"
            :key="keyYearPage"
            class="year-view"
            role="grid"
            :aria-label="formattedSubheader()"
            @keydown="handleYearGridKeydown"
          >
            <div class="grid-body">
              <span
                v-for="year in years"
                :key="year.timestamp"
                role="gridcell"
                :aria-selected="year.isSelected"
                :aria-current="year.isCurrent ? 'date' : undefined"
                class="grid-body__cell__cell"
              >
                <DatePickerGridButton
                  v-bind="
                    selectableGridButtonProps(
                      year.isSelected,
                      year.isDisabled,
                      year.isCurrent,
                    )
                  "
                  :button-class="yearClasses(year)"
                  @click="selectYear(year)"
                >
                  {{ year.year }}
                </DatePickerGridButton>
              </span>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Lng as Lnguage } from "@/locales/index";
import {
  DatesConfiguration,
  datePickerViewType,
  Day,
  Month,
  Year,
  DatePickerProps,
  DialogInterface,
  ContainerMenuInterface,
} from "@/types";
import EButton from "@/components/button/index.vue";
import DatePickerGridButton from "./grid-button.vue";

import UtilDate from "@/utils/date";
import icon from "@/utils/icons";

import {
  computed,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";

const liveAnnouncement = ref("");

const textColor = computed(() => {
  return `${props.color}--text`;
});

// Computed disables for navigation buttons
const nextDisabled = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.day)
    return nextMonthDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.month)
    return nextYearDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.year)
    return nextYearPageDisabled.value;
  return false;
});

const prevDisabled = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.day)
    return previousMonthDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.month)
    return previousYearDisabled.value;
  if (viewComputed.value === store.viewTypeOptions.year)
    return previousYearPageDisabled.value;
  return false;
});

const dialog = inject<DialogInterface | undefined>("EDialog", undefined);
const menuContainer = inject<ContainerMenuInterface | undefined>(
  "EMenuContainer",
  undefined,
);

const props = withDefaults(defineProps<DatePickerProps>(), {
  color: "primary",
  lng: "en",
  disabled: undefined,
  highlighted: undefined,
  view: undefined,
  weekStart: 1,
});

const store = reactive({
  pageDate: new Date(),
  localView: datePickerViewType.day,
  selectedDate: new UtilDate(new Date(), props.lng),
  globalContentAnimation: "tab-transition",
  viewTypeOptions: datePickerViewType,
  pickerTransition: "picker-transition",
  valueTimestamp: new Date().getTime(),
});

const keyMonth = computed(() => {
  return store.pageDate.getFullYear() + "-" + store.pageDate.getMonth();
});

const keyYear = computed(() => {
  return store.pageDate.getFullYear();
});

const keyYearPage = computed(() => {
  return Math.floor(new Date(store.pageDate).getFullYear() / 12) * 12;
});

const emit = defineEmits<{
  (e: "update:view", value: datePickerViewType): void;
  (e: "update:modelValue", value: Date | string): void;
  (e: "click:day", value: Day): void;
}>();

const viewComputed = computed((): datePickerViewType => {
  if (props.onlyYear) {
    return datePickerViewType.year;
  } else if (props.onlyMonth) {
    return store.localView === datePickerViewType.day
      ? datePickerViewType.month
      : store.localView;
  }
  return props.view !== undefined ? props.view : store.localView;
});
const changeView = (value: datePickerViewType) => {
  store.localView = value;
  emit("update:view", value);
};
const changeValue = (value: UtilDate) => {
  updatePageConfiguration(value);
  if (props.closeOnChange) {
    // setTimeout(() => {
    dialog?.close(true);
    menuContainer?.closeMenu();
    // }, 400)
  }
  emit("update:modelValue", value.date);
};

const computedValue = computed(() => {
  return new UtilDate(props.modelValue);
});
const updatePageConfiguration = (utilDate: UtilDate): void => {
  store.selectedDate = utilDate;
  store.pageDate = utilDate.date;
  store.valueTimestamp = utilDate.date.getTime();
};

const visiblePrevMonthDays = computed((): Array<Day> => {
  const utilDate = new UtilDate(store.pageDate).startOfMonth();
  const length = amountVisibleDaysOfPrevMonth.value;
  const result: Day[] = new Array(length);

  for (let i = 1; i <= length; i++) {
    result[length - i] = {
      ...dayObject(utilDate.subtract(1, "days").date, true),
      isAdjacentMonth: true,
    };
  }
  return result;
});

watch(
  () => props.modelValue,
  (value: string | number | Date | undefined) => {
    updatePageConfiguration(new UtilDate(value));
  },
);

watch(
  () => props.view,
  (value: datePickerViewType | undefined) => {
    if (value) changeView(value);
  },
);

const amountVisibleDaysOfPrevMonth = computed((): number => {
  const utilDate = new UtilDate(store.pageDate).startOfMonth();
  const day_number = utilDate.date.getDay();
  const rest = day_number - props.weekStart;
  return rest >= 0 ? rest : 7 + rest;
});
const dayObject = (
  date: Date,
  forceDisabled: boolean | undefined = undefined,
): Day => {
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
    isSunday: date.getDay() === 0,
  };
};
const isSelectedDate = (date: Date): boolean => {
  if (!store.selectedDate) {
    return false;
  }
  return store.selectedDate.date.toDateString() === date.toDateString();
};
const isDisabledDate = (date: Date): boolean => {
  return getDateConfiguration(date, props.disabled);
};

const getDateConfiguration = (
  date: Date,
  configObject: DatesConfiguration | undefined,
): boolean => {
  let result = false;
  if (typeof configObject === "undefined") {
    return false;
  }
  if (typeof configObject.dates !== "undefined") {
    configObject.dates.forEach((d) => {
      if (date.toDateString() === d.toDateString()) {
        result = true;
        return true;
      }
    });
  }
  if (
    typeof configObject.to !== "undefined" &&
    configObject.from &&
    configObject.to &&
    ((date > configObject.from && date < configObject.to) ||
      new UtilDate(date).format("year-YYYY-month-MM-month-DD") ===
        new UtilDate(configObject.from).format("year-YYYY-month-MM-month-DD") ||
      new UtilDate(date).format("year-YYYY-month-MM-month-DD") ===
        new UtilDate(configObject.to).format("year-YYYY-month-MM-month-DD"))
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
  if (typeof configObject.ranges !== "undefined") {
    configObject.ranges.forEach((range) => {
      if (
        typeof range.from !== "undefined" &&
        range.from &&
        typeof range.to !== "undefined" &&
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
    typeof configObject.days !== "undefined" &&
    configObject.days.indexOf(date.getDay()) !== -1
  ) {
    result = true;
  }
  if (
    typeof configObject.daysOfMonth !== "undefined" &&
    configObject.daysOfMonth.indexOf(date.getDate()) !== -1
  ) {
    result = true;
  }
  if (
    typeof configObject.customPredictor === "function" &&
    configObject.customPredictor(date)
  ) {
    result = true;
  }
  return result;
};

const isHighlightedDate = (date: Date): boolean => {
  if (isDisabledDate(date)) {
    return false;
  }

  return getDateConfiguration(date, props.highlighted);
};

const isHighlightStart = (date: Date): boolean => {
  return (
    isHighlightedDate(date) &&
    props.highlighted?.from instanceof Date &&
    props.highlighted?.from.getFullYear() === date.getFullYear() &&
    props.highlighted?.from.getMonth() === date.getMonth() &&
    props.highlighted?.from.getDate() === date.getDate()
  );
};

const isHighlightEnd = (date: Date): boolean => {
  return (
    isHighlightedDate(date) &&
    props.highlighted?.to instanceof Date &&
    props.highlighted?.to.getFullYear() === date.getFullYear() &&
    props.highlighted?.to.getMonth() === date.getMonth() &&
    props.highlighted?.to.getDate() === date.getDate()
  );
};

onMounted(() => {
  store.pageDate = props.modelValue ? new Date(props.modelValue) : new Date();
  store.selectedDate = new UtilDate(props.modelValue);
});

const visibleNextMonthDays = computed((): Array<Day> => {
  const utilDate = new UtilDate(store.pageDate).endOfMonth();
  const daysInMonth = utilDate.daysInMonth;

  const amountDaysInLastRow =
    (daysInMonth + amountVisibleDaysOfPrevMonth.value) % 7;
  const length = amountDaysInLastRow > 0 ? 7 - amountDaysInLastRow : 0;
  const result: Array<Day> = [];

  for (let i = 1; i <= length; i++) {
    result.push({
      ...dayObject(utilDate.add(1, "days").date, true),
      isAdjacentMonth: true,
    });
  }
  return result;
});

const pickerClass = computed(() => {
  return {
    "e-picker e-picker--date": true,
    "e-picker--landscape": props.landscape,
  };
});

const gridContainerClass = computed((): Record<string, boolean> => {
  return {
    "e-date-picker-grid": true,
    "e-date-picker-grid--date":
      viewComputed.value === store.viewTypeOptions.day,
    "e-date-picker-grid--month":
      viewComputed.value === store.viewTypeOptions.month,
  };
});

const days = computed((): Array<Day> => {
  let days: Array<Day> = [];
  const utilDateObject = new UtilDate(store.pageDate).set(1, "days");
  const daysInMonth = utilDateObject.daysInMonth;

  for (let i = 0; i < daysInMonth; i++) {
    days.push(dayObject(utilDateObject.date));
    utilDateObject.add(1, "days");
  }
  return days;
});

const months = computed((): Array<Month> => {
  let months: Array<Month> = [];
  let utilDate = new UtilDate(store.pageDate, props.lng).startOfYear();
  for (let i = 0; i < 12; i++) {
    months.push({
      month: utilDate.monthshortName,
      timestamp: utilDate.date.getTime(),
      isSelected: isSelectedMonth(utilDate.date),
      isCurrent: isCurrentMonth(utilDate.date),
      isDisabled: isDisabledMonth(utilDate.date),
    });
    utilDate.add(1, "months");
  }
  return months;
});

const years = computed((): Array<Year> => {
  let years: Array<Year> = [];
  const yearStart = Math.floor(store.pageDate.getFullYear() / 12) * 12;
  let utilDate = new UtilDate().set(yearStart, "years").startOfYear();
  for (let i = 0; i < 12; i++) {
    years.push({
      year: utilDate.date.getFullYear(),
      timestamp: utilDate.date.getTime(),
      isSelected: isSelectedYear(utilDate.date),
      isCurrent: isCurrentYear(utilDate.date),
      isDisabled: isDisabledMonth(utilDate.date),
    });
    utilDate.add(1, "years");
  }
  return years;
});
const isSelectedMonth = (date: Date): boolean => {
  return (
    !!store.selectedDate &&
    store.selectedDate.date.getFullYear() === date.getFullYear() &&
    store.selectedDate.date.getMonth() === date.getMonth()
  );
};
const isSelectedYear = (date: Date): boolean => {
  return (
    !!store.selectedDate &&
    store.selectedDate.date.getFullYear() === date.getFullYear()
  );
};

const isCurrentMonth = (date: Date): boolean => {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth()
  );
};

const isCurrentYear = (date: Date): boolean => {
  return new Date().getFullYear() === date.getFullYear();
};

const isDisabledMonth = (date: Date): boolean => {
  let disabled = false;
  if (typeof props.disabled === "undefined") {
    return false;
  }
  if (typeof props.disabled?.to !== "undefined" && props.disabled?.to) {
    if (
      (date.getMonth() < props.disabled?.to.getMonth() &&
        date.getFullYear() <= props.disabled?.to.getFullYear()) ||
      date.getFullYear() < props.disabled?.to.getFullYear()
    ) {
      disabled = true;
    }
  }
  if (typeof props.disabled?.from !== "undefined" && props.disabled?.from) {
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
};

const changeViewMode = (viewMode?: datePickerViewType): void => {
  if (!props.onlyYear) {
    store.globalContentAnimation = "picker-fade-transition";
    if (viewMode) {
      changeView(viewMode);
    } else {
      let result = store.viewTypeOptions.month;
      if (viewComputed.value === store.viewTypeOptions.day) {
        result = store.viewTypeOptions.month;
      } else if (viewComputed.value === store.viewTypeOptions.month) {
        result = store.viewTypeOptions.year;
      }
      changeView(result);
    }
  }
};

const t = (): Lnguage => {
  return new Lnguage(props.lng, props.weekStart);
};

const daysOfWeek = computed((): Array<string> => {
  return t().weekdaysMin;
});

const currentYear = computed(() => {
  return store.pageDate.getFullYear();
});

const formattedHeaderDate = computed((): string => {
  if (!store.selectedDate) {
    return "&nbsp;";
  }
  return store.selectedDate
    .setLng(props.lng)
    .format("week-ddd, month-mmm month-D");
});

const formattedHeaderKey = computed((): number => {
  return store.selectedDate?.date.getTime() || 1;
});

const formattedSubheader = (): string => {
  const utilDate = new UtilDate(store.pageDate, props.lng);
  switch (viewComputed.value) {
    case store.viewTypeOptions.day:
      return utilDate.format("month-mmmm year-YYYY");
    case store.viewTypeOptions.month:
      return utilDate.format("year-YYYY");
    case store.viewTypeOptions.year:
      const year = Math.floor(new Date(store.pageDate).getFullYear() / 12) * 12;
      return `${year} - ${year + 12}`;
  }
  return ``;
};

const prevButtonLabel = computed((): string => {
  switch (viewComputed.value) {
    case datePickerViewType.month:
      return "Previous year";
    case datePickerViewType.year:
      return "Previous 12 years";
    default:
      return "Previous month";
  }
});

const nextButtonLabel = computed((): string => {
  switch (viewComputed.value) {
    case datePickerViewType.month:
      return "Next year";
    case datePickerViewType.year:
      return "Next 12 years";
    default:
      return "Next month";
  }
});

const headerButtonLabel = computed((): string => {
  switch (viewComputed.value) {
    case datePickerViewType.day:
      return `View months — ${formattedSubheader()}`;
    case datePickerViewType.month:
      return `View years — ${formattedSubheader()}`;
    default:
      return formattedSubheader();
  }
});

const dayClasses = (day: Day): Record<string, boolean> => {
  const isDefaultState = !day.isSelected && !day.isToday && !day.isHighlighted;

  return {
    "btn-day": true,
    "btn-day--default": isDefaultState,
    "btn-day--disabled": day.isDisabled,
    "btn-day--highlighted": day.isHighlighted,
    "btn-day--highlight-start": day.isHighlightStart,
    "btn-day--highlight-end": day.isHighlightEnd,
    "btn-day--today": day.isToday,
    "btn-day--selected": day.isSelected,
    "btn-day--weekend": day.isWeekend,
    "btn-day--sat": day.isSaturday,
    "btn-day--sun": day.isSunday,
    "btn-day--adjacent-month": !!day.isAdjacentMonth,
  };
};

const monthClasses = (month: Month): Record<string, boolean> => {
  const isDefaultState = !month.isSelected && !month.isCurrent;

  return {
    "btn-month": true,
    "btn-month--default": isDefaultState,
    "btn-month--disabled": month.isDisabled,
    "btn-month--current": month.isCurrent,
    "btn-month--selected": month.isSelected,
  };
};

const yearClasses = (year: Year): Record<string, boolean> => {
  const isDefaultState = !year.isSelected && !year.isCurrent;

  return {
    "btn-year": true,
    "btn-year--default": isDefaultState,
    "btn-year--disabled": year.isDisabled,
    "btn-year--current": year.isCurrent,
    "btn-year--selected": year.isSelected,
  };
};

const dayGridButtonProps = (
  day: Day,
): {
  color?: string;
  depressed: boolean;
  disabled: boolean;
  noInvertColor?: boolean;
  outlined: boolean;
  text: boolean;
} => {
  // Priority: selected > today > highlighted > default
  if (day.isSelected) {
    return {
      color: props.color,
      depressed: true,
      disabled: day.isDisabled,
      outlined: false,
      text: false,
    };
  }

  if (day.isToday) {
    return {
      color: props.color,
      depressed: false,
      disabled: day.isDisabled,
      outlined: true,
      text: false,
    };
  }

  if (day.isHighlighted) {
    return {
      color: props.color,
      depressed: false,
      disabled: day.isDisabled,
      outlined: false,
      text: true,
    };
  }

  return {
    color: undefined,
    depressed: false,
    disabled: day.isDisabled,
    noInvertColor: true,
    outlined: false,
    text: true,
  };
};

const selectableGridButtonProps = (
  isSelected: boolean,
  isDisabled: boolean,
  isCurrent: boolean,
): {
  block: boolean;
  color?: string;
  depressed: boolean;
  disabled: boolean;
  noInvertColor?: boolean;
  outlined: boolean;
  size: "default";
  text: boolean;
} => {
  // Priority: selected > current > default
  if (isSelected) {
    return {
      block: true,
      color: props.color,
      depressed: false,
      disabled: isDisabled,
      outlined: false,
      size: "default",
      text: false,
    };
  }

  if (isCurrent) {
    return {
      block: true,
      color: props.color,
      depressed: false,
      disabled: isDisabled,
      noInvertColor: true,
      outlined: true,
      size: "default",
      text: false,
    };
  }

  return {
    block: true,
    color: undefined,
    depressed: false,
    disabled: isDisabled,
    noInvertColor: true,
    outlined: false,
    size: "default",
    text: true,
  };
};

const nextMonth = () => {
  if (!nextMonthDisabled.value) {
    store.globalContentAnimation = "tab-transition";
    changeMonth(+1);
  }
};
const previousMonth = () => {
  if (!previousMonthDisabled.value) {
    store.globalContentAnimation = "tab-reverse-transition";
    changeMonth(-1);
  }
};

const nextMonthDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.from) {
    return false;
  }
  return (
    props.disabled?.from.getMonth() <= store.pageDate.getMonth() &&
    props.disabled?.from.getFullYear() <= store.pageDate.getFullYear()
  );
});

const previousMonthDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.to) {
    return false;
  }
  return (
    props.disabled.to.getMonth() >= store.pageDate.getMonth() &&
    props.disabled.to.getFullYear() >= store.pageDate.getFullYear()
  );
});

const changeMonth = (incrementBy = +1): void => {
  const utilDate = new UtilDate(store.pageDate);
  store.pageDate =
    incrementBy > 0
      ? utilDate.add(incrementBy, "months").date
      : utilDate.subtract(incrementBy, "months").date;
};

const changeYear = (incrementBy = +1): void => {
  const utilDate = new UtilDate(store.pageDate);
  store.pageDate =
    incrementBy > 0
      ? utilDate.add(incrementBy, "years").date
      : utilDate.subtract(incrementBy, "years").date;
};

const nextButtonAction = (): void => {
  if (viewComputed.value === store.viewTypeOptions.day) {
    nextMonth();
  } else if (viewComputed.value === store.viewTypeOptions.month) {
    nextYear();
  } else {
    nextYearPage();
  }
  nextTick(() => {
    liveAnnouncement.value = formattedSubheader();
  });
};
const nextYear = (): void => {
  if (!nextYearDisabled.value) {
    store.globalContentAnimation = "tab-transition";
    changeYear(1);
  }
};
const nextYearPage = (): void => {
  if (!nextYearPageDisabled.value) {
    store.globalContentAnimation = "tab-transition";
    changeYear(12);
  }
};
const nextYearDisabled = computed((): boolean => {
  if (!props.disabled || !props.disabled?.from) {
    return false;
  }
  return props.disabled?.from.getFullYear() <= store.pageDate.getFullYear();
});
const nextYearPageDisabled = computed((): boolean => {
  return false;
});
const previousYearPageDisabled = computed((): boolean => {
  return false;
});

const previousYearDisabled = computed(() => {
  if (!props.disabled || !props.disabled?.to) {
    return false;
  }
  return props.disabled?.to.getFullYear() >= store.pageDate.getFullYear();
});

const previousYear = (): void => {
  if (!previousYearDisabled.value) {
    store.globalContentAnimation = "tab-reverse-transition";
    changeYear(-1);
  }
};

const previousYearPage = (): void => {
  if (!previousYearPageDisabled.value) {
    store.globalContentAnimation = "tab-reverse-transition";
    changeYear(-12);
  }
};
const headerValueKey = computed(() => {
  if (viewComputed.value === store.viewTypeOptions.year) {
    return keyYearPage.value;
  }
  return viewComputed.value == store.viewTypeOptions.day
    ? store.pageDate.getMonth()
    : store.pageDate.getFullYear();
});

const prevButtonAction = (): void => {
  if (viewComputed.value == store.viewTypeOptions.day) {
    previousMonth();
  } else if (viewComputed.value === store.viewTypeOptions.month) {
    previousYear();
  } else {
    previousYearPage();
  }
  nextTick(() => {
    liveAnnouncement.value = formattedSubheader();
  });
};

const handleGridKeydown =
  (cols: number) =>
  (e: KeyboardEvent): void => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
      return;
    e.preventDefault();
    const grid = e.currentTarget as HTMLElement;
    const buttons = Array.from(
      grid.querySelectorAll<HTMLButtonElement>(".grid-body button"),
    );
    const isDisabledButton = (button: HTMLButtonElement): boolean => {
      return (
        button.disabled ||
        button.getAttribute("aria-disabled") === "true" ||
        button.classList.contains("btn-day--disabled") ||
        button.classList.contains("e-btn--disabled")
      );
    };

    const enabledButtons = buttons.filter(
      (button) => !isDisabledButton(button),
    );
    if (!enabledButtons.length) return;

    const focused = document.activeElement as HTMLButtonElement | null;
    const idx = focused ? buttons.indexOf(focused) : -1;

    if (idx === -1) {
      enabledButtons[0]?.focus();
      return;
    }

    const deltas: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: cols,
      ArrowUp: -cols,
    };
    const step = deltas[e.key] ?? 0;
    let next = idx + step;

    while (next >= 0 && next < buttons.length) {
      const button = buttons[next];
      if (!isDisabledButton(button)) {
        button.focus();
        return;
      }
      next += step;
    }
  };

const handleDayGridKeydown = handleGridKeydown(7);
const handleMonthGridKeydown = handleGridKeydown(3);
const handleYearGridKeydown = handleGridKeydown(3);

const selectDate = (day: Day): void => {
  if (day.isDisabled) {
    emit("click:day", day);
    return;
  }
  const currentDate = computedValue.value.date;
  const nextDate = new UtilDate(day.timestamp).date;
  store.pickerTransition =
    currentDate > nextDate ? "picker-transition-reverse" : "picker-transition";
  changeValue(new UtilDate(day.timestamp));
};

const selectMonth = (month: Month): void => {
  if (!month.isDisabled) {
    if (props.onlyMonth) {
      changeValue(new UtilDate(month.timestamp));
    } else {
      store.globalContentAnimation = "picker-fade-transition";
      store.pageDate = new Date(month.timestamp);
      changeView(store.viewTypeOptions.day);
    }
  }
};

const selectYear = (year: Year): void => {
  if (!year.isDisabled) {
    if (props.onlyYear) {
      changeValue(new UtilDate(year.timestamp));
    } else {
      store.globalContentAnimation = "picker-fade-transition";
      store.pageDate = new Date(year.timestamp);
      changeView(store.viewTypeOptions.month);
    }
  }
};
</script>
<style lang="scss" src="./style.scss"></style>
