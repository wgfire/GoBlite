import { useEditor } from "@craftjs/core";
import { Button } from "@go-blite/shadcn";
import { useCallback, useRef, cloneElement, useState } from "react";

interface DragState {
  isDragging: boolean;
  element: JSX.Element | null;
  mouseOffset: { x: number; y: number };
}

export const DragBox = ({ element, icon }: { element: JSX.Element; icon: JSX.Element }) => {
  const {
    connectors: { create },
    query
  } = useEditor();

  const dragStateRef = useRef<DragState>({
    isDragging: false,
    element: null,
    mouseOffset: { x: 0, y: 0 }
  });
  const [previewElement, setPreviewElement] = useState<JSX.Element | null>(element);
  const elementRef = useRef<HTMLElement | null>(null);

  const createElementWithPosition = useCallback(
    (x: number, y: number) => {
      return cloneElement(element, {
        style: {
          ...element.props.style
        },
        customStyle: {
          transform: `translate(${x}px, ${y}px)`
        }
      });
    },
    [element]
  );
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    dragStateRef.current.isDragging = true;

    // 记录鼠标相对于元素的偏移
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragStateRef.current.mouseOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }, []);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!dragStateRef.current.isDragging) return;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const container = elements.find(el => {
      const node = query.getNodes()[el.getAttribute("data-id")!];
      return node?.data.isCanvas;
    }) as HTMLElement;

    if (container && elementRef.current) {
      const containerRect = container.getBoundingClientRect();
      const x = e.clientX - containerRect.left;
      const y = e.clientY - containerRect.top;

      // 在拖拽结束时使用最终位置创建元素
      const finalElement = createElementWithPosition(x, y);
      console.log(finalElement, "finalElement", previewElement);
      setPreviewElement(finalElement);
    }
  }, []);

  const handleDragEnd = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (!dragStateRef.current.isDragging) return;

      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      const container = elements.find(el => {
        const node = query.getNodes()[el.getAttribute("data-id")!];
        return node?.data.isCanvas;
      }) as HTMLElement;

      if (container && elementRef.current) {
        const containerRect = container.getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;

        // 在拖拽结束时使用最终位置创建元素
        const finalElement = createElementWithPosition(x, y);
        console.log(finalElement, "finalElement");
        create(elementRef.current, finalElement);
        // console.log(a, "a");
      }

      dragStateRef.current.isDragging = false;
      dragStateRef.current.element = null;
    },
    [query, create, createElementWithPosition]
  );
  return (
    <div
      draggable
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      ref={el => (elementRef.current = el)}
      onDragEnd={handleDragEnd}
    >
      <Button variant="outline" className="w-full h-8 text-xs flex items-center justify-center">
        {icon}
      </Button>
    </div>
  );
};
