import React, { CSSProperties } from "react";
import { UserComponent } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { Resizer } from "@/components/Resizer";

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
  background: { r: 0, g: 0, b: 0, a: 0.1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: "100%",
  height: "auto"
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
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

  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      style={{
        justifyContent,
        flexDirection,
        alignItems,
        background: `rgba(${Object.values(background)})`,
        color: `rgba(${Object.values(color)})`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        boxShadow: shadow === 0 ? "none" : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
        borderRadius: `${radius}px`,
        flex: fillSpace === "yes" ? 1 : "unset"
      }}
    >
      {children}
    </Resizer>
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
