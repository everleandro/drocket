import { ComputedRef } from "vue";
export type ListModelProp =
  | Array<string | number>
  | string
  | number
  | undefined
  | null;

  export type ListSizeClassKeys =
  | "xSmall"
  | "small"
  | "large"
  | "xLarge";
export interface EListInjection {
  changeModelValue: (value: number | string | undefined | null) => void;
  changeGroupValue: (value: number | string | undefined | null) => void;
  modelValue: ComputedRef<ListModelProp>;
  group: ComputedRef<ListModelProp>;
}
