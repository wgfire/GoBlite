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
      const target = e.target as HTMLElement;
      if (dragRef.current && target === dragRef.current.element && target.dataset.id !== "ROOT") {
        target.setAttribute("data-dragging", "true");
        dragRef.current.element = target;
        console.log(e.clientX, "拖拽");
        eventBus.emit("mouseDrag", {
          x: e.clientX,
          y: e.clientY,
          initx: mouseDownRef.current!.x,
          inity: mouseDownRef.current!.y,
          matrix: mouseDownRef.current!.matrix!,
          target
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
    console.log(dragRef.current, "松开current");
    mouseDownRef.current = null;
    eventBus.emit("mouseUp", { x: e.clientX, y: e.clientY });
    (e.target as HTMLElement)?.removeAttribute("data-dragging");
  }, []);

  // 子元素点击事件代理
  const handleClick = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.dataset && target.dataset.id) {
      dragRef.current = { element: target };
      console.log(dragRef.current, e.clientX, "点击current");
      const style = window.getComputedStyle(target);
      const matrix = new DOMMatrix(style.transform); // 或者其他属性
      mouseDownRef.current = { x: e.clientX, y: e.clientY, matrix };
      eventBus.emit("mouseDown", { id: target.dataset.id });
    }
  }, []);

  const handleContextMenu = React.useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (target.dataset && target.dataset.id) {
      eventBus.emit("contextMenu", { e });
    }
  }, []);

  React.useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      // 添加事件监听
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousedown", handleClick);
    }

    // 清理事件监听
    return () => {
      if (currentRef) {
        console.log("清理");
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
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
