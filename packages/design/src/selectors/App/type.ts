import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface ContainerStyle extends BaseStyle {
  fillSpace?: boolean;
  gridCols?: number;
  gridRows?: number;
}

export interface AppProps extends CommonComponentProps {
  style: ContainerStyle;
}
