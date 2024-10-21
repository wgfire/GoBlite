import { Resizer } from "@/components/Resizer";
import { UserComponent } from "@craftjs/core";
import ImageSettings from "./ImageSettings";

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export const Image: UserComponent<ImageProps> = ({ src, alt, width, height, objectFit = "cover" }) => {
  return (
    <Resizer propKey={{ width: "width", height: "height" }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="max-w-full h-auto cursor-pointer"
        style={{
          objectFit,
          width,
          height
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
    objectFit: "cover"
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
