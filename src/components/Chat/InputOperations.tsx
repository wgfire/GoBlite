import React, { useRef, ChangeEvent } from "react";
import { FiUpload, FiZap } from "react-icons/fi";
import { AIModelType, DEFAULT_MODEL_CONFIGS } from "@/core/ai/hooks/useAIService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";

interface InputOperationsProps {
  onOptimizePrompt: () => void;
  isOptimizing: boolean;
  isSending: boolean;
  hasPrompt: boolean;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  currentModel: AIModelType;
  onModelChange: (model: AIModelType) => void;
}

export const InputOperations: React.FC<InputOperationsProps> = ({ onOptimizePrompt, isOptimizing, isSending, hasPrompt, onFileUpload, currentModel, onModelChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex  space-x-2 items-center px-2 py-4 border-t border-gray-700  bg-gray-800">
      <div className="flex space-x-2">
        <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors" title="Upload file">
          <FiUpload size={18} />
        </button>
        <input type="file" ref={fileInputRef} onChange={onFileUpload} className="hidden" multiple />

        <button
          onClick={onOptimizePrompt}
          disabled={isOptimizing || !hasPrompt || isSending}
          className="text-yellow-400 hover:text-yellow-300 p-2 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Optimize prompt"
        >
          <FiZap size={18} />
        </button>
      </div>

      <div className="flex items-center">
        <Select value={currentModel} onValueChange={(value) => onModelChange(value as AIModelType)} disabled={isSending}>
          <SelectTrigger className="h-8 bg-gray-700 border-gray-600 text-sm">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(DEFAULT_MODEL_CONFIGS).map((config) => (
              <SelectItem key={config.type} value={config.type}>
                {config.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
