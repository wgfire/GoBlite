import { Resizer } from "@/components/Resizer";
import { useNode, UserComponent } from "@craftjs/core";
import { ImageSettings } from "./ImageSettings";

export interface ImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  maxWidth: string;
  events?: {
    onClick: string;
  };
  watermark?: boolean;
  noWatermarkSrc?: string;
}

export const Image: UserComponent<Partial<ImageProps>> = props => {
  const { id } = useNode();
  const { src, alt, height, objectFit = "cover", maxWidth, watermark, noWatermarkSrc } = props;
  const switchNoWatermarkSrc = false; // true

  const renderSrc = switchNoWatermarkSrc && watermark ? noWatermarkSrc : src;
  return (
    <Resizer propKey={{ width: "width", height: "height" }} style={{ maxWidth: "100%" }} id={id}>
      <img
        src={renderSrc}
        alt={alt}
        loading="lazy"
        className="cursor-pointer"
        style={{
          objectFit,
          width: "100%",
          height,
          maxWidth
        }}
      />
    </Resizer>
  );
};

Image.craft = {
  props: {
    src: "",
    alt: "Image description",
    width: "100%",
    height: "auto",
    objectFit: "cover",
    maxWidth: "100%",
    watermark: false
  },
  custom: {
    displayName: "Image"
  },
  related: {
    settings: ImageSettings
  },
  rules: {
    canDrag: () => true
  }
};
