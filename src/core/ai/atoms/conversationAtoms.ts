/**
 * 对话相关的原子状态
 */
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Conversation } from "../types";

// 对话列表 - 持久化，只存储ID列表
export const conversationIdsAtom = atomWithStorage<string[]>("ai_conversation_ids", []);

// 当前选中的对话ID - 持久化
export const currentConversationIdAtom = atomWithStorage<string | null>("ai_current_conversation_id", null);

// 对话内容映射 - 持久化，按ID存储
export const conversationsAtom = atomWithStorage<Record<string, Conversation>>("ai_conversations", {});

// 用户输入 - 非持久化
export const userInputAtom = atom<string>("");
