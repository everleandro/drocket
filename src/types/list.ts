import { ComputedRef } from "vue";
export type ListModelProp =
  | Array<string | number>
  | string
  | number
  | undefined
  | null;
export interface EListInjection {
  changeModelValue: (value: number | string | undefined | null) => void;
  changeGroupValue: (value: number | string | undefined | null) => void;
  modelValue: ComputedRef<ListModelProp>;
  group: ComputedRef<ListModelProp>;
}
