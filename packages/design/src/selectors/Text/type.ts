import { BaseProps, LayoutStyle } from "@/types";

export interface TextStyle extends LayoutStyle {
  text: string;
  textAlign: "left" | "center" | "right";
  shadow: number;
}

export interface TextProps extends BaseProps {
  baseStyle: TextStyle;
}
