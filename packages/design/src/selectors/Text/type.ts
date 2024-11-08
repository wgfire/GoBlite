import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface TextStyle extends BaseStyle {
  fontSize?: number | string;
  fontWeight?: number | string;
  lineHeight?: number | string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  shadow?: number;
}

export interface TextProps extends CommonComponentProps {
  style: TextStyle;
  text?: string;
}
