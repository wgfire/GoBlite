import { Guide } from "../type";

interface SnapResult {
  guides: Guide[];
  snapPosition?: {
    x?: number;
    y?: number;
  };
}

interface SnapConfig {
  snapThreshold: number;
  showSnapIndicators: boolean;
  enableMagneticSnap: boolean;
}

export const useSmartSnap = () => {
  const defaultConfig: SnapConfig = {
    snapThreshold: 8, // 8px内自动吸附
    showSnapIndicators: true,
    enableMagneticSnap: true
  };

  /**
   * 计算智能吸附和对齐辅助线
   */
  const calculateSmartSnap = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    parentRect: DOMRect,
    config: SnapConfig = defaultConfig
  ): SnapResult => {
    const guides: Guide[] = [];
    const snapPosition: { x?: number; y?: number } = {};

    // 计算父容器的中心点
    const parentCenterX = parentRect.width / 2;
    const parentCenterY = parentRect.height / 2;

    // 计算拖拽元素的中心点
    const draggedCenterX = draggedRect.left - parentRect.left + draggedRect.width / 2;
    const draggedCenterY = draggedRect.top - parentRect.top + draggedRect.height / 2;

    // 检查与父容器中心的对齐
    if (Math.abs(draggedCenterX - parentCenterX) < config.snapThreshold) {
      guides.push({
        type: "snap-parent-center-x",
        style: {
          left: parentCenterX,
          top: 0,
          height: parentRect.height,
          borderLeft: "2px solid #10b981",
          boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
        },
        label: "水平居中"
      });

      if (config.enableMagneticSnap) {
        snapPosition.x = parentCenterX - draggedRect.width / 2;
      }
    }

    if (Math.abs(draggedCenterY - parentCenterY) < config.snapThreshold) {
      guides.push({
        type: "snap-parent-center-y",
        style: {
          left: 0,
          top: parentCenterY,
          width: parentRect.width,
          borderTop: "2px solid #10b981",
          boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
        },
        label: "垂直居中"
      });

      if (config.enableMagneticSnap) {
        snapPosition.y = parentCenterY - draggedRect.height / 2;
      }
    }

    // 检查与兄弟元素的对齐和吸附
    siblings.forEach(sibling => {
      const siblingRect = sibling.getBoundingClientRect();
      const siblingCenterX = siblingRect.left - parentRect.left + siblingRect.width / 2;
      const siblingCenterY = siblingRect.top - parentRect.top + siblingRect.height / 2;

      // 水平对齐检查
      // 左对左
      if (Math.abs(draggedRect.left - siblingRect.left) < config.snapThreshold) {
        guides.push({
          type: "snap-left-left",
          style: {
            left: draggedRect.left - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "左对齐"
        });
      }

      // 右对右
      if (Math.abs(draggedRect.right - siblingRect.right) < config.snapThreshold) {
        guides.push({
          type: "snap-right-right",
          style: {
            left: draggedRect.right - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "右对齐"
        });
      }

      // 中心对中心
      if (Math.abs(draggedCenterX - siblingCenterX) < config.snapThreshold) {
        guides.push({
          type: "snap-center-center-x",
          style: {
            left: draggedCenterX,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "水平居中对齐"
        });
      }

      // 垂直对齐检查
      // 顶对顶
      if (Math.abs(draggedRect.top - siblingRect.top) < config.snapThreshold) {
        guides.push({
          type: "snap-top-top",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.top - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "顶对齐"
        });
      }

      // 底对底
      if (Math.abs(draggedRect.bottom - siblingRect.bottom) < config.snapThreshold) {
        guides.push({
          type: "snap-bottom-bottom",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.bottom - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "底对齐"
        });
      }

      // 中心对中心
      if (Math.abs(draggedCenterY - siblingCenterY) < config.snapThreshold) {
        guides.push({
          type: "snap-center-center-y",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedCenterY,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "垂直居中对齐"
        });
      }

      // 间距对齐检查
      // 右对左（相邻元素）
      if (Math.abs(draggedRect.right - siblingRect.left) < config.snapThreshold) {
        guides.push({
          type: "snap-right-left",
          style: {
            left: draggedRect.right - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "边界对齐"
        });
      }

      // 左对右（相邻元素）
      if (Math.abs(draggedRect.left - siblingRect.right) < config.snapThreshold) {
        guides.push({
          type: "snap-left-right",
          style: {
            left: draggedRect.left - parentRect.left,
            top: Math.min(draggedRect.top, siblingRect.top) - parentRect.top,
            height: Math.max(siblingRect.bottom, draggedRect.bottom) - Math.min(siblingRect.top, draggedRect.top),
            borderLeft: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "边界对齐"
        });
      }

      // 底对顶（相邻元素）
      if (Math.abs(draggedRect.bottom - siblingRect.top) < config.snapThreshold) {
        guides.push({
          type: "snap-bottom-top",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.bottom - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "边界对齐"
        });
      }

      // 顶对底（相邻元素）
      if (Math.abs(draggedRect.top - siblingRect.bottom) < config.snapThreshold) {
        guides.push({
          type: "snap-top-bottom",
          style: {
            left: Math.min(draggedRect.left, siblingRect.left) - parentRect.left,
            top: draggedRect.top - parentRect.top,
            width: Math.max(siblingRect.right, draggedRect.right) - Math.min(siblingRect.left, draggedRect.left),
            borderTop: "2px solid #10b981",
            boxShadow: "0 0 8px rgba(16, 185, 129, 0.3)"
          },
          label: "边界对齐"
        });
      }
    });

    // 添加吸附指示器
    if (config.showSnapIndicators && guides.length > 0) {
      // 可以添加额外的视觉指示器
    }

    return {
      guides,
      snapPosition: Object.keys(snapPosition).length > 0 ? snapPosition : undefined
    };
  };

  return {
    calculateSmartSnap
  };
};
