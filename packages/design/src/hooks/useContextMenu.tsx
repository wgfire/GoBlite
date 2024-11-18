import { useEditor } from "@craftjs/core";
import { useCallback } from "react";
import { HookConfig } from "./type";

export const useContextMenu = (): HookConfig => {
  const { query } = useEditor();

  const createContextMenu = useCallback(({ e }: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
    const target = e.target as HTMLElement;
    //const canvas = document.getElementById("blite-canvas")!;
    // const targetX = canvas.getBoundingClientRect().x;
    // const targetY = canvas.getBoundingClientRect().top;
    const position = { x: e.clientX, y: e.clientY + 20 };
    if (target.dataset && target.dataset.id) {
      const currentlySelectedNodeId = query.getEvent("selected").first();
      const node = query.getNodes()[currentlySelectedNodeId];
      try {
        window.dispatchEvent(
          new CustomEvent("showContextMenu", {
            detail: {
              node: node,
              position
            }
          })
        );
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return {
    id: "contextMenu",
    handlers: {
      contextMenu: createContextMenu
    }
  };
};
