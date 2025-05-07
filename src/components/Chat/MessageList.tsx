import { useRef, useEffect } from 'react';
// import { FiImage, FiFile, FiX } from "react-icons/fi";
import { AIResponseContent } from "./AIResponseHandler";
import { AIMessageContent, Message, MessageRole } from "@/core/ai/types";

interface MessageListProps {
  messages: Message[];
  isSending: boolean;
  parseAIResponse?: (text: string) => AIMessageContent[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isSending, parseAIResponse }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]); 

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800" ref={messagesEndRef}>
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === MessageRole.USER ? "justify-end" : "justify-start"}`}>
          <div className={`break-words max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}>
            {message.role === MessageRole.ASSISTANT ? (
              <AIResponseContent text={message.content} parseContent={parseAIResponse} />
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
            {/* {message.files && message.files.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.files.map((file) => (
                  <div key={file.id} className="bg-gray-800 rounded p-2">
                    <div className="flex items-center">
                      {file.previewUrl ? (
                        <>
                          <FiImage className="mr-2" />
                          <img src={file.previewUrl} alt="Preview" className="max-h-20 max-w-xs" />
                        </>
                      ) : (
                        <>
                          <FiFile className="mr-2" />
                          <span className="text-sm truncate max-w-xs">{file.file.name}</span>
                        </>
                      )}
                      <button className="ml-auto text-gray-400 hover:text-white">
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )} */}
          </div>
        </div>
      ))}
      {isSending && (
        <div className="flex justify-start">
          <div className="bg-gray-700 text-gray-200 rounded-lg p-3 max-w-xs">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
