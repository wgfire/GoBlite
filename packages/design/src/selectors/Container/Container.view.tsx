import React, { useEffect } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { ContainerProps } from "./type";
import { ElementBoxView } from "@/components/ElementBox";

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

  useEffect(() => {
    if (events?.onLoad) {
      eval(events.onLoad);
    }
  }, [events]);

  return (
    <ElementBoxView
      id={id}
      data-id={id}
      style={{
        position: "relative",
        ...style,
        ...customStyle
      }}
    >
      {children}
    </ElementBoxView>
  );
};
