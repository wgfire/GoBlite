import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { Editor, QueryMethods } from "@craftjs/core";
import { RenderNode } from "../RenderNode";

import { useDesignContext } from "@/context/useDesignContext";
import { EditorContent } from "./EditorContent";
import { Toaster } from "@go-blite/shadcn";

export const Design: React.FC = React.memo(() => {
  // 使用 useDesignContext 获取上下文，不再传入 initialProps
  const { resolver, schema, onRender, currentInfo } = useDesignContext();

  // 使用 useRef 存储 currentInfo，确保始终能访问到最新值
  const currentInfoRef = useRef(currentInfo);

  // 当 currentInfo 变化时更新 ref
  useEffect(() => {
    currentInfoRef.current = currentInfo;
    console.log(currentInfo, "currentInfo");
  }, [currentInfo]);

  const onNodesChange = useCallback((query: ReturnType<typeof QueryMethods>) => {
    // console.log(query.getSerializedNodes(), "query", currentInfoRef.current);
    localStorage.setItem(currentInfoRef.current.device, JSON.stringify(query.getSerializedNodes()));
  }, []);

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);

  return (
    <>
      <Toaster />
      <Editor
        resolver={resolver}
        enabled={true}
        onRender={renderCallback}
        onNodesChange={onNodesChange}
        indicator={{
          success: "opacity: 0",
          error: "opacity: 1"
        }}
      >
        <EditorContent schema={schema} />
      </Editor>
    </>
  );
});

Design.displayName = "Design";
