import React, { CSSProperties, useEffect } from "react";
import { UserComponent } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { Resizer } from "@/components/Resizer";

export type EventType = "onClick" | "onLoad";

export interface ContainerProps {
  width?: string;
  height?: string;
  layout?: "flex" | "grid";
  flexDirection?: CSSProperties["flexDirection"];
  fillSpace?: "yes" | "no";
  gridRows?: number;
  gridCols?: number;
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  margin: number;
  padding: number;
  background?: { r: number; g: number; b: number; a: number };
  events: {
    onLoad?: string;
    onClick?: string;
  };
}

const defaultProps: ContainerProps = {
  layout: "flex",
  events: {},
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  fillSpace: "no",
  padding: 0,
  margin: 0,
  background: { r: 0, g: 0, b: 0, a: 0.1 },
  width: "100%",
  height: "auto"
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
  const options = {
    ...defaultProps,
    ...props
  };

  const { flexDirection, alignItems, justifyContent, fillSpace, background, padding, margin, children, events } =
    options;

  useEffect(() => {
    if (events?.onLoad) {
      eval(events.onLoad);
    }
  }, [events]);

  return (
    <Resizer
      propKey={{ width: "width", height: "height" }}
      style={{
        justifyContent,
        flexDirection,
        alignItems,
        background: background ? `rgba(${Object.values(background)})` : undefined,
        padding: `${padding}px`,
        margin: `${margin}px`,
        flex: fillSpace === "yes" ? 1 : "unset"
      }}
    >
      {children}
    </Resizer>
  );
};

Container.craft = {
  props: defaultProps,
  rules: {
    canDrag: () => true
  },
  related: {
    settings: ContainerSettings
  },
  custom: {
    displayName: "Container" // 设置默认的显示名称
  }
};
