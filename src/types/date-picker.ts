import { IconPath } from "./icon";
import { suportedLng } from "@/locales/index";
export interface DatesRange {
  from: Date;
  to: Date;
}

export interface Day {
  date: number;
  timestamp: number;
  isSelected: boolean;
  isDisabled: boolean;
  isHighlighted: boolean;
  isHighlightStart: boolean;
  isHighlightEnd: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isSaturday: boolean;
  isSunday: boolean;
}

export enum datePickerViewType {
  day,
  month,
  year,
}

export interface DatesConfiguration {
  dates?: Array<Date>;
  from?: Date;
  to?: Date;
  daysOfMonth?: Array<number>;
  ranges?: Array<DatesRange>;
  days?: Array<number>;
  customPredictor?: (date: Date) => boolean;
}

export interface Month {
  month: string;
  timestamp: number;
  isSelected: boolean;
  isDisabled: boolean;
}

export interface Year {
  year: number;
  timestamp: number;
  isSelected: boolean;
  isDisabled: boolean;
}
export interface DatePickerProps {
  landscape?: boolean;
  color?: string;
  noTitle?: boolean;
  onlyYear?: boolean;
  onlyMonth?: boolean;
  closeOnChange?: boolean;
  modelValue?: Date | string;
  weekStart?: number;
  format?: string;
  lng?: suportedLng;
  iconPrev?: string | Array<IconPath> | IconPath;
  iconNext?: string | Array<IconPath> | IconPath;
  disabled?: DatesConfiguration;
  highlighted?: DatesConfiguration;
  view?: datePickerViewType;
}
