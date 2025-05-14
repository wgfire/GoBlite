import React, { useMemo, useEffect, useCallback, useRef } from "react";
import { Editor, QueryMethods } from "@craftjs/core";
import { RenderNode } from "../RenderNode";

import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container/Container.edit";
import { Text } from "@/selectors/Text/Text.edit";
import { Button } from "@/selectors/Button/Button.edit";
import { Image } from "@/selectors/Image/Image.edit";
import { App } from "@/selectors/App/App.edit";

import { EditorContent } from "./EditorContent";
export { defaultDevice, defaultNode } from "./EditorContent";

export const Design: React.FC = React.memo(() => {
  const defaultResolver = useMemo(
    () => ({
      Container,
      Text,
      Button,
      Image,
      App
    }),
    []
  );

  const { resolver, schema, onRender, updateContext, currentInfo } = useDesignContext();

  // 使用 useRef 存储 currentInfo，确保始终能访问到最新值
  const currentInfoRef = useRef(currentInfo);

  // 当 currentInfo 变化时更新 ref
  useEffect(() => {
    currentInfoRef.current = currentInfo;
    console.log(currentInfo, "currentInfo");
  }, [currentInfo]);

  useEffect(() => {
    updateContext(draft => {
      draft.resolver = mergedResolver;
    });
  }, []);

  const mergedResolver = useMemo(
    () => ({
      ...defaultResolver,
      ...resolver
    }),
    [defaultResolver, resolver]
  );

  const onNodesChange = useCallback((query: ReturnType<typeof QueryMethods>) => {
    // console.log(query.getSerializedNodes(), "query", currentInfoRef.current);
    localStorage.setItem(currentInfoRef.current.device, JSON.stringify(query.getSerializedNodes()));
  }, []);

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);
  return (
    <Editor
      resolver={mergedResolver}
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
  );
});

Design.displayName = "Design";
