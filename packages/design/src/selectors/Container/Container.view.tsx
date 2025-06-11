import React, { useEffect, useMemo } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { ContainerProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";
import { omit } from "lodash-es";
import { executeUserScript } from "@/utils/script/scriptRunner";

const defaultProps: ContainerProps = {
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
    flexDirection: "row",
    maxHeight: 100000,
    maxWidth: 100000
  },
  events: {},
  customStyle: {
    width: "50px",
    height: "50px"
  },
  animation: []
};

export const Container: UserComponent<Partial<React.PropsWithChildren<ContainerProps>>> = props => {
  const { id } = useNode();

  const options = {
    ...defaultProps,
    ...props
  };

  const { style, events, customStyle, children } = options;
  const { backgroundImage, background } = style;
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

  useEffect(() => {
    if (events?.onLoad) {
      executeUserScript(events.onLoad.value);
    }
  }, [events]);

  const styled = useMemo(() => {
    // 移除background属性，以避免与backgroundImage同时存在
    const styled = { ...omit(style, "background", "backgroundImage"), ...customStyle };

    return styled;
  }, [customStyle, style]);

  return (
    <ElementBoxView
      id={id}
      data-id={id}
      style={{
        position: "relative",
        ...styleBg,
        ...styled
      }}
    >
      {children}
    </ElementBoxView>
  );
};
