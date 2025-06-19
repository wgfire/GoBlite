/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNode } from "@craftjs/core";
import Moveable, {
  MoveableRefTargetType,
  OnResize,
  OnRotate,
  OnResizeEnd,
  OnRotateEnd,
  OnScale,
  OnScaleStart,
  OnScaleEnd
} from "react-moveable";
import React, { CSSProperties, useEffect, useMemo, useRef } from "react"; // 引入 useState 和 useRef
import { flushSync } from "react-dom";
import "./Resizer.css";
import { extractUnit, getComputedNumberValue, getComputedValue, maintainUnit } from "@/utils/resize";

export interface ResizerProps {
  style?: CSSProperties;
  target: MoveableRefTargetType | HTMLElement;
  scalable?: boolean;
  resizable?: boolean;
  rotatable?: boolean;
  scalaText?: boolean;
}

export const Moveables: React.FC<React.PropsWithChildren<ResizerProps>> = props => {
  const moveableRef = React.useRef<Moveable>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);
  const { target, scalable = false, resizable = true, rotatable = true, scalaText } = props;
  const {
    actions: { setProp },
    active,
    dom
  } = useNode(node => ({
    active: node.events.selected,
    nodeWidth: node.data.props.style?.width,
    nodeHeight: node.data.props.style?.height,
    customStyle: node.data.props.customStyle,
    dom: node.dom,
    props: node.data.props // 确保 props 被正确获取
  }));
  const isDragging = useMemo(() => {
    return dom?.getAttribute("data-dragging") === "true";
  }, [dom?.getAttribute("data-dragging")]);

  // 处理调整大小
  const handleResize = ({ target, width, height, drag }: OnResize) => {
    if (!target || !(target instanceof HTMLElement)) return;

    // 直接修改 DOM 元素样式
    if (width) target.style.width = `${width}px`;
    if (height) target.style.height = `${height}px`;
    if (drag.transform) target.style.transform = drag.transform;
  };

  // 调整大小结束时更新 schema
  const handleResizeEnd = ({ target }: OnResizeEnd) => {
    if (!target || !(target instanceof HTMLElement)) return;
    // 获取当前的样式值
    const currentWidth = getComputedNumberValue(target, "width");
    const currentHeight = getComputedNumberValue(target, "height");
    flushSync(() => {
      // 使用 flushSync 包装 setProp
      setProp((props: any) => {
        const wunit = extractUnit(props.customStyle.width);
        const hunit = extractUnit(props.customStyle.height);

        // 保持原有单位设置新的尺寸
        props.customStyle.width = maintainUnit(currentWidth, target, "width", wunit);

        props.customStyle.height = maintainUnit(currentHeight, target, "height", hunit);

        //props.customStyle.transform = "none";
        //target.style.transform = "none";
      });
    });
    if (moveableRef.current) {
      moveableRef.current.updateRect();
    }
  };

  // 处理旋转
  const handleRotate = ({ target, transform }: OnRotate) => {
    if (!target || !(target instanceof HTMLElement)) return;
    target.style.transform = transform;
  };

  // 旋转结束时更新 schema
  const handleRotateEnd = ({ target }: OnRotateEnd) => {
    if (!target || !(target instanceof HTMLElement)) return;
    const currentTransform = getComputedValue(target, "transform");
    flushSync(() => {
      // 使用 flushSync 包装 setProp
      setProp((props: any) => {
        props.customStyle.transform = currentTransform;
      });
    });
    if (moveableRef.current) {
      moveableRef.current.updateRect();
    }
  };

  // 存储初始字体大小和单位
  const initialFontSizeRef = useRef<{ value: number; unit: string } | null>(null);

  const handleScaleStart = ({ target }: OnScaleStart) => {
    if (!target || !(target instanceof HTMLElement) || !scalaText) return;
    const currentFontSize = getComputedStyle(target).fontSize;
    const value = parseFloat(currentFontSize);
    const unit = extractUnit(currentFontSize) || "px";
    if (!isNaN(value)) {
      initialFontSizeRef.current = { value, unit };
    }
  };

  const handleScale = ({ target, drag, scale }: OnScale) => {
    console.log(drag, "缩放");
    if (!target || !(target instanceof HTMLElement)) return;

    if (scalaText && initialFontSizeRef.current) {
      const { value: initialValue, unit } = initialFontSizeRef.current;
      const currentScale = Array.isArray(scale) ? (scale[0] + scale[1]) / 2 : 1; // 使用平均缩放值
      const newFontSize = initialValue * currentScale;
      target.style.fontSize = `${newFontSize.toFixed(4)}${unit}`;
      setProp((props: any) => {
        props.style.fontSize = Number(newFontSize.toFixed(4));
      });
    } else {
      target.style.transform = drag.transform;
    }
  };
  const handleScaleEnd = ({ target, lastEvent }: OnScaleEnd) => {
    // 使用 lastEvent 获取最终的 scale
    if (!target || !(target instanceof HTMLElement)) return;

    if (scalaText && initialFontSizeRef.current && lastEvent) {
      target.style.transform = "none";
      initialFontSizeRef.current = null; // 重置初始字体大小
    } else if (!scalaText) {
      // 非文本缩放逻辑保持不变
      const transform = getComputedValue(target, "transform");
      if (transform && transform !== "none") {
        const matrix = new DOMMatrix(transform);
        const scaleX = matrix.a;
        const scaleY = matrix.d;

        flushSync(() => {
          // 使用 flushSync 包装 setProp
          setProp((props: any) => {
            const originalWidthStr = props.customStyle.width;
            const originalHeightStr = props.customStyle.height;

            if (originalWidthStr) {
              const numericWidth = parseFloat(originalWidthStr);
              const unitW = extractUnit(originalWidthStr) || "px";
              if (!isNaN(numericWidth) && typeof scaleX === "number" && !isNaN(scaleX) && scaleX !== 0) {
                props.customStyle.width = `${(numericWidth * scaleX).toFixed(4)}${unitW}`;
              }
            }

            if (originalHeightStr) {
              const numericHeight = parseFloat(originalHeightStr);
              const unitH = extractUnit(originalHeightStr) || "px";
              if (!isNaN(numericHeight) && typeof scaleY === "number" && !isNaN(scaleY) && scaleY !== 0) {
                props.customStyle.height = `${(numericHeight * scaleY).toFixed(4)}${unitH}`;
              }
            }
            props.customStyle.transform = "none";
          });
        });
        target.style.transform = "none"; // 重置元素的内联 transform
      } else {
        flushSync(() => {
          // 使用 flushSync 包装 setProp
          setProp((props: any) => {
            props.customStyle.transform = "none";
          });
        });
      }
    }

    if (moveableRef.current) {
      moveableRef.current.updateRect();
    }
  };

  // 监听父容器尺寸变化
  useEffect(() => {
    if (!dom || !active) return;

    // 获取父元素
    const targetElement = dom instanceof HTMLElement ? dom : null;
    if (!targetElement) return;

    const parentElement = targetElement.parentElement;
    if (!parentElement) return;

    parentRef.current = parentElement;

    // 创建ResizeObserver监听父容器尺寸变化
    const observer = new ResizeObserver(() => {
      // 当父容器尺寸变化时，更新控制框
      if (moveableRef.current) {
        moveableRef.current.updateRect();
      }
    });

    const targetObserver = new MutationObserver(() => {
      // 当目标元素属性变化时，更新控制框
      if (moveableRef.current) {
        moveableRef.current.updateRect();
      }
    });

    // 开始监听父容器
    observer.observe(parentElement);
    resizeObserverRef.current = observer;

    // 开始监听目标元素
    targetObserver.observe(targetElement, {
      attributes: true
    });

    return () => {
      // 清理监听
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
      if (targetObserver) {
        targetObserver.disconnect();
      }
    };
  }, [dom, active]);

  return (
    target &&
    active &&
    !isDragging && (
      <Moveable
        ref={moveableRef}
        bounds={{ left: 0, top: 0, bottom: 0, right: 0, position: "css" }}
        flushSync={flushSync}
        target={target}
        draggable={false}
        resizable={resizable}
        rotatable={rotatable}
        origin={false}
        scalable={scalable}
        useResizeObserver={true} // 监听目标元素尺寸变化
        useMutationObserver={true} // 监听目标元素属性变化
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        onRotate={handleRotate}
        onRotateEnd={handleRotateEnd}
        onScaleStart={handleScaleStart}
        onScale={handleScale}
        onScaleEnd={handleScaleEnd}
      />
    )
  );
};
