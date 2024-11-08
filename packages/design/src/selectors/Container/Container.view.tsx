import React, { useEffect } from "react";
import { useNode, UserComponent } from "@craftjs/core";
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

  useEffect(() => {
    if (events?.onLoad) {
      eval(events.onLoad);
    }
  }, [events]);

  return (
    <div
      id={id}
      data-id={id}
      style={{
        position: "relative",
        flex: style.fillSpace ? 1 : "unset",
        ...style,
        ...customStyle
      }}
    >
      {children}
    </div>
  );
};
