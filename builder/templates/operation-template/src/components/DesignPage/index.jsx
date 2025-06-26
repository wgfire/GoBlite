import { DesignProvider, Preview } from "@go-blite/design";
import { useEffect, useState } from "react";
import "@go-blite/design/styles";
// 导入外部业务组件
import { externalBusinessComponents } from "../../businessComponents";

const DesignPage = ({ initialData }) => {
  const [schemaData, setSchemaData] = useState(initialData.schema);
  const [translationData, setTranslationData] = useState(initialData.translation);

  // 监听 initialData 变化
  useEffect(() => {
    console.log("DesignPage initialData changed:", initialData);
    setSchemaData(initialData.schema);
    setTranslationData(initialData.translation);
  }, [initialData]);

  if (!schemaData || typeof schemaData !== "object" || Object.keys(schemaData).length === 0) {
    console.error("DesignPage received invalid or empty initialData:", schemaData);
    return <div>Error: Page configuration data is invalid or missing.</div>;
  }
  console.log("翻译数据", translationData);

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
          publish: true,
          // 传递外部业务组件
          resolver: externalBusinessComponents,
          i18n: {
            translation: translationData
          }
        }}
      >
        <Preview />
      </DesignProvider>
    </div>
  );
};

export default DesignPage;
