import { useState, useCallback } from "react";
import { CrowdinService } from "../service";
import { CrowdinConfig, defaultConfig } from "../config";

/**
 * 使用Crowdin上传功能的Hook
 * @param config Crowdin配置
 */
export const useCrowdinUpload = (config: CrowdinConfig = defaultConfig) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const crowdinService = new CrowdinService(config);

  /**
   * 上传翻译JSON到Crowdin
   * @param fileName 文件名
   * @param translationData 翻译数据对象
   */
  const uploadTranslation = useCallback(
    async (fileName: string, translationData: Record<string, string>) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        // 将对象转换为JSON字符串
        const fileContent = JSON.stringify(translationData, null, 2);

        // 上传到Crowdin
        const result = await crowdinService.uploadTranslationFile(fileName, fileContent);

        setUploadResult(result);
        return result;
      } catch (error) {
        setUploadError(error as Error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [crowdinService]
  );

  return {
    uploadTranslation,
    isUploading,
    uploadError,
    uploadResult
  };
};
