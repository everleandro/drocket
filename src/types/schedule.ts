export interface ScheduleSpace {
  label: string;
  id: string | number;
}

export interface ScheduleSlotEvent {
  name: string;
  entityId: number | string;
  start: Date | string;
  end: Date | string;
  color: string;
}

export interface ScheduleEvent extends ScheduleSlotEvent {
  footer?: string | number | null;
  subtitle?: string | number | null;
  id: string | number;
}

export interface Point {
  x: number;
  y: number;
}
export enum ScheduleMode {
  day,
  week,
  month,
  year,
  schedule,
}
