import React from "react";
import { useCanvasSubscribe } from "@/hooks/useCanvasSubscribe";
import { ContextMenuManager } from "@/components/ContextMenu/ContextMenuManager";
import { AlignmentGuides } from "@/components/AlignmentGuides";
import { eventBus } from "@/hooks/useEvents";
import { Events } from "@/hooks/type";

export interface CanvasProps extends React.PropsWithChildren {
  className?: string;
}

export const Canvas = React.memo<CanvasProps>(props => {
  const ref = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ element: HTMLElement } | null>(null);
  const mouseDownRef = React.useRef<Events["mouseDown"] | null>(null);

  useCanvasSubscribe();

  const handleDoubleClick = React.useCallback((e: MouseEvent) => {
    const id = (e.target as HTMLElement).dataset.id;
    if (!id) return;
    eventBus.emit("doubleClick", { id });
  }, []);

  // 鼠标移动事件处理函数
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    //   e.stopPropagation(); // 阻止事件冒泡后chrome浏览器会卡顿
    if (dragRef.current && dragRef.current.element && dragRef.current.element.dataset.id !== "ROOT") {
      requestAnimationFrame(() => {
        mouseDownRef.current?.target?.setAttribute("data-dragging", "true");
        eventBus.emit("mouseDrag", {
          x: e.clientX,
          y: e.clientY,
          ...mouseDownRef.current!
        });
      });
    }
  }, []);

  // 鼠标松开事件处理函数
  const handleMouseUp = React.useCallback((e: MouseEvent) => {
    mouseDownRef.current?.target?.setAttribute("data-dragging", "false");
    dragRef.current = null;
    mouseDownRef.current = null;
    eventBus.emit("mouseUp", { x: e.clientX, y: e.clientY });
  }, []);

  // 子元素点击事件代理
  const handleMouseDown = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("indicator")) return;
    // 向上查找最近的带有 data-id 的元素
    const draggableElement = target.closest("[data-id]") as HTMLElement;
    const rect = draggableElement.getBoundingClientRect();
    const parentRect = draggableElement.parentElement?.getBoundingClientRect();

    if (draggableElement && draggableElement.dataset.id && parentRect) {
      dragRef.current = { element: draggableElement }; // 这里为拖拽的包裹容器
      const matrix = new DOMMatrix(window.getComputedStyle(draggableElement).transform);
      mouseDownRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        target: draggableElement,
        parent: draggableElement.parentElement,
        rect,
        parentRect,
        matrix
      };
      eventBus.emit("mouseDown", mouseDownRef.current);
    }
  }, []);

  const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const target = (e.target as HTMLElement).closest("[data-id]") as HTMLElement;
    e.target = target;
    if (target.dataset && target.dataset.id) {
      eventBus.emit("contextMenu", { e });
    }
  }, []);

  React.useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      // 添加事件监听
      currentRef.addEventListener("mousemove", handleMouseMove);
      currentRef.addEventListener("mouseup", handleMouseUp);
      currentRef.addEventListener("mousedown", handleMouseDown);
      currentRef.addEventListener("dblclick", handleDoubleClick);
    }

    // 清理事件监听
    return () => {
      if (currentRef) {
        console.log("清理");
        currentRef.removeEventListener("mousemove", handleMouseMove);
        currentRef.removeEventListener("mouseup", handleMouseUp);
        currentRef.removeEventListener("mousedown", handleMouseDown);
        currentRef.removeEventListener("dblclick", handleDoubleClick);
      }
    };
  }, []);
  return (
    <div ref={ref} className={props.className} onContextMenu={handleContextMenu} id="blite-canvas">
      {props.children}
      <ContextMenuManager />
      <AlignmentGuides />
    </div>
  );
});
