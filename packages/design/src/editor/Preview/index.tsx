import React from "react";
import { Editor, Frame, useEditor, SerializedNodes } from "@craftjs/core";
import { useDesignContext } from "@/context/useDesignContext";
import { defaultNode } from "../Design/EditorContent";

// 内部组件，用于处理 schema 变化
const PreviewContent: React.FC<{ schema: SerializedNodes | string | undefined }> = React.memo(({ schema }) => {
  const { actions } = useEditor();

  // 使用 useEffect 监听 schema 变化
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
  // 使用 useDesignContext 获取上下文，不再传入 initialProps
  const { resolver, schema } = useDesignContext();

  return (
    <Editor resolver={resolver} enabled={false}>
      <PreviewContent schema={schema} />
    </Editor>
  );
});
