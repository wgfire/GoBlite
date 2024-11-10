import React, { useEffect, useMemo } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { Resizer } from "@/components/Resizer";
import { ContainerProps } from "./type";

const defaultProps: ContainerProps = {
  style: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
    background: "rgba(255, 255, 255, 0.1)",
    width: "100%",
    height: "auto",
    backgroundImage: "none"
  },
  events: {},
  customStyle: {},
  animation: []
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
  const { id } = useNode();

  const options = {
    ...defaultProps,
    ...props
  };

  const { style, events, customStyle, children } = options;
  const { display, fillSpace, background, backgroundImage, gap, gridCols, gridRows } = style;
  useEffect(() => {
    if (events?.onLoad) {
      eval(events.onLoad);
    }
  }, [events]);

  const styleBg = useMemo(() => {
    // background 和 backgroundImage 应该不 同时存在
    return {
      background: background || "rgba(255, 255, 255, 1)",
      ...(backgroundImage && backgroundImage !== "none"
        ? {
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "100% 100%"
          }
        : {})
    };
  }, [background, backgroundImage]);
  const styled = useMemo(() => {
    const styled = { ...customStyle, ...style };
    if (display === "grid") {
      styled["gridTemplateColumns"] = `repeat(${gridCols ?? 0}, 1fr)`;
      styled["gridTemplateRows"] = `repeat(${gridRows ?? 0}, 1fr)`;
    }
    return styled;
  }, [gridCols, gridRows, display, customStyle]);
  console.log(styled, "options");
  return (
    <Resizer
      id={id}
      propKey={{ width: "width", height: "height" }}
      data-id={id}
      style={{
        position: "relative",
        gap: gap ?? 0,
        flex: fillSpace ? 1 : "unset",
        ...styleBg,
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
  name: "Container",
  displayName: "Container",
  custom: {
    displayName: "Container" // 设置默认的显示名称
  }
};
