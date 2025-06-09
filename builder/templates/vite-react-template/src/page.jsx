import { useState, useEffect, useMemo } from "react";
import DesignPage from "./components/DesignPage";
import { useDeviceType } from "./hooks/useDeviceType";

// 辅助函数：为指定设备配置查找 schema 和模板
const findSchemaForDevice = (deviceConfig, primaryLang, fallbackLang) => {
  if (!deviceConfig || !deviceConfig.languagePageMap) {
    return null; // 没有此设备的语言映射数据
  }

  let schema = null;
  let langUsed = null;

  if (deviceConfig.languagePageMap[primaryLang]) {
    schema = deviceConfig.languagePageMap[primaryLang].schema;
    langUsed = primaryLang;
  } else if (deviceConfig.languagePageMap[fallbackLang]) {
    schema = deviceConfig.languagePageMap[fallbackLang].schema;
    langUsed = fallbackLang;
  }

  if (schema) {
    return {
      schema: schema,
      template: deviceConfig.pageTemplate, // 模板与设备配置关联
      langUsed: langUsed // 实际使用的语言
    };
  }
  return null; // 在此设备配置下未找到指定语言的 schema
};

const Page = ({ langCode, allSchemas }) => {
  const deviceType = useDeviceType();
  const [currentSchema, setCurrentSchema] = useState(null);
  const [pageTemplate, setPageTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const structuredSchemas = useMemo(() => {
    if (!allSchemas || !Array.isArray(allSchemas)) return {};
    return allSchemas.reduce((acc, deviceConfig) => {
      if (deviceConfig && deviceConfig.type) {
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

    const fallbackLanguage = "en-US";
    let foundSchemaInfo = null;

    console.log(`[PageDisplay] Attempting to load schema for: lang=${langCode}, device=${deviceType}`);

    // 尝试1: 当前设备类型，目标语言 -> 回退语言
    const currentDeviceConfig = structuredSchemas[deviceType];
    if (currentDeviceConfig) {
      foundSchemaInfo = findSchemaForDevice(currentDeviceConfig, langCode, fallbackLanguage);
      if (foundSchemaInfo) {
        console.log(
          `[PageDisplay] Schema found: device=${deviceType}, lang=${foundSchemaInfo.langUsed} (requested lang ${langCode})`
        );
      }
    }

    // 尝试2: 如果未找到，且当前非桌面设备，则回退到桌面设备，目标语言 -> 回退语言
    if (!foundSchemaInfo && deviceType !== "desktop") {
      console.warn(`[PageDisplay] Fallback to desktop device: trying lang=${langCode}, then ${fallbackLanguage}`);
      const desktopDeviceConfig = structuredSchemas["desktop"];
      if (desktopDeviceConfig) {
        foundSchemaInfo = findSchemaForDevice(desktopDeviceConfig, langCode, fallbackLanguage);
        if (foundSchemaInfo) {
          console.log(
            `[PageDisplay] Schema found in desktop fallback: device=desktop, lang=${foundSchemaInfo.langUsed}`
          );
        }
      }
    }

    if (foundSchemaInfo && foundSchemaInfo.schema) {
      setCurrentSchema(foundSchemaInfo.schema);
      setPageTemplate(foundSchemaInfo.template);
      console.log(foundSchemaInfo.schema, "当前渲染的schema");
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

  if (isLoading) return <div>Loading content...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentSchema) return <div>No schema available for the current selection.</div>;

  return <DesignPage initialData={currentSchema} />;
};

export default Page;
