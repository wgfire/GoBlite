import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { Editor, QueryMethods } from "@craftjs/core";
import { RenderNode } from "../RenderNode";

import { useDesignContext } from "@/context/useDesignContext";
import { EditorContent } from "./EditorContent";
import { Toaster } from "@go-blite/shadcn";

import { BusinessComponents } from "@/context/Provider"; // 类型导入

export const Design: React.FC = React.memo(() => {
  const designContext = useDesignContext();

  const { resolver: businessComponentsResolver, schema, onRender, currentInfo } = designContext;

  // 使用 useRef 存储 currentInfo，确保始终能访问到最新值
  const currentInfoRef = useRef(currentInfo);

  // 当 currentInfo 变化时更新 ref
  useEffect(() => {
    currentInfoRef.current = currentInfo;
    // console.log(currentInfo, "currentInfo in Design"); // 避免不必要的 console.log
  }, [currentInfo]);

  const onNodesChange = useCallback((query: ReturnType<typeof QueryMethods>) => {
    if (currentInfoRef.current?.device) {
      // 确保 currentInfoRef.current 和 device 存在
      localStorage.setItem(currentInfoRef.current.device, JSON.stringify(query.getSerializedNodes()));
    }
  }, []);

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);

  // 为 Craft.js Editor 构建 resolver 对象

  const editorResolver = useMemo(() => {
    const resolver: Record<string, React.ElementType> = {};
    if (businessComponentsResolver) {
      businessComponentsResolver.forEach((comp: BusinessComponents) => {
        resolver[comp.name] = comp.editResolver;
      });
    }
    return resolver;
  }, [businessComponentsResolver]);

  return (
    <>
      <Toaster />
      <Editor
        resolver={editorResolver} // 使用转换后的 resolver
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
