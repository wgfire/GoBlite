import { Frame, SerializedNodes, useEditor } from "@craftjs/core";
import { ViewImport } from "../ViewImport";
import Loading from "@/components/Loading";
import { memo, useEffect, useState } from "react";
import { Devices } from "@/context/Provider";
import { useDesignContext } from "@/context";
export const defaultNode: SerializedNodes = {
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
        height: "auto",
        minHeight: "100%",
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
