import { useNode, UserComponent } from "@craftjs/core";
import { ImageSettings } from "./ImageSettings";
import { ImageProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";

export const Image: UserComponent<Partial<ImageProps>> = props => {
  const { id } = useNode();
  const { style, src, alt, watermark, noWatermarkSrc, switchNoWatermarkSrc = false, customStyle } = props;

  const renderSrc = switchNoWatermarkSrc && watermark ? noWatermarkSrc : src;
  return (
    <ElementBoxView
      id={id}
      style={{
        position: "relative",
        ...customStyle
      }}
    >
      <img
        src={renderSrc}
        alt={alt}
        loading="lazy"
        className="cursor-pointer"
        style={{
          ...style
        }}
      />
    </ElementBoxView>
  );
};

Image.craft = {
  props: {
    src: "",
    alt: "Image description",
    watermark: false,
    style: {
      width: "100%",
      height: "100%",
      objectPosition: "center",
      objectFit: "cover",
      maxWidth: "100vw"
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
