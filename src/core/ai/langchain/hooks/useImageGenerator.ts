/**
 * 图像生成钩子
 * 提供图像生成功能
 */

import { useState, useCallback } from "react";
import { useMessageHandler } from "./useMessageHandler";
import { AIServiceStatus, ImageGenerationOptions, ImageGenerationResult } from "../../types";
import { IMAGE_GENERATION_SYSTEM_PROMPT, ERROR_MESSAGES } from "../../constants";

/**
 * 图像生成钩子选项
 */
export interface UseImageGeneratorOptions {
  /** 消息处理钩子 */
  messageHandler: ReturnType<typeof useMessageHandler>;
  /** 服务状态 */
  status: AIServiceStatus;
}

/**
 * 图像生成钩子
 * 提供图像生成功能
 */
export const useImageGenerator = (options: UseImageGeneratorOptions) => {
  // 状态
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 生成图像
   * @param prompt 提示词
   * @param imageOptions 图像生成选项
   * @returns 图像生成结果
   */
  const generateImage = useCallback(
    async (prompt: string, imageOptions?: ImageGenerationOptions): Promise<ImageGenerationResult> => {
      try {
        // 检查服务状态
        if (options.status !== AIServiceStatus.READY) {
          throw new Error(ERROR_MESSAGES.SERVICE_NOT_READY);
        }

        // 构建提示词
        let fullPrompt = prompt;
        if (imageOptions?.width && imageOptions?.height) {
          fullPrompt += `\n图像尺寸: ${imageOptions.width}x${imageOptions.height}`;
        }
        if (imageOptions?.style) {
          fullPrompt += `\n图像风格: ${imageOptions.style}`;
        }

        // 发送消息
        const response = await options.messageHandler.sendMessage(fullPrompt, {
          ...imageOptions,
          systemPrompt: imageOptions?.systemPrompt || IMAGE_GENERATION_SYSTEM_PROMPT,
        });

        if (!response.success) {
          throw new Error(response.error || ERROR_MESSAGES.IMAGE_GENERATION_FAILED);
        }

        // 模拟图像生成（实际项目中应该调用真实的图像生成API）
        // 这里只是返回一个占位图像URL
        const imageUrl = `https://via.placeholder.com/${imageOptions?.width || 512}x${imageOptions?.height || 512}?text=AI+Generated+Image`;
        setGeneratedImageUrl(imageUrl);

        return {
          ...response,
          imageUrl,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.IMAGE_GENERATION_FAILED;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [options.status, options.messageHandler]
  );

  return {
    // 状态
    generatedImageUrl,
    error,

    // 方法
    generateImage,
  };
};

export default useImageGenerator;
