import { useNode, useEditor } from "@craftjs/core";
import clsx from "clsx";
import debounce from "lodash-es/debounce";
import { Resizable, ResizableProps, ResizeStartCallback } from "re-resizable";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";

import { isPercentage, pxToPercent, percentToPx, getElementDimensions } from "../../utils/numToMeasurement";
import { ResizerIndicators } from "./ResizerIndicators";

interface ResizerProps extends Omit<ResizableProps, "size"> {
  id?: string;
  propKey: {
    width: string;
    height: string;
  };
  children: React.ReactNode;
}

interface Dimensions {
  width: string | number;
  height: string | number;
}

export const Resizer: React.FC<ResizerProps> = ({ propKey, children, ...props }) => {
  const {
    id,
    actions: { setProp },
    connectors: { connect },
    fillSpace,
    nodeWidth,
    nodeHeight,
    parent,
    active,
    inNodeContext
  } = useNode(node => ({
    parent: node.data.parent,
    active: node.events.selected,
    nodeWidth: node.data.props[propKey.width],
    nodeHeight: node.data.props[propKey.height],
    fillSpace: node.data.props.fillSpace
  }));

  const { isRootNode, parentDirection } = useEditor((state, query) => ({
    parentDirection: parent && state.nodes[parent] && state.nodes[parent].data.props.flexDirection,
    isRootNode: query.node(id).isRoot()
  }));

  const resizable = useRef<Resizable | null>(null);
  const isResizing = useRef<boolean>(false);
  const editingDimensions = useRef<Dimensions | null>(null);
  const nodeDimensions = useRef<Dimensions | null>(null);
  nodeDimensions.current = { width: nodeWidth, height: nodeHeight };
  //   const maxWidth = useRef<number>(0);

  const [internalDimensions, setInternalDimensions] = useState<Dimensions>({
    width: nodeWidth,
    height: nodeHeight
  });

  const updateInternalDimensionsInPx = useCallback(() => {
    const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current!;
    const parentElement = resizable.current?.resizable?.parentElement;

    const width = percentToPx(nodeWidth, parentElement?.clientWidth || 0);
    const height = percentToPx(nodeHeight, parentElement?.clientHeight || 0);

    setInternalDimensions({
      width,
      height
    });
  }, []);

  const updateInternalDimensionsWithOriginal = useCallback(() => {
    const { width: nodeWidth, height: nodeHeight } = nodeDimensions.current!;
    setInternalDimensions({
      width: nodeWidth,
      height: nodeHeight
    });
  }, []);

  const getUpdatedDimensions = useCallback((width: number, height: number): Dimensions | undefined => {
    const dom = resizable.current?.resizable;
    if (!dom || !editingDimensions.current) return;

    const currentWidth = parseInt(editingDimensions.current.width as string),
      currentHeight = parseInt(editingDimensions.current.height as string);
    return {
      width: currentWidth + width,
      height: currentHeight + height
    };
  }, []);

  useEffect(() => {
    if (!isResizing.current) updateInternalDimensionsWithOriginal();
  }, [nodeWidth, nodeHeight, updateInternalDimensionsWithOriginal]);

  const debouncedUpdateDimensions = useMemo(
    () => debounce(updateInternalDimensionsWithOriginal, 200),
    [updateInternalDimensionsWithOriginal]
  );

  useEffect(() => {
    window.addEventListener("resize", debouncedUpdateDimensions);
    return () => {
      window.removeEventListener("resize", debouncedUpdateDimensions);
      debouncedUpdateDimensions.cancel();
    };
  }, [debouncedUpdateDimensions]);

  const handleResizeStart = useCallback<ResizeStartCallback>(
    e => {
      updateInternalDimensionsInPx();
      e.preventDefault();
      e.stopPropagation();
      const dom = resizable.current?.resizable;
      if (!dom) return;
      editingDimensions.current = {
        width: dom.getBoundingClientRect().width,
        height: dom.getBoundingClientRect().height
      };
      isResizing.current = true;
    },
    [updateInternalDimensionsInPx]
  );

  const handleResize = useCallback(
    (_: unknown, __: unknown, ___: unknown, d: { width: number; height: number }) => {
      const dom = resizable.current?.resizable;
      if (!dom) return;
      const updatedDimensions = getUpdatedDimensions(d.width, d.height);
      if (!updatedDimensions) return;

      let { width, height } = updatedDimensions;

      if (isPercentage(nodeWidth)) {
        width = pxToPercent(width as number, getElementDimensions(dom.parentElement as HTMLElement)?.width) + "%";
      } else {
        width = `${width}px`;
      }

      if (isPercentage(nodeHeight)) {
        height = pxToPercent(height as number, getElementDimensions(dom.parentElement as HTMLElement).height) + "%";
      } else {
        height = `${height}px`;
      }

      if (isPercentage(width) && dom.parentElement && dom.parentElement.style.width === "auto") {
        width = (editingDimensions.current?.width as number) + d.width + "px";
      }

      if (isPercentage(height) && dom.parentElement && dom.parentElement.style.height === "auto") {
        height = (editingDimensions.current?.height as number) + d.height + "px";
      }

      setProp((prop: Record<string, string>) => {
        prop[propKey.width] = width;
        prop[propKey.height] = height;
      }, 500);
    },
    [nodeWidth, nodeHeight, propKey, setProp, getUpdatedDimensions]
  );

  const handleResizeStop = useCallback(() => {
    isResizing.current = false;
    updateInternalDimensionsWithOriginal();
  }, [updateInternalDimensionsWithOriginal]);

  const resizableEnable = useMemo(
    () =>
      ["top", "left", "bottom", "right", "topLeft", "topRight", "bottomLeft", "bottomRight"].reduce(
        (acc, key) => {
          acc[key] = active && inNodeContext && !isRootNode;
          return acc;
        },
        {} as Record<string, boolean>
      ),
    [active, inNodeContext, isRootNode]
  );

  const resizableClassName = useMemo(
    () =>
      clsx("flex", {
        "m-auto": isRootNode,
        "overflow-hidden": isRootNode,
        "max-w-full": true
      }),
    [isRootNode]
  );
  return (
    <Resizable
      enable={resizableEnable}
      className={resizableClassName}
      id={id}
      ref={ref => {
        if (ref) {
          resizable.current = ref;
          connect(resizable.current.resizable!);
        }
      }}
      size={internalDimensions}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      onResizeStop={handleResizeStop}
      {...props}
    >
      {children}
      {active && <ResizerIndicators bound={fillSpace === "yes" ? parentDirection : false} />}
    </Resizable>
  );
};
