import { BaseStyle, CommonComponentProps } from "@/types/schema";

export interface ImageStyle extends BaseStyle {
  objectFit?: "fill" | "contain" | "cover" | "none" | "scale-down";
}

export interface ImageProps extends CommonComponentProps {
  customStyle: BaseStyle;
  style: ImageStyle;
  src: string;
  alt?: string;
  lazy?: boolean;
  watermark?: boolean; // 是否添加水印
  noWatermarkSrc?: string; // 无水印图片
  switchNoWatermarkSrc?: boolean; // 是否使用无水印图片
}
