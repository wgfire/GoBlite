import { useState, useEffect, useCallback, useRef } from "react";

interface TranslateState {
  translateX: number;
  translateY: number;
}

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// 用于跟踪当前正在拖拽的元素
let currentDraggingElement: string | null = null;

export const useTranslate = (id: string, enable = true) => {
  const [translate, setTranslate] = useState<TranslateState>({ translateX: 0, translateY: 0 });
  const translateRef = useRef(translate);
  const elementRef = useRef<HTMLElement | null>(null);
  const parentRef = useRef<HTMLElement | null>(null);
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const moveRange = useRef<Bounds | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null | boolean>(null);

  useEffect(() => {
    translateRef.current = translate;
  }, [translate]);

  const addFloatingEffect = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.boxShadow = "0 6px 12px rgba(0,0,0,0.5)";
      elementRef.current.style.transition = "box-shadow 0.3s ease";
      elementRef.current.style.cursor = "grabbing";
    }
  }, []);

  const removeFloatingEffect = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.style.boxShadow = "none";
      elementRef.current.style.transition = "none";
      elementRef.current.style.cursor = "pointer";
      elementRef.current.setAttribute("data-dragging", "false");
    }
  }, []);
  const updateBounds = useCallback(() => {
    if (elementRef.current && parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();
      moveRange.current = {
        minX: parentRect.left - elementRect.left,
        maxX: parentRect.right - elementRect.right,
        minY: parentRect.top - elementRect.top,
        maxY: parentRect.bottom - elementRect.bottom
      };
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !longPressTimerRef.current || currentDraggingElement !== id || !moveRange.current)
        return;
      elementRef.current?.setAttribute("data-dragging", "true");

      e.stopPropagation(); // 阻止事件冒泡

      let newTranslateY = e.clientY - startPosRef.current.y;
      let newTranslateX = e.clientX - startPosRef.current.x;

      // 限制移动范围
      newTranslateX = Math.max(moveRange.current.minX, Math.min(newTranslateX, moveRange.current.maxX));
      newTranslateY = Math.max(moveRange.current.minY, Math.min(newTranslateY, moveRange.current.maxY));

      console.log(newTranslateY, newTranslateX, moveRange.current, "newTranslateY");

      setTranslate({ translateX: newTranslateX, translateY: newTranslateY });
    },
    [id]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current as NodeJS.Timeout);
        longPressTimerRef.current = false;
      }
      updateBounds();
      currentDraggingElement = null; // 重置全局拖拽状态
    }
    removeFloatingEffect();

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      if (currentDraggingElement || (e.target as HTMLElement)?.style.cssText.includes("absolute")) return; // 如果已有元素在拖拽，则不处理

      startPosRef.current = {
        x: e.clientX - translateRef.current.translateX,
        y: e.clientY - translateRef.current.translateY
      };
      /**第一次的时候设置这个元素的拖拽范围 */
      if (!moveRange.current) {
        updateBounds();
      }

      isDraggingRef.current = true;
      currentDraggingElement = id; // 设置当前拖拽元素

      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = true;
        if (elementRef.current) {
          addFloatingEffect();
          document.addEventListener("mousemove", handleMouseMove);
        }
      }, 800);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [id]
  );

  useEffect(() => {
    const element = document.getElementById(id);
    if (element && enable) {
      elementRef.current = element;
      parentRef.current = element.parentElement;
      elementRef.current.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      elementRef.current?.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id, enable]);

  return translate;
};
