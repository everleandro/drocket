export type IconPath = { d: string; fill?: string; class?: string };
export type IconClassKeys =
  | "xSmall"
  | "small"
  | "large"
  | "xLarge"
  | "disabled";

export interface IconProps {
  color?: string;
  disabled?: boolean;
  preffix?: string;
  viewBox?: string;
  icon?: Array<IconPath> | IconPath | string;
  small?: boolean;
  xSmall?: boolean;
  large?: boolean;
  xLarge?: boolean;
}
