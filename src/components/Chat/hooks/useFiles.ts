/**
 * 文件管理钩子
 * 提供文件上传、删除等功能，并使用jotai管理状态
 */
import { useCallback } from "react";
import { useAtom } from "jotai";
import { uploadedFilesAtom, isProcessingFilesAtom, fileUploadErrorAtom } from "../atoms/filesAtom";
import { toast } from "@/components/ui/use-toast";

export const useFiles = () => {
  // 使用jotai原子状态
  const [uploadedFiles, setUploadedFiles] = useAtom(uploadedFilesAtom);
  const [isProcessingFiles, setIsProcessingFiles] = useAtom(isProcessingFilesAtom);
  const [fileUploadError, setFileUploadError] = useAtom(fileUploadErrorAtom);

  /**
   * 处理文件上传
   * @param e 文件上传事件
   */
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;

      try {
        const newFiles = Array.from(e.target.files).map((file) => ({
          id: crypto.randomUUID(),
          file,
          previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }));

        setUploadedFiles((prev) => [...prev, ...newFiles]);
        setFileUploadError(null);
      } catch (error) {
        console.error("文件上传失败:", error);
        setFileUploadError(error instanceof Error ? error.message : "文件上传失败");
        toast({
          title: "文件上传失败",
          description: error instanceof Error ? error.message : "未知错误",
          variant: "default",
        });
      }
    },
    [setUploadedFiles, setFileUploadError]
  );

  /**
   * 移除上传的文件
   * @param id 文件ID
   */
  const removeFile = useCallback(
    (id: string) => {
      setUploadedFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);
        if (fileToRemove?.previewUrl) {
          URL.revokeObjectURL(fileToRemove.previewUrl);
        }
        return prev.filter((f) => f.id !== id);
      });
    },
    [setUploadedFiles]
  );

  /**
   * 清空所有上传的文件
   */
  const clearFiles = useCallback(() => {
    setUploadedFiles((prev) => {
      // 释放所有预览URL
      prev.forEach((file) => {
        if (file.previewUrl) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
      return [];
    });
  }, [setUploadedFiles]);

  return {
    // 状态
    uploadedFiles,
    isProcessingFiles,
    fileUploadError,

    // 设置状态
    setUploadedFiles,
    setIsProcessingFiles,
    setFileUploadError,

    // 方法
    handleFileUpload,
    removeFile,
    clearFiles,
  };
};
