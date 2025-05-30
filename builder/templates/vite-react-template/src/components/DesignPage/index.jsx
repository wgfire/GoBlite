import { DesignProvider, Preview } from "@go-blite/design";
import { useEffect, useState } from "react";
import "@go-blite/design/styles";

const DesignPage = ({ initialData }) => {
  const [schemaData, setSchemaData] = useState(initialData);

  // 监听 initialData 变化
  useEffect(() => {
    console.log("DesignPage initialData changed:", initialData);
    setSchemaData(initialData);
  }, [initialData]);

  if (!schemaData || typeof schemaData !== "object" || Object.keys(schemaData).length === 0) {
    console.error("DesignPage received invalid or empty initialData:", schemaData);
    return <div>Error: Page configuration data is invalid or missing.</div>;
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
        overflowY: "auto"
      }}
    >
      {/*
        使用 DesignProvider 提供初始配置
        publish: true 表示使用预览模式，会自动使用 defaultViewResolver
      */}
      <DesignProvider
        initialProps={{
          schema: schemaData,
          publish: true
        }}
      >
        <Preview />
      </DesignProvider>
    </div>
  );
};

export default DesignPage;
