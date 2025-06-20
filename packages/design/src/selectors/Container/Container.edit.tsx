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
    maxWidth: 100000,
    gridAutoFlow: "row", // 默认纵向排列
    gap: 8
  },
  events: {},
  customStyle: {
    width: "100px",
    height: "100px"
  },
  // 默认使用绝对定位模式
  layoutMode: "absolute",
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
  const { style, events, customStyle, children, layoutMode } = options;
  const { background, backgroundImage, gap, gridAutoFlow } = style;
  useEffect(() => {
    if (events?.onLoad) {
      executeUserScript(events.onLoad.value);
    }
  }, [events?.onLoad]);

  const styleBg = useMemo(() => {
    // 如果backgroundImage存在，则设置size
    return backgroundImage && backgroundImage !== "none"
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "100% 100%"
        }
      : { background: background || "rgba(255, 255, 255, 1)" };
  }, [background, backgroundImage]);

  const styled = useMemo(() => {
    // 移除background属性，以避免与backgroundImage同时存在
    const baseStyle = omit(style, "background", "backgroundImage");
    // 根据布局模式应用不同的网格策略
    if (layoutMode === "flow") {
      // 流式布局：使用网格自动排列
      return {
        ...baseStyle,
        ...customStyle,
        display: "grid",
        // 设置网格自动流向
        gridAutoFlow: gridAutoFlow || "row",
        // 移除固定的网格模板，让网格自动创建
        gridTemplateRows: "auto",
        gridTemplateColumns: "auto",
        // 设置网格间距
        gap: gap || 0,
        // 移除绝对定位相关的属性
        position: "relative" as const
      };
    } else {
      return { ...baseStyle, ...customStyle };
    }
  }, [style, customStyle, layoutMode, gridAutoFlow, gap]);

  return (
    <ElementBox
      ref={node => node && connect(node)}
      id={id}
      data-id={id}
      style={{
        gap: gap ?? 0,
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
