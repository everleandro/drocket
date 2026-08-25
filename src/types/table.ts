export type TableCellAlign = "start" | "center" | "end";

export interface TableHeader {
  key: string;
  label: string;
  align?: TableCellAlign;
  width?: string;
}
