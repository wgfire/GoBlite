/**
 * 对话管理钩子
 * 提供对话创建、切换、删除和管理功能
 */

import { useState, useCallback, useEffect } from "react";
import { MemoryManager } from "../memory/memoryManager";
import { CreateConversationOptions, ConversationInfo, Message, MemoryType, StorageProvider } from "../../types";

/**
 * 对话管理钩子选项
 */
export interface UseConversationManagerOptions {
  /** 是否自动初始化 */
  autoInit?: boolean;
  /** 记忆类型 */
  memoryType?: MemoryType;
  /** 存储提供商 */
  storageProvider?: StorageProvider;
  /** 默认系统提示词 */
  defaultSystemPrompt?: string;
}

/**
 * 对话管理钩子
 * 提供对话创建、切换、删除和管理功能
 */
export const useConversationManager = (options: UseConversationManagerOptions = {}) => {
  // 获取记忆管理器实例
  const memoryManager = MemoryManager.getInstance();

  // 状态
  const [conversations, setConversations] = useState<ConversationInfo[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  /**
   * 初始化对话管理器
   */
  const initialize = useCallback(() => {
    try {
      // 初始化记忆管理器
      memoryManager.initialize(options.memoryType || MemoryType.BUFFER, options.storageProvider || StorageProvider.LOCAL_STORAGE);

      // 更新状态
      setCurrentConversationId(memoryManager.getCurrentConversationId());
      setConversations(memoryManager.getConversations());
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "初始化对话管理器失败";
      setError(errorMessage);
      return false;
    }
  }, [options.memoryType, options.storageProvider, memoryManager]);

  /**
   * 创建对话
   * @param options 创建选项
   * @returns 对话ID
   */
  const createConversation = useCallback(
    (createOptions: CreateConversationOptions): string => {
      try {
        const id = memoryManager.createConversation({
          ...createOptions,
          systemPrompt: createOptions.systemPrompt || options.defaultSystemPrompt,
        });
        setCurrentConversationId(id);
        setConversations(memoryManager.getConversations());
        return id;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "创建对话失败";
        setError(errorMessage);
        return "";
      }
    },
    [memoryManager, options.defaultSystemPrompt]
  );

  /**
   * 切换对话
   * @param conversationId 对话ID
   * @returns 是否切换成功
   */
  const switchConversation = useCallback(
    (conversationId: string): boolean => {
      try {
        const success = memoryManager.switchConversation(conversationId);
        if (success) {
          setCurrentConversationId(conversationId);
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "切换对话失败";
        setError(errorMessage);
        return false;
      }
    },
    [memoryManager]
  );

  /**
   * 删除对话
   * @param conversationId 对话ID
   * @returns 是否删除成功
   */
  const deleteConversation = useCallback(
    (conversationId: string): boolean => {
      try {
        const success = memoryManager.deleteConversation(conversationId);
        if (success) {
          setCurrentConversationId(memoryManager.getCurrentConversationId());
          setConversations(memoryManager.getConversations());
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "删除对话失败";
        setError(errorMessage);
        return false;
      }
    },
    [memoryManager]
  );

  /**
   * 添加消息
   * @param role 角色
   * @param content 内容
   * @returns 消息ID
   */
  const addMessage = useCallback(
    (role: "user" | "assistant" | "system", content: string): string => {
      try {
        const messageId = memoryManager.addMessage(currentConversationId, role, content);
        setConversations(memoryManager.getConversations());
        return messageId;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "添加消息失败";
        setError(errorMessage);
        return "";
      }
    },
    [currentConversationId, memoryManager]
  );

  /**
   * 获取对话消息
   * @param conversationId 对话ID（可选，默认为当前对话）
   * @returns 消息数组
   */
  const getMessages = useCallback(
    (conversationId?: string): Message[] => {
      try {
        return memoryManager.getMessages(conversationId || currentConversationId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "获取消息失败";
        setError(errorMessage);
        return [];
      }
    },
    [currentConversationId, memoryManager]
  );

  /**
   * 获取系统提示词
   * @param conversationId 对话ID（可选，默认为当前对话）
   * @returns 系统提示词
   */
  const getSystemPrompt = useCallback(
    (conversationId?: string): string => {
      try {
        return memoryManager.getSystemPrompt(conversationId || currentConversationId);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "获取系统提示词失败";
        setError(errorMessage);
        return options.defaultSystemPrompt || "";
      }
    },
    [currentConversationId, memoryManager, options.defaultSystemPrompt]
  );

  /**
   * 设置系统提示词
   * @param systemPrompt 系统提示词
   * @param conversationId 对话ID（可选，默认为当前对话）
   * @returns 是否设置成功
   */
  const setSystemPrompt = useCallback(
    (systemPrompt: string, conversationId?: string): boolean => {
      try {
        const success = memoryManager.setSystemPrompt(conversationId || currentConversationId, systemPrompt);
        if (success) {
          setConversations(memoryManager.getConversations());
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "设置系统提示词失败";
        setError(errorMessage);
        return false;
      }
    },
    [currentConversationId, memoryManager]
  );

  /**
   * 清空对话消息
   * @param conversationId 对话ID（可选，默认为当前对话）
   * @returns 是否清空成功
   */
  const clearMessages = useCallback(
    (conversationId?: string): boolean => {
      try {
        const success = memoryManager.clearMessages(conversationId || currentConversationId);
        if (success) {
          setConversations(memoryManager.getConversations());
          return true;
        }
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "清空消息失败";
        setError(errorMessage);
        return false;
      }
    },
    [currentConversationId, memoryManager]
  );

  /**
   * 重置对话管理器
   */
  const reset = useCallback(() => {
    try {
      memoryManager.reset();
      setCurrentConversationId(memoryManager.getCurrentConversationId());
      setConversations(memoryManager.getConversations());
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "重置对话管理器失败";
      setError(errorMessage);
    }
  }, [memoryManager]);

  // 自动初始化
  useEffect(() => {
    if (options.autoInit) {
      initialize();
    }
  }, [options.autoInit, initialize]);

  return {
    // 状态
    conversations,
    currentConversationId,
    error,

    // 方法
    initialize,
    createConversation,
    switchConversation,
    deleteConversation,
    addMessage,
    getMessages,
    getSystemPrompt,
    setSystemPrompt,
    clearMessages,
    reset,

    // 直接访问记忆管理器（用于高级操作）
    memoryManager,
  };
};

export default useConversationManager;
