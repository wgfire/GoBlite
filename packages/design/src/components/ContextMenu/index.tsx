import React from "react";
import { ArrowRightCircle } from "lucide-react";
import { useDesignContext } from "@/context";

export interface ContextMenuHocProps {
  Settings: React.ReactNode;
  position: { x: number; y: number };
  onClose: () => void;
}

export const ContextMenuHoc = React.memo((props: ContextMenuHocProps) => {
  const { Settings, position } = props;
  const { showSidebar, updateContext } = useDesignContext();
  return (
    <div
      className="bg-white border border-gray-200 rounded shadow-lg p-4 w-64"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 100
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">属性设置</h3>
        <ArrowRightCircle
          className="h-4 w-4 cursor-pointer"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("closeContextMenu"));
            updateContext(draft => {
              draft.showSidebar = !showSidebar;
            });
          }}
        />
      </div>

      <>{Settings}</>
    </div>
  );
});
