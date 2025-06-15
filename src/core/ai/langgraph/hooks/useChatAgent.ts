import { useState, useEffect, useCallback, useMemo } from "react";
import { createRouterAgent } from "../agents/routerAgent";
import { Message, MessageRole, ModelProvider, ModelType } from "../../types";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { useModelConfig } from "../../hooks/useModelConfig";
import { RouterStateType } from "../agents/routerAgent";
import { useConversation } from "./useConversation";
import useMemoizedFn from "@/hooks/useMemoizedFn";
import { useAtomValue } from "jotai";
import { templateContextAtom } from "@/components/Chat/atoms/templateAtom";
import { FileItemType, useFileSystem } from "@/core/fileSystem";

// Hook选项
export interface UseAgentChatOptions {
  apiKey?: string;
  provider?: ModelProvider;
  modelType?: ModelType;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

const initAgentState = {
  messages: [],
  userInput: "",
  next: null,
  routerAnalysis: null,
  templateContext: null,
  generatedCode: null,
  fileOperations: [],
  error: null,
  isInitializing: false,
  hasResponse: false,
};

/**
 * 简化版的useAgentChat hook，只负责与AI交互和存储消息
 * 会话管理由useConversation hook负责
 */
export function useChatAgent(options: UseAgentChatOptions = {}) {
  // 状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeModelConfig } = useModelConfig();
  const { openFile, writeFile } = useFileSystem()

  // 使用useConversation hook管理会话
  const conversation = useConversation();

  // 获取模板上下文
  const templateContext = useAtomValue(templateContextAtom);

  // 代理状态
  const [agent, setAgent] = useState<ReturnType<typeof createRouterAgent> | null>(null);

  // 使用useMemo创建配置，避免不必要的重新渲染
  const config = useMemo(
    () => ({
      configurable: {
        thread_id: conversation.currentConversationId,
      },
    }),
    [conversation.currentConversationId]
  );

  // 当前状态
  const [currentState, setCurrentState] = useState<RouterStateType>(initAgentState);

  // 初始化代理
  const initAgent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("开始初始化AI代理");

      // 创建代理
      const agentInstance = createRouterAgent();
      console.log("代理实例创建成功");

      // 获取当前会话的消息历史
      const currentConversation = conversation.currentConversation;
      console.log(`当前会话: ${currentConversation ? currentConversation.id : "无会话"}`);

      // 准备初始状态
      let initialState = { ...currentState };

      // 如果有当前会话，将其消息历史转换为 LangChain 消息格式
      if (currentConversation && currentConversation.messages.length > 0) {
        console.log(`加载当前会话消息历史，消息数: ${currentConversation.messages.length}`);

        // 将消息历史转换为 LangChain 消息格式
        const messagesForAgent = [];

        // 将会话消息转换为 LangChain 消息
        for (const msg of currentConversation.messages) {
          if (msg.role === MessageRole.USER) {
            messagesForAgent.push(
              new HumanMessage({
                content: msg.content,
              })
            );
          } else if (msg.role === MessageRole.ASSISTANT) {
            messagesForAgent.push(
              new AIMessage({
                content: msg.content,
                additional_kwargs: {
                  metadata: {
                    isError: msg.metadata?.isError,
                  },
                },
              })
            );
          } else if (msg.role === MessageRole.SYSTEM && !currentConversation.systemPrompt) {
            // 只有当没有系统提示词时，才添加系统消息
            messagesForAgent.push(
              new SystemMessage({
                content: msg.content,
              })
            );
          }
        }

        // 更新初始状态
        initialState = {
          ...initialState,
          messages: messagesForAgent,
        };

        console.log(`初始化状态包含 ${messagesForAgent.length} 条消息`);
      } else {
        console.log("没有当前会话或消息历史，使用默认初始状态");
        initialState = {
          ...initAgentState,
        };
      }

      setCurrentState(initialState);
      console.log("代理状态初始化成功", initialState);

      setAgent(agentInstance);

      // 添加一个特殊的空调用，仅用于激活 memorySaver
      if (agentInstance && currentConversation) {
        console.log("执行空调用以激活 memorySaver");
        try {
          // 使用与正常调用相同的参数结构，但设置初始化标记
          const invokeParams = {
            ...initialState,
            userInput: null,
            templateContext: templateContext,
            isInitializing: true, // 设置初始化标记
          };

          await agentInstance.app.invoke(invokeParams, config);
          console.log("memorySaver 激活成功", templateContext);
        } catch (initError) {
          console.error("激活 memorySaver 失败:", initError);
          // 即使激活失败也继续，不影响整体初始化
        }
      }

      setIsInitialized(true);
      console.log("代理初始化完成");
    } catch (err) {
      console.error("初始化代理失败:", err);
      setError(err instanceof Error ? err.message : "初始化失败");
    } finally {
      setIsLoading(false);
    }
    /**无需修改 */
  }, [config, templateContext]);

  // 发送消息
  const sendMessage = useMemoizedFn(async (content: string) => {
    // 声明在函数开始处，确保在整个函数作用域内可用
    let activeConversationId: string | null = null;

    try {
      setIsLoading(true);

      // 确保有一个有效的会话ID
      activeConversationId = conversation.currentConversationId;
      console.log(`准备发送消息: "${content}"`, activeConversationId);

      // 如果没有当前会话，创建一个新会话
      if (!activeConversationId) {
        console.log("没有当前会话，创建新会话");

        // 创建新会话并等待完成
        const result = await conversation.createConversation("新对话", options.systemPrompt);
        if (!result) {
          throw new Error("创建会话失败");
        }

        const { newConversationId } = result;
        console.log(`创建了新会话: ${newConversationId}`);

        // 使用新创建的会话ID
        activeConversationId = newConversationId;
      }

      // 无论是否创建新会话，都添加用户消息到会话
      console.log(`添加用户消息到会话 ${activeConversationId}`);

      // 使用addMessage方法添加消息，传入会话ID避免状态同步问题
      const userMessageId = await conversation.addMessage({
        message: {
          role: MessageRole.USER,
          content,
          metadata: {
            timestamp: Date.now(),
          }
        },
        conversationId: activeConversationId,
      });

      console.log(`用户消息添加成功，消息ID: ${userMessageId}`);

      // 调用代理
      console.log("调用AI代理处理消息");

      // 准备调用代理的参数
      const invokeParams = {
        userInput: content,
        // 传递模板上下文给大模型
        templateContext: templateContext,
      };

      console.log("发送消息时的模板上下文:", templateContext);

      const result = await agent?.app.invoke(invokeParams, config);

      console.log("代理返回结果:", result);

      if (!result || !result.messages || result.messages.length === 0) {
        throw new Error("代理返回的消息为空");
      }

      const responseContent = result.messages[result.messages.length - 1];
      const responseText = responseContent.content as string;
      const metadata = responseContent.additional_kwargs?.metadata as Message["metadata"];

      // 添加助手消息到会话，使用同一个会话ID
      console.log(`添加AI响应到会话 ${activeConversationId}`);
      const addMessage: Omit<Message, "id" | "timestamp"> = {
        role: MessageRole.ASSISTANT,
        content: responseText,
        metadata: {
          isError: metadata?.isError,
          timestamp: Date.now(),
        },
      };
      const assistantMessageId = await conversation.addMessage({ message: addMessage, conversationId: activeConversationId });
      console.log(`AI响应添加成功，消息ID: ${assistantMessageId}`);

      // 更新代理状态
      setCurrentState(result);
      if (result.fileOperations) {
        console.log(result.fileOperations, 'ai返回文件信息')
        for (let index = 0; index < result.fileOperations.length; index++) {
          const element = result.fileOperations[index];
          openFile({
            path: element.path,
            type: FileItemType.FILE
          })
          writeFile(element.path, element.content!)

        }
      }

      return responseText;
    } catch (err) {
      console.error("发送消息失败:", err);
      setError(`发送消息失败: ${err instanceof Error ? err.message : "未知错误"}`);

      // 添加错误消息到会话
      if (activeConversationId) {
        await conversation.addMessage({
          message: {
            metadata: {
              isError: true,
              timestamp: Date.now(),
            },
            role: MessageRole.ASSISTANT,
            content: `发送消息失败: ${err instanceof Error ? err.message : "未知错误"}`,
          },
          conversationId: activeConversationId,
        });
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  });

  const handleCancelRequest = () => {
    setIsLoading(false);
  };

  // 初始化
  useEffect(() => {
    console.log("初始化useAgentChat");
    // 首先初始化模型配置
    initializeModelConfig();

    // 等待会话初始化完成后再初始化代理
    if (conversation.isInitialized) {
      console.log("会话已初始化，开始初始化代理");
      initAgent();
    } else {
      console.log("会话未初始化，等待会话初始化");
    }
  }, [conversation.isInitialized, initAgent, initializeModelConfig]);

  return {
    // 状态
    isInitialized,
    isLoading,
    error,
    messages: conversation.currentMessages,
    templateContext,

    // 方法
    sendMessage,
    handleCancelRequest,

    // 原始对象
    agent,
    currentState,
    conversation,
  };
}

export default useChatAgent;
