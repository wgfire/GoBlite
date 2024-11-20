import React, { useEffect, useMemo } from "react";
import { useNode, UserComponent, ROOT_NODE } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { Resizer } from "@/components/Resizer";
import { ContainerProps } from "./type";
import { ContainerSettingsFast } from "./ContainerSettingsFast";
import { omit } from "lodash-es";

export const defaultProps: ContainerProps = {
  style: {
    display: "grid",
    padding: 0,
    margin: 0,
    background: "rgba(237, 237, 237, 0.8)",
    width: "100%",
    height: "auto",
    backgroundImage: "none",
    gridArea: "1 / 1 / 2 / 2",
    gridTemplateRows: "minmax(0px, 100%)",
    gridTemplateColumns: "minmax(0px, 1fr)",
    flexDirection: "row"
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
  const { display, fillSpace, background, backgroundImage, gap } = style;
  useEffect(() => {
    if (events?.onLoad) {
      eval(events.onLoad);
    }
  }, [events]);

  const styleBg = useMemo(() => {
    // 如果backgroundImage存在，则删除background属性

    return {
      ...(backgroundImage && backgroundImage !== "none"
        ? {
            background: undefined,
            backgroundImage: `url(${backgroundImage})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "100% 100%"
          }
        : { background: background || "rgba(255, 255, 255, 1)" })
    };
  }, [background, backgroundImage]);

  const styled = useMemo(() => {
    // 移除background属性，以避免与backgroundImage同时存在
    const styled = { ...omit(style, "background", "backgroundImage"), ...customStyle };

    return styled;
  }, [display, customStyle, style]);
  return (
    <Resizer
      id={id}
      propKey={{ width: "width", height: "height" }}
      data-id={id}
      style={{
        gap: gap ?? 0,
        flex: fillSpace ? 1 : "unset",
        ...styleBg,
        ...styled,
        ...(id === ROOT_NODE ? { overflowX: "hidden" } : {})
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
    settings: ContainerSettings,
    fastSettings: ContainerSettingsFast
  },
  name: "Container",
  displayName: "Container",
  custom: {
    displayName: "Container" // 设置默认的显示名称
  }
};
