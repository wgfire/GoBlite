import React, { useMemo, useEffect } from "react";
import { Editor } from "@craftjs/core";
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

  const contextData = useDesignContext();
  const { resolver, schema, onRender, updateContext } = contextData;
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

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);

  return (
    <Editor
      resolver={mergedResolver}
      enabled={true}
      onRender={renderCallback}
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
