import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ContextMenuHoc } from "./index";
import { Node as CraftNode } from "@craftjs/core";

interface ContextMenuState {
  node: CraftNode;
  position: { x: number; y: number };
}

export const ContextMenuManager: React.FC = () => {
  const [menuState, setMenuState] = useState<ContextMenuState | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleShowContextMenu = (e: CustomEvent<ContextMenuState>) => {
      setMenuState(e.detail);
    };

    const handleHideContextMenu = (e: MouseEvent) => {
      // 如果点击的元素是菜单内部的元素，不关闭菜单
      console.log(e.target);
      if (menuRef.current?.contains(e.target as Node)) {
        return;
      }
      setMenuState(null);
    };

    // 添加事件监听
    window.addEventListener("showContextMenu", handleShowContextMenu as EventListener);
    window.addEventListener("click", handleHideContextMenu);

    return () => {
      window.removeEventListener("showContextMenu", handleShowContextMenu as EventListener);
      window.removeEventListener("click", handleHideContextMenu);
    };
  }, []);

  if (!menuState) return null;

  const Settings = () => {
    // 根据 node 的 related.settings 返回不同的菜单内容
    return React.createElement(menuState.node.related.settings);
  };

  return createPortal(
    <div ref={menuRef}>
      <ContextMenuHoc Settings={<Settings />} position={menuState.position} onClose={() => setMenuState(null)} />
    </div>,
    document.body
  );
};
