/**
 * App组件 用于包裹子元素，可以设置全局动画，事件、注册一些上下文
 */
import React, { useEffect, useMemo } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { ContainerSettings } from "./AppSettings";
// import { Resizer } from "@/components/Resizer";
import { ContainerSettingsFast } from "./AppSettingsFast";
import { omit } from "lodash-es";
import { AppProps } from "./type";
import { useUpdateAppHeight } from "@/hooks/useUpdateAppHeight";

export const defaultProps: AppProps = {
  style: {
    display: "grid",
    gridAutoFlow: "row",
    gridTemplateColumns: "1fr",
    gridAutoRows: "minmax(0px,100%)",
    gap: "10px",
    padding: 10,
    height: "auto",
    minHeight: "100%",
    minWidth: "100%",
    width: "auto",
    flexDirection: "column",
    background: "rgba(255,255,255,1)",
    alignContent: "flex-start",
    position: "relative"
  },
  events: {},
  customStyle: {},
  animation: []
};

export const App: UserComponent<Partial<React.PropsWithChildren<AppProps>>> = props => {
  const {
    id,
    connectors: { connect }
  } = useNode();
  useUpdateAppHeight(id);

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
    <div
      id={id}
      // propKey={{ width: "width", height: "height" }}
      ref={ref => {
        if (ref) {
          connect(ref);
        }
      }}
      data-id={id}
      style={{
        gap: gap ?? 0,
        flex: fillSpace ? 1 : "unset",
        ...styleBg,
        ...styled
      }}
    >
      {children}
    </div>
  );
};
App.craft = {
  props: defaultProps,
  rules: {
    canDrag: () => true
  },
  related: {
    settings: ContainerSettings,
    fastSettings: ContainerSettingsFast
  },
  name: "App",
  displayName: "App",
  custom: {
    displayName: "App" // 设置默认的显示名称
  }
};
