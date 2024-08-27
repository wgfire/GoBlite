import { ImageSettings } from "./ImageSettings";
import { Resizer } from "../Resizer";
import { useRef, useState } from "react";
import { useNode } from "@craftjs/core";

export interface ImageProps {
  /**
   * 图片的src
   */
  src?: string;
  /**
   * 图片的alt
   */
  alt?: string;
  /**
   * 图片的width
   */
  width?: number | string;
  /**
   * 图片的height
   */
  height?: number | string;
  /**
   * 图片的样式
   */
  styles?: React.CSSProperties;
  /**
   * 图片的加载失败时的占位图片
   */
  errorImg?: string;
}

const defaultProps: ImageProps = {
  height: "auto",
  width: "100%",
  src: "https://cdn.builder.io/api/v1/image/assets/TEMP/74a6f7510d4e9b06e0cf5bbf2fc8e9cac1e1613e856eaafeaf15dd77c389da7b?placeholderIfAbsent=true&apiKey=6b9b908ef31942c8b2aff57817d1eca0",
  alt: "图片失败",
};

export const Image = (props: ImageProps) => {
  const { src, alt, styles, errorImg } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const {actions:{setProp}} = useNode()

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (typeof src === "string") {
        setProp((props)=>{
          props.src = src
        })
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Resizer propKey={{ width: "width", height: "height" }}>
      <>
        <img
          src={src}
          alt={alt}
          style={styles}
          className={"max-w-full h-auto cursor-pointer"}
          onClick={handleClick}
          onError={(e) => {
            if (errorImg) {
              (e.target as HTMLImageElement).src = errorImg;
            }
          }}
        />
        <label style={{ display: 'none' }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </>
    </Resizer>
  );
};

Image.craft = {
  displayName: "Image",
  props: defaultProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    toolbar: ImageSettings,
  },
};
