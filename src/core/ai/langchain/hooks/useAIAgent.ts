/**
 * AI代理钩子
 * 提供基于LangChain的AI代理功能
 */

import { useState, useCallback } from "react";
import { AgentExecutor } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { useFileSystem } from "@/core/fileSystem";
import { useWebContainer } from "@/core/webContainer";
import { AIResponse, AIServiceStatus } from "../../types";
import { ERROR_MESSAGES } from "../../constants";

/**
 * AI代理钩子选项
 */
export interface UseAIAgentOptions {
  /** 模型实例 */
  model: BaseChatModel | null;
  /** 服务状态 */
  status: AIServiceStatus;
}

/**
 * AI代理钩子
 * 提供基于LangChain的AI代理功能
 */
export const useAIAgent = (options: UseAIAgentOptions) => {
  // 获取文件系统和WebContainer钩子
  const fileSystem = useFileSystem();
  const webContainer = useWebContainer();

  // 状态
  const [error, setError] = useState<string | null>(null);

  /**
   * 创建文件系统工具
   * @param fs 文件系统
   * @returns 文件系统工具
   */
  const createFileSystemTool = useCallback((fs: ReturnType<typeof useFileSystem>) => {
    return {
      name: "file_system",
      description: "用于操作文件系统的工具",
      async invoke({ action, path, content }: { action: string; path?: string; content?: string }) {
        try {
          switch (action) {
            case "list":
              return { files: fs.files };
            case "read":
              if (!path) return { error: "读取文件时必须提供路径" };
              const fileContent = fs.getFileContent(path);
              return { content: fileContent };
            case "write":
              if (!path || content === undefined) return { error: "写入文件时必须提供路径和内容" };
              await fs.writeFile(path, content);
              return { success: true, message: `文件 ${path} 写入成功` };
            case "delete":
              if (!path) return { error: "删除文件时必须提供路径" };
              await fs.deleteFile(path);
              return { success: true, message: `文件 ${path} 删除成功` };
            case "mkdir":
              if (!path) return { error: "创建目录时必须提供路径" };
              await fs.createDirectory(path);
              return { success: true, message: `目录 ${path} 创建成功` };
            default:
              return { error: `不支持的操作: ${action}` };
          }
        } catch (error) {
          return { error: `文件系统操作失败: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    };
  }, []);

  /**
   * 创建WebContainer工具
   * @param wc WebContainer
   * @param fs 文件系统
   * @returns WebContainer工具
   */
  const createWebContainerTool = useCallback((wc: ReturnType<typeof useWebContainer>, fs: ReturnType<typeof useFileSystem>) => {
    return {
      name: "web_container",
      description: "用于操作WebContainer的工具",
      async invoke({ action, packageName }: { action: string; packageName?: string }) {
        try {
          switch (action) {
            case "start":
              await wc.startApp(fs.files);
              return { success: true, message: "应用启动成功" };
            case "install":
              if (!packageName) return { error: "安装依赖时必须提供包名" };
              await wc.installDependency(packageName);
              return { success: true, message: `依赖 ${packageName} 安装成功` };
            case "build":
              await wc.buildApp();
              return { success: true, message: "应用构建成功" };
            case "restart":
              await wc.restartApp();
              return { success: true, message: "应用重启成功" };
            default:
              return { error: `不支持的操作: ${action}` };
          }
        } catch (error) {
          return { error: `WebContainer操作失败: ${error instanceof Error ? error.message : String(error)}` };
        }
      },
    };
  }, []);

  /**
   * 创建代理
   * @param systemPrompt 系统提示词
   * @returns 代理执行器
   */
  const createAgent = useCallback(
    async (systemPrompt: string) => {
      if (!options.model) {
        throw new Error("模型未初始化");
      }

      // 创建工具
      const tools = [createFileSystemTool(fileSystem), createWebContainerTool(webContainer, fileSystem)];

      // 创建提示模板
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", systemPrompt],
        ["human", "{input}"],
      ]);

      // 创建代理链
      const chain = RunnableSequence.from([
        {
          input: (input: { input: string }) => input.input,
        },
        prompt,
        options.model,
      ]);

      // 创建代理执行器
      const executor = AgentExecutor.fromAgentAndTools({
        agent: chain,
        tools,
      });

      return executor;
    },
    [options.model, fileSystem, webContainer, createFileSystemTool, createWebContainerTool]
  );

  /**
   * 执行代理
   * @param input 输入
   * @param systemPrompt 系统提示词
   * @returns 代理响应
   */
  const executeAgent = useCallback(
    async (input: string, systemPrompt?: string): Promise<AIResponse> => {
      try {
        // 检查服务状态
        if (options.status !== AIServiceStatus.READY) {
          throw new Error(ERROR_MESSAGES.SERVICE_NOT_READY);
        }

        // 检查模型
        if (!options.model) {
          throw new Error("模型未初始化");
        }

        // 创建代理
        const agent = await createAgent(
          systemPrompt || "你是一个AI助手，可以帮助用户操作文件系统和WebContainer。你可以使用file_system工具操作文件，使用web_container工具操作WebContainer。"
        );

        // 执行代理
        const result = await agent.invoke({ input });

        return {
          success: true,
          content: result.output,
        };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "执行代理失败";
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [options.status, options.model, createAgent]
  );

  return {
    // 状态
    error,

    // 方法
    executeAgent,
  };
};

export default useAIAgent;
