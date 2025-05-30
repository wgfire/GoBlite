import { Frame, SerializedNodes, useEditor } from "@craftjs/core";
import { ViewImport } from "../ViewImport";
import Loading from "@/components/Loading";
import { memo, useEffect, useState } from "react";
import { useDesignContext } from "@/context";
import { defaultNode } from "@/constant";

export const EditorContent: React.FC<{ schema: string | SerializedNodes | undefined }> = memo(({ schema }) => {
  const { actions } = useEditor();
  const [loading, setLoading] = useState(true);
  const contextData = useDesignContext();
  const {
    currentInfo: { device }
  } = contextData;
  useEffect(() => {
    console.log(schema, "schema");
    if (schema && Object.keys(schema).length > 0) {
      actions.deserialize(schema);
    } else {
      actions.deserialize(JSON.stringify(defaultNode));
    }
  }, [schema, device]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
