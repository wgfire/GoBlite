import { useMemo } from "react";
import { useDesignContext } from "../context/useDesignContext";

/**
 * 多语言翻译钩子函数
 *
 * 根据组件ID和翻译键数组，从设计器上下文中获取对应的翻译文本
 * 使用方式：const { getText } = useI18n("component-id", ["text", "title"]);
 * 然后可以通过 getText("text") 获取对应的翻译文本
 *
 * @param nodeId 组件ID
 * @param keys 需要翻译的键数组
 * @returns 包含 getText 方法的对象，用于获取翻译文本
 */
export const useI18n = (nodeId: string, keys: string[]) => {
  // 从设计器上下文中获取翻译数据
  const { i18n } = useDesignContext();

  // 使用 useMemo 缓存结果，避免不必要的重新计算
  const translationMap = useMemo(() => {
    // 如果没有翻译数据，返回空对象
    if (!i18n?.translation) {
      return {};
    }

    const result: Record<string, string> = {};

    // 遍历所有需要翻译的键
    keys.forEach(key => {
      // 构建翻译键格式：nodeId__key
      const translationKey = `${nodeId}__${key}`;

      // 从翻译数据中获取对应的翻译文本
      const translatedText = i18n.translation[translationKey];

      // 将翻译文本存入结果对象
      result[key] = translatedText || "";
    });

    return result;
  }, [nodeId, keys, i18n?.translation]);

  /**
   * 获取指定键的翻译文本
   *
   * @param key 翻译键
   * @returns 翻译文本，如果没有找到则返回空字符串
   */
  const getText = (key: string): string => {
    return translationMap[key] || "";
  };

  /**
   * 获取所有翻译文本的映射
   *
   * @returns 所有翻译文本的映射对象
   */
  const getAllTexts = (): Record<string, string> => {
    return { ...translationMap };
  };

  return {
    getText,
    getAllTexts,
    translations: translationMap
  };
};
