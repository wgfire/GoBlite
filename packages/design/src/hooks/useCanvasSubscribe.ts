import { eventBus } from "@/utils/eventBus";
import { useMount, useUnmount } from "ahooks";
import { useClickAddNode } from "./useClickAddNode";
import { useContextMenu } from "./useContextMenu";
import { useDragNode } from "./useDragNode";

export const useCanvasSubscribe = () => {
  const { clickAddNode } = useClickAddNode();
  const { createContextMenu } = useContextMenu();
  const { handleMouseDrag } = useDragNode();
  useMount(() => {
    eventBus.on("mouseDrag", handleMouseDrag);
    eventBus.on("doubleClick", clickAddNode);
    eventBus.on("contextMenu", createContextMenu);
  });

  useUnmount(() => {
    eventBus.off("doubleClick", clickAddNode);
    eventBus.off("contextMenu", createContextMenu);
    eventBus.off("mouseDrag", handleMouseDrag);
  });
};
