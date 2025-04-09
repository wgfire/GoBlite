/**
 * 模型切换器钩子
 */

import { useState, useCallback, useEffect } from 'react';
import { ModelSwitcher, ModelProvider, ModelConfig } from '../langchain/modelSwitcher';
import { AIMessage } from '@langchain/core/messages';

export interface UseModelSwitcherOptions {
  initialModels: ModelConfig[];
  defaultModel?: string;
}

export interface UseModelSwitcherResult {
  availableModels: string[];
  currentModel: string;
  isProcessing: boolean;
  error: string | null;
  switchModel: (modelKey: string) => boolean;
  sendMessage: (messages: Array<[string, string]>) => Promise<AIMessage>;
}

/**
 * 模型切换器钩子函数
 * 提供在React组件中使用模型切换器的能力
 */
export const useModelSwitcher = (options: UseModelSwitcherOptions): UseModelSwitcherResult => {
  const [modelSwitcher, setModelSwitcher] = useState<ModelSwitcher | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化模型切换器
  useEffect(() => {
    try {
      const switcher = new ModelSwitcher(options.initialModels, options.defaultModel);
      setModelSwitcher(switcher);
      setAvailableModels(switcher.getAvailableModels());
      setCurrentModel(switcher.getCurrentModelKey());
    } catch (err) {
      setError(err instanceof Error ? err.message : '初始化模型切换器失败');
    }
  }, [options.initialModels, options.defaultModel]);

  // 切换模型
  const switchModel = useCallback((modelKey: string): boolean => {
    if (!modelSwitcher) return false;
    
    const success = modelSwitcher.switchModel(modelKey);
    if (success) {
      setCurrentModel(modelSwitcher.getCurrentModelKey());
    }
    return success;
  }, [modelSwitcher]);

  // 发送消息
  const sendMessage = useCallback(async (messages: Array<[string, string]>): Promise<AIMessage> => {
    if (!modelSwitcher) {
      throw new Error('模型切换器未初始化');
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await modelSwitcher.sendMessage(messages);
      setIsProcessing(false);
      return response;
    } catch (err) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err.message : '发送消息失败';
      setError(errorMessage);
      throw err;
    }
  }, [modelSwitcher]);

  return {
    availableModels,
    currentModel,
    isProcessing,
    error,
    switchModel,
    sendMessage,
  };
};
