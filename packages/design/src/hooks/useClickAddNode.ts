import { Container, defaultProps } from "@/selectors/Container/Container.edit";
import { FreshNode, useEditor } from "@craftjs/core";
import { useCallback } from "react";
import { HookConfig } from "./type";
/**
 * 根据传入的id，在当前id的父级节点下添加一个节点
 */
export const useClickAddNode = (): HookConfig => {
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
            ...defaultProps.style,
            width: "100px",
            height: "100px",
            background: "rgba(255, 255, 255, 0.8)",
            border: "1px solid rgba(0, 0, 0, 0.3)"
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
    id: "doubleClick",
    handlers: {
      doubleClick: clickAddNode
    }
  };
};
