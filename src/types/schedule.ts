export interface Space {
  label: string;
  id: string | number;
}

export interface SlotEvent {
  name: string;
  entityId: number | string;
  start: Date | string;
  end: Date | string;
  color: string;
}

export interface ScheduleEvent extends SlotEvent {
  footer?: string | number | null;
  subtitle?: string | number | null;
}

export interface Point {
  x: number;
  y: number;
}
export enum Mode {
  day,
  week,
  month,
  year,
  schedule,
}
