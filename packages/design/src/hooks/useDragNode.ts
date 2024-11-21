import { useEditor } from "@craftjs/core";
import { useRef } from "react";
import { HookConfig, Events } from "./type";
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
    const style = window.getComputedStyle(e.target!);
    const leftValue = parseFloat(style.left) || 0;
    const topValue = parseFloat(style.top) || 0;
    dragState.current = {
      mode: "fixed",
      target: e.target,
      initialRect: e.rect,
      initialTransform: {
        x: leftValue,
        y: topValue
      }
    };
  };

  const switchToFixed = (e: Events["mouseDrag"]) => {
    const { target, rect, x, y, mouseX, mouseY } = e;
    if (!target || !rect) return;

    const initx = rect.left; // dragState.current.initialTransform?.x!
    const inity = rect.top; //dragState.current.initialTransform?.y!

    const deltaX = x - mouseX;
    const deltaY = y - mouseY;

    setProp(target.dataset.id!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "fixed",
        justifySelf: "start",
        alignSelf: "start",
        left: `${initx + deltaX}px`,
        top: `${inity + deltaY}px`,
        willChange: "left, top",
        zIndex: 1000
      };
    });
  };

  const mouseDrag = (data: Events["mouseDrag"]) => {
    const { target, parentRect, rect, matrix } = data;
    if (!parentRect || !rect || !target || !matrix) return;

    //dragNode(data);
    switchToFixed(data);
  };

  const resetToTranslate = () => {
    const { target } = dragState.current;
    const targetId = target?.dataset.id;
    const element = target;
    if (!element || dragState.current.mode !== "fixed") return;

    const currentRect = element.getBoundingClientRect();
    const newParent = element.parentElement;
    console.log(newParent, "newParent");
    if (!newParent) return;

    const parentRect = newParent.getBoundingClientRect();
    const parentStyles = window.getComputedStyle(newParent);

    // 3. 计算相对位置（相对于父元素内容区域）
    const parentPaddingLeft = parseFloat(parentStyles.paddingLeft) || 0;
    const parentPaddingTop = parseFloat(parentStyles.paddingTop) || 0;

    // 计算元素相对于父元素的位置（考虑父元素padding）
    const relativeLeft = currentRect.left - parentRect.left - parentPaddingLeft;
    const relativeTop = currentRect.top - parentRect.top - parentPaddingTop;

    // 计算内容区域尺寸
    const contentWidth = parentRect.width - parentPaddingLeft - parseFloat(parentStyles.paddingRight);
    const contentHeight = parentRect.height - parentPaddingTop - parseFloat(parentStyles.paddingTop);

    // 计算百分比
    const leftPercent = `${Number(((relativeLeft / contentWidth) * 100).toFixed(2))}%`;
    const topPercent = `${Number(((relativeTop / contentHeight) * 100).toFixed(2))}%`;
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
        //  transform: `translate(${relativeLeft}px, ${relativeTop}px)`,
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
