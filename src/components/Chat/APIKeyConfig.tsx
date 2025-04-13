import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModelType, AI_MODELS } from "@/core/ai";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiCheck, FiKey, FiAlertCircle } from "react-icons/fi";
import { motion } from "framer-motion";

interface APIKeyConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modelType: ModelType, apiKey: string) => Promise<boolean>;
  currentModel: ModelType;
}

export const APIKeyConfig: React.FC<APIKeyConfigProps> = ({ isOpen, onClose, onSave, currentModel }) => {
  const [apiKey, setApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelType>(currentModel);
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
      // 使用try-catch包裹onSave调用，防止未捕获的异常
      let success = false;
      try {
        success = await onSave(selectedModel, apiKey);
      } catch (saveError) {
        console.error("保存API密钥时出错:", saveError);
        throw saveError;
      }

      if (success) {
        onClose();
      } else {
        setError("保存失败，请检查API密钥是否正确");
      }
    } catch (err) {
      console.error("保存API密钥时出错:", err);
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
          <div className="p-3 bg-cyan-900/20 border border-cyan-800/30 rounded-md mb-2">
            <p className="text-sm text-cyan-300">请配置一个AI模型的API密钥以启用完整功能。您可以选择以下任一模型：</p>
            <ul className="mt-2 space-y-1 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span>
                  OpenAI GPT-4o -{" "}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    https://platform.openai.com/api-keys
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span>
                  Google Gemini -{" "}
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    https://aistudio.google.com/app/apikey
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span>
                  DeepSeek -{" "}
                  <a href="https://platform.deepseek.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                    https://platform.deepseek.com/api-keys
                  </a>
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model" className="text-gray-300 font-medium">
              选择AI模型
            </Label>
            <div className="w-full">
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelType)}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-gray-200 hover:bg-slate-700 hover:border-slate-600 focus:ring-cyan-500/30">
                  <SelectValue placeholder="选择AI模型" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-gray-200">
                  {Object.values(AI_MODELS).map((config) => (
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
