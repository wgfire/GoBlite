import { Events, HookConfig, Priority } from "@/hooks/type";
import { updateEventVariable } from "@/hooks/useEventVariable";
import { useVHLine } from "./useVHLine";
import { useNearestSibling } from "./useNearestSlibling";
import { useSmartSnap } from "./useSmartSnap";
import { usePositionInfo } from "./usePositionInfo";
import { usePerformanceOptimizer } from "./usePerformanceOptimizer";
import { useSmartSnapping } from "./useSmartSnapping";

export const useGuides = (): HookConfig => {
  const { calculateVHLines } = useVHLine();
  const { updateSiblingsCache, findNearestSibling, clearCache } = useNearestSibling();
  // const { calculateSmartDistances } = useSmartDistances();
  const { calculateSmartSnap } = useSmartSnap();
  const { getSmartPositionInfo, convertPositionInfoToGuides } = usePositionInfo();
  const { optimizeGuidesComplete, throttledUpdate, cleanup } = usePerformanceOptimizer();
  const { checkSnapPosition, applySnapPosition, resetSnap } = useSmartSnapping();

  const handleMouseDrag = (data: Events["mouseDrag"]) => {
    throttledUpdate(() => {
      const { target } = data;
      const draggedElement = target;
      const parent = draggedElement?.parentElement;

      if (!draggedElement || !parent) return updateEventVariable("guides", { guides: [] });

      const parentRect = parent.getBoundingClientRect();
      const draggedRect = draggedElement.getBoundingClientRect();

      const computedStyle = window.getComputedStyle(parent);
      const parentPadding = {
        top: parseFloat(computedStyle.paddingTop),
        bottom: parseFloat(computedStyle.paddingBottom),
        left: parseFloat(computedStyle.paddingLeft),
        right: parseFloat(computedStyle.paddingRight)
      };

      const siblings = Array.from(parent.children).filter(
        child => child !== draggedElement && child.id
      ) as HTMLElement[];

      // 1. 智能位置信息（优先显示最相关的距离）
      const positionInfo = getSmartPositionInfo(draggedRect, siblings, parentRect, parentPadding);
      const smartPositionGuides = convertPositionInfoToGuides(positionInfo, draggedRect, parentRect);

      // 2. 智能吸附和对齐检测
      const snapResult = calculateSmartSnap(draggedRect, siblings, parentRect);

      // 3. 传统的对齐辅助线（作为补充）
      updateSiblingsCache(siblings);
      const alignmentGuides = findNearestSibling(draggedRect, siblings, parentRect);

      // 4. 基础的垂直和水平线（仅在没有更好选择时显示）
      const [verticalLine, horizontalLine] = calculateVHLines(draggedRect, parentRect, parentPadding);

      // 5. 合并所有辅助线
      const allGuides = [
        ...snapResult.guides, // 吸附线优先级最高
        ...smartPositionGuides, // 智能距离线
        ...alignmentGuides, // 对齐线
        // 只有在智能距离线不足时才显示基础线
        ...(smartPositionGuides.length < 2 ? [verticalLine, horizontalLine] : [])
      ];

      // 6. 性能优化：限制数量、去重、优先级排序
      const optimizedGuides = optimizeGuidesComplete(allGuides, parentRect);

      updateEventVariable("guides", { guides: optimizedGuides });
    });
  };

  const handleMouseUp = (data: Events["mouseUp"]) => {
    const { target } = data;
    const draggedElement = target;
    const parent = draggedElement?.parentElement;

    if (draggedElement && parent) {
      const parentRect = parent.getBoundingClientRect();
      const draggedRect = draggedElement.getBoundingClientRect();
      const siblings = Array.from(parent.children).filter(
        child => child !== draggedElement && child.id
      ) as HTMLElement[];

      // 检查是否需要吸附
      const snapCheck = checkSnapPosition(draggedRect, siblings, parentRect);

      if (snapCheck.shouldSnap && snapCheck.snapTo) {
        // 应用吸附
        applySnapPosition(draggedElement, snapCheck.snapTo, parentRect);
      }
    }

    updateEventVariable("guides", { guides: [] });
    clearCache();
    cleanup();
    resetSnap();
  };

  return {
    id: "guides",
    handlers: {
      mouseDrag: handleMouseDrag,
      mouseUp: handleMouseUp
    },
    priority: Priority.HIGH
  };
};
