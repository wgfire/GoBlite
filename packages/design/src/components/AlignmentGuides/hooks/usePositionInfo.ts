import { Guide } from "../type";

interface PositionInfo {
  distance: number;
  direction: "top" | "bottom" | "left" | "right";
  targetElement?: HTMLElement;
  relativePosition: "container" | "element";
}

interface SmartContext {
  hasNearbyElements: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  };
  containerMargins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  elementDensity: "sparse" | "medium" | "dense";
}

export const usePositionInfo = () => {
  /**
   * 分析拖拽元素周围的环境上下文
   */
  const analyzeContext = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    parentRect: DOMRect,
    parentPadding: { top: number; bottom: number; left: number; right: number }
  ): SmartContext => {
    const proximityThreshold = 80; // 80px内被认为是"附近"
    const hasNearbyElements = {
      top: false,
      bottom: false,
      left: false,
      right: false
    };

    // 检查各个方向是否有邻近元素
    siblings.forEach(sibling => {
      const siblingRect = sibling.getBoundingClientRect();

      // 检查垂直方向
      if (
        siblingRect.left < draggedRect.right + proximityThreshold &&
        siblingRect.right > draggedRect.left - proximityThreshold
      ) {
        if (siblingRect.bottom <= draggedRect.top && draggedRect.top - siblingRect.bottom <= proximityThreshold) {
          hasNearbyElements.top = true;
        }
        if (siblingRect.top >= draggedRect.bottom && siblingRect.top - draggedRect.bottom <= proximityThreshold) {
          hasNearbyElements.bottom = true;
        }
      }

      // 检查水平方向
      if (
        siblingRect.top < draggedRect.bottom + proximityThreshold &&
        siblingRect.bottom > draggedRect.top - proximityThreshold
      ) {
        if (siblingRect.right <= draggedRect.left && draggedRect.left - siblingRect.right <= proximityThreshold) {
          hasNearbyElements.left = true;
        }
        if (siblingRect.left >= draggedRect.right && siblingRect.left - draggedRect.right <= proximityThreshold) {
          hasNearbyElements.right = true;
        }
      }
    });

    // 计算到容器边界的距离
    const containerMargins = {
      top: draggedRect.top - (parentRect.top + parentPadding.top),
      bottom: parentRect.bottom - parentPadding.bottom - draggedRect.bottom,
      left: draggedRect.left - (parentRect.left + parentPadding.left),
      right: parentRect.right - parentPadding.right - draggedRect.right
    };

    // 评估元素密度
    const containerArea = parentRect.width * parentRect.height;
    const elementCount = siblings.length + 1; // +1 for dragged element
    const density = elementCount / (containerArea / 10000); // elements per 100x100 area

    let elementDensity: "sparse" | "medium" | "dense";
    if (density < 2) elementDensity = "sparse";
    else if (density < 5) elementDensity = "medium";
    else elementDensity = "dense";

    return {
      hasNearbyElements,
      containerMargins,
      elementDensity
    };
  };

  /**
   * 智能选择要显示的位置信息
   */
  const getSmartPositionInfo = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    parentRect: DOMRect,
    parentPadding: { top: number; bottom: number; left: number; right: number }
  ): PositionInfo[] => {
    const context = analyzeContext(draggedRect, siblings, parentRect, parentPadding);
    const positionInfo: PositionInfo[] = [];

    // 智能决策：根据上下文选择最有用的位置信息

    // 垂直方向
    if (context.hasNearbyElements.top) {
      // 有上方元素，显示到最近上方元素的距离
      const nearestTop = findNearestElementInDirection(draggedRect, siblings, "top");
      if (nearestTop) {
        const topRect = nearestTop.getBoundingClientRect();
        positionInfo.push({
          distance: Math.round(draggedRect.top - topRect.bottom),
          direction: "top",
          targetElement: nearestTop,
          relativePosition: "element"
        });
      }
    } else {
      // 没有上方元素，显示到容器顶部的距离
      if (context.containerMargins.top > 0) {
        positionInfo.push({
          distance: Math.round(context.containerMargins.top),
          direction: "top",
          relativePosition: "container"
        });
      }
    }

    if (context.hasNearbyElements.bottom) {
      // 有下方元素，显示到最近下方元素的距离
      const nearestBottom = findNearestElementInDirection(draggedRect, siblings, "bottom");
      if (nearestBottom) {
        const bottomRect = nearestBottom.getBoundingClientRect();
        positionInfo.push({
          distance: Math.round(bottomRect.top - draggedRect.bottom),
          direction: "bottom",
          targetElement: nearestBottom,
          relativePosition: "element"
        });
      }
    } else {
      // 没有下方元素，显示到容器底部的距离
      if (context.containerMargins.bottom > 0) {
        positionInfo.push({
          distance: Math.round(context.containerMargins.bottom),
          direction: "bottom",
          relativePosition: "container"
        });
      }
    }

    // 水平方向
    if (context.hasNearbyElements.left) {
      // 有左侧元素，显示到最近左侧元素的距离
      const nearestLeft = findNearestElementInDirection(draggedRect, siblings, "left");
      if (nearestLeft) {
        const leftRect = nearestLeft.getBoundingClientRect();
        positionInfo.push({
          distance: Math.round(draggedRect.left - leftRect.right),
          direction: "left",
          targetElement: nearestLeft,
          relativePosition: "element"
        });
      }
    } else {
      // 没有左侧元素，显示到容器左边的距离
      if (context.containerMargins.left > 0) {
        positionInfo.push({
          distance: Math.round(context.containerMargins.left),
          direction: "left",
          relativePosition: "container"
        });
      }
    }

    if (context.hasNearbyElements.right) {
      // 有右侧元素，显示到最近右侧元素的距离
      const nearestRight = findNearestElementInDirection(draggedRect, siblings, "right");
      if (nearestRight) {
        const rightRect = nearestRight.getBoundingClientRect();
        positionInfo.push({
          distance: Math.round(rightRect.left - draggedRect.right),
          direction: "right",
          targetElement: nearestRight,
          relativePosition: "element"
        });
      }
    } else {
      // 没有右侧元素，显示到容器右边的距离
      if (context.containerMargins.right > 0) {
        positionInfo.push({
          distance: Math.round(context.containerMargins.right),
          direction: "right",
          relativePosition: "container"
        });
      }
    }

    // 根据元素密度调整显示策略
    if (context.elementDensity === "dense") {
      // 密集布局：只显示最重要的2个位置信息
      return positionInfo
        .sort((a, b) => {
          // 优先显示到元素的距离，其次是较小的距离
          if (a.relativePosition === "element" && b.relativePosition === "container") return -1;
          if (a.relativePosition === "container" && b.relativePosition === "element") return 1;
          return a.distance - b.distance;
        })
        .slice(0, 2);
    }

    return positionInfo;
  };

  /**
   * 查找指定方向上最近的元素
   */
  const findNearestElementInDirection = (
    draggedRect: DOMRect,
    siblings: HTMLElement[],
    direction: "top" | "bottom" | "left" | "right"
  ): HTMLElement | null => {
    let nearest: HTMLElement | null = null;
    let minDistance = Infinity;

    siblings.forEach(sibling => {
      const siblingRect = sibling.getBoundingClientRect();
      let distance: number;
      let isInDirection = false;

      switch (direction) {
        case "top":
          isInDirection =
            siblingRect.bottom <= draggedRect.top &&
            siblingRect.left < draggedRect.right &&
            siblingRect.right > draggedRect.left;
          distance = draggedRect.top - siblingRect.bottom;
          break;
        case "bottom":
          isInDirection =
            siblingRect.top >= draggedRect.bottom &&
            siblingRect.left < draggedRect.right &&
            siblingRect.right > draggedRect.left;
          distance = siblingRect.top - draggedRect.bottom;
          break;
        case "left":
          isInDirection =
            siblingRect.right <= draggedRect.left &&
            siblingRect.top < draggedRect.bottom &&
            siblingRect.bottom > draggedRect.top;
          distance = draggedRect.left - siblingRect.right;
          break;
        case "right":
          isInDirection =
            siblingRect.left >= draggedRect.right &&
            siblingRect.top < draggedRect.bottom &&
            siblingRect.bottom > draggedRect.top;
          distance = siblingRect.left - draggedRect.right;
          break;
      }

      if (isInDirection && distance < minDistance) {
        minDistance = distance;
        nearest = sibling;
      }
    });

    return nearest;
  };

  /**
   * 将位置信息转换为辅助线
   */
  const convertPositionInfoToGuides = (
    positionInfo: PositionInfo[],
    draggedRect: DOMRect,
    parentRect: DOMRect
  ): Guide[] => {
    return positionInfo.map(info => {
      const isElement = info.relativePosition === "element";
      const color = isElement ? "#10b981" : "#6b7280";
      const style = isElement ? "solid" : "dashed";

      let guideStyle: React.CSSProperties;
      let label: string;

      switch (info.direction) {
        case "top":
          guideStyle = {
            left: draggedRect.left - parentRect.left + draggedRect.width / 2,
            top: draggedRect.top - parentRect.top - info.distance,
            height: info.distance,
            borderLeft: `1px ${style} ${color}`,
            backgroundColor: isElement ? "rgba(16, 185, 129, 0.1)" : undefined
          };
          label = isElement ? `${info.distance}px` : `${info.distance}px`;
          break;
        case "bottom":
          guideStyle = {
            left: draggedRect.left - parentRect.left + draggedRect.width / 2,
            top: draggedRect.bottom - parentRect.top,
            height: info.distance,
            borderLeft: `1px ${style} ${color}`,
            backgroundColor: isElement ? "rgba(16, 185, 129, 0.1)" : undefined
          };
          label = isElement ? `${info.distance}px` : `${info.distance}px`;
          break;
        case "left":
          guideStyle = {
            left: draggedRect.left - parentRect.left - info.distance,
            top: draggedRect.top - parentRect.top + draggedRect.height / 2,
            width: info.distance,
            borderTop: `1px ${style} ${color}`,
            backgroundColor: isElement ? "rgba(16, 185, 129, 0.1)" : undefined
          };
          label = isElement ? `${info.distance}px` : `${info.distance}px`;
          break;
        case "right":
          guideStyle = {
            left: draggedRect.right - parentRect.left,
            top: draggedRect.top - parentRect.top + draggedRect.height / 2,
            width: info.distance,
            borderTop: `1px ${style} ${color}`,
            backgroundColor: isElement ? "rgba(16, 185, 129, 0.1)" : undefined
          };
          label = isElement ? `${info.distance}px` : `${info.distance}px`;
          break;
      }

      return {
        type: `smart-${info.direction}-${info.relativePosition}`,
        style: guideStyle,
        label
      };
    });
  };

  return {
    analyzeContext,
    getSmartPositionInfo,
    convertPositionInfoToGuides,
    findNearestElementInDirection
  };
};
