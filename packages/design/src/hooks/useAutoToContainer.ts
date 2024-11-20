import { useEditor } from "@craftjs/core";
import { useCallback, useRef } from "react";
import { Events, HookConfig } from "./type";

interface DragContainerRef {
  element: HTMLElement;
  targetContainer: HTMLElement;
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
      container.style.transition = "box-shadow 0.2s ease-in-out";
      console.log(container, "addContainerEffect");
    }
  };

  // 移除容器hover效果
  const removeContainerEffect = (container: HTMLElement) => {
    if (container.id !== "ROOT") {
      container.style.boxShadow = "";
      container.style.transition = "";
    }
  };
  const handleDragStart = useCallback((e: Events["mouseDown"]) => {
    if (!e.target || !e.target.parentElement) return;
    dragRef.current = {
      element: e.target,
      targetContainer: e.target.parentElement
    };
    previousContainerRef.current = e.target.parentElement || null;
  }, []);

  const findTargetContainer = useCallback((e: Events["mouseDrag"]) => {
    const dragElement = e.target;
    const targetId = dragElement?.dataset.id;
    if (!dragElement) return;
    const elements = document.elementsFromPoint(e.x, e.y);
    const dragRect = dragElement.getBoundingClientRect();

    // 存储所有可能的容器及其面积
    const possibleContainers = elements
      .map(el => {
        const id = el.getAttribute("data-id");
        if (!id) return null;

        const node = query.node(id).get();
        // 检查是否允许放入
        if (node.data && !node.data.isCanvas) return null;
        if (id === targetId) return null;

        const containerRect = el.getBoundingClientRect();

        // 计算容器的总面积
        const containerArea = containerRect.width * containerRect.height;

        // 确保拖拽元素在容器范围内
        const isInBounds = dragRect.left >= containerRect.left && dragRect.top >= containerRect.top;

        if (!isInBounds) {
          console.log(dragRect, containerRect, el, "不在范围内");
          return null;
        }

        return {
          element: el as HTMLElement,
          area: containerArea
        };
      })
      .filter((container): container is { element: HTMLElement; area: number } => container !== null);

    // 按面积升序排序，返回面积最小的容器
    const smallestContainer = possibleContainers.sort((a, b) => a.area - b.area)[0];

    return smallestContainer?.element;
  }, []);

  const handleDrag = useCallback(
    (e: Events["mouseDrag"]) => {
      requestAnimationFrame(() => {
        if (!dragRef.current?.element) return;
        const targetContainer = findTargetContainer(e);

        // 如果有之前的容器，且目标容器不同，移除之前容器的效果
        if (previousContainerRef.current && previousContainerRef.current !== targetContainer) {
          removeContainerEffect(previousContainerRef.current);

          // 更新目标容器和效果
          if (targetContainer) {
            addContainerEffect(targetContainer);

            previousContainerRef.current = targetContainer;
            const parentId = targetContainer.dataset.id;
            const nodeId = dragRef.current.element.dataset.id;

            if (parentId && nodeId) {
              // 使用原生的移动方式 避免刷新 为了保持其他hooks里的引用时target元素有效的
              targetContainer.appendChild(dragRef.current.element);
              //move(nodeId, parentId, targetContainer.childNodes.length + 1);
              dragRef.current.targetContainer = targetContainer;

              //   console.log("更新了容器", dragRef.current.targetContainer, dragRef.current.element);
            }
          }
        }
      });
    },
    [findTargetContainer]
  );

  const handleDragEnd = useCallback(() => {
    if (dragRef.current) {
      removeContainerEffect(dragRef.current.targetContainer);
      setTimeout(() => {
        if (dragRef.current?.targetContainer && dragRef.current?.element) {
          move(
            dragRef.current.element.dataset.id!,
            dragRef.current.targetContainer.dataset.id!,
            dragRef.current.targetContainer.childNodes.length
          );
        }
      }, 0);
    }
    previousContainerRef.current = null;
    dragRef.current = null;
  }, []);

  return {
    id: "autoToContainer",
    handlers: {
      mouseDown: handleDragStart,
      mouseDrag: handleDrag,
      mouseUp: handleDragEnd
    }
  };
};
