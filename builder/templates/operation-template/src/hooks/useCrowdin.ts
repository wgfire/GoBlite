import { useState, useEffect } from "react";

interface CrowdinHookParams {
  projectId?: number;
  fileName?: string;
  languageId: string | null;
}

/**
 * 一个 React Hook，用于从 Crowdin 获取翻译数据。
 * 它会自动处理加载和错误状态，并在 languageId 变化时重新获取数据。
 * @param {CrowdinHookParams} params - Hook 的参数。
 * @returns {{translation: object, isLoading: boolean, error: string | null}}
 */
export const useCrowdin = ({ projectId = 44, fileName = "main", languageId }: CrowdinHookParams) => {
  const [translation, setTranslation] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果 languageId 不存在，则不执行任何操作
    if (!languageId || !fileName) {
      setTranslation({});
      return;
    }

    const fetchTranslationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 1. 获取下载链接
        const response = await fetch(
          `${import.meta.env.VITE_CROWDIN_API_URL}/translations/${fileName}/${languageId}?projectId=${projectId}`
        );

        if (!response.ok) {
          // 如果是 404 错误，说明该语言的翻译文件不存在，这是正常情况
          if (response.status === 404) {
            console.warn(`No translation file found for language: ${languageId}`);
            setTranslation({});
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || "获取下载链接失败");
        }

        // 2. 解析响应以获取下载 URL
        const responseData = await response.json();
        const { url: downloadUrl } = responseData;

        if (!downloadUrl) {
          throw new Error("下载链接不存在");
        }

        // 3. 使用下载 URL 获取翻译文件
        const translationResponse = await fetch(downloadUrl);

        if (!translationResponse.ok) {
          throw new Error("获取翻译内容失败");
        }

        // 4. 解析翻译文件并更新状态
        const translationData = await translationResponse.json();
        setTranslation(translationData);
      } catch (err: unknown) {
        console.error("获取翻译数据失败:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        // 出错时重置为对象，避免应用崩溃
        setTranslation({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslationData();
  }, [languageId, projectId, fileName]);

  return { translation, isLoading, error };
};
