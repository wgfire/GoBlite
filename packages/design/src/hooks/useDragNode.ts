import { Events } from "@/utils/eventBus";
import { useEditor } from "@craftjs/core";
import { useRef } from "react";
import { HookConfig } from "./type";

interface Position {
  x: number;
  y: number;
}

export const useDragNode = (): HookConfig => {
  const {
    query,
    actions: { setProp }
  } = useEditor();

  // 存储拖拽开始时的初始位置
  const initialPosition = useRef<Position | null>(null);

  const dragNode = (data: Events["mouseDrag"]) => {
    const { x, y, mouseX, mouseY, target, parentRect, rect, matrix } = data;
    if (!parentRect || !rect || !target || !matrix) return;
    console.log(parentRect, "parentRect");

    // TODO: 这里适合用left right 设置偏移
    // initialPosition.current = {
    //   x: rect.left - parentRect.left,
    //   y: rect.top - parentRect.top
    // };

    initialPosition.current = {
      x: matrix.e,
      y: matrix.f
    };

    // 计算位移
    const deltaX = x - mouseX;
    const deltaY = y - mouseY;

    // 计算新位置（相对于父容器）
    const newX = initialPosition.current.x + deltaX;
    const newY = initialPosition.current.y + deltaY;

    // 转换为百分比 得使用left right 设置偏移
    // const xPercent = (newX / parentRect.width) * 100;
    // const yPercent = (newY / parentRect.height) * 100;

    const node = query.getNodes()[target!.dataset!.id!];
    setProp(node.id, p => {
      p.customStyle = {
        ...p.customStyle,
        transform: `translate(${newX}px, ${newY}px)`,
        transition: "transform 0.05s cubic-bezier(0.17, 0.67, 0.83, 0.67)" // 添加平滑过渡
      };
    });
  };

  // 重置初始位置
  const resetPosition = () => {
    initialPosition.current = null;
    console.log("鼠标松开");
  };

  return {
    id: "dragNode",
    handlers: {
      mouseDrag: dragNode,
      mouseUp: resetPosition
    }
  };
};
