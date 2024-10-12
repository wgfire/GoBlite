import { useEffect } from "react";
import { useNode } from "@craftjs/core";

export const useDrag = (dom: HTMLElement | null) => {
  const {
    connectors: { drag }
  } = useNode();

  useEffect(() => {
    if (dom) {
      drag(dom);
    }
  }, [dom, drag]);
};
