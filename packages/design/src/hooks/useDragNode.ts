import { useEditor } from "@craftjs/core";
import { useRef } from "react";
import { HookConfig, Events } from "./type";
import { calculateRelativePosition } from "@/utils/resize";
interface DragState {
  mode: "translate" | "fixed";
  initialRect?: DOMRect;
  initialTransform?: { x: number; y: number };
  currentParentId?: string;
  target: HTMLElement | null;
}

export const useDragNode = (): HookConfig => {
  const {
    actions: { setProp }
  } = useEditor();
  const dragState = useRef<DragState>({
    mode: "translate",
    initialRect: undefined,
    initialTransform: undefined,
    currentParentId: undefined,
    target: null
  });

  const mouseDown = (e: Events["mouseDown"]) => {
    dragState.current = {
      mode: "fixed",
      target: e.target,
      initialRect: e.rect
    };
  };

  const switchToAbsolute = (e: Events["mouseDrag"]) => {
    const { target, rect, x, y, mouseX, mouseY, parent } = e;
    if (!target || !rect || !parent) return;
    const currentParent = target.parentElement;
    const parentStyles = window.getComputedStyle(parent!);
    const parentPaddingLeft = parseFloat(parentStyles.paddingLeft) || 0;
    const parentPaddingTop = parseFloat(parentStyles.paddingTop) || 0;
    const parentRect = currentParent?.getBoundingClientRect();
    if (!currentParent || !parentRect) return;

    // 计算鼠标移动的总偏移量
    const deltaX = x - mouseX;
    const deltaY = y - mouseY;

    const relativeX = rect.left - parentRect.left + deltaX;
    const relativeY = rect.top - parentRect.top + deltaY;

    setProp(target.dataset.id!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "absolute",
        justifySelf: "start",
        alignSelf: "start",
        left: `${relativeX}px`,
        top: `${relativeY}px`,
        willChange: "left, top",
        zIndex: 1000,
        maxWidth: parent.clientWidth - parentPaddingLeft,
        maxHeight: parent.clientHeight - parentPaddingTop
      };
    });
  };
  const mouseDrag = (data: Events["mouseDrag"]) => {
    const { target, parentRect, rect, matrix } = data;
    if (!parentRect || !rect || !target || !matrix) return;

    //dragNode(data);
    switchToAbsolute(data);
  };

  const resetToTranslate = () => {
    const { target } = dragState.current;
    const targetId = target?.dataset.id;
    const element = target;
    if (!element || dragState.current.mode !== "fixed") return;

    const newParent = element.parentElement;
    if (!newParent) return;

    // 计算百分比
    const { left: leftPercent, top: topPercent } = calculateRelativePosition(element, newParent, "px");
    // 使用px
    // const leftPx = `${relativeLeft}px`;
    // const topPx = `${relativeTop}px`;

    setProp(targetId!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "relative",
        left: leftPercent,
        top: topPercent,
        willChange: "none",
        zIndex: "auto"
      };
    });

    dragState.current = {
      mode: "translate",
      initialRect: undefined,
      initialTransform: undefined,
      currentParentId: undefined,
      target: null
    };
  };

  return {
    id: "dragNode",
    handlers: {
      mouseDown: mouseDown,
      mouseDrag: mouseDrag,
      mouseUp: resetToTranslate
    }
  };
};
