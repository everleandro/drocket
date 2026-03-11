import { SizeProps } from "./size";

export type IconPath = { d: string; fill?: string; class?: string };

export interface IconProps extends SizeProps {
  color?: string;
  disabled?: boolean;
  preffix?: string;
  viewBox?: string;
  icon?: Array<IconPath> | IconPath | string;
}
