import React from "react";
import { useEditor } from "@craftjs/core";
import { ToolbarItem } from "./ToolbarItem";
import { ToolbarSection } from "./ToolbarSection";

export const Toolbar: React.FC = () => {
  const { selected } = useEditor(state => {
    const currentNodeId = state.events.selected;
    return {
      selected: currentNodeId && state.nodes[currentNodeId]
    };
  });

  return (
    <div className="p-4 bg-background border-border">
      {selected && selected.related && selected.related.toolbar && <selected.related.toolbar />}
      {!selected && <div className="text-center text-muted-foreground">Select an element to edit its properties</div>}
    </div>
  );
};

export { ToolbarItem, ToolbarSection };
