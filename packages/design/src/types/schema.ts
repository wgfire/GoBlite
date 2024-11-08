import { CSSProperties } from "react";

// 基础样式属性
interface BaseStyle {
  // 布局
  display?: "block" | "flex" | "grid" | "none";
  position?: "relative" | "absolute" | "fixed" | "sticky";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";

  // 尺寸
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;

  // 间距
  margin?: string | number;
  padding?: string | number;
  gap?: string | number;

  // 边框
  border?: string;
  borderRadius?: string | number;

  // 背景
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;

  // 阴影
  boxShadow?: string;

  // 颜色
  color?: string;
}
export interface Animation {
  name?: string;
  duration?: number;
  timingFunction?: string;
  delay?: number;
}

/**
 * 事件配置 打包的时候去 @go-blite/events 加载
 */
export interface EventConfig {
  value: string;
  name: string;
}

export interface ResourceConfig {
  url: string;
  name: string;
}

// export interface ResponsiveConfig {
//   mobile?: Partial<BaseStyle>;
//   tablet?: Partial<BaseStyle>;
//   desktop?: Partial<BaseStyle>;
// }

// 组件通用属性
interface CommonComponentProps {
  id?: string;
  className?: string;
  style?: BaseStyle;
  animation?: Animation[];
  customStyle?: CSSProperties; // 自定义样式
  events?: {
    onClick?: () => void | EventConfig;
    onLoad?: string;
  };
}

export type { BaseStyle, CommonComponentProps };
