import React, { useRef, useEffect, useCallback, useState, useLayoutEffect, useMemo } from "react";
import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import { createPortal } from "react-dom";
import { ArrowUp, Trash2, Copy, Maximize } from "lucide-react";
import { Button } from "@go-blite/shadcn";
import { flushSync } from "react-dom";
import { useCopyNode } from "@/hooks/useCopyNode";
import expect from "@/utils/expect";

export const RenderNode: React.FC<{ render: React.ReactElement }> = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent("selected").contains(id)
  }));

  const copyNode = useCopyNode();

  const { isHover, dom, name, deletable, parent, props } = useNode(node => ({
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

  const isDragging = useMemo(() => {
    return dom?.getAttribute("data-dragging") === "true";
  }, [dom?.getAttribute("data-dragging")]);

  const getPos = useCallback((dom: HTMLElement | null) => {
    if (!dom || !currentRef.current) return { top: "0px", left: "0px" };
    const { bottom, right, width } = dom.getBoundingClientRect();
    const offset = right - width * 0.5 - currentRef.current.offsetWidth / 2;

    return {
      top: `${bottom + 20}px`,
      left: `${offset}px`
    };
  }, []);

  useEffect(() => {
    let time = null;
    if (props.customStyle?.position === "fixed") {
      if (time) clearTimeout(time);
    } else {
      time = setTimeout(() => {}, 1000);
    }
    return () => {
      if (time) {
        clearTimeout(time);
      }
    };
  }, [props?.customStyle?.position]);

  const updatePosition = useCallback(() => {
    if (dom && currentRef.current) {
      const newPos = getPos(dom);
      setPosition(newPos);
    }
  }, [dom, getPos]);

  useLayoutEffect(() => {
    updatePosition();
  }, [isHover, isActive, updatePosition, isDragging]);

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

  // 处理宽度设置为100%并清空left值
  const handleFullWidth = useCallback(() => {
    flushSync(() => {
      actions.setProp(id, props => {
        // 设置宽度为100%
        if (props.style) {
          props.customStyle.width = "100%";
        }

        // 清空left值
        if (props.customStyle) {
          props.customStyle.left = "0";
        }
      });
    });

    // 如果有dom元素，更新其样式 让拖拽手柄能够更新
    if (dom && dom instanceof HTMLElement) {
      dom.style.width = "100%";
      dom.style.left = "";
    }
  }, [id, actions, dom]);

  return (
    <>
      {isActive &&
        !isDragging &&
        createPortal(
          <div
            ref={currentRef}
            className="py-1 px-1 text-white bg-primary fixed flex items-center z-[100] rounded-md animate-accordion-down"
            style={{
              left: position.left,
              top: position.top
            }}
          >
            <h4 className="flex-1 mr-2 text-sm">{name}</h4>
            {id !== ROOT_NODE && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2 cursor-pointer"
                  onClick={handleFullWidth}
                  title="宽度100%"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </>
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
