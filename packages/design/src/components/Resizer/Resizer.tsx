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
import React, { CSSProperties, useMemo, useRef } from "react"; // 引入 useState 和 useRef
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
    console.log(drag, "resize");
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
        // 因为拖拽的时候 实时使用px进行更新为了不每次计算% ,所以没有直接获取根据属性提取单位后缀，而是用之前的属性值来判断单位
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

    target.style.transform = drag.transform;

    if (scalaText && initialFontSizeRef.current) {
      const { value: initialValue, unit } = initialFontSizeRef.current;
      // Moveable 的 scale 是一个数组 [scaleX, scaleY]，通常文本缩放我们关心平均缩放或特定方向
      // 这里我们简单取 scale[0] 作为缩放因子，或者根据需求调整
      const currentScale = Array.isArray(scale) ? (scale[0] + scale[1]) / 2 : 1; // 使用平均缩放值
      const newFontSize = initialValue * currentScale;
      target.style.fontSize = `${newFontSize.toFixed(4)}${unit}`;
    }
  };
  const handleScaleEnd = ({ target, lastEvent }: OnScaleEnd) => {
    // 使用 lastEvent 获取最终的 scale
    if (!target || !(target instanceof HTMLElement)) return;

    if (scalaText && initialFontSizeRef.current && lastEvent) {
      const { value: initialValue, unit } = initialFontSizeRef.current;
      const finalScale = Array.isArray(lastEvent.scale) ? (lastEvent.scale[0] + lastEvent.scale[1]) / 2 : 1; // 使用平均缩放值
      const newNumericFontSize = initialValue * finalScale;

      flushSync(() => {
        // 使用 flushSync 包装 setProp
        setProp((props: any) => {
          props.style.fontSize = `${Number(newNumericFontSize.toFixed(4))}${unit}`;
          // 缩放文本时，通常不希望改变元素的 transform，因为字体大小已经调整
          // 如果需要保持 transform（例如，如果缩放也应用于元素本身而不仅仅是文本），则需要不同的逻辑
          props.customStyle.transform = "none"; // 重置 transform
        });
      });
      // 重置元素的内联 transform，因为属性已更新
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

  return (
    target &&
    active &&
    !isDragging && (
      <Moveable
        ref={moveableRef}
        flushSync={flushSync}
        target={target}
        draggable={false}
        resizable={resizable}
        rotatable={rotatable}
        origin={false}
        scalable={scalable}
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
