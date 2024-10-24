import React, { useRef, useEffect, useCallback, useState, useLayoutEffect } from "react";
import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import { createPortal } from "react-dom";
import { ArrowUp, Move, Trash2, Copy } from "lucide-react";
import { Button } from "@go-blite/shadcn";
import { useCopyNode } from "@/hooks/useCopyNode";
import expect from "@/utils/expect";

export const RenderNode: React.FC<{ render: React.ReactElement }> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id)
  }));

  const copyNode = useCopyNode();

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    parent,
    connectors: { drag }
  } = useNode(node => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent!,
    props: node.data.props
  }));

  const currentRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: "0px", left: "0px" });

  const getPos = useCallback((dom: HTMLElement | null) => {
    if (!dom || !currentRef.current) return { top: "0px", left: "0px" };
    const { top, bottom, right } = dom.getBoundingClientRect();
    const offset = right - currentRef.current.clientWidth;

    return {
      top: `${top > 0 ? top - 39 : bottom}px`,
      left: `${offset}px`
    };
  }, []);

  const updatePosition = useCallback(() => {
    if (dom && currentRef.current) {
      const newPos = getPos(dom);
      setPosition(newPos);
    }
  }, [dom, getPos]);

  useLayoutEffect(() => {
    updatePosition();
  }, [isHover, isActive, updatePosition]);

  useEffect(() => {
    const craftjsRenderer = document.querySelector(".blite-renderer");
    if (craftjsRenderer) {
      craftjsRenderer.addEventListener("scroll", updatePosition);
    }
    return () => {
      if (craftjsRenderer) {
        craftjsRenderer.removeEventListener("scroll", updatePosition);
      }
    };
  }, [updatePosition]);

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) {
        dom.classList.add("component-selected");
      } else {
        dom.classList.remove("component-selected");
      }
    }
  }, [dom, isActive, isHover]);

  const handleCopy = useCallback(() => {
    const node = query.node(id).get();
    if (!node || !node.data.parent) {
      console.error("当前节点不存在", id);
      return;
    }

    const parentId = node.data.parent;
    const newNodeId = copyNode(node, parentId);

    expect(() => {
      actions.selectNode(newNodeId as string);
    })(() => typeof newNodeId === "string")(() => {
      console.log("newNodeId没有", newNodeId);
    });
  }, [id, query, actions, copyNode]);

  return (
    <>
      {(isHover || isActive) &&
        createPortal(
          <div
            ref={currentRef}
            className="py-1 px-1 text-white bg-primary fixed flex items-center z-[9999] rounded-md animate-accordion-down"
            style={{
              left: position.left,
              top: position.top
            }}
          >
            <h4 className="flex-1 mr-2 text-sm">{name}</h4>
            {moveable && (
              <Button variant="ghost" size="sm" className="mr-2 cursor-move" ref={drag as React.Ref<HTMLButtonElement>}>
                <Move className="h-4 w-4" />
              </Button>
            )}
            {id !== ROOT_NODE && (
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 cursor-pointer"
                onClick={() => actions.selectNode(parent)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
            {id !== ROOT_NODE && (
              <Button variant="ghost" size="sm" className="mr-2 cursor-pointer" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
            )}
            {deletable && (
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer"
                onMouseDown={e => {
                  e.stopPropagation();
                  actions.delete(id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>,
          document.querySelector(".page-container") as Element
        )}
      {render}
    </>
  );
};
