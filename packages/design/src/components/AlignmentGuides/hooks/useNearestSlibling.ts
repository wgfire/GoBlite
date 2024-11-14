import { useRef } from "react";
import { Guide } from "../type";

export const useNearestSibling = () => {
  const siblingsRectCache = useRef<Map<HTMLElement, DOMRect>>(new Map());

  const updateSiblingsCache = (siblings: HTMLElement[]) => {
    siblings.forEach(sibling => {
      if (!siblingsRectCache.current.has(sibling)) {
        siblingsRectCache.current.set(sibling, sibling.getBoundingClientRect());
      }
    });
  };

  const findNearestSibling = (draggedRect: DOMRect, siblings: HTMLElement[], parentRect: DOMRect): Guide[] => {
    const alignmentGuides: Guide[] = [];
    const threshold = 5;

    // 计算父容器的中心点
    const parentCenterX = parentRect.width / 2;
    const parentCenterY = parentRect.height / 2;

    // 计算拖拽元素的中心点
    const draggedCenterX = draggedRect.left - parentRect.left + draggedRect.width / 2;
    const draggedCenterY = draggedRect.top - parentRect.top + draggedRect.height / 2;

    // 检查水平居中
    if (Math.abs(draggedCenterX - parentCenterX) < threshold) {
      alignmentGuides.push({
        type: "parent-center-x",
        style: {
          left: parentCenterX,
          top: 0,
          height: parentRect.height,
          borderLeft: "1px dashed #ff4d4f"
        },
        label: "水平居中"
      });
    }

    // 检查垂直居中
    if (Math.abs(draggedCenterY - parentCenterY) < threshold) {
      alignmentGuides.push({
        type: "parent-center-y",
        style: {
          left: 0,
          top: parentCenterY,
          width: parentRect.width,
          borderTop: "1px dashed #ff4d4f"
        },
        label: "垂直居中"
      });
    }

    siblings.forEach(sibling => {
      const siblingRect = siblingsRectCache.current.get(sibling)!;

      // 水平对齐检查（左对左、左对右、右对左、右对右）
      if (Math.abs(draggedRect.left - siblingRect.left) < threshold) {
        alignmentGuides.push({
          type: "left-left",
          style: {
            left: draggedRect.left - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "1px dashed #1890ff"
          },
          label: "左对齐"
        });
      }
      if (Math.abs(draggedRect.right - siblingRect.right) < threshold) {
        alignmentGuides.push({
          type: "right-right",
          style: {
            left: draggedRect.right - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "1px dashed #1890ff"
          },
          label: "右对齐"
        });
      }

      // 垂直对齐检查（顶对顶、顶对底、底对顶、底对底）
      if (Math.abs(draggedRect.top - siblingRect.top) < threshold) {
        alignmentGuides.push({
          type: "top-top",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.top - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "1px dashed #1890ff"
          },
          label: "顶对齐"
        });
      }
      if (Math.abs(draggedRect.bottom - siblingRect.bottom) < threshold) {
        alignmentGuides.push({
          type: "bottom-bottom",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.bottom - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "1px dashed #1890ff"
          },
          label: "底对齐"
        });
      }
      if (Math.abs(draggedRect.bottom - siblingRect.top) < threshold) {
        alignmentGuides.push({
          type: "bottom-top",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.bottom - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "1px dashed #1890ff"
          },
          label: "底对顶"
        });
      }

      // 顶对底
      if (Math.abs(draggedRect.top - siblingRect.bottom) < threshold) {
        alignmentGuides.push({
          type: "top-bottom",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.top - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "1px dashed #1890ff"
          },
          label: "顶对底"
        });
      }
      // 右对左
      if (Math.abs(draggedRect.right - siblingRect.left) < threshold) {
        alignmentGuides.push({
          type: "right-left",
          style: {
            left: draggedRect.right - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "1px dashed #1890ff"
          },
          label: "右对左"
        });
      }

      // 左对右
      if (Math.abs(draggedRect.left - siblingRect.right) < threshold) {
        alignmentGuides.push({
          type: "left-right",
          style: {
            left: draggedRect.left - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "1px dashed #1890ff"
          },
          label: "左对右"
        });
      }
      // 左对中
      if (Math.abs(draggedRect.left - (siblingRect.left + siblingRect.width / 2)) < threshold) {
        alignmentGuides.push({
          type: "left-center",
          style: {
            left: draggedRect.left - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "1px dashed #1890ff"
          },
          label: "左对中"
        });
      }

      // 右对中
      if (Math.abs(draggedRect.right - (siblingRect.left + siblingRect.width / 2)) < threshold) {
        alignmentGuides.push({
          type: "right-center",
          style: {
            left: draggedRect.right - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "1px dashed #1890ff"
          },
          label: "右对中"
        });
      }
      // 顶对中
      if (Math.abs(draggedRect.top - (siblingRect.top + siblingRect.height / 2)) < threshold) {
        alignmentGuides.push({
          type: "top-center",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.top - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "1px dashed #1890ff"
          },
          label: "顶对中"
        });
      }

      // 底对中
      if (Math.abs(draggedRect.bottom - (siblingRect.top + siblingRect.height / 2)) < threshold) {
        alignmentGuides.push({
          type: "bottom-center",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.bottom - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "1px dashed #1890ff"
          },
          label: "底对中"
        });
      }
    });

    return alignmentGuides;
  };

  const clearCache = () => {
    siblingsRectCache.current.clear();
  };

  return {
    updateSiblingsCache,
    findNearestSibling,
    clearCache
  };
};
