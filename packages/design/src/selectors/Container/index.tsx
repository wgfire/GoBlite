import React, { CSSProperties, useEffect, useMemo } from "react";
import { useNode, UserComponent, ROOT_NODE } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { Resizer } from "@/components/Resizer";
import { useTranslate } from "@/hooks/useTranslate";

export type EventType = "onClick" | "onLoad";

export interface ContainerProps {
  width?: string;
  height?: string;
  display?: "flex" | "grid";
  flexDirection?: CSSProperties["flexDirection"];
  fillSpace?: "yes" | "no";
  gridRows?: number;
  gridCols?: number;
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  customStyle?: CSSProperties;
  margin: number;
  gap?: number;
  padding: number;
  background?: { r: number; g: number; b: number; a: number };
  events: {
    onLoad?: string;
    onClick?: string;
  };
}

const defaultProps: ContainerProps = {
  display: "flex",
  events: {},
  flexDirection: "row",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  fillSpace: "no",
  padding: 0,
  margin: 0,
  background: { r: 0, g: 0, b: 0, a: 0.1 },
  width: "100%",
  height: "auto",
  customStyle: {}
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
  const {
    id
    // actions: { setProp }
  } = useNode();
  const { translateX, translateY } = useTranslate(id, ROOT_NODE !== id);

  const options = {
    ...defaultProps,
    ...props
  };

  const {
    flexDirection,
    gridCols,
    gridRows,
    alignItems,
    justifyContent,
    fillSpace,
    background,
    padding,
    margin,
    children,
    events,
    display,
    gap,
    customStyle
  } = options;

  useEffect(() => {
    if (events?.onLoad) {
      eval(events.onLoad);
    }
  }, [events]);
  const styled = useMemo(() => {
    const style = { ...customStyle };
    if (display === "grid") {
      style["gridTemplateColumns"] = `repeat(${gridCols ?? 0}, 1fr)`;
      style["gridTemplateRows"] = `repeat(${gridRows ?? 0}, 1fr)`;
    }
    return style;
  }, [gridCols, gridRows, display, customStyle]);

  return (
    <Resizer
      id={id}
      propKey={{ width: "width", height: "height" }}
      style={{
        justifyContent,
        flexDirection,
        alignItems,
        display,
        transform: `translate(${translateX}px, ${translateY}px)`,
        gap: gap ?? 0,
        background: background ? `rgba(${Object.values(background)})` : undefined,
        padding: `${padding}px`,
        margin: `${margin}px`,
        flex: fillSpace === "yes" ? 1 : "unset",
        ...styled
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
