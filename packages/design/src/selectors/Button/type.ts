import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface ButtonStyle extends BaseStyle {
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export interface ButtonProps extends CommonComponentProps {}
