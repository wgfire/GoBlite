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

      if (!oldParent || !newParent || oldParentId === newParentId) return;
      console.log([...newParent.nodes.slice(0, index), nodeId], oldParentId, newParentId, "oldParent, newParent");

      // 3. 构建新的节点树
      const newNodes = {
        ...currentNodes,
        [oldParentId]: {
          ...oldParent,
          nodes: oldParent.nodes.filter(id => id !== nodeId)
        },
        [newParentId]: {
          ...newParent,
          nodes: [...newParent.nodes.slice(0, index), nodeId]
        },
        [nodeId]: {
          ...node,
          parent: newParentId
        }
      };

      // 4. 使用 deserialize 重新加载整个状态树，用craftjs的 action state 来设置 由于dom层与内部状态树不一致，导致craftjs报错
      // 使用 history.ignore() 避免记录这个操作到历史记录中，因为这只是同步DOM操作到状态树
      console.log(newNodes, "newNodes");
      actions.deserialize(newNodes);
      actions.selectNode(nodeId);
    } catch (error) {
      console.error("Error in moveNodeOnly:", error);
    }
  };

  return { moveNodeOnly };
};
