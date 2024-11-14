import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface ButtonStyle extends BaseStyle {}

export interface ButtonProps extends CommonComponentProps {
  style: ButtonStyle;
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}
