import React, { useMemo, useEffect } from "react";
import { Editor, Frame, useEditor, SerializedNodes } from "@craftjs/core";
import { RenderNode } from "../RenderNode";
import { ViewImport } from "../ViewImport";
import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text";
import { Button } from "@/selectors/Button";
import { Image } from "@/selectors/Image";
const defaultNode: SerializedNodes = {
  ROOT: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      width: "100%",
      background: { r: 255, g: 255, b: 255, a: 1 },
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
  const { resolver, schema, onRender } = useDesignContext({ publish: true });

  const renderCallback = useMemo(() => onRender || RenderNode, [onRender]);

  const defaultResolver = {
    Container,
    Text,
    Button,
    Image
  };
  const setResolver = {
    ...defaultResolver,
    ...resolver
  };
  return (
    <div className="h-screen">
      <Editor resolver={setResolver} enabled={true} onRender={renderCallback}>
        <EditorContent schema={schema} />
      </Editor>
    </div>
  );
});

Design.displayName = "Design";
