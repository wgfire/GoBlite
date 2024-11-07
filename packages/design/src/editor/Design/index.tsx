import React, { useMemo, useEffect, useState } from "react";
import { Editor, Frame, useEditor, SerializedNodes } from "@craftjs/core";
import { RenderNode } from "../RenderNode";
import { ViewImport } from "../ViewImport";
import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container";
import { Text } from "@/selectors/Text";
import { Button } from "@/selectors/Button";
import { Image } from "@/selectors/Image";
import { Devices } from "@/context/Provider";
import Loading from "@/components/Loading";

const defaultNode: SerializedNodes = {
  ROOT: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      width: "100%",
      background: "rgba(255,255,255,1)",
      padding: 10,
      height: "100%",
      flexDirection: "column"
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(schema, "schema");
    if (schema && Object.keys(schema).length > 0) {
      actions.deserialize(schema);
    } else {
      actions.deserialize(defaultNode);
    }
  }, [schema, actions]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <>
      <ViewImport>
        <Frame></Frame>
      </ViewImport>
      <Loading loading={loading} />
    </>
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
    <Editor resolver={mergedResolver} enabled={true} onRender={renderCallback}>
      <EditorContent schema={schema} />
    </Editor>
  );
});

Design.displayName = "Design";
