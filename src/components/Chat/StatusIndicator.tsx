import React from "react";
import { AIServiceStatus } from "@/core/ai";
import { FiAlertCircle, FiCheck, FiLoader, FiSettings } from "react-icons/fi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusIndicatorProps {
  status: AIServiceStatus;
  onOpenAPIKeyConfig: () => void;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, onOpenAPIKeyConfig }) => {
  let icon = null;
  let statusText = "";
  let statusClass = "";

  switch (status) {
    case AIServiceStatus.UNINITIALIZED:
      icon = <FiSettings className="animate-pulse" />;
      statusText = "未初始化";
      statusClass = "text-gray-400";
      break;
    case AIServiceStatus.INITIALIZING:
      icon = <FiLoader className="animate-spin" />;
      statusText = "初始化中";
      statusClass = "text-blue-400";
      break;
    case AIServiceStatus.READY:
      icon = <FiCheck />;
      statusText = "就绪";
      statusClass = "text-green-400";
      break;
    case AIServiceStatus.PROCESSING:
      icon = <FiLoader className="animate-spin" />;
      statusText = "处理中";
      statusClass = "text-blue-400";
      break;
    case AIServiceStatus.ERROR:
      icon = <FiAlertCircle />;
      statusText = "错误";
      statusClass = "text-red-400";
      break;
    default:
      icon = <FiSettings />;
      statusText = "未知状态";
      statusClass = "text-gray-400";
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={onOpenAPIKeyConfig} className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-700 transition-colors ${statusClass}`}>
            <span>{icon}</span>
            <span className="text-xs">{statusText}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>AI服务状态: {statusText}</p>
          <p className="text-xs">点击配置API密钥</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
