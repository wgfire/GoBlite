import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface ButtonStyle extends BaseStyle {}

export interface ButtonProps extends CommonComponentProps {
  customStyle: BaseStyle;
  style: ButtonStyle;
  text: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  // 是否启用底部安全区域，主要用于iOS设备
  useSafeArea?: boolean;
}
