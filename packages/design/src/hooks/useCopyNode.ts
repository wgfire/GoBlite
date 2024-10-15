import { useCallback } from "react";
import { Node, NodeTree, FreshNode, useEditor } from "@craftjs/core";

export const useCopyNode = () => {
  const { actions, query } = useEditor();

  const createNodeTree = useCallback(
    (node: Node): NodeTree => {
      const freshNode: FreshNode = {
        data: {
          ...node.data,
          nodes: []
        }
      };
      const newNode = query.parseFreshNode(freshNode).toNode();
      const newNodeId = newNode.id;

      const nodeTree: NodeTree = {
        rootNodeId: newNodeId,
        nodes: {
          [newNodeId]: newNode
        }
      };

      if (node.data.nodes && Array.isArray(node.data.nodes)) {
        node.data.nodes.forEach(childId => {
          const childNode = query.node(childId).get();
          if (childNode) {
            const childTree = createNodeTree(childNode);
            nodeTree.nodes = { ...nodeTree.nodes, ...childTree.nodes };
            nodeTree.nodes[newNodeId].data.nodes.push(childTree.rootNodeId);
          }
        });
      }

      return nodeTree;
    },
    [query]
  );

  const copyNode = useCallback(
    (node: Node, parentId: string): string | null => {
      if (!node || !node.data) {
        console.error("Invalid node data", node);
        return null;
      }

      const nodeTree = createNodeTree(node);

      if (nodeTree) {
        try {
          actions.addNodeTree(nodeTree, parentId);
          return nodeTree.rootNodeId;
        } catch {
          return null;
        }
      }
      return null;
    },
    [actions, createNodeTree]
  );

  return copyNode;
};
