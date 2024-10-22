import { Resizer } from "@/components/Resizer";
import { UserComponent } from "@craftjs/core";
import ImageSettings from "./ImageSettings";

export interface ImageProps {
  src: string;
  alt: string;
  width: string;
  height: string;
  objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
  maxWidth: string;
}

export const Image: UserComponent<ImageProps> = ({ src, alt, height, objectFit = "cover", maxWidth }) => {
  return (
    <Resizer propKey={{ width: "width", height: "height" }}>
      <img
        src={src}
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
    maxWidth: "100%"
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
