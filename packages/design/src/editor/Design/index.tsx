import React, { useMemo, useEffect } from "react";
import { Editor, Frame, useEditor, SerializedNodes } from "@craftjs/core";
import { RenderNode } from "../RenderNode";
import { ViewImport } from "../ViewImport";
import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text/Text.edit";
import { Button } from "@/selectors/Button/Button.edit";
import { Image } from "@/selectors/Image";
import { Devices } from "@/context/Provider";

const defaultNode: SerializedNodes = {
  ROOT: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      width: "100%",
      background: "rgba(255,255,255,1)",
      padding: 10
    },
    nodes: [],
    linkedNodes: {},
    parent: null,
    hidden: false,
    displayName: "Container",
    custom: { displayName: "App" }
  }
};

export const defaultDevice: Devices = [
  {
    type: "desktop",
    pageTemplate: "static-download",
    languagePageMap: {
      zh: {
        schema: defaultNode
      }
    }
  }
];

const EditorContent: React.FC<{ schema: string | SerializedNodes | undefined }> = ({ schema }) => {
  const { actions } = useEditor();

  useEffect(() => {
    console.log(schema, "schema");
    if (schema && Object.keys(schema).length > 0) {
      actions.deserialize(schema);
    } else {
      actions.deserialize(defaultNode);
    }
  }, [schema, actions]);

  return (
    <ViewImport>
      <Frame></Frame>
    </ViewImport>
  );
};

export const Design: React.FC = React.memo(() => {
  const defaultResolver = useMemo(
    () => ({
      Container,
      Text,
      Button,
      Image
    }),
    []
  );
  const initDesign = useMemo(
    () => ({
      resolver: defaultResolver
    }),
    [defaultResolver]
  );

  const contextData = useDesignContext(initDesign);
  const { resolver, schema, onRender } = contextData;

  const mergedResolver = useMemo(
    () => ({
      ...defaultResolver,
      ...resolver
    }),
    [defaultResolver, resolver]
  );

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);

  return (
    <Editor resolver={mergedResolver} enabled={true} onRender={renderCallback}>
      <EditorContent schema={schema} />
    </Editor>
  );
});

Design.displayName = "Design";
