import { Suspense, lazy, useMemo } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { useLanguage } from "./hooks/useLanguage";
import { useCurrentSchema } from "./hooks/useCurrentSchema";
import { useCrowdin } from "./hooks/useCrowdin";
import rawSchemaContent from "./schema.json";

const PageDisplay = lazy(() => import("./page"));

// 从 schema 数据中提取支持的语言
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
  // 使用 useMemo 缓存 schema 数据，防止 App 组件重渲染时重复解析
  const allSchemaData = useMemo(() => {
    return typeof rawSchemaContent === "string" ? JSON.parse(rawSchemaContent) : rawSchemaContent;
  }, []); // 空依赖数组，因为 rawSchemaContent 是静态导入，不会改变

  // 同样使用 useMemo 缓存支持的语言列表，只有在 allSchemaData 改变时才重新计算
  const supportedLanguages = useMemo(() => extractSupportedLanguages(allSchemaData), [allSchemaData]);

  // 3. 获取当前语言
  const { language: currentLanguage, loading: loadingLanguage } = useLanguage(supportedLanguages);

  // 4. 使用 hook 计算当前应显示的 schema
  const {
    currentSchema,
    isLoading: isLoadingCurrentSchema,
    error: errorCurrentSchema
  } = useCurrentSchema(allSchemaData, currentLanguage);
  console.log(currentSchema, "currentSchema");
  // 5. 安全地获取 fileName
  const fileName = currentSchema ? `${currentSchema["ROOT"]?.props?.title}.json` : null;

  // 6. 获取当前语言的翻译数据
  // useCrowdin hook 需要能处理 fileName 为 null 的情况，或者我们可以有条件地调用它
  const { translation, isLoading: isLoadingTranslation } = useCrowdin({
    languageId: currentLanguage,
    fileName
  });

  // 7. 统一处理加载状态
  if (loadingLanguage || isLoadingCurrentSchema || isLoadingTranslation) {
    return <div>Loading...</div>;
  }

  // 8. 统一处理错误状态
  if (errorCurrentSchema) {
    return <div>Error: {errorCurrentSchema}</div>;
  }

  return (
    <Suspense fallback={<div>Loading Page Component...</div>}>
      <Routes>
        <Route path="/" element={<PageDisplay currentSchema={currentSchema} translation={translation} />} />
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
