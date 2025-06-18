import { Suspense, lazy, useEffect, useState } from "react";
import { useLanguage } from "./hooks/useLanguage";
import { HashRouter, Routes, Route } from "react-router-dom";

const PageDisplay = lazy(() => import("./page"));

// Extract supported languages from schema data
const extractSupportedLanguages = schemas => {
  const langSet = new Set();
  if (Array.isArray(schemas)) {
    schemas.forEach(deviceConfig => {
      if (deviceConfig && deviceConfig.languagePageMap) {
        Object.keys(deviceConfig.languagePageMap).forEach(lang => langSet.add(lang));
      }
    });
  }
  const langs = Array.from(langSet);
  return langs.length > 0 ? langs : ["en-US"];
};

// --- App Component ---

const App = () => {
  const [allSchemaData, setAllSchemaData] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [errorSchema, setErrorSchema] = useState(null);
  const [supportedLanguages, setSupportedLanguages] = useState([]);

  // 获取 schema 数据
  useEffect(() => {
    let isMounted = true;
    const fetchSchema = async () => {
      if (!isMounted) return;
      setLoadingSchema(true);
      try {
        const schemaModule = await import("./schema.json");
        const rawSchemaContent = schemaModule.default;
        const parsedSchema = typeof rawSchemaContent === "string" ? JSON.parse(rawSchemaContent) : rawSchemaContent;
        setAllSchemaData(parsedSchema);
        setSupportedLanguages(extractSupportedLanguages(parsedSchema));
      } catch (err) {
        console.error("Failed to load schema.json:", err);
        setErrorSchema("Could not load page configuration.");
      } finally {
        if (isMounted) setLoadingSchema(false);
      }
    };
    fetchSchema();

    return () => {
      isMounted = false;
    };
  }, []);

  // 使用新的 hook 获取语言
  const { language: currentLanguage, loading: loadingLanguage } = useLanguage(supportedLanguages);

  if (loadingSchema || loadingLanguage) {
    return <div>Loading...</div>; // 统一的加载状态
  }

  if (errorSchema || !allSchemaData) {
    return <div>Error: {errorSchema || "Page configuration is missing or invalid."}</div>;
  }

  return (
    <Suspense fallback={<div>Loading Page Component...</div>}>
      <Routes>
        <Route path="/" element={<PageDisplay langCode={currentLanguage} allSchemas={allSchemaData} />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
};

const RootApp = () => (
  <HashRouter>
    <App />
  </HashRouter>
);

export default RootApp;
