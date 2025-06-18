import { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

const PageDisplay = lazy(() => import("./page"));

const getLangFromWindowHeader = () => {
  if (typeof window !== "undefined" && typeof window.getHeader === "function") {
    try {
      const header = window.getHeader();
      if (header && typeof header.Locale === "string" && header.Locale.trim() !== "") {
        return header.Locale;
      }
    } catch (e) {
      console.warn("Error accessing window.getHeader().Locale:", e);
    }
  }
  return null;
};

const getLangFromQuery = () => {
  try {
    const search = location.search;
    const params = new URLSearchParams(search);
    const lang = params.get("lang");
    if (lang && lang.trim() !== "") {
      return lang;
    }
  } catch (e) {
    console.warn("Error parsing URL query parameters for language:", e);
  }
  return null;
};

// 从浏览器偏好获取语言
const getLangFromNavigator = () => {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return null;
};

// 按优先级确定有效语言
const determineEffectiveLanguage = supportedLanguages => {
  let lang = null;

  // 1. 从 URL 查询参数 (?lang=xx) 获取
  lang = getLangFromQuery();
  if (lang && supportedLanguages.includes(lang)) {
    return lang;
  }
  console.log(lang, "getLangFromQuery");

  // 2. 从 window.getHeader().Locale 获取
  lang = getLangFromWindowHeader();
  if (lang) {
    if (supportedLanguages.includes(lang)) return lang;
  }

  // 3. 从浏览器语言 (navigator.language) 获取
  const navLang = getLangFromNavigator();
  if (navLang) {
    if (supportedLanguages.includes(navLang)) return navLang;
  }

  // 4. 默认使用第一个支持的语言或硬编码的默认值
  if (supportedLanguages.length > 0) {
    return supportedLanguages[0];
  }
  return "en-US"; // Fallback default language
};

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
  const [currentLanguage, setCurrentLanguage] = useState(null);
  const [loadingSchema, setLoadingSchema] = useState(true);
  const [errorSchema, setErrorSchema] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSchemaAndSetLanguage = async () => {
      if (!isMounted) return;
      setLoadingSchema(true);
      setErrorSchema(null);

      try {
        const schemaModule = await import("./schema.json");
        const rawSchemaContent = schemaModule.default;

        if (typeof rawSchemaContent !== "string") {
          console.warn("schema.json's default export was not a string.");
        }
        const parsedSchema = typeof rawSchemaContent === "string" ? JSON.parse(rawSchemaContent) : rawSchemaContent;

        if (!isMounted) return;
        setAllSchemaData(parsedSchema);

        const supportedLangs = extractSupportedLanguages(parsedSchema);
        console.log(supportedLangs, "supportedLangs", parsedSchema);
        const effectiveLang = determineEffectiveLanguage(supportedLangs);
        console.log(effectiveLang, "当前语言");
        if (!isMounted) return;
        setCurrentLanguage(effectiveLang);
      } catch (err) {
        console.error("Failed to load schema.json or determine language:", err);
        if (!isMounted) return;
        setErrorSchema("Could not load page configuration or language settings.");
      } finally {
        if (isMounted) {
          setLoadingSchema(false);
        }
      }
    };

    fetchSchemaAndSetLanguage();

    return () => {
      isMounted = false;
    };
  }, []);
  if (loadingSchema) {
    return <div>Loading page configuration...</div>;
  }

  if (errorSchema || !allSchemaData) {
    return <div>Error: {errorSchema || "Page configuration is missing or invalid."}</div>;
  }

  if (!currentLanguage) {
    return <div>Determining language settings...</div>;
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
