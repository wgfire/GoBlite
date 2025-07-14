import { Guide } from "../type";

interface NearestElements {
  top: HTMLElement | null;
  bottom: HTMLElement | null;
  left: HTMLElement | null;
  right: HTMLElement | null;
}

interface SmartDistanceConfig {
  threshold: number;
  showContainerDistance: boolean;
  maxDisplayDistance: number;
}

export const useSmartDistances = () => {
  const defaultConfig: SmartDistanceConfig = {
    threshold: 100, // 100px内的元素被认为是"邻近"的
    showContainerDistance: true, // 是否显示到容器边界的距离
    maxDisplayDistance: 300 // 最大显示距离，超过此距离不显示距离线
  };

  /**
   * 查找拖拽元素周围最近的元素
   */
  const findNearestElements = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    parentRect: DOMRect,
    config: SmartDistanceConfig = defaultConfig
  ): NearestElements => {
    const result: NearestElements = {
      top: null,
      bottom: null,
      left: null,
      right: null
    };

    let minTopDistance = Infinity;
    let minBottomDistance = Infinity;
    let minLeftDistance = Infinity;
    let minRightDistance = Infinity;

    siblings.forEach(sibling => {
      const siblingRect = sibling.getBoundingClientRect();

      // 检查垂直方向的最近元素
      if (siblingRect.left < draggedRect.right && siblingRect.right > draggedRect.left) {
        // 上方元素
        if (siblingRect.bottom <= draggedRect.top) {
          const distance = draggedRect.top - siblingRect.bottom;
          if (distance < minTopDistance && distance <= config.threshold) {
            minTopDistance = distance;
            result.top = sibling;
          }
        }
        // 下方元素
        if (siblingRect.top >= draggedRect.bottom) {
          const distance = siblingRect.top - draggedRect.bottom;
          if (distance < minBottomDistance && distance <= config.threshold) {
            minBottomDistance = distance;
            result.bottom = sibling;
          }
        }
      }

      // 检查水平方向的最近元素
      if (siblingRect.top < draggedRect.bottom && siblingRect.bottom > draggedRect.top) {
        // 左侧元素
        if (siblingRect.right <= draggedRect.left) {
          const distance = draggedRect.left - siblingRect.right;
          if (distance < minLeftDistance && distance <= config.threshold) {
            minLeftDistance = distance;
            result.left = sibling;
          }
        }
        // 右侧元素
        if (siblingRect.left >= draggedRect.right) {
          const distance = siblingRect.left - draggedRect.right;
          if (distance < minRightDistance && distance <= config.threshold) {
            minRightDistance = distance;
            result.right = sibling;
          }
        }
      }
    });

    return result;
  };

  /**
   * 计算智能距离辅助线
   */
  const calculateSmartDistances = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    parentRect: DOMRect,
    parentPadding: { top: number; bottom: number; left: number; right: number },
    config: SmartDistanceConfig = defaultConfig
  ): Guide[] => {
    const guides: Guide[] = [];
    const nearestElements = findNearestElements(draggedRect, siblings, parentRect, config);

    // 垂直方向距离线
    if (nearestElements.top) {
      const topRect = nearestElements.top.getBoundingClientRect();
      const distance = Math.round(draggedRect.top - topRect.bottom);

      guides.push({
        type: "smart-vertical-top",
        style: {
          left: draggedRect.left - parentRect.left + draggedRect.width / 2,
          top: topRect.bottom - parentRect.top,
          height: distance,
          borderLeft: "1px solid #10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        },
        label: `${distance}px`
      });
    } else if (config.showContainerDistance) {
      // 显示到容器顶部的距离
      const distanceToTop = Math.round(draggedRect.top - (parentRect.top + parentPadding.top));
      if (distanceToTop > 0 && distanceToTop <= config.maxDisplayDistance) {
        guides.push({
          type: "smart-vertical-container-top",
          style: {
            left: draggedRect.left - parentRect.left + draggedRect.width / 2,
            top: parentPadding.top,
            height: distanceToTop,
            borderLeft: "1px dashed #6b7280"
          },
          label: `${distanceToTop}px 顶部`
        });
      }
    }

    if (nearestElements.bottom) {
      const bottomRect = nearestElements.bottom.getBoundingClientRect();
      const distance = Math.round(bottomRect.top - draggedRect.bottom);

      guides.push({
        type: "smart-vertical-bottom",
        style: {
          left: draggedRect.left - parentRect.left + draggedRect.width / 2,
          top: draggedRect.bottom - parentRect.top,
          height: distance,
          borderLeft: "1px solid #10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        },
        label: `${distance}px`
      });
    } else if (config.showContainerDistance) {
      // 显示到容器底部的距离
      const distanceToBottom = Math.round(parentRect.bottom - parentPadding.bottom - draggedRect.bottom);
      if (distanceToBottom > 0 && distanceToBottom <= config.maxDisplayDistance) {
        guides.push({
          type: "smart-vertical-container-bottom",
          style: {
            left: draggedRect.left - parentRect.left + draggedRect.width / 2,
            top: draggedRect.bottom - parentRect.top,
            height: distanceToBottom,
            borderLeft: "1px dashed #6b7280"
          },
          label: `${distanceToBottom}px 底部`
        });
      }
    }

    // 水平方向距离线
    if (nearestElements.left) {
      const leftRect = nearestElements.left.getBoundingClientRect();
      const distance = Math.round(draggedRect.left - leftRect.right);

      guides.push({
        type: "smart-horizontal-left",
        style: {
          left: leftRect.right - parentRect.left,
          top: draggedRect.top - parentRect.top + draggedRect.height / 2,
          width: distance,
          borderTop: "1px solid #10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        },
        label: `${distance}px`
      });
    } else if (config.showContainerDistance) {
      // 显示到容器左边的距离
      const distanceToLeft = Math.round(draggedRect.left - (parentRect.left + parentPadding.left));
      if (distanceToLeft > 0 && distanceToLeft <= config.maxDisplayDistance) {
        guides.push({
          type: "smart-horizontal-container-left",
          style: {
            left: parentPadding.left,
            top: draggedRect.top - parentRect.top + draggedRect.height / 2,
            width: distanceToLeft,
            borderTop: "1px dashed #6b7280"
          },
          label: `${distanceToLeft}px 左边`
        });
      }
    }

    if (nearestElements.right) {
      const rightRect = nearestElements.right.getBoundingClientRect();
      const distance = Math.round(rightRect.left - draggedRect.right);

      guides.push({
        type: "smart-horizontal-right",
        style: {
          left: draggedRect.right - parentRect.left,
          top: draggedRect.top - parentRect.top + draggedRect.height / 2,
          width: distance,
          borderTop: "1px solid #10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)"
        },
        label: `${distance}px`
      });
    } else if (config.showContainerDistance) {
      // 显示到容器右边的距离
      const distanceToRight = Math.round(parentRect.right - parentPadding.right - draggedRect.right);
      if (distanceToRight > 0 && distanceToRight <= config.maxDisplayDistance) {
        guides.push({
          type: "smart-horizontal-container-right",
          style: {
            left: draggedRect.right - parentRect.left,
            top: draggedRect.top - parentRect.top + draggedRect.height / 2,
            width: distanceToRight,
            borderTop: "1px dashed #6b7280"
          },
          label: `${distanceToRight}px 右边`
        });
      }
    }

    return guides;
  };

  return {
    calculateSmartDistances,
    findNearestElements
  };
};
