import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface ContainerStyle extends BaseStyle {
  fillSpace?: boolean;
  gridCols?: number;
  gridRows?: number;
}

export interface ContainerProps extends CommonComponentProps {
  style: ContainerStyle;
  customStyle: ContainerStyle;
}
