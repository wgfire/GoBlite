import React, { CSSProperties } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";

export interface ContainerProps {
  background: Record<"r" | "g" | "b" | "a", number>;
  color: Record<"r" | "g" | "b" | "a", number>;
  flexDirection: CSSProperties["flexDirection"];
  alignItems: CSSProperties["alignItems"];
  justifyContent: CSSProperties["justifyContent"];
  fillSpace: string;
  width: string;
  height: string;
  padding: string[];
  margin: string[];
  shadow: number;
  radius: number;
}
const defaultProps: ContainerProps = {
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  fillSpace: "no",
  padding: ["0", "0", "0", "0"],
  margin: ["0", "0", "0", "0"],
  background: { r: 255, g: 255, b: 255, a: 0.5 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: "100%",
  height: "auto"
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
  const {
    connectors: { connect, drag }
  } = useNode();
  const options = {
    ...defaultProps,
    ...props
  };
  const {
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    background,
    color,
    padding,
    margin,
    shadow,
    radius,
    children
  } = options;

  const bgColor = background
    ? `rgba(${background.r}, ${background.g}, ${background.b}, ${background.a})`
    : "transparent";

  return (
    <div
      ref={ref => connect(drag(ref as HTMLElement))}
      style={{
        flexDirection,
        alignItems,
        justifyContent,
        background: bgColor,
        padding: padding ? padding.join(" ") : undefined,
        margin: margin ? margin.join(" ") : undefined,
        boxShadow: shadow ? `0 0 ${shadow}px 0 rgba(0, 0, 0, 0.1)` : undefined,
        borderRadius: radius ? `${radius}px` : undefined,
        flex: fillSpace === "yes" ? 1 : undefined,
        color: color ? `rgba(${Object.values(color)})` : undefined
      }}
      className="w-full h-full min-h-[50px] relative"
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: "Container",
  props: defaultProps,
  rules: {
    canDrag: () => true
  },
  related: {
    toolbar: ContainerSettings
  }
};
