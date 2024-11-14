import React from "react";
import { useDoubleClick } from "@/hooks/useDoubleClick";
import { eventBus } from "@/utils/eventBus";
import { useCanvasSubscribe } from "@/hooks/useCanvasSubscribe";
import { ContextMenuManager } from "@/components/ContextMenu/ContextMenuManager";
import { useThrottleFn } from "ahooks";
import { AlignmentGuides } from "@/components/AlignmentGuides";

export interface CanvasProps extends React.PropsWithChildren {
  className?: string;
}

export const Canvas = React.memo<CanvasProps>(props => {
  const ref = React.useRef<HTMLDivElement>(null);
  const dragRef = React.useRef<{ element: HTMLElement } | null>(null);
  const mouseDownRef = React.useRef<{ x: number; y: number; matrix: DOMMatrix | null } | null>({
    x: 0,
    y: 0,
    matrix: null
  });
  useCanvasSubscribe();

  useDoubleClick(ref, {
    onDoubleClick: (event: MouseEvent) => {
      const id = (event.target as HTMLElement).dataset.id;
      if (!id) return;
      eventBus.emit("doubleClick", { id });
    }
  });

  // 鼠标移动事件处理函数
  const { run: handleMouseMove } = useThrottleFn(
    (e: MouseEvent) => {
      e.stopPropagation(); // 阻止事件冒泡
      if (dragRef.current && dragRef.current.element && dragRef.current.element.dataset.id !== "ROOT") {
        eventBus.emit("mouseDrag", {
          x: e.clientX,
          y: e.clientY,
          initx: mouseDownRef.current!.x,
          inity: mouseDownRef.current!.y,
          matrix: mouseDownRef.current!.matrix!,
          target: dragRef.current.element
        });
      }
    },
    {
      wait: 12
    }
  );

  // 鼠标松开事件处理函数
  const handleMouseUp = React.useCallback((e: MouseEvent) => {
    dragRef.current = null;
    mouseDownRef.current = null;
    eventBus.emit("mouseUp", { x: e.clientX, y: e.clientY });
  }, []);

  // 子元素点击事件代理
  const handleClick = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("indicator")) return;
    // 向上查找最近的带有 data-id 的元素
    const draggableElement = target.closest("[data-id]") as HTMLElement;
    if (draggableElement && draggableElement.dataset.id) {
      dragRef.current = { element: draggableElement };
      const style = window.getComputedStyle(draggableElement);
      const matrix = new DOMMatrix(style.transform);
      mouseDownRef.current = { x: e.clientX, y: e.clientY, matrix };
      eventBus.emit("mouseDown", { target: draggableElement });
    }
  }, []);

  const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(e, "contextMenu");
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
      currentRef.addEventListener("mousedown", handleClick);
      //   currentRef.addEventListener("dragover", e => {
      //     console.log(e, "dragover");
      //   });
    }

    // 清理事件监听
    return () => {
      if (currentRef) {
        console.log("清理");
        currentRef.removeEventListener("mousemove", handleMouseMove);
        currentRef.removeEventListener("mouseup", handleMouseUp);
        currentRef.removeEventListener("mousedown", handleClick);
      }
    };
  }, [handleMouseMove, handleMouseUp, handleClick]);
  return (
    <div ref={ref} className={props.className} onContextMenu={handleContextMenu} id="blite-canvas">
      {props.children}
      <ContextMenuManager />
      <AlignmentGuides />
    </div>
  );
});
