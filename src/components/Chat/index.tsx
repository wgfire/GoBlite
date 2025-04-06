import React, { useState, useCallback } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { InputArea } from "./InputArea";
import { HeaderTab, Message, UploadedFile } from "./types";
import { Template } from "@/template/types";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateForm } from "../TemplateForm";

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<HeaderTab>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const handleSend = useCallback(async (prompt: string, files: UploadedFile[]) => {
    if (!prompt.trim() && files.length === 0) return;

    setIsSending(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: prompt,
      timestamp: Date.now(),
      files: files.length > 0 ? files : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const aiResponse: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: `这是对"${prompt}"的AI回复${files.length > 0 ? `，并收到${files.length}个文件` : ""}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "抱歉，处理请求时出错",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  }, []);

  const handleOptimizePrompt = useCallback(async (prompt: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`优化后的提示: ${prompt}`);
      }, 800);
    });
  }, []);
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateForm(true);
  };
  const handleTemplateFormSubmit = (data: Record<string, string>) => {
    console.log("Template form submitted:", data);
  };
  const handleTemplateFormClose = () => {
    setSelectedTemplate(null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl relative">
      <div className="absolute right-0 h-full w-[1px] bg-gradient-to-b from-purple-500/0 via-cyan-500/50 to-purple-500/0"></div>
      <ChatHeader onTemplateSelect={handleTemplateSelect} selectedTemplate={selectedTemplate} isMobile={false} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MessageList messages={messages} isSending={isSending} />
      <InputArea onSend={handleSend} onOptimizePrompt={handleOptimizePrompt} isSending={isSending} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} />

      <AnimatePresence>
        {showTemplateForm && selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center p-4 z-[100]"
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(8px)",
            }}
          >
            <TemplateForm template={selectedTemplate} onSubmit={handleTemplateFormSubmit} onClose={handleTemplateFormClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
