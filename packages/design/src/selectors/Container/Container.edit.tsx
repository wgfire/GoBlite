import React, { useEffect, useMemo } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { ContainerSettings } from "./ContainerSettings";
import { ContainerProps } from "./type";
import { ContainerSettingsFast } from "./ContainerSettingsFast";
import { omit } from "lodash-es";
import ElementBox from "@/components/ElementBox";
import { useUpdateAppHeight } from "@/hooks/useUpdateAppHeight";
import { executeUserScript } from "@/utils/script/scriptRunner";
export const defaultProps: ContainerProps = {
  style: {
    display: "grid",
    padding: 0,
    margin: 0,
    background: "rgba(237, 237, 237, 0.8)",
    backgroundImage: "none",
    gridArea: "1 / 1 / 2 / 2",
    gridTemplateRows: "minmax(0px, 100%)",
    gridTemplateColumns: "minmax(0px, 1fr)",
    flexDirection: "row",
    maxHeight: 100000,
    maxWidth: 100000
  },
  events: {},
  customStyle: {
    width: "10%",
    height: "10%"
  },
  animation: []
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
  const {
    id,
    connectors: { connect }
  } = useNode();

  const options = {
    ...defaultProps,
    ...props
  };
  useUpdateAppHeight(id);
  const { style, events, customStyle, children } = options;
  const { display, fillSpace, background, backgroundImage, gap } = style;
  useEffect(() => {
    if (events?.onLoad) {
      executeUserScript(events.onLoad);
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
    <ElementBox
      ref={node => node && connect(node)}
      id={id}
      data-id={id}
      style={{
        gap: gap ?? 0,
        flex: fillSpace ? 1 : "unset",
        ...styleBg,
        ...styled
      }}
    >
      {children}
    </ElementBox>
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
