import React, { useEffect } from "react";
import { useNode, UserComponent } from "@craftjs/core";
import { AppProps } from "./type";
import { executeUserScript } from "@/utils/script/scriptRunner";

const defaultProps: AppProps = {
  style: {
    display: "grid",
    gridAutoFlow: "row",
    gridTemplateColumns: "1fr",
    gridAutoRows: "minmax(0px,100%)",
    padding: 10,
    minHeight: "100%",
    minWidth: "100%",
    flexDirection: "column",
    background: "rgba(255,255,255,1)",
    alignContent: "flex-start",
    position: "relative",
    width: "100vw",
    height: "100vh"
  },
  events: {},
  customStyle: {},
  animation: []
};

export const App: UserComponent<Partial<React.PropsWithChildren<AppProps>>> = props => {
  const { id } = useNode();

  const options = {
    ...defaultProps,
    ...props
  };

  const { style, events, customStyle, children } = options;
  console.log(options, "style");
  useEffect(() => {
    if (events?.onLoad) {
      executeUserScript(events.onLoad.value);
    }
  }, [events]);

  return (
    <div
      id={id}
      data-id={id}
      style={{
        ...style,
        ...customStyle
      }}
    >
      {children}
    </div>
  );
};
