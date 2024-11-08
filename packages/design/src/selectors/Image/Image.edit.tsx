import { Resizer } from "@/components/Resizer";
import { useNode, UserComponent } from "@craftjs/core";
import { ImageSettings } from "./ImageSettings";
import { ImageProps } from "./type";

export const Image: UserComponent<Partial<ImageProps>> = props => {
  const { id } = useNode();
  const { style, src, alt, watermark, noWatermarkSrc, switchNoWatermarkSrc = false } = props;

  const renderSrc = switchNoWatermarkSrc && watermark ? noWatermarkSrc : src;
  return (
    <Resizer propKey={{ width: "width", height: "height" }} style={{ maxWidth: "100%" }} id={id}>
      <img
        src={renderSrc}
        alt={alt}
        loading="lazy"
        className="cursor-pointer"
        style={{
          ...style
        }}
      />
    </Resizer>
  );
};

Image.craft = {
  props: {
    src: "",
    alt: "Image description",
    watermark: false,
    style: {
      height: "auto",
      width: "100%",
      objectFit: "cover",
      maxWidth: "100%"
    }
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
