import { useNode, UserComponent } from "@craftjs/core";

export interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export const Image: UserComponent<ImageProps> = ({ src, alt, width, height, objectFit = "cover" }) => {
  const {
    connectors: { connect, drag }
  } = useNode();

  return (
    <div ref={ref => connect(drag(ref as HTMLElement))} className="w-full">
      <img
        src={src}
        alt={alt}
        className={"max-w-full h-auto cursor-pointer"}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          objectFit
        }}
      />
    </div>
  );
};

Image.craft = {
  displayName: "Image",
  props: {
    src: "",
    alt: "",
    width: "100%",
    height: "auto",
    objectFit: "cover"
  },
  rules: {
    canDrag: () => true
  }
};
