import { Suspense, lazy, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

const PageDisplay = lazy(() => import("./PageDisplay"));

// 动态导入 schema.json
// Vite 支持 JSON 导入
// 注意：在构建时，这个 import 会被处理，schema.json 的内容会包含在包里
// import initialAllSchemas from './schema.json'; // 假设后端会将 schema 放在这里

const App = () => {
  const [allSchemaData, setAllSchemaData] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [errorSchema, setErrorSchema] = useState(null);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        // Vite 将会处理这个动态导入。确保 schema.json 存在于 src 目录中
        const schemaModule = await import("./schema.json");
        setAllSchemaData(schemaModule.default); // JSON 模块的默认导出是其内容
      } catch (err) {
        console.error("Failed to load schema.json:", err);
        setErrorSchema("Could not load page configuration.");
      } finally {
        setLoadingSchema(false);
      }
    };
    fetchSchema();
  }, []);

  if (loadingSchema) {
    return <div>Loading page configuration...</div>;
  }

  if (errorSchema || !allSchemaData) {
    return <div>Error: {errorSchema || "Page configuration is missing."}</div>;
  }

  // 从 schema 数据动态生成支持的语言列表
  const getSupportedLanguages = schemas => {
    const langSet = new Set();
    if (Array.isArray(schemas)) {
      schemas.forEach(deviceConfig => {
        if (deviceConfig.languagePageMap) {
          Object.keys(deviceConfig.languagePageMap).forEach(lang => langSet.add(lang));
        }
      });
    }
    const langs = Array.from(langSet);
    return langs.length > 0 ? langs : ["zh"]; // 默认 'zh' 如果没有找到
  };

  const supportedLanguages = getSupportedLanguages(allSchemaData);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading Page Component...</div>}>
        <Routes>
          <Route
            path="/:langCode"
            element={<LanguageGate supportedLanguages={supportedLanguages} schemas={allSchemaData} />}
          />
          <Route path="/" element={<Navigate to={`/${supportedLanguages[0] || "zh"}`} replace />} />
          <Route path="*" element={<div>404 - Page Not Found (Client Side)</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const LanguageGate = ({ supportedLanguages, schemas }) => {
  const { langCode } = useParams();
  const defaultLang = supportedLanguages[0] || "zh";

  if (!langCode || !supportedLanguages.includes(langCode.toLowerCase())) {
    return <Navigate to={`/${defaultLang}`} replace />;
  }
  return <PageDisplay langCode={langCode.toLowerCase()} allSchemas={schemas} />;
};

export default App;
