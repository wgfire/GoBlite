import { eventBus, Events } from "@/utils/eventBus";
import { useMount, useUnmount } from "ahooks";
import { useClickAddNode } from "./useClickAddNode";
import { useContextMenu } from "./useContextMenu";
import { useDragNode } from "./useDragNode";
import { useAutoToContainer } from "./useAutoToContainer";
import { useCallback } from "react";

export const useCanvasSubscribe = () => {
  const { clickAddNode } = useClickAddNode();
  const { createContextMenu } = useContextMenu();
  const { dragNode } = useDragNode();

  const { handleDragEnd } = useAutoToContainer();

  const handleMouseDrag = useCallback((arg: Events["mouseDrag"]) => {
    dragNode(arg);
    // handleDrag(arg);
  }, []);

  useMount(() => {
    eventBus.on("mouseDrag", arg => handleMouseDrag(arg));
    eventBus.on("doubleClick", clickAddNode);
    eventBus.on("contextMenu", createContextMenu);
    eventBus.on("mouseUp", handleDragEnd);
  });

  useUnmount(() => {
    eventBus.off("doubleClick", clickAddNode);
    eventBus.off("contextMenu", createContextMenu);
    eventBus.off("mouseDrag", handleMouseDrag);
    eventBus.off("mouseUp", handleDragEnd);
  });
};
