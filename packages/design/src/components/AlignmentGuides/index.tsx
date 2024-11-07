import { useEffect, useState } from "react";
import { Guide } from "./type";
import { useVHLine } from "./hooks/useVHLine";
import { useNearestSibling } from "./hooks/useNearestSlibling";
import { eventBus } from "@/utils/eventBus";
import { createPortal } from "react-dom";
import styles from "./index.module.css";
export const AlignmentGuides: React.FC = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const { calculateVHLines } = useVHLine();
  const { updateSiblingsCache, findNearestSibling, clearCache } = useNearestSibling();

  useEffect(() => {
    const handleMouseDrag = (data: { target: HTMLElement }) => {
      const { target } = data;
      const draggedElement = target;
      const parent = draggedElement.parentElement;
      if (!draggedElement || !parent) return;

      setParentElement(parent);

      const draggedRect = draggedElement.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();

      const computedStyle = window.getComputedStyle(parent);
      const parentPadding = {
        top: parseFloat(computedStyle.paddingTop),
        bottom: parseFloat(computedStyle.paddingBottom),
        left: parseFloat(computedStyle.paddingLeft),
        right: parseFloat(computedStyle.paddingRight)
      };

      const [verticalLine, horizontalLine] = calculateVHLines(draggedRect, parentRect, parentPadding);

      const siblings = Array.from(parent.children).filter(
        child => child !== draggedElement && child.id
      ) as HTMLElement[];

      updateSiblingsCache(siblings);
      const alignmentGuides = findNearestSibling(draggedRect, siblings, parentRect);

      setGuides([verticalLine, horizontalLine, ...alignmentGuides]);
    };

    const handleMouseUp = () => {
      setGuides([]);
      setParentElement(null);
      clearCache();
    };

    eventBus.on("mouseDrag", handleMouseDrag);
    eventBus.on("mouseUp", handleMouseUp);

    return () => {
      eventBus.off("mouseDrag", handleMouseDrag);
      eventBus.off("mouseUp", handleMouseUp);
    };
  }, []);

  if (!parentElement) return null;

  return createPortal(
    <>
      {guides.map((guide, index) => (
        <div key={index} className={styles.guideLine} style={guide.style} data-type={guide.type}>
          {guide.label && <span className={styles.guideLabel}>{guide.label}</span>}
        </div>
      ))}
    </>,
    parentElement
  );
};
