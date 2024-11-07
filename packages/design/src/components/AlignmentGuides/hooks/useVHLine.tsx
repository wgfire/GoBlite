import { Guide } from "../type";

export const useVHLine = () => {
  const calculateVHLines = (
    draggedRect: DOMRect,
    parentRect: DOMRect,
    parentPadding: { top: number; bottom: number; left: number; right: number }
  ): [Guide, Guide] => {
    const { top, bottom, left, right } = parentPadding;

    // 计算实际可用空间
    const availableHeight = parentRect.height - top - bottom;
    const availableWidth = parentRect.width - left - right;

    // 计算距离父容器顶部的距离及百分比
    const distanceTop = draggedRect.top - (parentRect.top + top);
    const percentageTop = ((distanceTop / availableHeight) * 100).toFixed(2) + "%";

    // 计算水平方向的距离及百分比
    const distanceLeft = draggedRect.left - (parentRect.left + left);
    const distanceRight = parentRect.right - right - draggedRect.right;
    const isCloserLeft = distanceLeft < distanceRight;

    const horizontalDistance = isCloserLeft ? distanceLeft : distanceRight;
    const percentageHorizontal = ((horizontalDistance / availableWidth) * 100).toFixed(2) + "%";

    const verticalLine: Guide = {
      type: "vertical-top",
      style: {
        left: draggedRect.left - parentRect.left + draggedRect.width / 2,
        top: 0,
        height: draggedRect.top - parentRect.top,
        borderLeft: "1px dashed red"
      },
      label: `${percentageTop} 从顶部`
    };

    const horizontalLine: Guide = isCloserLeft
      ? {
          type: "horizontal-left",
          style: {
            left: 0,
            top: draggedRect.top - parentRect.top + draggedRect.height / 2,
            width: draggedRect.left - parentRect.left,
            borderTop: "1px dashed blue"
          },
          label: `${percentageHorizontal} 从左边`
        }
      : {
          type: "horizontal-right",
          style: {
            left: draggedRect.right - parentRect.left,
            top: draggedRect.top - parentRect.top + draggedRect.height / 2,
            width: parentRect.width - (draggedRect.right - parentRect.left),
            borderTop: "1px dashed blue"
          },
          label: `右边${percentageHorizontal}`
        };

    return [verticalLine, horizontalLine];
  };

  return { calculateVHLines };
};
