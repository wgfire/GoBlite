import React, { useState, useCallback, useEffect, useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { InputArea } from "./InputArea";
import { InputOperations } from "./InputOperations";
import { APIKeyConfig } from "./APIKeyConfig";
import { StatusIndicator } from "./StatusIndicator";
import { HeaderTab, Message, UploadedFile } from "./types";
import { Template } from "@/template/types";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateForm } from "../TemplateForm";
import useAIService, { AIModelType } from "@/core/ai/hooks/useAIService";
import { useFileSystem } from "@/core/fileSystem";
import { useWebContainer } from "@/core/webContainer";
import { AIGenerationType, AIMessageType, AIMessageContent, AIServiceStatus } from "@/core/ai/types";
import { FiChevronLeft, FiChevronRight, FiMessageSquare, FiSettings } from "react-icons/fi";
import { FileItemType } from "@/core/fileSystem/types";
import "./Chat.css";
import { toast } from "@/components/ui/use-toast";

interface ChatProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({ onCollapseChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<HeaderTab>("templates");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAPIKeyConfig, setShowAPIKeyConfig] = useState(false);

  // Ref to store the current width before collapsing
  const chatRef = useRef<HTMLDivElement>(null);

  // 获取AI服务钩子
  const {
    error: aiError,
    status,
    isProcessing,
    generateCode,
    sendChatRequest,
    optimizePrompt: aiOptimizePrompt,
    processTemplate,
    cancelRequest,
    currentModelType,
    switchModel,
  } = useAIService({ autoInit: true });

  // 模型切换处理
  const handleModelChange = useCallback(
    async (modelType: AIModelType) => {
      await switchModel(modelType);
    },
    [switchModel]
  );

  // 获取文件系统和WebContainer钩子
  const fileSystem = useFileSystem();
  const webContainer = useWebContainer();
  // 监听AI错误
  useEffect(() => {
    if (aiError) {
      console.error("AI服务错误:", aiError);
      toast({
        title: "AI服务错误",
        description: aiError,
        variant: "error",
      });
    }
  }, [aiError]);

  const handleSaveAPIKey = useCallback(
    async (modelType: AIModelType, apiKey: string) => {
      const success = await switchModel(modelType, apiKey);
      if (success) {
        toast({
          title: "配置成功",
          description: `已成功配置${modelType}模型`,
        });
      }
      return success;
    },
    [switchModel]
  );

  // 解析AI响应中的代码和图像
  const parseAIResponse = useCallback((text: string): AIMessageContent[] => {
    const contents: AIMessageContent[] = [];

    // 提取代码块
    const codeBlockRegex = /```([\w-]+)?\s*([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // 添加代码块前的文本
      if (match.index > lastIndex) {
        contents.push({
          type: AIMessageType.TEXT,
          content: text.substring(lastIndex, match.index).trim(),
        });
      }

      // 添加代码块
      contents.push({
        type: AIMessageType.CODE,
        content: match[2],
        language: match[1] || "plaintext",
      });

      lastIndex = match.index + match[0].length;
    }

    // 添加剩余文本
    if (lastIndex < text.length) {
      contents.push({
        type: AIMessageType.TEXT,
        content: text.substring(lastIndex).trim(),
      });
    }

    return contents;
  }, []);

  // 发送消息
  const handleSend = useCallback(
    async (prompt: string, files: UploadedFile[]) => {
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
        // 检测是否是代码生成请求
        const isCodeRequest = /(生成|创建|写一个|实现).*(代码|组件|函数|类|HTML|CSS|JavaScript|React|Vue)/i.test(prompt);

        if (isCodeRequest) {
          // 生成代码
          const result = await generateCode(prompt);

          let responseText = "";
          const filesList = [];

          if (result.success && result.files && result.files.length > 0) {
            // 成功生成代码
            responseText = `我已根据您的要求生成了以下文件：\n\n`;

            // 添加文件列表
            for (const file of result.files) {
              responseText += `- ${file.path}\n`;
              filesList.push(file);

              // 如果是代码文件，添加预览
              if (file.content && file.content.length < 1000) {
                responseText += `\n\`\`\`${file.language || "plaintext"}\n${file.content}\n\`\`\`\n\n`;
              }
            }

            // 添加文件到文件系统
            for (const file of result.files) {
              const dirPath = file.path.split("/").slice(0, -1).join("/");
              fileSystem.createFile(dirPath, {
                name: file.path.split("/").pop() || "unnamed",
                path: file.path,
                type: FileItemType.FILE,
                content: file.content,
                metadata: {
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  size: new Blob([file.content]).size,
                },
              });
            }

            // 启动WebContainer预览
            webContainer.startApp(fileSystem.files);

            responseText += "\n文件已添加到文件系统，并已启动预览。";
          } else {
            // 生成失败或没有文件
            responseText = result.error ? `抱歉，生成代码时出错：${result.error}` : `我理解了您的需求，但无法生成相应的代码文件。请提供更详细的信息。`;
          }

          // 创建AI响应消息
          const aiResponse: Message = {
            id: crypto.randomUUID(),
            sender: "ai",
            text: responseText,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, aiResponse]);
        } else {
          // 普通对话请求
          // 使用sendChatRequest发送请求
          const response = await sendChatRequest(prompt, {
            systemPrompt: "你是一个智能助手，可以回答用户的问题并提供帮助。",
            temperature: 0.7,
          });

          if (!response.success) {
            throw new Error(response.error || "请求失败");
          }

          const responseText = response.content || "抱歉，无法获取响应";

          // 创建AI响应消息
          const aiResponse: Message = {
            id: crypto.randomUUID(),
            sender: "ai",
            text: responseText,
            timestamp: Date.now(),
          };

          setMessages((prev) => [...prev, aiResponse]);
        }
      } catch (error) {
        console.error("Error:", error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: `抱歉，处理请求时出错: ${error instanceof Error ? error.message : "未知错误"}`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsSending(false);
      }
    },
    [generateCode, sendChatRequest, fileSystem, webContainer]
  );

  // 优化提示词
  const handleOptimizePrompt = useCallback(
    async (prompt: string) => {
      try {
        return await aiOptimizePrompt(prompt);
      } catch (error) {
        console.error("优化提示词失败:", error);
        return prompt; // 失败时返回原始提示词
      }
    },
    [aiOptimizePrompt]
  );
  // 选择模板
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateForm(true);
  };

  // 提交模板表单
  const handleTemplateFormSubmit = async (data: Record<string, string>) => {
    if (!selectedTemplate) return;

    setShowTemplateForm(false);
    setIsSending(true);

    // 创建用户消息
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text: `请使用${selectedTemplate.name}模板创建一个页面，参数如下：\n${Object.entries(data)
        .map(([key, value]) => {
          const field = selectedTemplate.fields?.find((f) => f.id === key);
          return field ? `${field.name}: ${value}` : `${key}: ${value}`;
        })
        .join("\n")}`,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // 处理模板
      const result = await processTemplate({
        template: selectedTemplate,
        formData: data,
        generationType: AIGenerationType.MIXED,
        autoSync: true,
      });

      if (result.success && result.files && result.files.length > 0) {
        // 成功处理模板
        let responseText = `我已根据${selectedTemplate.name}模板生成了以下文件：\n\n`;

        // 添加文件列表
        for (const file of result.files) {
          responseText += `- ${file.path}\n`;
        }

        // 添加预览信息
        responseText += "\n文件已添加到文件系统，并已启动预览。";

        // 创建AI响应消息
        const aiResponse: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: responseText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiResponse]);
      } else {
        // 处理失败
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          sender: "ai",
          text: `处理模板时出错：${result.error || "未知错误"}`,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("处理模板失败:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "抱歉，处理模板时出错",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
      setSelectedTemplate(null);
    }
  };

  // 关闭模板表单
  const handleTemplateFormClose = () => {
    setSelectedTemplate(null);
    setShowTemplateForm(false);
  };

  // 取消AI请求
  const handleCancelRequest = () => {
    cancelRequest();
    setIsSending(false);
  };

  const toggleCollapse = useCallback(() => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  }, [isCollapsed, onCollapseChange]);

  return (
    <motion.div
      ref={chatRef}
      layout
      initial={false}
      animate={{
        width: isCollapsed ? "60px" : "100%",
        height: "100%",
        position: "relative",
        zIndex: 50,
      }}
      transition={{
        type: "tween", // Use tween for more predictable animation
        ease: "easeInOut",
        duration: 0.3,
      }}
      className={`flex flex-col bg-gray-900 text-gray-200 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl relative ${
        isCollapsed ? "rounded-r-lg overflow-hidden chat-collapsed" : "h-full"
      }`}
    >
      {/* Collapse/Expand button */}
      <motion.button
        onClick={toggleCollapse}
        className={`absolute z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors ${
          isCollapsed ? "top-4 left-1/2 -translate-x-1/2" : "top-4 right-4"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isCollapsed ? "展开聊天" : "收起聊天"}
      >
        {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
      </motion.button>

      {/* Right border gradient */}
      <div className={`absolute right-0 h-full ${isCollapsed ? "chat-collapsed-border" : "w-[1px] bg-gradient-to-b from-purple-500/0 via-cyan-500/50 to-purple-500/0"}`}></div>

      {/* Collapsed state icon */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-start h-full pt-16 px-2"
          >
            <div className="p-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-4">
              <FiMessageSquare size={20} className="text-white" />
            </div>
            <div className="vertical-text text-xs font-medium text-cyan-400 tracking-wider">AI CHAT</div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCollapsed(false);
                setTimeout(() => setShowAPIKeyConfig(true), 300);
              }}
              className="mt-8 p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
              title="AI模型设置"
            >
              <FiSettings size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content - only show when expanded */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col h-full w-full"
          >
            <div className="relative">
              <ChatHeader onTemplateSelect={handleTemplateSelect} selectedTemplate={selectedTemplate} isMobile={false} activeTab={activeTab} setActiveTab={setActiveTab} />
              <div className="absolute right-4 top-4 flex items-center space-x-2">
                <StatusIndicator status={status || AIServiceStatus.UNINITIALIZED} onOpenAPIKeyConfig={() => setShowAPIKeyConfig(true)} />
              </div>
            </div>
            <MessageList messages={messages} isSending={isSending} parseAIResponse={parseAIResponse} />
            <InputArea onSend={handleSend} isSending={isSending || isProcessing} uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} onCancel={handleCancelRequest} />
            <InputOperations
              onOptimizePrompt={() => handleOptimizePrompt("")}
              isOptimizing={false}
              isSending={isSending || isProcessing}
              hasPrompt={true}
              onFileUpload={(e) => {
                if (e.target.files) {
                  const newFiles = Array.from(e.target.files).map((file) => ({
                    id: crypto.randomUUID(),
                    file,
                    previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
                  }));
                  setUploadedFiles((prev) => [...prev, ...newFiles]);
                }
              }}
              currentModel={currentModelType}
              onModelChange={handleModelChange}
              onOpenAPIKeyConfig={() => setShowAPIKeyConfig(true)}
            />

           
          </motion.div>
        )}
      </AnimatePresence>

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
         {/* API密钥配置对话框 */}
         <APIKeyConfig isOpen={showAPIKeyConfig} onClose={() => setShowAPIKeyConfig(false)} onSave={handleSaveAPIKey} currentModel={currentModelType} />
      </AnimatePresence>
    </motion.div>
  );
};

export default Chat;
