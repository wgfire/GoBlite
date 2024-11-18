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
  useEventManager([doubleClick, contextMenu, dragNode, guides, autoToContainer]);

  //   registerHook({
  //     id: "customFeature",
  //     handlers: {
  //       mouseDown: data => {
  //         console.log(data, "自定义");
  //       }
  //     }
  //   });
  //   registerHooks([
  //     {
  //       id: "customFeature2",
  //       handlers: {
  //         mouseDown: data => {
  //           console.log(data, "自定义2");
  //         }
  //       }
  //     }
  //   ]);
};
