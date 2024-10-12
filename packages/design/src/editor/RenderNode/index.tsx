import React, { useRef, useEffect, useCallback } from "react";
import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import { createPortal } from "react-dom";
import { ArrowUp, Move, Trash2 } from "lucide-react";
import { Button } from "@go-blite/shadcn/button";

export const RenderNode: React.FC<{ render: React.ReactElement }> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id)
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent
  } = useNode(node => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
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
      top: `${top > 0 ? top : bottom}px`,
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

  return (
    <>
      {(isHover || isActive) &&
        createPortal(
          <div
            ref={currentRef}
            className={"px-2 py-2 text-white bg-primary fixed flex items-center z-auto"}
            style={{
              left: getPos(dom).left,
              top: getPos(dom).top
            }}
          >
            <h2 className="flex-1 mr-4">{name}</h2>
            {moveable && (
              <Button variant="ghost" size="icon" className="mr-2 cursor-move" ref={drag}>
                <Move className="h-4 w-4" />
              </Button>
            )}
            {id !== ROOT_NODE && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 cursor-pointer"
                onClick={() => actions.selectNode(parent)}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            )}
            {deletable && (
              <Button
                variant="ghost"
                size="icon"
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
