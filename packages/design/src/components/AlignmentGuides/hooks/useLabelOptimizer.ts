import { Guide } from "../type";

interface LabelPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  guideIndex: number;
}

export const useLabelOptimizer = () => {
  /**
   * 检测标签冲突并优化位置
   */
  const optimizeLabelPositions = (guides: Guide[], draggedRect: DOMRect, parentRect: DOMRect): Guide[] => {
    if (guides.length <= 1) return guides;

    const optimizedGuides = [...guides];
    const labelPositions: LabelPosition[] = [];

    // 计算每个标签的预期位置
    guides.forEach((guide, index) => {
      const labelRect = calculateLabelPosition(guide, draggedRect, parentRect);
      if (labelRect) {
        labelPositions.push({
          ...labelRect,
          guideIndex: index
        });
      }
    });

    // 检测冲突并调整位置
    for (let i = 0; i < labelPositions.length; i++) {
      const currentLabel = labelPositions[i];
      let hasConflict = false;

      // 检查与拖拽元素的冲突
      if (isOverlappingWithElement(currentLabel, draggedRect, parentRect)) {
        hasConflict = true;
      }

      // 检查与其他标签的冲突
      for (let j = 0; j < i; j++) {
        if (isOverlapping(currentLabel, labelPositions[j])) {
          hasConflict = true;
          break;
        }
      }

      if (hasConflict) {
        // 调整位置
        const adjustedGuide = adjustLabelPosition(optimizedGuides[currentLabel.guideIndex], draggedRect, parentRect);
        optimizedGuides[currentLabel.guideIndex] = adjustedGuide;
      }
    }

    return optimizedGuides;
  };

  /**
   * 计算标签的实际位置
   */
  const calculateLabelPosition = (guide: Guide, _draggedRect: DOMRect, _parentRect: DOMRect) => {
    if (!guide.label) return null;

    // 估算标签尺寸 (11px字体，约6px/字符)
    const labelWidth = guide.label.length * 6 + 12; // +12 for padding
    const labelHeight = 20;

    let x = 0,
      y = 0;

    // 根据辅助线类型和样式计算标签位置
    const style = guide.style;
    const left = style.left || 0;
    const top = style.top || 0;
    const width = style.width || 1;
    const height = style.height || 1;

    // 垂直线 - 标签在线的中点
    if (guide.type.includes("vertical") || style.borderLeft) {
      x = left - labelWidth / 2;
      y = top + height / 2 - labelHeight / 2;
    }
    // 水平线 - 标签在线的中点
    else if (guide.type.includes("horizontal") || style.borderTop) {
      x = left + width / 2 - labelWidth / 2;
      y = top - labelHeight / 2;
    }

    return { x, y, width: labelWidth, height: labelHeight };
  };

  /**
   * 检查两个矩形是否重叠
   */
  const isOverlapping = (rect1: LabelPosition, rect2: LabelPosition): boolean => {
    return !(
      rect1.x + rect1.width < rect2.x ||
      rect2.x + rect2.width < rect1.x ||
      rect1.y + rect1.height < rect2.y ||
      rect2.y + rect2.height < rect1.y
    );
  };

  /**
   * 检查标签是否与拖拽元素重叠
   */
  const isOverlappingWithElement = (labelPos: LabelPosition, draggedRect: DOMRect, parentRect: DOMRect): boolean => {
    const elementRelativeRect = {
      x: draggedRect.left - parentRect.left,
      y: draggedRect.top - parentRect.top,
      width: draggedRect.width,
      height: draggedRect.height
    };

    // 添加一些缓冲区避免过于接近
    const buffer = 10;
    return !(
      labelPos.x + labelPos.width < elementRelativeRect.x - buffer ||
      elementRelativeRect.x + elementRelativeRect.width + buffer < labelPos.x ||
      labelPos.y + labelPos.height < elementRelativeRect.y - buffer ||
      elementRelativeRect.y + elementRelativeRect.height + buffer < labelPos.y
    );
  };

  /**
   * 调整标签位置避免冲突
   */
  const adjustLabelPosition = (guide: Guide, _draggedRect: DOMRect, _parentRect: DOMRect): Guide => {
    const adjustedGuide = { ...guide };

    // 根据辅助线类型选择调整策略
    if (guide.type.includes("vertical") || guide.style.borderLeft) {
      // 垂直线：尝试向左或向右偏移
      adjustedGuide.style = {
        ...guide.style
        // 通过CSS类来调整位置
      };
    } else if (guide.type.includes("horizontal") || guide.style.borderTop) {
      // 水平线：尝试向上或向下偏移
      adjustedGuide.style = {
        ...guide.style
      };
    }

    return adjustedGuide;
  };

  /**
   * 智能选择标签显示位置，避开拖拽元素
   */
  const getOptimalLabelPosition = (guide: Guide, draggedRect: DOMRect, parentRect: DOMRect): { className?: string } => {
    const style = guide.style;
    const isVertical = guide.type.includes("vertical") || style.borderLeft;
    const elementRect = {
      left: draggedRect.left - parentRect.left,
      top: draggedRect.top - parentRect.top,
      right: draggedRect.right - parentRect.left,
      bottom: draggedRect.bottom - parentRect.top
    };

    let className = "";

    if (isVertical) {
      const lineX = style.left || 0;
      const lineTop = style.top || 0;
      const lineCenterY = lineTop + (style.height || 0) / 2;

      // 检查标签中心是否会与元素重叠
      if (
        lineCenterY >= elementRect.top - 10 &&
        lineCenterY <= elementRect.bottom + 10 &&
        Math.abs(lineX - elementRect.left) < 60
      ) {
        // 如果会重叠，向上或向下偏移
        if (elementRect.top > 30) {
          className = "conflict-adjusted-up";
        } else {
          className = "conflict-adjusted-down";
        }
      }
    } else {
      // 水平线类似处理
      const lineY = style.top || 0;
      const lineLeft = style.left || 0;
      const lineCenterX = lineLeft + (style.width || 0) / 2;

      if (
        lineCenterX >= elementRect.left - 10 &&
        lineCenterX <= elementRect.right + 10 &&
        Math.abs(lineY - elementRect.top) < 30
      ) {
        if (elementRect.left > 60) {
          className = "conflict-adjusted-left";
        } else {
          className = "conflict-adjusted-right";
        }
      }
    }

    return { className };
  };

  return {
    optimizeLabelPositions,
    getOptimalLabelPosition
  };
};
