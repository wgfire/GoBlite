import { Events } from "@/utils/eventBus";
import { useEditor } from "@craftjs/core";
import { useCallback, useRef } from "react";

interface DragContainerRef {
  element: HTMLElement;
  targetContainer?: HTMLElement | null;
}

export const useAutoToContainer = () => {
  const {
    // actions: { move },
    query
  } = useEditor();

  const dragRef = useRef<DragContainerRef | null>(null);

  // 查找目标容器
  const findTargetContainer = useCallback(
    (e: Events["mouseDrag"]) => {
      const elements = document.elementsFromPoint(e.x, e.y);
      return elements.find(el => {
        const id = el.getAttribute("data-id");
        if (!id) return false;
        const node = query.node(id).get();
        return node.data.isCanvas && id !== dragRef.current?.element.dataset.id;
      }) as HTMLElement | undefined;
    },
    [query]
  );

  // 处理拖拽过程
  const handleDrag = useCallback(
    (e: Events["mouseDrag"]) => {
      if (!dragRef.current?.element) return;

      const targetContainer = findTargetContainer(e);
      if (targetContainer) {
        targetContainer.style.outline = "2px dashed #1890ff";
        dragRef.current.targetContainer = targetContainer;
      }
    },
    [findTargetContainer]
  );

  const handleDragEnd = useCallback(() => {
    dragRef.current = null;
  }, []);

  return {
    handleDrag,
    handleDragEnd
  };
};
