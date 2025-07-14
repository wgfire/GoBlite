import { useMemo } from "react";
import { Guide } from "./type";
import { createPortal } from "react-dom";
import styles from "./index.module.css";
import { useEventVariable } from "@/hooks/useEventVariable";
import { useLabelOptimizer } from "./hooks/useLabelOptimizer";

export const AlignmentGuides: React.FC = () => {
  const mouseDrag = useEventVariable("mouseDrag");
  const guides = useEventVariable("guides");
  const { getOptimalLabelPosition } = useLabelOptimizer();

  const guidesMemo = useMemo(() => {
    return guides?.guides as Guide[];
  }, [guides]);

  const parentElementMemo = useMemo(() => {
    return mouseDrag?.target?.parentElement || null;
  }, [mouseDrag?.target?.parentElement]);

  const draggedRectMemo = useMemo(() => {
    if (!mouseDrag?.target) return null;
    return mouseDrag.target.getBoundingClientRect();
  }, [mouseDrag?.target]);

  const parentRectMemo = useMemo(() => {
    if (!parentElementMemo) return null;
    return parentElementMemo.getBoundingClientRect();
  }, [parentElementMemo]);

  if (!parentElementMemo || !guidesMemo || !draggedRectMemo || !parentRectMemo) return null;

  return createPortal(
    <>
      {guidesMemo.map((guide, index) => {
        // 获取标签的最优位置信息
        const labelOptimization = getOptimalLabelPosition(guide, draggedRectMemo, parentRectMemo);

        return (
          <div key={index} className={styles.guideLine} style={guide.style} data-type={guide.type}>
            {guide.label && (
              <span className={`${styles.guideLabel} ${labelOptimization.className || ""}`}>{guide.label}</span>
            )}
          </div>
        );
      })}
    </>,
    parentElementMemo
  );
};
