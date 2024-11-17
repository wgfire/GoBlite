import { NodeTree, useEditor } from "@craftjs/core";
import { useCallback, useRef } from "react";

interface DragState {
  isDragging: boolean;
  element: JSX.Element | null;
  mouseOffset: { x: number; y: number };
}

export interface DragBoxProps {
  element: JSX.Element;
  icon?: JSX.Element;
}

export const DragBox: React.FC<React.PropsWithChildren<DragBoxProps>> = ({ element, children }) => {
  const {
    connectors: { create },
    query,
    actions
  } = useEditor();

  const dragStateRef = useRef<DragState>({
    isDragging: false,
    element: null,
    mouseOffset: { x: 0, y: 0 }
  });
  //  / const [previewElement, setPreviewElement] = useState<JSX.Element | null>(element);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    dragStateRef.current.isDragging = true;
    dragStateRef.current.element = element;

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
      dragStateRef.current.mouseOffset = {
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top
      };
    }
  }, []);

  const createCallback = (nodeTree: NodeTree) => {
    actions.setProp(nodeTree.rootNodeId, props => {
      props.customStyle = {
        ...props.customStyle,
        transform: `translate(${dragStateRef.current.mouseOffset.x}px, ${dragStateRef.current.mouseOffset.y}px)`
      };
    });
  };

  return (
    <div
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      ref={el => {
        if (el) {
          elementRef.current = el;
          create(elementRef.current, dragStateRef.current.element!, {
            onCreate: createCallback
          });
        }
      }}
      // onDragEnd={handleDragEnd}
    >
      {children}
    </div>
  );
};
