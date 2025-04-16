import React, { useRef } from "react";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { InputArea } from "./InputArea";
import { InputOperations } from "./InputOperations";
import { APIKeyConfig } from "./APIKeyConfig";
import { StatusIndicator } from "./StatusIndicator";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateForm } from "../TemplateForm";
import { ServiceStatus } from "@/core/ai";
import { FiChevronLeft, FiChevronRight, FiMessageSquare, FiSettings } from "react-icons/fi";
import "./Chat.css";
import { useChat } from "./useChat";

interface ChatProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({ onCollapseChange }) => {
  // 使用自定义 hook 获取所有状态和方法
  const {
    messages,
    uploadedFiles,
    isSending,
    activeTab,
    selectedTemplate,
    showTemplateForm,
    isCollapsed,
    showAPIKeyConfig,
    status,
    selectedModelType,
    setActiveTab,
    setUploadedFiles,
    setShowAPIKeyConfig,
    setIsCollapsed,
    handleSend,
    handleOptimizePrompt,
    handleTemplateSelect,
    handleTemplateFormSubmit,
    handleTemplateFormClose,
    handleCancelRequest,
    handleModelChange,
    handleSaveAPIKey,
    toggleCollapse,
    parseAIResponse,
  } = useChat({ onCollapseChange });

  // Ref to store the current width before collapsing
  const chatRef = useRef<HTMLDivElement>(null);

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
      <div
        className={`absolute right-0 h-full ${
          isCollapsed ? "chat-collapsed-border" : "w-[1px] bg-gradient-to-b from-purple-500/0 via-cyan-500/50 to-purple-500/0"
        }`}
      ></div>

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
              <ChatHeader
                onTemplateSelect={handleTemplateSelect}
                selectedTemplate={selectedTemplate}
                isMobile={false}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
              <div className="absolute right-14 top-5 flex items-center space-x-2">
                <StatusIndicator status={status || ServiceStatus.UNINITIALIZED} onOpenAPIKeyConfig={() => setShowAPIKeyConfig(true)} />
              </div>
            </div>
            <MessageList messages={messages} isSending={isSending} parseAIResponse={parseAIResponse} />
            <InputArea
              onSend={handleSend}
              isSending={isSending}
              uploadedFiles={uploadedFiles}
              setUploadedFiles={setUploadedFiles}
              onCancel={handleCancelRequest}
            />
            <InputOperations
              onOptimizePrompt={() => handleOptimizePrompt("")}
              isOptimizing={false}
              isSending={isSending}
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
              currentModel={selectedModelType}
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
        <APIKeyConfig
          isOpen={showAPIKeyConfig}
          onClose={() => setShowAPIKeyConfig(false)}
          onSave={handleSaveAPIKey}
          currentModel={selectedModelType}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default Chat;
