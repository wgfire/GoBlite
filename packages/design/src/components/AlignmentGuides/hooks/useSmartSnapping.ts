import { useRef } from "react";

interface SnapTarget {
  type: string;
  position: {
    x?: number;
    y?: number;
  };
  threshold: number;
}

export const useSmartSnapping = () => {
  const snapTargets = useRef<SnapTarget[]>([]);
  const isSnapping = useRef(false);

  /**
   * 更新吸附目标
   */
  const updateSnapTargets = (targets: SnapTarget[]) => {
    snapTargets.current = targets;
  };

  /**
   * 检查是否应该吸附
   */
  const checkSnapPosition = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    parentRect: DOMRect
  ): { shouldSnap: boolean; snapTo?: { x?: number; y?: number }; snapType?: string } => {
    const snapThreshold = 8; // 8px吸附阈值
    const draggedCenterX = draggedRect.left - parentRect.left + draggedRect.width / 2;
    const draggedCenterY = draggedRect.top - parentRect.top + draggedRect.height / 2;
    const draggedLeft = draggedRect.left - parentRect.left;
    const draggedTop = draggedRect.top - parentRect.top;
    const draggedRight = draggedRect.right - parentRect.left;
    const draggedBottom = draggedRect.bottom - parentRect.top;

    // 检查与父容器中心的吸附
    const parentCenterX = parentRect.width / 2;
    const parentCenterY = parentRect.height / 2;

    if (Math.abs(draggedCenterX - parentCenterX) < snapThreshold) {
      return {
        shouldSnap: true,
        snapTo: { x: parentCenterX - draggedRect.width / 2 },
        snapType: "parent-center-x"
      };
    }

    if (Math.abs(draggedCenterY - parentCenterY) < snapThreshold) {
      return {
        shouldSnap: true,
        snapTo: { y: parentCenterY - draggedRect.height / 2 },
        snapType: "parent-center-y"
      };
    }

    // 检查与兄弟元素的吸附
    for (const sibling of siblings) {
      const siblingRect = sibling.getBoundingClientRect();
      const siblingLeft = siblingRect.left - parentRect.left;
      const siblingTop = siblingRect.top - parentRect.top;
      const siblingRight = siblingRect.right - parentRect.left;
      const siblingBottom = siblingRect.bottom - parentRect.top;
      const siblingCenterX = siblingLeft + siblingRect.width / 2;
      const siblingCenterY = siblingTop + siblingRect.height / 2;

      // 左对左
      if (Math.abs(draggedLeft - siblingLeft) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { x: siblingLeft },
          snapType: "left-left"
        };
      }

      // 右对右
      if (Math.abs(draggedRight - siblingRight) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { x: siblingRight - draggedRect.width },
          snapType: "right-right"
        };
      }

      // 顶对顶
      if (Math.abs(draggedTop - siblingTop) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { y: siblingTop },
          snapType: "top-top"
        };
      }

      // 底对底
      if (Math.abs(draggedBottom - siblingBottom) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { y: siblingBottom - draggedRect.height },
          snapType: "bottom-bottom"
        };
      }

      // 中心对中心
      if (Math.abs(draggedCenterX - siblingCenterX) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { x: siblingCenterX - draggedRect.width / 2 },
          snapType: "center-center-x"
        };
      }

      if (Math.abs(draggedCenterY - siblingCenterY) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { y: siblingCenterY - draggedRect.height / 2 },
          snapType: "center-center-y"
        };
      }

      // 边界吸附
      // 右对左
      if (Math.abs(draggedRight - siblingLeft) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { x: siblingLeft - draggedRect.width },
          snapType: "right-left"
        };
      }

      // 左对右
      if (Math.abs(draggedLeft - siblingRight) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { x: siblingRight },
          snapType: "left-right"
        };
      }

      // 底对顶
      if (Math.abs(draggedBottom - siblingTop) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { y: siblingTop - draggedRect.height },
          snapType: "bottom-top"
        };
      }

      // 顶对底
      if (Math.abs(draggedTop - siblingBottom) < snapThreshold) {
        return {
          shouldSnap: true,
          snapTo: { y: siblingBottom },
          snapType: "top-bottom"
        };
      }
    }

    return { shouldSnap: false };
  };

  /**
   * 应用吸附位置
   */
  const applySnapPosition = (element: HTMLElement, snapTo: { x?: number; y?: number }, parentRect: DOMRect) => {
    if (!element) return;

    isSnapping.current = true;

    // 使用 transform 来实现平滑的吸附动画
    const currentTransform = element.style.transform || "";
    let newTransform = currentTransform;

    if (snapTo.x !== undefined) {
      const targetX = snapTo.x + parentRect.left;
      newTransform = newTransform.replace(/translateX\([^)]*\)/, "") + ` translateX(${targetX}px)`;
    }

    if (snapTo.y !== undefined) {
      const targetY = snapTo.y + parentRect.top;
      newTransform = newTransform.replace(/translateY\([^)]*\)/, "") + ` translateY(${targetY}px)`;
    }

    element.style.transform = newTransform.trim();
    element.style.transition = "transform 0.2s ease-out";

    // 清除吸附状态
    setTimeout(() => {
      isSnapping.current = false;
      if (element.style.transition) {
        element.style.transition = "";
      }
    }, 200);
  };

  /**
   * 获取当前吸附状态
   */
  const getSnapStatus = () => ({
    isSnapping: isSnapping.current,
    targets: [...snapTargets.current]
  });

  /**
   * 重置吸附状态
   */
  const resetSnap = () => {
    isSnapping.current = false;
    snapTargets.current = [];
  };

  return {
    updateSnapTargets,
    checkSnapPosition,
    applySnapPosition,
    getSnapStatus,
    resetSnap
  };
};
