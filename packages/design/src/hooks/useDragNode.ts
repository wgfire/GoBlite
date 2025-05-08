import { useEditor } from "@craftjs/core";
import { useRef } from "react";
import { HookConfig, Events } from "./type";
import { calculateRelativePosition } from "@/utils/resize";

// 辅助函数：解析 CSS transform 矩阵字符串
const parseCSSTransformMatrix = (transformString: string | null): { x: number; y: number; remainingMatrix: string } => {
  if (!transformString || transformString === "none") {
    return { x: 0, y: 0, remainingMatrix: "matrix(1, 0, 0, 1, 0, 0)" }; // 返回单位矩阵
  }
  try {
    const matrix = new DOMMatrix(transformString);
    const tx = matrix.e;
    const ty = matrix.f;

    // 创建一个新的矩阵，仅包含非平移部分 (旋转, 缩放, 倾斜)
    const remaining = new DOMMatrix([matrix.a, matrix.b, matrix.c, matrix.d, 0, 0]);

    return { x: tx, y: ty, remainingMatrix: remaining.toString() };
  } catch (error) {
    console.warn("使用 DOMMatrix 解析 transform 字符串失败，尝试使用基础的正则表达式回退: ", error);
    // 针对 "matrix(...)" 格式的基础回退方案
    const matrixRegex =
      /matrix\(\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*\)/;
    const match = transformString.match(matrixRegex);
    if (match) {
      const values = match.slice(1).map(parseFloat);
      return {
        x: values[4],
        y: values[5],
        remainingMatrix: `matrix(${values[0]}, ${values[1]}, ${values[2]}, ${values[3]}, 0, 0)`
      };
    }
  }
  // 如果所有解析都失败
  return { x: 0, y: 0, remainingMatrix: "matrix(1, 0, 0, 1, 0, 0)" };
};

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
        justifySelf: "start",
        alignSelf: "start",
        left: `${relativeX}px`,
        top: `${relativeY}px`,
        transform: initialTransform.remainingMatrix, // 应用原始 transform 的非平移部分
        willChange: "left, top, transform", // 添加 transform 到 willChange
        zIndex: 1000,
        maxWidth: currentParent.clientWidth - parentPaddingLeft, // 使用 currentParent
        maxHeight: currentParent.clientHeight - parentPaddingTop // 使用 currentParent
      };
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

    // calculateRelativePosition 用于计算相对定位时的 left/top。
    // 注意：如果此函数内部使用 getBoundingClientRect，则元素的当前 transform (remainingMatrix)
    // 可能会影响其计算结果。理想情况下，calculateRelativePosition 应能处理这种情况，
    // 或者在调用前临时移除 transform。
    const { left: leftPx, top: topPx } = calculateRelativePosition(element, newParent, "px", false);

    setProp(targetId!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "relative",
        left: `${leftPx}px`, // 使用像素值
        top: `${topPx}px`, // 使用像素值
        transform: initialTransform?.remainingMatrix || "none", // 应用存储的 remainingMatrix
        zIndex: "auto"
      };
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

    // 更新 setProp 之后，下面的 setProp 调用需要调整或者移除，因为它会覆盖上面的修改
    // 此处假设上面的 setProp 已经包含了所有需要的修改，因此注释掉重复的 setProp
    /* setProp(targetId!, p => {
      p.customStyle = {
        ...p.customStyle,
        position: "relative",
        left: leftPercent, // 这里仍然是 leftPercent，需要改为 leftPx
        top: topPercent,   // 这里仍然是 topPercent，需要改为 topPx
        transform: initialTransform?.remainingMatrix || "none", // 应用存储的 remainingMatrix
        zIndex: "auto"
      };
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
    }); */

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
