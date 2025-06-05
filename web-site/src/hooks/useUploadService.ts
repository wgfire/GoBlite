import { useState } from "react";
import { useToast } from "@go-blite/shadcn/hooks/use-toast";

interface UploadServiceOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useUploadService = (options?: UploadServiceOptions) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const processDownloadAndUpload = async (deviceInfo: { device: unknown; projectName?: string }) => {
    const { device, projectName = "test" } = deviceInfo;
    setIsProcessing(true);
    try {
      // 1. 调用构建服务
      toast({
        title: "开始构建",
        description: "正在准备您的设计稿..."
      });
      const rawBuilderApiUrl = import.meta.env.VITE_BUILDER_API_URL;
      let builderApiUrl;

      if (rawBuilderApiUrl.startsWith("http")) {
        builderApiUrl = rawBuilderApiUrl;
      } else {
        const origin = window.location.origin;

        if (rawBuilderApiUrl.startsWith("/") && origin.endsWith("/")) {
          builderApiUrl = `${origin.slice(0, -1)}${rawBuilderApiUrl}`;
        } else if (!rawBuilderApiUrl.startsWith("/") && !origin.endsWith("/")) {
          builderApiUrl = `${origin}/${rawBuilderApiUrl}`;
        } else {
          builderApiUrl = `${origin}${rawBuilderApiUrl}`;
        }
      }

      const buildResponse = await fetch(builderApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projectName: projectName,
          schema: JSON.stringify(device) // 确保 device 是 schema 数据或者包含 schema 的对象
        })
      });

      if (!buildResponse.ok) {
        const errorText = await buildResponse.text();
        console.error("构建服务响应错误:", errorText);
        let errorMessage = `构建失败: ${buildResponse.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = `构建失败: ${buildResponse.status} ${errorData.message || buildResponse.statusText}`;
        } catch (_) {
          errorMessage = `构建失败: ${buildResponse.status} ${buildResponse.statusText || errorText}`;
        }
        throw new Error(errorMessage);
      }

      const buildData = await buildResponse.json();

      if (!buildData.buildId) {
        throw new Error("获取构建ID失败，响应数据缺少 buildId");
      }

      toast({
        title: "构建成功",
        description: `构建ID: ${buildData.buildId}，正在下载文件...`
      });

      // 2. 下载 zip 文件
      const downloadResponse = await fetch(`http://localhost:3002/api/build/download/${buildData.buildId}`);

      if (!downloadResponse.ok) {
        throw new Error(`下载构建文件失败: ${downloadResponse.status} ${downloadResponse.statusText}`);
      }
      const blob = await downloadResponse.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mt-${projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      const fileName = `mt-${projectName}.zip`;
      const file = new File([blob], fileName, { type: "application/zip" });

      toast({
        title: "下载完成",
        description: "正在上传文件到服务器..."
      });

      // 3. 上传到服务器 (使用 FormData)
      const formData = new FormData();
      formData.append("file", file, fileName);

      const uploadResponse = await fetch("https://demo-resource.mistorebox.com/api/op/resource/v1/file/upload-zip", {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("上传服务响应错误:", errorText);
        let errorMessage = `上传失败: ${uploadResponse.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = `上传失败: ${uploadResponse.status} ${errorData.message || uploadResponse.statusText}`;
        } catch (_) {
          errorMessage = `上传失败: ${uploadResponse.status} ${uploadResponse.statusText || errorText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await uploadResponse.json();
      toast({
        title: "上传成功",
        description: "资源已成功上传到服务器。",
        variant: "default"
      });
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      console.error("处理下载和上传过程中发生错误:", error);
      toast({
        title: "操作失败",
        description: "在处理过程中发生未知错误。",
        variant: "destructive"
      });
      options?.onError?.(error as Error);
    } finally {
      setIsProcessing(false);
    }
    return null;
  };

  return {
    processDownloadAndUpload,
    isProcessing
  };
};
