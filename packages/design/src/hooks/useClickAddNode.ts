import { Container } from "@/selectors/Container/Container.edit";
import { FreshNode, useEditor } from "@craftjs/core";
import { useCallback } from "react";

/**
 * 根据传入的id，在当前id的父级节点下添加一个节点
 */
export const useClickAddNode = () => {
  const {
    query,
    actions: { add, selectNode }
  } = useEditor();

  const clickAddNode = useCallback(({ id }: { id: string }) => {
    const parentNode = query.node(id);
    const isCanvas = parentNode.isCanvas();
    const freshNode: FreshNode = {
      data: {
        type: Container,
        isCanvas: true,
        parent: id,
        props: {
          style: {
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.8)"
          }
        },
        nodes: []
      }
    };
    const node = query.parseFreshNode(freshNode).toNode();
    if (isCanvas) {
      console.log(parentNode, id);
      add(node, id);
      selectNode(node.id);
    }
  }, []);

  return {
    clickAddNode
  };
};
