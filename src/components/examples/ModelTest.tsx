/**
 * 模型测试组件
 * 用于测试不同AI模型的功能
 */

import React, { useState } from "react";
import { useLangChainAI, AIModelType } from "@/core/ai";

const ModelTest: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { initialize, sendMessage, currentModelType, switchModel } = useLangChainAI({
    defaultModelType: AIModelType.DEEPSEEK,
    autoInit: true,
  });

  const handleInitialize = async () => {
    setIsLoading(true);
    const success = await initialize(apiKey);
    setIsLoading(false);
    if (success) {
      setResponse("初始化成功");
    } else {
      setResponse("初始化失败");
    }
  };

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    const result = await sendMessage(prompt);
    setIsLoading(false);

    if (result.success) {
      setResponse(result.content || "");
    } else {
      setResponse(`错误: ${result.error}`);
    }
  };

  const handleSwitchModel = (model: AIModelType) => {
    switchModel(model);
    setResponse(`已切换到模型: ${model}`);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">模型测试</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">初始化</h2>
        <div className="flex gap-2">
          <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="API密钥" className="flex-1 p-2 border rounded" />
          <button onClick={handleInitialize} disabled={isLoading} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
            {isLoading ? "处理中..." : "初始化"}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">当前模型: {currentModelType}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleSwitchModel(AIModelType.DEEPSEEK)}
            className={`px-4 py-2 rounded ${currentModelType === AIModelType.DEEPSEEK ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            DeepSeek
          </button>
          <button
            onClick={() => handleSwitchModel(AIModelType.GEMINI_PRO)}
            className={`px-4 py-2 rounded ${currentModelType === AIModelType.GEMINI_PRO ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Gemini
          </button>
          <button
            onClick={() => handleSwitchModel(AIModelType.GPT4O)}
            className={`px-4 py-2 rounded ${currentModelType === AIModelType.GPT4O ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            GPT-4o
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">发送消息</h2>
        <div className="mb-2">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="输入消息..." className="w-full p-2 border rounded min-h-[100px]" />
        </div>
        <button onClick={handleSendMessage} disabled={isLoading || !prompt.trim()} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400">
          {isLoading ? "发送中..." : "发送"}
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">响应</h2>
        <div className="p-4 border rounded min-h-[200px] whitespace-pre-wrap">{response || "响应将显示在这里"}</div>
      </div>
    </div>
  );
};

export default ModelTest;
