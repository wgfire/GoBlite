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
  const initialTranslateRef = useRef({ x: 0, y: 0 });
  const boundsRef = useRef<Bounds>({ minX: 0, maxX: 0, minY: 0, maxY: 0 });
  const longPressTimerRef = useRef<NodeJS.Timeout | null | boolean>(null);

  const updateBounds = useCallback(() => {
    if (elementRef.current && parentRef.current) {
      const parentRect = parentRef.current.getBoundingClientRect();
      const elementRect = elementRef.current.getBoundingClientRect();
      boundsRef.current = {
        minX: 0,
        maxX: parentRect.width - elementRect.width,
        minY: 0,
        maxY: parentRect.height - elementRect.height
      };
    }
  }, []);

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
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !longPressTimerRef.current || currentDraggingElement !== id) return;

      e.stopPropagation(); // 阻止事件冒泡

      let newTranslateX = initialTranslateRef.current.x + (e.clientX - startPosRef.current.x);
      let newTranslateY = initialTranslateRef.current.y + (e.clientY - startPosRef.current.y);

      // 限制移动范围
      newTranslateX = Math.max(boundsRef.current.minX, Math.min(newTranslateX, boundsRef.current.maxX));
      newTranslateY = Math.max(boundsRef.current.minY, Math.min(newTranslateY, boundsRef.current.maxY));

      setTranslate({ translateX: newTranslateX, translateY: newTranslateY });
    },
    [id, translate]
  );

  const handleMouseUp = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current as NodeJS.Timeout);
        longPressTimerRef.current = false;
      }
      currentDraggingElement = null; // 重置全局拖拽状态
    }
    removeFloatingEffect();

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, [removeFloatingEffect, handleMouseMove]);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();

      if (currentDraggingElement || e.target?.style.cssText.includes("absolute")) return; // 如果已有元素在拖拽，则不处理

      updateBounds();
      startPosRef.current = { x: e.clientX, y: e.clientY };
      initialTranslateRef.current = { x: translateRef.current.translateX, y: translateRef.current.translateY };

      isDraggingRef.current = true;
      currentDraggingElement = id; // 设置当前拖拽元素

      longPressTimerRef.current = setTimeout(() => {
        longPressTimerRef.current = true;
        if (elementRef.current) {
          addFloatingEffect();
          document.addEventListener("mousemove", handleMouseMove);
        }
      }, 300);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [id, updateBounds, addFloatingEffect, handleMouseMove, handleMouseUp]
  );

  useEffect(() => {
    const element = document.getElementById(id);
    if (element && enable) {
      elementRef.current = element;
      parentRef.current = element.parentElement;
      elementRef.current.addEventListener("mousedown", handleMouseDown);
      updateBounds();
    }

    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener("mousedown", handleMouseDown);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [id]);

  return translate;
};
