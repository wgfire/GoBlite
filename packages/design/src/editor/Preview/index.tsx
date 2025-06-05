import React from "react";
import { Editor, Frame, useEditor, SerializedNodes } from "@craftjs/core";
import { useDesignContext } from "@/context/useDesignContext";
import { defaultNode } from "@/constant";
import { BusinessComponents } from "@/context/Provider"; // 类型导入
import { useMemo } from "react"; // 导入 useMemo

// 内部组件，用于处理 schema 变化
const PreviewContent: React.FC<{ schema: SerializedNodes | string | undefined }> = React.memo(({ schema }) => {
  const { actions } = useEditor();

  React.useEffect(() => {
    console.log("Preview schema changed:", schema);
    if (schema && Object.keys(schema).length > 0) {
      actions.deserialize(schema);
    } else {
      actions.deserialize(JSON.stringify(defaultNode));
    }
  }, [schema, actions]);

  return <Frame />;
});

export const Preview: React.FC = React.memo(() => {
  const designContext = useDesignContext();

  if (!designContext) {
    return null;
  }

  const { resolver: businessComponentsResolver, schema } = designContext;

  const previewResolver = useMemo(() => {
    const resolver: Record<string, React.ElementType> = {};
    if (businessComponentsResolver) {
      businessComponentsResolver.forEach((comp: BusinessComponents) => {
        resolver[comp.name] = comp.viewResolver; // 使用 viewResolver
      });
    }
    return resolver;
  }, [businessComponentsResolver]);

  return (
    <Editor resolver={previewResolver} enabled={false}>
      <PreviewContent schema={schema} />
    </Editor>
  );
});
