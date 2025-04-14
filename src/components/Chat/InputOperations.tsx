import React, { useRef, ChangeEvent } from "react";
import { FiUpload, FiZap, FiSettings } from "react-icons/fi";
import { ModelType, AI_MODELS } from "@/core/ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { useAtom } from "jotai";
import { availableModelsAtom } from "@/core/ai/atoms/modelAtoms";
import { toast } from "@/components/ui/use-toast";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InputOperationsProps {
  onOptimizePrompt: () => void;
  isOptimizing: boolean;
  isSending: boolean;
  hasPrompt: boolean;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  currentModel: ModelType;
  onModelChange: (model: ModelType) => void;
  onOpenAPIKeyConfig?: () => void;
}

export const InputOperations: React.FC<InputOperationsProps> = ({
  onOptimizePrompt,
  isOptimizing,
  isSending,
  hasPrompt,
  onFileUpload,
  currentModel,
  onModelChange,
  onOpenAPIKeyConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availableModels] = useAtom(availableModelsAtom);

  // 处理模型切换，如果模型不可用则显示提示
  const handleModelChange = (modelType: ModelType) => {
    console.log(`尝试切换到模型: ${modelType}`);
    console.log(`可用模型列表:`, availableModels);
    console.log(`AI_MODELS中的配置:`, AI_MODELS[modelType]);

    if (availableModels.includes(modelType)) {
      console.log(`模型 ${modelType} 可用，开始切换`);
      onModelChange(modelType);
    } else {
      // 获取模型提供商
      const provider = AI_MODELS[modelType]?.provider;
      console.log(`模型 ${modelType} 不可用，提供商: ${provider}`);
      toast({
        title: "模型不可用",
        description: `请先配置${provider}的API密钥`,
        variant: "default",
      });

      // 打开API密钥配置对话框
      if (onOpenAPIKeyConfig) {
        onOpenAPIKeyConfig();
      }
    }
  };

  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-gray-700 bg-gray-800">
      <div className="flex space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                disabled={isSending}
              >
                <FiUpload size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>上传文件</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" multiple />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onOptimizePrompt}
                disabled={isOptimizing || !hasPrompt || isSending}
                className={`p-2 rounded-full hover:bg-gray-700 transition-colors ${
                  isOptimizing ? "text-yellow-500 animate-pulse" : "text-yellow-400 hover:text-yellow-300"
                } disabled:opacity-50`}
              >
                <FiZap size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>优化提示词</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center space-x-2">
        <Select value={currentModel} onValueChange={(value) => handleModelChange(value as ModelType)} disabled={isSending}>
          <SelectTrigger className="h-8 bg-gray-700 border-gray-600 text-sm min-w-[120px]">
            <SelectValue placeholder="选择模型" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(AI_MODELS).map((config) => {
              const isAvailable = availableModels.includes(config.modelType);
              return (
                <SelectItem key={config.modelType} value={config.modelType} disabled={!isAvailable} className={!isAvailable ? "opacity-50 cursor-not-allowed" : ""}>
                  {config.modelType} {!isAvailable && "(需配置API密钥)"}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {onOpenAPIKeyConfig && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onOpenAPIKeyConfig} className="text-cyan-400 hover:text-cyan-300 p-2 rounded-full hover:bg-gray-700 transition-colors">
                  <FiSettings size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>API密钥设置</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};
