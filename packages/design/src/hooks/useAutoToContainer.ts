import { Events } from "@/utils/eventBus";
import { useEditor } from "@craftjs/core";
import { useCallback, useRef } from "react";
import { HookConfig } from "./type";

interface DragContainerRef {
  element: HTMLElement;
  targetContainer?: HTMLElement | null;
}

export const useAutoToContainer = (): HookConfig => {
  const {
    query,
    actions: { move }
  } = useEditor();

  const dragRef = useRef<DragContainerRef | null>(null);
  const previousContainerRef = useRef<HTMLElement | null>(null);

  // 添加容器hover效果
  const addContainerEffect = (container: HTMLElement) => {
    if (container.id !== "ROOT") {
      container.style.boxShadow = "0 0 10px 1px inset rgba(59, 130, 246, 0.5)";
      container.style.transition = "all 0.2s ease-in-out";
    }
  };

  // 移除容器hover效果
  const removeContainerEffect = (container: HTMLElement) => {
    if (container.id !== "ROOT") {
      container.style.boxShadow = "";
    }
  };

  // 查找目标容器
  const findTargetContainer = useCallback(
    (e: Events["mouseDrag"]) => {
      const dragElement = e.target;
      if (!dragElement) return;
      const dragRect = e.rect;
      const elements = document.elementsFromPoint(e.x, e.y);

      const targetContainer = elements.find(el => {
        const id = el.getAttribute("data-id");
        if (!id) return false;

        const node = query.node(id).get();
        // 检查是否允许放入
        if (!node.data.isCanvas) return false;
        if (id === dragElement.dataset.id) return false;

        const containerRect = el.getBoundingClientRect();
        const isInside =
          dragRect.left < containerRect.right &&
          dragRect.right > containerRect.left &&
          dragRect.top < containerRect.bottom &&
          dragRect.bottom > containerRect.top;

        return isInside;
      }) as HTMLElement | undefined;

      return targetContainer;
    },
    [query]
  );
  const handleDrag = useCallback(
    (e: Events["mouseDrag"]) => {
      if (!e.target) return;

      dragRef.current = {
        element: e.target
      };

      const targetContainer = findTargetContainer(e);

      // 如果有之前的容器，且目标容器不同，移除之前容器的效果
      if (previousContainerRef.current && previousContainerRef.current !== targetContainer) {
        removeContainerEffect(previousContainerRef.current);
      }

      // 更新目标容器和效果
      if (targetContainer) {
        addContainerEffect(targetContainer);
        dragRef.current.targetContainer = targetContainer;
        previousContainerRef.current = targetContainer;
        const parentId = targetContainer.dataset.id;
        const nodeId = dragRef.current.element.dataset.id;
        console.log(targetContainer, "targetContainer", parentId, nodeId);
        if (parentId && nodeId) {
          move(nodeId, parentId, targetContainer.childNodes.length + 1);
        }
      } else {
        dragRef.current.targetContainer = null;
        previousContainerRef.current = null;
      }
    },
    [findTargetContainer]
  );

  const handleDragEnd = useCallback(() => {
    if (previousContainerRef.current) {
      removeContainerEffect(previousContainerRef.current);
      previousContainerRef.current = null;
    }
    dragRef.current = null;
  }, []);

  return {
    id: "autoToContainer",
    handlers: {
      mouseDrag: handleDrag,
      mouseUp: handleDragEnd
    }
  };
};
