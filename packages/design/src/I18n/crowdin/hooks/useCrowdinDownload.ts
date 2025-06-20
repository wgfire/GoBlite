import { useState, useCallback } from "react";
import { CrowdinConfig } from "../config";
import { defaultConfig } from "../config";
import { CrowdinService } from "../service";

/**
 * 使用Crowdin下载功能的Hook
 * @param config Crowdin配置
 */
export const useCrowdinDownload = (config: CrowdinConfig = defaultConfig) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<Error | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);

  const crowdinService = new CrowdinService(config);

  /**
   * 下载特定语言的翻译
   * @param languageId 语言ID (如 'zh-CN', 'en', 'ja')
   * @param fileId 可选的文件ID
   */
  const downloadTranslation = useCallback(
    async (languageId: string, fileId?: number) => {
      setIsDownloading(true);
      setDownloadError(null);

      try {
        // 获取下载链接
        const url = await crowdinService.downloadTranslation(languageId, fileId);
        setDownloadUrl(url);

        // 下载并解析JSON
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`下载失败: ${response.statusText}`);
        }

        const translationData = await response.json();
        setTranslations(translationData);

        return translationData;
      } catch (error) {
        setDownloadError(error as Error);
        throw error;
      } finally {
        setIsDownloading(false);
      }
    },
    [crowdinService]
  );

  return {
    downloadTranslation,
    isDownloading,
    downloadError,
    downloadUrl,
    translations
  };
};
