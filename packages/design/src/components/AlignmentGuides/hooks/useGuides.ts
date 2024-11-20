import { Events, HookConfig, Priority } from "@/hooks/type";
import { updateEventVariable } from "@/hooks/useEventVariable";
import { useVHLine } from "./useVHLine";
import { useNearestSibling } from "./useNearestSlibling";

export const useGuides = (): HookConfig => {
  const { calculateVHLines } = useVHLine();
  const { updateSiblingsCache, findNearestSibling, clearCache } = useNearestSibling();
  const handleMouseDrag = (data: Events["mouseDrag"]) => {
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

    const [verticalLine, horizontalLine] = calculateVHLines(draggedRect, parentRect, parentPadding);

    const siblings = Array.from(parent.children).filter(child => child !== draggedElement && child.id) as HTMLElement[];

    updateSiblingsCache(siblings);
    const alignmentGuides = findNearestSibling(draggedRect, siblings, parentRect);

    updateEventVariable("guides", { guides: [verticalLine, horizontalLine, ...alignmentGuides] });
  };

  const handleMouseUp = () => {
    updateEventVariable("guides", { guides: [] });
    clearCache();
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
