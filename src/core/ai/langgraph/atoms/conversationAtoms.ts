/**
 * LangGraph对话相关的原子状态
 */
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Conversation } from "../../types";

// 对话列表 - 使用内存存储，实际数据由useConversation通过IndexedDB管理
export const agentConversationIdsAtom = atom<string[]>([]);

// 当前选中的对话ID - 使用内存存储，但保留在localStorage以便恢复上次会话
export const agentCurrentConversationIdAtom = atomWithStorage<string | null>("agent_current_conversation_id", null);

// 对话内容映射 - 使用内存存储，实际数据由useConversation通过IndexedDB管理
export const agentConversationsAtom = atom<Record<string, Conversation>>({});

// 数据库初始化状态 - 全局共享，确保只初始化一次
export const dbInitializedAtom = atom<boolean>(false);

// 数据库初始化中状态 - 全局共享，防止并发初始化
export const dbInitializingAtom = atom<boolean>(false);

// 当前db对象
export const dbAtom = atom<IDBDatabase | null>(null);

// 当前会话的消息列表 - 派生原子
export const agentCurrentMessagesAtom = atom((get) => {
  const currentId = get(agentCurrentConversationIdAtom);
  const conversations = get(agentConversationsAtom);

  if (!currentId || !conversations[currentId]) {
    return [];
  }

  return conversations[currentId].messages;
});

// 是否有会话 - 派生原子
export const hasConversationsAtom = atom((get) => {
  const ids = get(agentConversationIdsAtom);
  return ids.length > 0;
});
