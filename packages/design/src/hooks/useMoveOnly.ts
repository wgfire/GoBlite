import { useEditor } from "@craftjs/core";

/**
 * @description 只移动节点，不操作dom,代替craftjs的move方法
 */
export const useMoveNodeOnly = () => {
  const { query, actions } = useEditor();

  const moveNodeOnly = (nodeId: string, newParentId: string, index: number) => {
    try {
      // 1. 获取当前完整的节点树
      const currentNodes = query.getSerializedNodes();

      // 2. 获取需要移动的节点信息
      const node = currentNodes[nodeId];

      if (!node || !node.parent) return;

      const oldParentId = node.parent;
      const oldParent = currentNodes[oldParentId];
      const newParent = currentNodes[newParentId];

      if (!oldParent || !newParent) return;

      // 3. 构建新的节点树
      const newNodes = {
        ...currentNodes,
        [oldParentId]: {
          ...oldParent,
          nodes: oldParent.nodes.filter(id => id !== nodeId)
        },
        [newParentId]: {
          ...newParent,
          nodes: [...newParent.nodes.slice(0, index), nodeId, ...newParent.nodes.slice(index)]
        },
        [nodeId]: {
          ...node,
          parent: newParentId
        }
      };

      // 4. 使用 deserialize 重新加载整个状态树
      console.log(newNodes, "newNodes");
      actions.deserialize(newNodes);
      actions.selectNode(nodeId);
    } catch (error) {
      console.error("Error in moveNodeOnly:", error);
    }
  };

  return { moveNodeOnly };
};
