import React, { useMemo, useEffect, useState, memo } from "react";
import { Editor, Frame, useEditor, SerializedNodes } from "@craftjs/core";
import { RenderNode } from "../RenderNode";
import { ViewImport } from "../ViewImport";
import { useDesignContext } from "@/context/useDesignContext";
import { Container } from "@/selectors/Container/Container.edit";
import { Text } from "@/selectors/Text/Text.edit";
import { Button } from "@/selectors/Button/Button.edit";
import { Image } from "@/selectors/Image/Image.edit";
import { Devices } from "@/context/Provider";
import Loading from "@/components/Loading";

const defaultNode: SerializedNodes = {
  ROOT: {
    type: {
      resolvedName: "Container"
    },
    isCanvas: true,
    props: {
      style: {
        display: "grid",
        gridAutoFlow: "row",
        gridTemplateColumns: "1fr",
        gridAutoRows: "minmax(0px,100%)",
        gap: "10px",
        padding: 10,
        height: "100%",
        width: "100%",
        flexDirection: "column",
        background: "rgba(255,255,255,1)",
        alignContent: "start"
      }
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

const EditorContent: React.FC<{ schema: string | SerializedNodes | undefined }> = memo(({ schema }) => {
  const { actions } = useEditor();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(schema, "schema");
    if (schema && Object.keys(schema).length > 0) {
      actions.deserialize(schema);
    } else {
      console.log(defaultNode, "defaultNode");
      actions.deserialize(JSON.stringify(defaultNode));
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
});

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
