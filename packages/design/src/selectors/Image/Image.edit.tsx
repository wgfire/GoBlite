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
        transform: customStyle?.transform || "translate(0,0)",
        width: "max-content"
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
      width: "500px",
      objectFit: "cover",
      maxWidth: "100%"
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
