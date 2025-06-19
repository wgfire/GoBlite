import { useClickAddNode } from "./useClickAddNode";
import { useContextMenu } from "./useContextMenu";
import { useDragNode } from "./useDragNode";
import { useAutoToContainer } from "./useAutoToContainer";
import { useEventManager } from "./useEvents";
import { useGuides } from "@/components/AlignmentGuides/hooks/useGuides";

export const useCanvasSubscribe = () => {
  const doubleClick = useClickAddNode();
  const contextMenu = useContextMenu();
  const autoToContainer = useAutoToContainer();
  const dragNode = useDragNode();
  const guides = useGuides();
  useEventManager([doubleClick, contextMenu, guides, dragNode, autoToContainer]);
};
