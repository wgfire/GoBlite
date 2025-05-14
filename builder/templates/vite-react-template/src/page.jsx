import { useState, useEffect, useMemo } from "react";
import DesignPage from "./components/DesignPage";
import { useDeviceType } from "./hooks/useDeviceType";

const PageDisplay = ({ langCode, allSchemas }) => {
  const deviceType = useDeviceType();
  const [currentSchema, setCurrentSchema] = useState(null);
  const [pageTemplate, setPageTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const structuredSchemas = useMemo(() => {
    if (!allSchemas || !Array.isArray(allSchemas)) return {};
    return allSchemas.reduce((acc, deviceConfig) => {
      if (deviceConfig && deviceConfig.type) {
        // 添加检查
        acc[deviceConfig.type] = {
          pageTemplate: deviceConfig.pageTemplate,
          languagePageMap: deviceConfig.languagePageMap
        };
      }
      return acc;
    }, {});
  }, [allSchemas]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setCurrentSchema(null);
    setPageTemplate(null);

    console.log(`[PageDisplay] Attempting to load schema for: lang=${langCode}, device=${deviceType}`);

    let schemaToLoad = null;
    let template = null;
    let found = false;

    const deviceData = structuredSchemas[deviceType];

    if (deviceData && deviceData.languagePageMap) {
      if (deviceData.languagePageMap[langCode]) {
        schemaToLoad = deviceData.languagePageMap[langCode].schema;
        template = deviceData.pageTemplate;
        found = true;
        console.log(`[PageDisplay] Found exact match: device=${deviceType}, lang=${langCode}`);
      } else {
        // Fallback 1: Current device, default language (e.g., 'zh')
        const fallbackLang = "zh"; // Or from config
        if (deviceData.languagePageMap[fallbackLang]) {
          schemaToLoad = deviceData.languagePageMap[fallbackLang].schema;
          template = deviceData.pageTemplate;
          found = true;
          console.warn(
            `[PageDisplay] Fallback 1: device=${deviceType}, lang=${fallbackLang} (original lang ${langCode} not found)`
          );
        }
      }
    }

    // Fallback 2: Default device (e.g., 'desktop'), current language
    if (!found && deviceType !== "desktop") {
      console.warn(`[PageDisplay] Trying Fallback 2: device=desktop, lang=${langCode}`);
      const desktopData = structuredSchemas["desktop"];
      if (desktopData && desktopData.languagePageMap && desktopData.languagePageMap[langCode]) {
        schemaToLoad = desktopData.languagePageMap[langCode].schema;
        template = desktopData.pageTemplate;
        found = true;
        console.log(`[PageDisplay] Found in Fallback 2: device=desktop, lang=${langCode}`);
      } else if (desktopData && desktopData.languagePageMap) {
        // Fallback 3: Default device, default language
        const fallbackLang = "zh";
        if (desktopData.languagePageMap[fallbackLang]) {
          schemaToLoad = desktopData.languagePageMap[fallbackLang].schema;
          template = desktopData.pageTemplate;
          found = true;
          console.warn(`[PageDisplay] Fallback 3: device=desktop, lang=${fallbackLang}`);
        }
      }
    }

    if (schemaToLoad) {
      setCurrentSchema(schemaToLoad);
      setPageTemplate(template);
    } else {
      setError(`Schema not found for language "${langCode}" on "${deviceType}" device after all fallbacks.`);
      console.error(`[PageDisplay] Schema not found for: lang=${langCode}, device=${deviceType}`);
    }
    setIsLoading(false);
  }, [langCode, deviceType, structuredSchemas]);

  useEffect(() => {
    if (pageTemplate) {
      document.title = `Page: ${pageTemplate} (${langCode.toUpperCase()}) - ${deviceType}`;
    }
  }, [pageTemplate, langCode, deviceType]);

  if (isLoading)
    return (
      <div>
        Loading content... (lang: {langCode}, device: {deviceType})
      </div>
    );
  if (error) return <div>Error: {error}</div>;
  if (!currentSchema)
    return <div>No schema available for the current selection. (Template: {pageTemplate || "N/A"})</div>;

  return <DesignPage initialData={currentSchema} />;
};

export default PageDisplay;
