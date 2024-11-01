import { BaseProps, LayoutStyle } from "@/types";

export interface ButtonStyle extends LayoutStyle {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export interface ButtonProps extends BaseProps {
  baseStyle: ButtonStyle;
}
