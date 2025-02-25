import React, { useEffect } from "react";

/**
 * 处理Figma插件消息的组件
 * 主要用于处理复制到剪贴板等操作
 */
const ParseHandler: React.FC = () => {
  useEffect(() => {
    // 监听来自插件的消息
    const handleMessage = (event: MessageEvent) => {
      const { type, text, success, message } = event.data.pluginMessage || {};

      // 处理复制到剪贴板
      if (type === "copyToClipboard" && text) {
        handleCopyToClipboard(text);
      }

      // 处理解析完成的消息
      if (type === "parseComplete") {
        // Figma会自动在插件端显示通知，这里不需要额外处理
        console.log(`解析${success ? "成功" : "失败"}: ${message}`);
      }
    };

    // 添加消息监听器
    window.addEventListener("message", handleMessage);

    // 清理函数
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  /**
   * 处理复制到剪贴板
   * @param text 要复制的文本
   */
  const handleCopyToClipboard = async (text: string) => {
    try {
      // 使用Clipboard API复制文本
      await navigator.clipboard.writeText(text);
      console.log("内容已复制到剪贴板");

      // 向插件发送消息，让插件显示通知
      parent.postMessage(
        {
          pluginMessage: {
            type: "showNotification",
            message: "内容已复制到剪贴板",
            success: true
          }
        },
        "*"
      );
    } catch (error) {
      console.error("复制到剪贴板失败:", error);

      // 尝试使用传统方法
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        console.log("内容已复制到剪贴板（备用方法）");

        // 向插件发送消息，让插件显示通知
        parent.postMessage(
          {
            pluginMessage: {
              type: "showNotification",
              message: "内容已复制到剪贴板",
              success: true
            }
          },
          "*"
        );
      } catch (fallbackError) {
        console.error("备用复制方法也失败:", fallbackError);

        // 向插件发送消息，让插件显示通知
        parent.postMessage(
          {
            pluginMessage: {
              type: "showNotification",
              message: "无法复制内容到剪贴板",
              success: false
            }
          },
          "*"
        );
      }
    }
  };

  // 这个组件不渲染任何内容，只处理消息
  return null;
};

export default ParseHandler;
