import React from "react";
import { useEditor } from "@craftjs/core";

export const Settings: React.FC = () => {
  const { active, related } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();
    return {
      active: currentlySelectedNodeId,
      related: currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related
    };
  });

  return (
    <div className="p-4 bg-background border-border">
      {active && related.settings && React.createElement(related.settings)}
      {!active && (
        <div
          className="px-5 py-2 flex flex-col items-center h-full justify-center text-center"
          style={{
            color: "rgba(0, 0, 0, 0.5607843137254902)",
            fontSize: "11px"
          }}
        >
          <h2 className="text-sm">拖拽或者选中组件来开始配置</h2>
        </div>
      )}
    </div>
  );
};
