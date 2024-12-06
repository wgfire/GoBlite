/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNode } from "@craftjs/core";
import Moveable, {
  MoveableRefTargetType,
  OnResize,
  OnRotate,
  OnResizeEnd,
  OnRotateEnd,
  OnScale,
  OnScaleEnd
} from "react-moveable";
import React, { CSSProperties, useMemo } from "react";
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
    dom: node.dom
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
    const transform = getComputedValue(target, "transform");
    setProp((props: any) => {
      // 因为拖拽的时候 实时使用px进行更新为了不每次计算% ,所以没有直接获取根据属性提取单位后缀，而是用之前的属性值来判断单位
      const wunit = extractUnit(props.customStyle.width);
      const hunit = extractUnit(props.customStyle.height);

      // 保持原有单位设置新的尺寸
      props.customStyle.width = maintainUnit(currentWidth, target, "width", wunit);

      props.customStyle.height = maintainUnit(currentHeight, target, "height", hunit);
      if (transform) {
        props.customStyle.transform = transform;
      }
    });
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
    setProp((props: any) => {
      props.customStyle.transform = currentTransform;
    });
  };
  const handleScale = ({ target, drag }: OnScale) => {
    console.log(drag, "缩放");
    if (!target || !(target instanceof HTMLElement)) return;

    target.style.transform = drag.transform;
  };
  const handleScaleEnd = ({ target }: OnScaleEnd) => {
    if (!target || !(target instanceof HTMLElement)) return;
    console.log("缩放结束", scalaText);
    if (scalaText) {
      // 从 transform matrix 中提取缩放比例
      const transform = getComputedValue(target, "transform");
      const matrix = new DOMMatrix(transform);
      const scale = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);

      // 获取当前的 font-size
      const currentFontSize = getComputedNumberValue(target, "fontSize");
      const newFontSize = currentFontSize * scale;

      setProp((props: any) => {
        // 保持原有单位
        const unit = extractUnit(props.style.fontSize || "16px");
        props.style.fontSize = `${newFontSize}${unit}`;
        // 重置 transform，因为缩放效果已经转换到 font-size 中
        props.customStyle.transform = "none";
      });
    } else {
      setProp((props: any) => {
        props.customStyle.transform = getComputedValue(target, "transform");
      });
    }
  };

  return (
    target &&
    active &&
    !isDragging && (
      <Moveable
        flushSync={flushSync}
        target={target}
        draggable={false}
        resizable={resizable}
        rotatable={rotatable}
        origin={false}
        scalable={scalable}
        throttleResize={2}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
        onRotate={handleRotate}
        onRotateEnd={handleRotateEnd}
        onScale={handleScale}
        onScaleEnd={handleScaleEnd}
      />
    )
  );
};
