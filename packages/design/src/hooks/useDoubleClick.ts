import { useEffect, RefObject } from "react";

interface UseDoubleClickOptions {
  onDoubleClick: (event: MouseEvent) => void;
  delay?: number;
}

export const useDoubleClick = (ref: RefObject<HTMLElement>, options: UseDoubleClickOptions) => {
  const { onDoubleClick, delay = 300 } = options;
  let clickCount = 0;
  let clickTimer: NodeJS.Timeout;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleClick = (event: MouseEvent) => {
      clickCount += 1;
      if (clickCount === 1) {
        clickTimer = setTimeout(() => {
          clickCount = 0;
        }, delay);
      } else if (clickCount === 2) {
        clearTimeout(clickTimer);
        clickCount = 0;
        onDoubleClick(event);
      }
    };

    element.addEventListener("click", handleClick);

    return () => {
      element.removeEventListener("click", handleClick);
      clearTimeout(clickTimer);
    };
  }, [ref, onDoubleClick, delay]);
};
