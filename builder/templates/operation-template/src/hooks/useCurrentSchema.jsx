import { useState, useEffect, useMemo } from "react";
import { useDeviceType } from "./useDeviceType";
import { findSchemaForDevice } from "../utils/findSchemaForDevice";

/**
 * 根据设备类型、语言和所有可用 schema，计算出当前应该渲染的 schema。
 * 包含了设备和语言的回退逻辑。
 * @param {Array} allSchemas - 所有设备和语言的 schema 配置数组。
 * @param {string} langCode - 当前选择的目标语言代码。
 * @returns {{currentSchema: object|null, isLoading: boolean, error: string|null}}
 */
export const useCurrentSchema = (allSchemas, langCode) => {
  const deviceType = useDeviceType();
  const [currentSchema, setCurrentSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 将数组结构的 schema 转换为以设备类型为 key 的对象，方便查找
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
    // 确保所有依赖项都已准备好
    if (!langCode || !deviceType || !allSchemas) {
      setIsLoading(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentSchema(null);

    const fallbackLanguage = "en-US"; // 定义回退语言
    let foundSchemaInfo = null;

    // 尝试1: 在当前设备类型中查找 schema (目标语言 -> 回退语言)
    const currentDeviceConfig = structuredSchemas[deviceType];
    if (currentDeviceConfig) {
      foundSchemaInfo = findSchemaForDevice(currentDeviceConfig, langCode, fallbackLanguage);
    }

    // 尝试2: 如果未找到，并且当前不是桌面设备，则回退到桌面设备再次查找
    if (!foundSchemaInfo && deviceType !== "desktop") {
      const desktopDeviceConfig = structuredSchemas["desktop"];
      if (desktopDeviceConfig) {
        foundSchemaInfo = findSchemaForDevice(desktopDeviceConfig, langCode, fallbackLanguage);
      }
    }

    if (foundSchemaInfo && foundSchemaInfo.schema) {
      setCurrentSchema(foundSchemaInfo.schema);
    } else {
      setError(`Schema not found for language "${langCode}" on "${deviceType}" device after all fallbacks.`);
    }
    setIsLoading(false);
  }, [langCode, deviceType, structuredSchemas, allSchemas]);

  return { currentSchema, isLoading, error };
};
