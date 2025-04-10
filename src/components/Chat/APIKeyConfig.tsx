import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIModelType } from "@/core/ai";

// 模型配置
const MODEL_CONFIGS = {
  [AIModelType.GPT4O]: { type: AIModelType.GPT4O, name: "OpenAI GPT-4o" },
  [AIModelType.GEMINI_PRO]: { type: AIModelType.GEMINI_PRO, name: "Google Gemini 1.5 Pro" },
  [AIModelType.DEEPSEEK]: { type: AIModelType.DEEPSEEK, name: "DeepSeek Chat" },
};
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiCheck, FiKey, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

interface APIKeyConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modelType: AIModelType, apiKey: string) => Promise<boolean>;
  currentModel: AIModelType;
}

export const APIKeyConfig: React.FC<APIKeyConfigProps> = ({ isOpen, onClose, onSave, currentModel }) => {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModelType>(currentModel);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("请输入API密钥");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const success = await onSave(selectedModel, apiKey);
      if (success) {
        onClose();
      } else {
        setError("保存失败，请检查API密钥是否正确");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 text-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-cyan-400 flex items-center gap-2 text-xl">
            <FiKey className="text-cyan-400" />
            配置AI模型
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="model" className="text-gray-300 font-medium">
              选择AI模型
            </Label>
            <div className="w-full">
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as AIModelType)}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-gray-200 hover:bg-slate-700 hover:border-slate-600 focus:ring-cyan-500/30">
                  <SelectValue placeholder="选择AI模型" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-gray-200">
                  {Object.values(MODEL_CONFIGS).map((config) => (
                    <SelectItem key={config.type} value={config.type} className="hover:bg-slate-700 focus:bg-slate-700 text-gray-200">
                      {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-gray-300 font-medium">
              API密钥
            </Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="输入API密钥"
              className="w-full bg-slate-800 border-slate-700 text-gray-200 placeholder:text-gray-500 focus:ring-cyan-500/30 focus:border-cyan-500"
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm mt-1 bg-red-950/30 p-2 rounded-md border border-red-800/50"
            >
              <FiAlertCircle />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button type="button" variant="outline" onClick={onClose} className="bg-transparent border-slate-700 text-gray-300 hover:bg-slate-800 hover:text-gray-200">
            取消
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white">
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                保存中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiCheck />
                保存
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
