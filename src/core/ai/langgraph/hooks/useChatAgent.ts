import { useState, useEffect, useCallback, useMemo } from "react";
import { createRouterAgent } from "../agents/routerAgent";
import { Message, MessageRole, ModelProvider, ModelType } from "../../types";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { useModelConfig } from "../../hooks/useModelConfig";
import { RouterStateType } from "../agents/routerAgent";
import { useConversation } from "./useConversation";

// Hook选项
export interface UseAgentChatOptions {
  apiKey?: string;
  provider?: ModelProvider;
  modelType?: ModelType;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

/**
 * 简化版的useAgentChat hook，只负责与AI交互和存储消息
 * 会话管理由useConversation hook负责
 */
export function useAgentChat(options: UseAgentChatOptions = {}) {
  // 状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initializeModelConfig } = useModelConfig();

  // 使用useConversation hook管理会话
  const conversation = useConversation();

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
  const [currentState, setCurrentState] = useState<RouterStateType>({
    messages: [],
    userInput: "",
    next: null,
    routerAnalysis: null,
    templateContext: null,
    generatedCode: null,
    error: null,
  });

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
      }

      // 初始化代理状态
      try {
        console.log("尝试初始化代理状态");
        await agentInstance.app.invoke(initialState, config);
        console.log("代理状态初始化成功");

        // 更新当前状态
        setCurrentState(initialState);
      } catch (invokeError) {
        console.warn("代理状态初始化失败，但仍然继续:", invokeError);
        // 即使初始化失败，我们仍然继续使用代理
      }

      setAgent(agentInstance);
      setIsInitialized(true);
      console.log("代理初始化完成");
    } catch (err) {
      console.error("初始化代理失败:", err);
      setError(err instanceof Error ? err.message : "初始化失败");
    } finally {
      setIsLoading(false);
    }
  }, [config, conversation.currentConversation, currentState]);

  // 发送消息
  const sendMessage = useCallback(
    async (content: string) => {
      // 声明在函数开始处，确保在整个函数作用域内可用
      let activeConversationId: string | null = null;

      try {
        setIsLoading(true);
        console.log(`准备发送消息: "${content}"`);

        // 确保有一个有效的会话ID
        activeConversationId = conversation.currentConversationId;

        // 如果没有当前会话，创建一个新会话
        if (!activeConversationId) {
          console.log("没有当前会话，创建新会话");

          // 创建新会话并等待完成
          const newConversationId = await conversation.createConversation("新对话", options.systemPrompt);
          console.log(`创建了新会话: ${newConversationId}`);

          // 等待一下，确保会话已经创建完成
          await new Promise((resolve) => setTimeout(resolve, 500));

          // 使用新创建的会话ID
          activeConversationId = newConversationId;
        }

        // 添加用户消息到会话
        console.log(`添加用户消息到会话 ${activeConversationId}`);

        // 使用addMessage方法添加消息
        const userMessageId = await conversation.addMessage(
          {
            role: MessageRole.USER,
            content,
          },
          activeConversationId
        );
        console.log(`用户消息添加成功，消息ID: ${userMessageId}`);

        // 调用代理
        console.log("调用AI代理处理消息");

        // 准备调用代理的参数
        const invokeParams = {
          userInput: content,
          // 如果有模板上下文，保留它
          templateContext: currentState.templateContext,
        };

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
          },
        };
        const assistantMessageId = await conversation.addMessage(addMessage, activeConversationId);
        console.log(`AI响应添加成功，消息ID: ${assistantMessageId}`);

        // 更新代理状态
        setCurrentState(result);

        return responseText;
      } catch (err) {
        console.error("发送消息失败:", err);
        setError(`发送消息失败: ${err instanceof Error ? err.message : "未知错误"}`);

        // 添加错误消息到会话
        if (activeConversationId) {
          await conversation.addMessage(
            {
              role: MessageRole.SYSTEM,
              content: `发送消息失败: ${err instanceof Error ? err.message : "未知错误"}`,
            },
            activeConversationId
          );
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    /**禁止修改 */
    [config]
  );

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
    /**禁止修改 */
  }, [conversation.isInitialized, initAgent, initializeModelConfig]);

  return {
    // 状态
    isInitialized,
    isLoading,
    error,
    messages: conversation.currentMessages,

    // 方法
    sendMessage,

    // 原始对象
    agent,
    currentState,
  };
}

export default useAgentChat;
