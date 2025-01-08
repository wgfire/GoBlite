import { useNode, useEditor } from "@craftjs/core";
import clsx from "clsx";
import { ResizerIndicators } from "./ResizerIndicators";
import { Resizable, ResizableProps, ResizeStartCallback } from "re-resizable";
import { useRef, useCallback, useMemo, useState } from "react";
import { isPercentage } from "../../utils/numToMeasurement";

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
    nodeWidth,
    nodeHeight,
    active,
    inNodeContext
  } = useNode(node => ({
    active: node.events.selected,
    nodeWidth: node.data.props.style[propKey.width],
    nodeHeight: node.data.props.style[propKey.height]
  }));

  const { isRootNode } = useEditor((_, query) => ({
    isRootNode: query.node(id).isRoot()
  }));

  const resizable = useRef<Resizable | null>(null);
  const startDimensions = useRef<Dimensions | null>(null);
  const [size, setSize] = useState({
    width: nodeWidth,
    height: nodeHeight
  });
  // 计算新的尺寸
  const calculateNewSize = useCallback((currentSize: string, delta: number, parentSize: number): string => {
    if (isPercentage(currentSize)) {
      // 如果是百分比，计算实际像素变化对应的百分比变化
      const deltaPercent = (delta / parentSize) * 100;
      const currentPercent = parseFloat(currentSize);
      return `${currentPercent + deltaPercent}%`;
    }
    // 如果是像素，直接加上变化值
    const currentPx = parseFloat(currentSize);
    return `${currentPx + delta}px`;
  }, []);

  // 处理开始拖拽
  const handleResizeStart = useCallback<ResizeStartCallback>(
    e => {
      e.preventDefault();
      e.stopPropagation();
      startDimensions.current = {
        width: nodeWidth,
        height: nodeHeight
      };
    },
    [nodeWidth, nodeHeight]
  );

  // 处理拖拽中
  const handleResize = useCallback(
    (_: unknown, __: unknown, ___: unknown, delta: { width: number; height: number }) => {
      const dom = resizable.current?.resizable;
      if (!dom || !startDimensions.current) return;

      const parentElement = dom.parentElement;
      if (!parentElement) return;

      const parentRect = parentElement.getBoundingClientRect();
      const newWidth = calculateNewSize(startDimensions.current.width as string, delta.width, parentRect.width);
      const newHeight = calculateNewSize(startDimensions.current.height as string, delta.height, parentRect.height);
      console.log(newWidth, newHeight, "newWidth, newHeight", nodeHeight);
      setSize({
        width: newWidth,
        height: newHeight
      });
    },
    [calculateNewSize, propKey, setProp]
  );

  // 计算可调整的方向
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

  // 计算类名
  const resizableClassName = useMemo(
    () =>
      clsx({
        "m-auto": isRootNode,
        "max-w-full": true,
        "user-select-none": true
      }),
    [isRootNode]
  );

  return (
    <Resizable
      enable={resizableEnable}
      className={clsx(resizableClassName, "resizer-wrapper")}
      id={id}
      ref={ref => {
        if (ref) {
          resizable.current = ref;
          connect(resizable.current.resizable!);
        }
      }}
      handleClasses={{
        top: "indicator",
        right: "indicator",
        bottom: "indicator",
        left: "indicator",
        topRight: "indicator",
        bottomRight: "indicator",
        bottomLeft: "indicator",
        topLeft: "indicator"
      }}
      size={size}
      onResizeStart={handleResizeStart}
      onResize={handleResize}
      maxWidth={props.style?.maxWidth}
      maxHeight={props.style?.maxHeight}
      minWidth={props.style?.minWidth}
      minHeight={props.style?.minHeight}
      {...props}
    >
      {children}
      {active && !isRootNode && <ResizerIndicators />}
    </Resizable>
  );
};
