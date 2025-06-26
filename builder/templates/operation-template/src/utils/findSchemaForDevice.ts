import { DesignContextProps } from "@/packages/design/src";

// 辅助函数：为指定设备配置查找 schema 和模板
export const findSchemaForDevice = (
  deviceConfig: DesignContextProps["device"][number],
  primaryLang: string,
  fallbackLang: string
) => {
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
      schema,
      template: deviceConfig.pageTemplate,
      langUsed: langUsed
    };
  }
  return null; // 在此设备配置下未找到指定语言的 schema
};
