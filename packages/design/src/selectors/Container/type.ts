import { BaseStyle, CommonComponentProps } from "@/types/schema";

// 布局模式枚举
export type LayoutMode = "absolute" | "flow";

export interface ContainerStyle extends BaseStyle {
  fillSpace?: boolean;
  gridCols?: number;
  gridRows?: number;

  // 流式布局的网格方向
  gridAutoFlow?: "row" | "column" | "row dense" | "column dense";
}

export interface ContainerProps extends CommonComponentProps {
  style: ContainerStyle;
  // 布局模式：absolute使用叠加网格+定位，flow使用自动网格排列
  layoutMode?: LayoutMode;
  customStyle: ContainerStyle;
}
