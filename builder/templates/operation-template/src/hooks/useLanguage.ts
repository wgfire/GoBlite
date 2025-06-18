import { useState, useEffect } from "react";
import { useAppEnv } from "./useAppEnv";

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

const getLangFromNavigator = () => {
  if (typeof navigator !== "undefined" && navigator.language) {
    return navigator.language;
  }
  return null;
};

export const useLanguage = (supportedLanguages: string[]) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { envData, loading: envLoading } = useAppEnv();

  useEffect(() => {
    if (envLoading) {
      return; // 等待 useAppEnv 完成加载
    }

    let effectiveLang: string | null = null;

    // 优先级 1: 从 URL 查询参数获取
    effectiveLang = getLangFromQuery();
    if (effectiveLang && supportedLanguages.includes(effectiveLang)) {
      setLanguage(effectiveLang);
      setLoading(false);
      return;
    }

    // 优先级 2: 从 App 环境 (window.getHeader) 获取
    if (envData.Locale && supportedLanguages.includes(envData.Locale)) {
      setLanguage(envData.Locale);
      setLoading(false);
      return;
    }

    // 优先级 3: 从浏览器偏好获取
    effectiveLang = getLangFromNavigator();
    if (effectiveLang && supportedLanguages.includes(effectiveLang)) {
      setLanguage(effectiveLang);
      setLoading(false);
      return;
    }

    // 优先级 4: 默认使用支持的第一个语言或备选
    setLanguage(supportedLanguages.length > 0 ? supportedLanguages[0] : "en-US");
    setLoading(false);
  }, [supportedLanguages, envData, envLoading]);

  return { language, loading };
};
