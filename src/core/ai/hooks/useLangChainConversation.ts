/**
 * LangChain对话管理钩子
 */
import { useCallback } from "react";
import { useAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import {
  conversationIdsAtom,
  currentConversationIdAtom,
  conversationsAtom,
  userInputAtom,
} from "../atoms/conversationAtoms";
import { Conversation, Message, MessageRole } from "../types";

/**
 * LangChain对话管理钩子
 * 提供对话创建、切换、删除和消息管理功能
 */
export function useLangChainConversation() {
  // 状态原子
  const [conversationIds, setConversationIds] = useAtom(conversationIdsAtom);
  const [currentConversationId, setCurrentConversationId] = useAtom(currentConversationIdAtom);
  const [conversations, setConversations] = useAtom(conversationsAtom);
  const [userInput, setUserInput] = useAtom(userInputAtom);
  
  /**
   * 获取当前对话
   */
  const getCurrentConversation = useCallback(() => {
    if (!currentConversationId) return null;
    return conversations[currentConversationId] || null;
  }, [currentConversationId, conversations]);
  
  /**
   * 获取所有对话
   */
  const getAllConversations = useCallback(() => {
    return conversationIds.map(id => conversations[id]).filter(Boolean);
  }, [conversationIds, conversations]);
  
  /**
   * 创建新对话
   * @param title 对话标题
   * @param systemPrompt 系统提示词
   */
  const createConversation = useCallback((title: string, systemPrompt?: string) => {
    try {
      const id = uuidv4();
      const now = Date.now();
      
      // 创建新对话
      const newConversation: Conversation = {
        id,
        title,
        systemPrompt,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      
      // 如果有系统提示词，添加系统消息
      if (systemPrompt) {
        newConversation.messages.push({
          id: uuidv4(),
          role: MessageRole.SYSTEM,
          content: systemPrompt,
          timestamp: now,
        });
      }
      
      // 更新状态
      setConversations(prev => ({
        ...prev,
        [id]: newConversation,
      }));
      
      setConversationIds(prev => [...prev, id]);
      setCurrentConversationId(id);
      
      return id;
    } catch (error) {
      console.error("创建对话失败:", error);
      return null;
    }
  }, [setConversations, setConversationIds, setCurrentConversationId]);
  
  /**
   * 切换对话
   * @param id 对话ID
   */
  const switchConversation = useCallback((id: string) => {
    try {
      if (!conversations[id]) {
        throw new Error(`对话不存在: ${id}`);
      }
      
      setCurrentConversationId(id);
      return true;
    } catch (error) {
      console.error("切换对话失败:", error);
      return false;
    }
  }, [conversations, setCurrentConversationId]);
  
  /**
   * 删除对话
   * @param id 对话ID
   */
  const deleteConversation = useCallback((id: string) => {
    try {
      // 更新对话ID列表
      setConversationIds(prev => prev.filter(convId => convId !== id));
      
      // 更新对话映射
      setConversations(prev => {
        const newConversations = { ...prev };
        delete newConversations[id];
        return newConversations;
      });
      
      // 如果删除的是当前对话，切换到其他对话
      if (currentConversationId === id) {
        const remainingIds = conversationIds.filter(convId => convId !== id);
        if (remainingIds.length > 0) {
          setCurrentConversationId(remainingIds[0]);
        } else {
          setCurrentConversationId(null);
        }
      }
      
      return true;
    } catch (error) {
      console.error("删除对话失败:", error);
      return false;
    }
  }, [conversationIds, currentConversationId, setConversationIds, setConversations, setCurrentConversationId]);
  
  /**
   * 更新对话标题
   * @param id 对话ID
   * @param title 新标题
   */
  const updateConversationTitle = useCallback((id: string, title: string) => {
    try {
      if (!conversations[id]) {
        throw new Error(`对话不存在: ${id}`);
      }
      
      setConversations(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          title,
          updatedAt: Date.now(),
        },
      }));
      
      return true;
    } catch (error) {
      console.error("更新对话标题失败:", error);
      return false;
    }
  }, [conversations, setConversations]);
  
  /**
   * 更新系统提示词
   * @param id 对话ID
   * @param systemPrompt 新的系统提示词
   */
  const updateSystemPrompt = useCallback((id: string, systemPrompt: string) => {
    try {
      if (!conversations[id]) {
        throw new Error(`对话不存在: ${id}`);
      }
      
      const conversation = conversations[id];
      const now = Date.now();
      
      // 查找现有的系统消息
      const systemMessageIndex = conversation.messages.findIndex(msg => msg.role === MessageRole.SYSTEM);
      
      // 创建新的消息数组
      let newMessages = [...conversation.messages];
      
      if (systemMessageIndex >= 0) {
        // 更新现有的系统消息
        newMessages[systemMessageIndex] = {
          ...newMessages[systemMessageIndex],
          content: systemPrompt,
          timestamp: now,
        };
      } else {
        // 添加新的系统消息
        newMessages = [
          {
            id: uuidv4(),
            role: MessageRole.SYSTEM,
            content: systemPrompt,
            timestamp: now,
          },
          ...newMessages,
        ];
      }
      
      // 更新对话
      setConversations(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          systemPrompt,
          messages: newMessages,
          updatedAt: now,
        },
      }));
      
      return true;
    } catch (error) {
      console.error("更新系统提示词失败:", error);
      return false;
    }
  }, [conversations, setConversations]);
  
  /**
   * 添加消息
   * @param id 对话ID
   * @param message 消息
   */
  const addMessage = useCallback((id: string, message: Omit<Message, "id" | "timestamp">) => {
    try {
      if (!conversations[id]) {
        throw new Error(`对话不存在: ${id}`);
      }
      
      const now = Date.now();
      
      // 创建完整消息
      const fullMessage: Message = {
        id: uuidv4(),
        ...message,
        timestamp: now,
      };
      
      // 更新对话
      setConversations(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          messages: [...prev[id].messages, fullMessage],
          updatedAt: now,
        },
      }));
      
      return fullMessage.id;
    } catch (error) {
      console.error("添加消息失败:", error);
      return null;
    }
  }, [conversations, setConversations]);
  
  /**
   * 清空对话消息
   * @param id 对话ID
   * @param keepSystemPrompt 是否保留系统提示词
   */
  const clearMessages = useCallback((id: string, keepSystemPrompt: boolean = true) => {
    try {
      if (!conversations[id]) {
        throw new Error(`对话不存在: ${id}`);
      }
      
      const conversation = conversations[id];
      const now = Date.now();
      
      // 保留系统消息
      let newMessages: Message[] = [];
      if (keepSystemPrompt) {
        newMessages = conversation.messages.filter(msg => msg.role === MessageRole.SYSTEM);
      }
      
      // 更新对话
      setConversations(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          messages: newMessages,
          updatedAt: now,
        },
      }));
      
      return true;
    } catch (error) {
      console.error("清空对话消息失败:", error);
      return false;
    }
  }, [conversations, setConversations]);
  
  /**
   * 更新用户输入
   * @param input 用户输入
   */
  const updateUserInput = useCallback((input: string) => {
    setUserInput(input);
  }, [setUserInput]);
  
  return {
    // 状态
    conversationIds,
    currentConversationId,
    conversations,
    userInput,
    currentConversation: getCurrentConversation(),
    allConversations: getAllConversations(),
    
    // 方法
    createConversation,
    switchConversation,
    deleteConversation,
    updateConversationTitle,
    updateSystemPrompt,
    addMessage,
    clearMessages,
    updateUserInput,
  };
}
