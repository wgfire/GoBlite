// import { Resizer } from "@/components/Resizer";
import { useNode, UserComponent } from "@craftjs/core";
import { ImageSettings } from "./ImageSettings";
import { ImageProps } from "./type";
import { ImageSettingsFast } from "./ImageSettingsFast";
import ElementBox from "@/components/ElementBox";

export type useImageType = UserComponent<Partial<ImageProps>>;

export const Image: useImageType = props => {
  const {
    id,
    connectors: { connect }
  } = useNode();
  const { style, src, alt, watermark, noWatermarkSrc, switchNoWatermarkSrc = false, customStyle } = props;

  const renderSrc = switchNoWatermarkSrc && watermark ? noWatermarkSrc : src;
  return (
    <ElementBox
      id={id}
      ref={node => node && connect(node)}
      data-id={id}
      style={{
        position: "relative",
        ...customStyle
      }}
    >
      <img
        draggable={false}
        src={renderSrc}
        alt={alt}
        loading="lazy"
        className="cursor-pointer"
        style={{
          ...style
        }}
      />
      {/* <Resizer propKey={{ width: "width", height: "height" }}>
        <img
          draggable={false}
          src={renderSrc}
          alt={alt}
          loading="lazy"
          className="cursor-pointer"
          style={{
            ...style
          }}
        />
      </Resizer> */}
    </ElementBox>
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
    },
    customStyle: {
      width: "100px",
      height: "100px"
    }
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
