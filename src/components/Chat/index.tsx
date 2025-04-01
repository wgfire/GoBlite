import React, { useState, useCallback } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { Message, UploadedFile } from './types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSend = useCallback(async (prompt: string, files: UploadedFile[]) => {
    if (!prompt.trim() && files.length === 0) return;

    setIsSending(true);
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: prompt,
      timestamp: Date.now(),
      files: files.length > 0 ? files : undefined
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: `这是对"${prompt}"的AI回复${files.length > 0 ? `，并收到${files.length}个文件` : ''}`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: "抱歉，处理请求时出错",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-200">
      <ChatHeader onTabChange={() => {}} />
      <MessageList messages={messages} isSending={isSending} />
      <InputArea
        onSend={handleSend}
        onOptimizePrompt={handleOptimizePrompt}
        isSending={isSending}
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      />
    </div>
  );
};

export default Chat;