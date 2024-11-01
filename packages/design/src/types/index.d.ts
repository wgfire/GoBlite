// 基础布局属性
interface LayoutStyle {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  // Flex 布局
  display?: "flex" | "block" | "inline-block" | "grid";
  flexDirection?: "row" | "column";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  gap?: number | string;
  flex?: string;

  // 间距
  margin?: string | number;
  padding?: string | number;

  // 视觉
  color?: string;
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  opacity?: number;

  //字体
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;

  // 边框
  border?: string;
  borderRadius?: string | number;
  boxShadow?: string;

  overflow?: "visible" | "hidden" | "scroll" | "auto";

  // 事件
  events?: {
    onClick: string;
    onLoad: string;
  };
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

export interface ResponsiveConfig {
  mobile?: Partial<LayoutStyle>;
  tablet?: Partial<LayoutStyle>;
  desktop?: Partial<LayoutStyle>;
}

export interface ResponsiveEventConfig {
  mobile?: EventConfig;
  tablet?: EventConfig;
  desktop?: EventConfig;
}

export interface ResponsiveResourceConfig {
  mobile?: ResourceConfig;
  tablet?: ResourceConfig;
  desktop?: ResourceConfig;
}
export interface BaseProps {
  baseStyle?: LayoutStyle;
  customStyle?: CSSProperties;
  responsiveStyles?: ResponsiveConfig;
  responsiveEvents?: ResponsiveEventConfig;
  responsiveResources?: ResponsiveResourceConfig;
}
