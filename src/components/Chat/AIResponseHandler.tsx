import React from 'react';
import { AIMessageContent, AIMessageType } from '@/core/ai/types';
import { FiFile, FiImage, FiCode, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { useFileSystem } from '@/core/fileSystem';
import { useWebContainer } from '@/core/webContainer';

interface AIResponseHandlerProps {
  content: AIMessageContent;
}

/**
 * 处理AI响应内容的组件
 * 根据内容类型显示不同的UI
 */
export const AIResponseHandler: React.FC<AIResponseHandlerProps> = ({ content }) => {
  const fileSystem = useFileSystem();
  const webContainer = useWebContainer();

  // 处理文本内容
  if (content.type === AIMessageType.TEXT) {
    return (
      <div className="whitespace-pre-wrap">{content.content}</div>
    );
  }

  // 处理代码内容
  if (content.type === AIMessageType.CODE) {
    return (
      <div className="relative mt-2 mb-4 rounded-md overflow-hidden">
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-xs text-gray-300">
          <div className="flex items-center">
            <FiCode className="mr-2" />
            <span>{content.language || 'code'}</span>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(content.content);
              }}
              className="text-xs h-6 px-2"
            >
              复制
            </Button>
          </div>
        </div>
        <pre className="p-4 bg-gray-900 overflow-x-auto">
          <code className={`language-${content.language || 'plaintext'}`}>
            {content.content}
          </code>
        </pre>
      </div>
    );
  }

  // 处理图像内容
  if (content.type === AIMessageType.IMAGE) {
    return (
      <div className="mt-2 mb-4">
        <div className="relative rounded-md overflow-hidden">
          <img 
            src={content.imageUrl} 
            alt={content.imageUrl || "AI生成的图像"} 
            className="max-w-full h-auto rounded-md"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex justify-between items-center">
            <div className="flex items-center">
              <FiImage className="mr-2" />
              <span className="text-sm">AI生成的图像</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // 下载图像
                const link = document.createElement('a');
                link.href = content.content;
                link.download = content.content || 'ai-generated-image.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="text-xs h-6 px-2"
            >
              下载
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 处理文件内容
  if (content.type === AIMessageType.FILE) {
    const fileInfo = content.filePath;
    
    return (
      <div className="mt-2 mb-4 p-4 bg-gray-800 rounded-md">
        <div className="flex items-center">
          <FiFile className="mr-2 text-blue-400" />
          <span className="text-sm font-medium">{fileInfo || '文件'}</span>
        </div>
        <div className="mt-2 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 打开文件
              if (fileInfo) {
                const file = fileSystem.findItem(fileSystem.files, fileInfo);
                if (file) {
                  fileSystem.openFile(file);
                }
              }
            }}
            className="text-xs"
          >
            打开
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              // 预览文件
              webContainer.startApp(fileSystem.files);
            }}
            className="text-xs"
          >
            预览
          </Button>
        </div>
      </div>
    );
  }

  // 处理错误内容
  if (content.type === AIMessageType.ERROR) {
    return (
      <div className="mt-2 mb-4 p-4 bg-red-900/30 border border-red-700 rounded-md">
        <div className="flex items-center text-red-400">
          <FiAlertTriangle className="mr-2" />
          <span className="font-medium">错误</span>
        </div>
        <div className="mt-2 text-red-200">
          {content.content}
        </div>
      </div>
    );
  }

  // 默认情况
  return <div>{content.content}</div>;
};

/**
 * 处理完整AI响应的组件
 * 解析并显示多种内容类型
 */
interface AIResponseContentProps {
  text: string;
  parseContent?: (text: string) => AIMessageContent[];
}

export const AIResponseContent: React.FC<AIResponseContentProps> = ({ 
  text,
  parseContent 
}) => {
  // 如果没有提供解析函数，则将整个文本作为单个文本内容
  const contents: AIMessageContent[] = parseContent 
    ? parseContent(text)
    : [{ type: AIMessageType.TEXT, content: text }];

  return (
    <div>
      {contents.map((content, index) => (
        <AIResponseHandler key={index} content={content} />
      ))}
    </div>
  );
};

export default AIResponseContent;
