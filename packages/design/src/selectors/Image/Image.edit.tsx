import { Resizer } from "@/components/Resizer";
import { useNode, UserComponent } from "@craftjs/core";
import { ImageSettings } from "./ImageSettings";
import { ImageProps } from "./type";
import { ImageSettingsFast } from "./ImageSettingsFast";
import ElementBox from "@/components/ElementBox";

export const Image: UserComponent<Partial<ImageProps>> = props => {
  const { id } = useNode();
  const { style, src, alt, watermark, noWatermarkSrc, switchNoWatermarkSrc = false, customStyle } = props;

  const renderSrc = switchNoWatermarkSrc && watermark ? noWatermarkSrc : src;
  return (
    <ElementBox
      id={id}
      data-id={id}
      style={{
        position: "relative",
        width: "max-content",
        ...customStyle
      }}
    >
      <Resizer propKey={{ width: "width", height: "height" }} style={{ maxWidth: "100%" }}>
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
    </ElementBox>
  );
};

Image.craft = {
  props: {
    src: "",
    alt: "Image description",
    watermark: false,
    style: {
      height: "auto",
      width: "200px",
      minWidth: "100px",
      objectFit: "cover",
      maxWidth: "100vw"
    },
    customStyle: {}
  },
  custom: {
    displayName: "Image"
  },
  related: {
    settings: ImageSettings,
    fastSettings: ImageSettingsFast
  },
  rules: {
    canDrag: () => true
  }
};
