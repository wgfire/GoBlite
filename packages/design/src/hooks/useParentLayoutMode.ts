import { useEditor } from "@craftjs/core";
import { useMemo } from "react";

// 获取父容器的布局模式
export const useParentLayoutMode = (nodeId: string): "absolute" | "flow" => {
  const { query } = useEditor();

  return useMemo(() => {
    try {
      const node = query.getNodes()[nodeId];
      if (!node) return "absolute";

      const parentId = node.data.parent;
      if (!parentId) return "absolute";

      const parentNode = query.getNodes()[parentId];
      if (!parentNode) return "absolute";

      // 检查父节点是否有layoutMode属性
      const parentLayoutMode = parentNode.data.props?.layoutMode;
      return parentLayoutMode === "flow" ? "flow" : "absolute";
    } catch (error) {
      console.warn("获取父容器布局模式失败:", error);
      return "absolute";
    }
  }, [nodeId, query]);
};
