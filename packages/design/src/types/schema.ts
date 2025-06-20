import { CSSProperties } from "react";

// 基础样式属性
interface BaseStyle {
  // 布局
  display?: "block" | "flex" | "grid" | "none";
  position?: "relative" | "absolute" | "fixed" | "sticky";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch";
  alignContent?: "flex-start" | "flex-end" | "center" | "stretch";
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  alignSelf?: "auto" | "flex-start" | "flex-end" | "center" | "stretch";
  justifySelf?: "auto" | "flex-start" | "flex-end" | "center" | "stretch";
  gridTemplateRows?: string;
  gridTemplateColumns?: string;
  gridArea?: string;

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
  borderRadius?: number;

  // 背景
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;

  // 阴影
  boxShadow?: string;

  // 颜色
  color?: string;

  // 盒子模型
  boxSizing?: "border-box" | "content-box";

  [key: string]: string | number | object | boolean | Array<unknown> | undefined;
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
export type EventType = "builtin" | "script";

export interface EventConfig {
  /** builtin | script */
  type: EventType;
  /** 展示用名称 */
  name: string;
  /** builtin: 事件 key ; script: 代码字符串 */
  value: string;
  /** 可选描述 */
  description?: string;
  version?: string;
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
  /**
   * @deprecated 组件内部元素样式
   * 比如 object-fit font-size color等
   */
  style?: BaseStyle;
  animation?: Animation[];
  // 自定义样式 跟布局相关
  customStyle?: CSSProperties;
  events?: {
    onClick?: EventConfig;
    onLoad?: EventConfig;
  };
  i18n?: {
    [key: string]: string;
  };
}

export type { BaseStyle, CommonComponentProps };
