import React, { useRef, ChangeEvent } from "react";
import { FiUpload, FiZap, FiSettings } from "react-icons/fi";
import { AIModelType } from "@/core/ai/hooks/useLangChainService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

// 模型配置
const MODEL_CONFIGS = {
  [AIModelType.GPT4O]: { type: AIModelType.GPT4O, name: "OpenAI GPT-4o" },
  [AIModelType.GEMINI_PRO]: { type: AIModelType.GEMINI_PRO, name: "Google Gemini 2.5 Pro" },
  [AIModelType.DEEPSEEK]: { type: AIModelType.DEEPSEEK, name: "DeepSeek Chat" },
};
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InputOperationsProps {
  onOptimizePrompt: () => void;
  isOptimizing: boolean;
  isSending: boolean;
  hasPrompt: boolean;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  currentModel: AIModelType;
  onModelChange: (model: AIModelType) => void;
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
        <Select value={currentModel} onValueChange={(value) => onModelChange(value as AIModelType)} disabled={isSending}>
          <SelectTrigger className="h-8 bg-gray-700 border-gray-600 text-sm min-w-[120px]">
            <SelectValue placeholder="选择模型" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(MODEL_CONFIGS).map((config) => (
              <SelectItem key={config.type} value={config.type}>
                {config.name}
              </SelectItem>
            ))}
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
