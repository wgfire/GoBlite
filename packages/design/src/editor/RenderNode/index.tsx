import React, { useRef, useEffect, useCallback } from "react";
import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import { createPortal } from "react-dom";
import { ArrowUp, Move, Trash2, Copy } from "lucide-react";
import { Button } from "@go-blite/shadcn/button";
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

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) {
        dom.classList.add("component-selected");
      } else {
        dom.classList.remove("component-selected");
      }
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom: HTMLElement | null) => {
    const { top, left, bottom } = dom ? dom.getBoundingClientRect() : { top: 0, left: 0, bottom: 0 };

    return {
      top: `${top > 0 ? top - 39 : bottom}px`,
      left: `${left}px`
    };
  }, []);

  const scroll = useCallback(() => {
    const el = currentRef.current;
    if (!el) return;
    const { top, left } = getPos(dom);
    el.style.top = top;
    el.style.left = left;
  }, [dom, getPos]);

  useEffect(() => {
    const craftjsRenderer = document.querySelector(".craftjs-renderer");
    if (craftjsRenderer) {
      craftjsRenderer.addEventListener("scroll", scroll);
    }
    return () => {
      if (craftjsRenderer) {
        craftjsRenderer.removeEventListener("scroll", scroll);
      }
    };
  }, [scroll]);

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
            className="py-1 px-1 text-white bg-primary fixed flex items-center z-[9999] rounded-md"
            style={{
              left: getPos(dom).left,
              top: getPos(dom).top
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
