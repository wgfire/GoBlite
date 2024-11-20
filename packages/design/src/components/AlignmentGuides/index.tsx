import { useMemo } from "react";
import { Guide } from "./type";

import { createPortal } from "react-dom";
import styles from "./index.module.css";
import { useEventVariable } from "@/hooks/useEventVariable";
export const AlignmentGuides: React.FC = () => {
  const mouseDrag = useEventVariable("mouseDrag");
  const guides = useEventVariable("guides");

  const guidesMemo = useMemo(() => {
    return guides?.guides as Guide[];
  }, [guides]);

  const parentELementMemo = useMemo(() => {
    return mouseDrag?.target?.parentElement || null;
  }, [mouseDrag?.target?.parentElement]);

  if (!parentELementMemo || !guidesMemo) return null;

  return createPortal(
    <>
      {guidesMemo.map((guide, index) => (
        <div key={index} className={styles.guideLine} style={guide.style} data-type={guide.type}>
          {guide.label && <span className={styles.guideLabel}>{guide.label}</span>}
        </div>
      ))}
    </>,
    parentELementMemo
  );
};
