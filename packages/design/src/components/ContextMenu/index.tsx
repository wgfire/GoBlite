import React from "react";
import { ArrowRightCircle } from "lucide-react"; // 导入 X 图标
import { useDesignContext } from "@/context";

export interface ContextMenuHocProps {
  Settings: React.ReactNode;
  position: { x: number; y: number };
  onClose: () => void;
  name?: string;
}

export const ContextMenuHoc = React.memo((props: ContextMenuHocProps) => {
  const { Settings, position, name = "" } = props;
  const { showSidebar, updateContext } = useDesignContext();
  return (
    <div
      className="bg-white border border-gray-200 rounded shadow-lg p-4 w-68"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        zIndex: 1000
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{name}-属性设置</h3>
        <ArrowRightCircle
          className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" // 可以调整一下样式
          onClick={() => {
            updateContext(draft => {
              draft.showSidebar = !showSidebar;
            });
            props.onClose();
          }}
        />
      </div>

      <>{Settings}</>
    </div>
  );
});
