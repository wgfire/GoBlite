import { useState } from "react";
import { useToastWithTimeout } from "./useToastWithTimeout";

export const useCrowdin = (projectId?: number, fileName?: string, languageId?: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);
  const [downloadError, setDownloadError] = useState<Error | null>(null);

  // 使用自定义 toast hook
  const showToast = useToastWithTimeout();
  // 上传翻译到Crowdin
  const handleUpload = async (data: { i18nData: string; _callback?: (success: boolean, data?: unknown) => void }) => {
    try {
      setIsUploading(true);
      showToast({
        title: "开始上传翻译",
        description: "正在上传文件到项目id: " + projectId + "，文件名: " + fileName + "，语言id: " + languageId,
        timeout: 0 // 不自动关闭，等待操作完成
      });
      const response = await fetch(import.meta.env.VITE_CROWDIN_API_URL + "/translations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projectId,
          content: data.i18nData,
          fileName,
          languageId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUploadError(errorData);
        showToast({
          title: "上传失败",
          description: errorData.msg || "上传文件失败",
          variant: "destructive",
          timeout: 5000
        });

        if (data._callback) {
          data._callback(false, errorData);
        }

        throw new Error(errorData.msg || "上传文件失败");
      }

      const responseData = await response.json();
      showToast({
        title: "上传成功",
        description: "文件已成功上传到Crowdin",
        variant: "default",
        timeout: 3000
      });

      if (data._callback) {
        data._callback(true, responseData);
      }

      return true;
    } catch (err) {
      setUploadError(err as Error);
      if (data._callback) {
        data._callback(false, err);
      }

      return false;
    } finally {
      setIsUploading(false);
    }
  };
  // 处理下载
  const handleDownloadTranslation = async (
    data: { language?: string; _callback?: (success: boolean, data?: unknown) => void } = {}
  ) => {
    if (!languageId) {
      // 如果有回调函数，调用并传递失败状态
      if (data._callback) {
        data._callback(false, new Error("未设置语言ID"));
      }
      return false;
    }
    try {
      setIsDownloading(true);
      showToast({
        title: "开始下载翻译",
        description: "正在下载文件...",
        variant: "default",
        timeout: 0 // 不自动关闭，等待操作完成
      });
      const response = await fetch(
        import.meta.env.VITE_CROWDIN_API_URL + `/translations/${fileName}/${languageId}?projectId=${projectId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setDownloadError(errorData);
        showToast({
          title: "下载失败",
          description: errorData.message || "获取下载链接失败",
          variant: "destructive",
          timeout: 5000
        });
        // 如果有回调函数，调用并传递失败状态和错误信息
        if (data._callback) {
          data._callback(false, errorData);
        }

        throw new Error(errorData.message || "获取下载链接失败");
      }

      // 解析后端返回的JSON，其中包含下载链接
      const responseData = await response.json();
      const { url: downloadUrl } = responseData;

      // 直接使用该链接进行下载
      const a = document.createElement("a");
      a.href = downloadUrl;
      // Crowdin的下载链接通常已经包含了正确的文件名，所以我们不再需要手动设置 a.download
      // a.download = `${fileName.replace(".json", "")}.${selectedLanguage}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast({
        title: "下载成功",
        description: "翻译文件已成功下载",
        variant: "default",
        timeout: 3000
      });
      // 如果有回调函数，调用并传递成功状态和响应数据
      if (data._callback) {
        data._callback(true, responseData);
      }

      return true;
    } catch (err) {
      setDownloadError(err as Error);
      showToast({
        title: "下载失败",
        description: "获取下载链接失败",
        variant: "destructive",
        timeout: 5000
      });

      // 如果有回调函数且还未调用，调用并传递失败状态和错误信息
      if (data._callback) {
        data._callback(false, err);
      }

      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  /**
   * 获取翻译数据
   * 先获取翻译文件的下载链接，然后获取链接内容并解析为JSON对象返回
   */
  const fetchTranslationData = async ({
    projectId,
    fileName,
    languageId
  }: {
    projectId: number;
    fileName: string;
    languageId: string;
  }) => {
    try {
      // 1. 获取下载链接
      const response = await fetch(
        import.meta.env.VITE_CROWDIN_API_URL + `/translations/${fileName}/${languageId}?projectId=${projectId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "获取下载链接失败");
      }

      // 2. 解析后端返回的JSON，获取下载链接
      const responseData = await response.json();
      const { url: downloadUrl } = responseData;

      if (!downloadUrl) {
        throw new Error("下载链接不存在");
      }

      // 3. 使用下载链接获取翻译文件内容
      const translationResponse = await fetch(downloadUrl);

      if (!translationResponse.ok) {
        throw new Error("获取翻译内容失败");
      }

      // 4. 解析翻译文件内容为JSON对象
      const translationData = await translationResponse.json();
      return translationData;
    } catch (error) {
      console.error("获取翻译数据失败:", error);
      // 出错时返回空对象，避免应用崩溃
      return {};
    }
  };

  return {
    isUploading,
    isDownloading,
    uploadError,
    downloadError,
    handleUpload,
    handleDownloadTranslation,
    fetchTranslationData
  };
};
