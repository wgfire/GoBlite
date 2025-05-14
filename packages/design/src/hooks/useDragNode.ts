import { useEditor } from "@craftjs/core";
import { useRef } from "react";
import { HookConfig, Events } from "./type";
import { calculateRelativePosition } from "@/utils/resize";
import { parseCSSTransformMatrix } from "@/utils/transform";

interface DragState {
  mode: "translate" | "fixed";
  initialRect?: DOMRect; // mousedown 时元素的视觉矩形 (getBoundingClientRect)
  initialTransform?: {
    // mousedown 时目标元素的 transform 组件
    tx: number; // 从矩阵中提取的 translateX
    ty: number; // 从矩阵中提取的 translateY
    remainingMatrix: string; // 用于非平移部分的矩阵字符串 (缩放, 旋转, 倾斜)
  };
  // currentParentId?: string; // 当前未使用，移除
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
    target: null
  });

  const mouseDown = (e: Events["mouseDown"]) => {
    // 假设 Events["mouseDown"] 提供了 clientX, clientY
    // 以及 rect (target.getBoundingClientRect())
    const { target, rect } = e;
    if (!target) return;

    const computedStyle = window.getComputedStyle(target);
    const currentTransform = computedStyle.transform;
    const parsedTransform = parseCSSTransformMatrix(currentTransform);

    dragState.current = {
      mode: "fixed",
      target: target,
      initialRect: rect, // mousedown 时 target.getBoundingClientRect() 的结果
      // initialMousePos 不再存储于此, 假设由 mouseDrag 事件提供 mouseX, mouseY (初始鼠标位置)
      initialTransform: {
        tx: parsedTransform.x,
        ty: parsedTransform.y,
        remainingMatrix: parsedTransform.remainingMatrix
      }
    };
  };

  const switchToAbsolute = (e: Events["mouseDrag"]) => {
    // e.target 是被拖拽的元素
    // e.parent 是绝对定位的参考父元素, 在此场景下可能不是最新的父元素
    // e.x, e.y 是当前鼠标的 clientX, clientY
    // e.mouseX, e.mouseY 是 mousedown 时的初始鼠标 clientX, clientY (由事件系统传入)
    const { target, x, y, mouseX, mouseY } = e;
    const { initialRect, initialTransform } = dragState.current;

    // 确保 mousedown 时的所有必要初始状态都存在
    if (!initialRect || !initialTransform) {
      console.warn("拖拽开始时缺少必要的初始状态。");
      return;
    }

    // 获取当前的实际父元素
    const currentParent = target?.parentElement;

    // 确保当前事件数据有效，并且有实际的父元素
    if (!target || !currentParent) return;

    const parentStyles = window.getComputedStyle(currentParent);
    const parentPaddingLeft = parseFloat(parentStyles.paddingLeft) || 0;
    const parentPaddingTop = parseFloat(parentStyles.paddingTop) || 0;
    const parentRect = currentParent.getBoundingClientRect(); // 使用当前的实际父元素

    // 鼠标移动的差量
    const deltaMouseX = x - mouseX;
    const deltaMouseY = y - mouseY;

    // 计算元素未应用 transform 时的新的左上角位置
    // initialRect.left 是视觉上的 left, 它已经包含了 initialTransform.tx
    // 所以, (initialRect.left - initialTransform.tx) 是未应用 transform 时的 left
    const newUntransformedLeft = initialRect.left - initialTransform.tx + deltaMouseX;
    const newUntransformedTop = initialRect.top - initialTransform.ty + deltaMouseY;

    // 转换为相对于父元素 padding box 的位置
    const relativeX = newUntransformedLeft - parentRect.left - parentPaddingLeft;
    const relativeY = newUntransformedTop - parentRect.top - parentPaddingTop;

    setProp(target.dataset.id!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "absolute",
        // 重置网格布局属性，避免与绝对定位冲突
        justifySelf: "start",
        alignSelf: "start",
        // 设置绝对定位属性
        left: `${relativeX}px`,
        top: `${relativeY}px`,
        transform: initialTransform.remainingMatrix, // 应用原始 transform 的非平移部分
        willChange: "left, top, transform", // 添加 transform 到 willChange
        zIndex: 1000,
        maxWidth: currentParent.clientWidth - parentPaddingLeft, // 使用 currentParent
        maxHeight: currentParent.clientHeight - parentPaddingTop // 使用 currentParent
      };

      // 如果组件有网格布局相关的属性，也需要重置
      if (p.justifyContent) {
        p.justifyContent = "flex-start";
      }
      if (p.alignItems) {
        p.alignItems = "flex-start";
      }
    });
  };
  const mouseDrag = (data: Events["mouseDrag"]) => {
    const { target, parentRect, rect } = data;
    if (!parentRect || !rect || !target) return;

    //dragNode(data);
    switchToAbsolute(data);
  };

  const resetToTranslate = () => {
    const { target, initialTransform } = dragState.current; // 获取 initialTransform
    const targetId = target?.dataset.id;
    const element = target;
    if (!element || dragState.current.mode !== "fixed") return;

    const newParent = element.parentElement;
    if (!newParent) return;

    // 检查是否为App根节点
    const isAppRoot = element.dataset.id === "ROOT" || element.querySelector("[data-id='ROOT']") !== null;

    // calculateRelativePosition 用于计算相对定位时的 left/top。
    const { left: leftPx, top: topPx } = calculateRelativePosition(element, newParent, "%", false);

    // 对于App根节点，确保top值不为负数
    const adjustedTopPx = isAppRoot && parseFloat(topPx) < 0 ? "0px" : topPx;

    setProp(targetId!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "relative",
        left: `${leftPx}`, // 使用像素值
        top: `${adjustedTopPx}`, // 使用调整后的像素值
        transform: initialTransform?.remainingMatrix || "none", // 应用存储的 remainingMatrix
        zIndex: "auto"
      };

      // 保持网格布局属性为默认值，与 left/top 配合使用
      p.customStyle.justifySelf = "start";
      p.customStyle.alignSelf = "start";

      // 根据 remainingMatrix 是否为 'none' 或单位矩阵来优化 willChange
      if (
        initialTransform?.remainingMatrix &&
        initialTransform.remainingMatrix !== "none" &&
        initialTransform.remainingMatrix !== "matrix(1, 0, 0, 1, 0, 0)"
      ) {
        p.customStyle.willChange = "transform";
      } else {
        p.customStyle.willChange = "none";
      }
    });

    dragState.current = {
      mode: "translate",
      initialRect: undefined,
      initialTransform: undefined, // 清除 initialTransform
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
