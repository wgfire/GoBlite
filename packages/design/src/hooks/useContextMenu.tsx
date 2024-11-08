import { useEditor } from "@craftjs/core";
import { useCallback } from "react";

export const useContextMenu = () => {
  const { query } = useEditor();

  const createContextMenu = useCallback(({ e }: { e: React.MouseEvent<HTMLDivElement, MouseEvent> }) => {
    const target = e.target as HTMLElement;
    const canvas = document.getElementById("blite-canvas")!;
    const targetX = canvas.getBoundingClientRect().x;
    const targetY = canvas.getBoundingClientRect().y;
    const position = { x: e.clientX - targetX + 100, y: e.clientY - targetY + 20 };
    if (target.dataset && target.dataset.id) {
      const currentlySelectedNodeId = query.getEvent("selected").first();
      const node = query.getNodes()[currentlySelectedNodeId];
      console.log(node);
      window.dispatchEvent(
        new CustomEvent("showContextMenu", {
          detail: {
            node: node,
            position
          }
        })
      );
    }
  }, []);

  return { createContextMenu };
};