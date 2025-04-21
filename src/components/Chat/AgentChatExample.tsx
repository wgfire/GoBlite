import React, { useState } from "react";
import { useAgentChat } from "@/core/ai/langgraph/hooks/useChatAgent";
import { ChatHeader } from "./ChatHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HeaderTab } from "./types";

export const AgentChatExample = () => {
  const [activeTab, setActiveTab] = useState<HeaderTab>("conversations");
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 使用useAgentChat hook
  const { isInitialized, isLoading, error, messages, sendMessage } = useAgentChat();

  // 处理发送消息
  const handleSendMessage = async () => {
    if (!userInput.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(userInput);
      setUserInput("");
      console.log("消息发送成功", messages);
    } catch (error) {
      console.error("发送消息失败:", error);
    } finally {
      setIsSending(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* 聊天头部 */}
      <ChatHeader onTemplateSelect={() => {}} selectedTemplate={null} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 聊天内容 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!isInitialized ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-slate-300">初始化中...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p>出错了: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                重新加载
              </Button>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-slate-300">开始一个新的聊天吧！</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : message.role === "assistant"
                    ? "bg-slate-700 text-white"
                    : "bg-slate-800 text-slate-300 italic text-sm"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-bounce text-slate-400">...</div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex space-x-2">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="flex-1 bg-slate-800 border-slate-700 focus:border-blue-500 text-white"
            disabled={!isInitialized || isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isInitialized || isLoading || !userInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentChatExample;
