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
    element: element,
    mouseOffset: { x: 0, y: 0 }
  });
  //  / const [previewElement, setPreviewElement] = useState<JSX.Element | null>(element);
  const elementRef = useRef<HTMLElement | undefined>(undefined);

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
      dragStateRef.current.mouseOffset = {
        x: e.clientX - containerRect.left, /// containerRect.width,
        y: e.clientY - containerRect.top /// containerRect.height
      };
    }
  }, []);

  const createCallback = (nodeTree: NodeTree) => {
    console.log(nodeTree, "nodeTree");
    // const leftPercent = `${Number((dragStateRef.current.mouseOffset.x * 100).toFixed(2))}%`;
    //const topPercent = `${Number((dragStateRef.current.mouseOffset.y * 100).toFixed(2))}%`;
    const leftPx = `${dragStateRef.current.mouseOffset.x}px`;
    const topPx = `${dragStateRef.current.mouseOffset.y}px`;
    actions.setProp(nodeTree.rootNodeId, props => {
      props.customStyle = {
        ...props.customStyle,
        position: "relative",
        left: leftPx,
        top: topPx
        //transform: `translate(${dragStateRef.current.mouseOffset.x}px, ${dragStateRef.current.mouseOffset.y}px)`
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
