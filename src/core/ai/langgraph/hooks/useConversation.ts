/**
 * 对话管理钩子
 * 提供对话创建、删除、加载和更新功能
 */
import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useStore } from "jotai";
import {
  agentConversationIdsAtom,
  agentCurrentConversationIdAtom,
  agentConversationsAtom,
  agentCurrentMessagesAtom,
  dbInitializedAtom,
  dbInitializingAtom,
  dbAtom,
} from "../atoms/conversationAtoms";
import { Conversation, Message, MessageRole } from "../../types";
import useMemoizedFn from "@/hooks/useMemoizedFn";

// IndexedDB配置
const DB_NAME = "agent_conversations_db";
const STORE_NAME = "conversations";
// 在文件顶部添加一个全局变量
let isDBInitializing = false;
/**
 * 对话管理钩子
 * 提供对话创建、删除、加载和更新功能
 */
export function useConversation() {
  // 状态
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Jotai原子状态
  const [conversationIds, setConversationIds] = useAtom(agentConversationIdsAtom);
  const [currentConversationId, setCurrentConversationId] = useAtom(agentCurrentConversationIdAtom);
  const [conversations, setConversations] = useAtom(agentConversationsAtom);
  const [currentMessages] = useAtom(agentCurrentMessagesAtom);
  const [dbInitialized, setDbInitialized] = useAtom(dbInitializedAtom);
  const [dbInitializing, setDbInitializing] = useAtom(dbInitializingAtom);
  const store = useStore();

  // IndexedDB实例
  const [db, setDb] = useAtom<IDBDatabase | null>(dbAtom);
  /**
   * 初始化IndexedDB
   * 使用全局原子状态来确保只初始化一次
   */
  const initDB = useMemoizedFn(async () => {
    // 如果数据库已经初始化或正在初始化，直接返回
    if (dbInitialized || dbInitializing || isDBInitializing) {
      console.log("数据库已经初始化或正在初始化，跳过");
      return;
    }
    isDBInitializing = true;
    try {
      // 设置正在初始化标志
      setDbInitializing(true);
      setIsLoading(true);
      setError(null);
      console.log("开始初始化 IndexedDB");

      const request = indexedDB.open(DB_NAME, 1);

      request.onerror = (event) => {
        console.error("初始化IndexedDB失败:", event);
        setError("初始化数据库失败");
        setIsLoading(false);
        setDbInitializing(false);
      };

      request.onsuccess = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        setDb(database);
        setIsInitialized(true);
        setIsLoading(false);
        // 设置全局初始化标志
        setDbInitialized(true);
        setDbInitializing(false);
        console.log("IndexedDB 初始化成功");

        // 从IndexedDB加载会话数据
        // 在这里直接定义加载函数，避免循环依赖
        try {
          console.log("开始从 IndexedDB 加载会话数据");

          const transaction = database.transaction([STORE_NAME], "readonly");
          const store = transaction.objectStore(STORE_NAME);
          const request = store.getAll();

          request.onsuccess = () => {
            const loadedConversations = request.result as Conversation[];
            console.log(`从 IndexedDB 加载了 ${loadedConversations.length} 个会话`);

            if (loadedConversations && loadedConversations.length > 0) {
              // 构建会话映射
              const conversationsMap: Record<string, Conversation> = {};
              const ids: string[] = [];

              loadedConversations.forEach((conversation) => {
                // 确保消息数组存在
                if (!conversation.messages) {
                  conversation.messages = [];
                }

                conversationsMap[conversation.id] = conversation;
                ids.push(conversation.id);
                console.log(`加载会话: ${conversation.id}, 标题: ${conversation.title}, 消息数: ${conversation.messages.length}`);
              });

              // 更新状态
              setConversations(conversationsMap);
              setConversationIds(ids);

              // 如果有当前会话ID，检查它是否存在于加载的会话中
              if (currentConversationId) {
                if (conversationsMap[currentConversationId]) {
                  console.log(`恢复当前会话: ${currentConversationId}`);
                } else {
                  // 如果当前会话ID不存在于加载的会话中，设置为第一个会话
                  if (ids.length > 0) {
                    console.log(`当前会话 ${currentConversationId} 不存在，切换到第一个会话: ${ids[0]}`);
                    setCurrentConversationId(ids[0]);
                  } else {
                    console.log("没有可用的会话，清除当前会话ID");
                    setCurrentConversationId(null);
                  }
                }
              } else if (ids.length > 0) {
                // 如果没有当前会话ID，设置为第一个会话
                console.log(`没有当前会话ID，设置为第一个会话: ${ids[0]}`);
                setCurrentConversationId(ids[0]);
              }
            } else {
              console.log("没有从 IndexedDB 加载到会话");
            }
          };

          request.onerror = (event) => {
            console.error("从IndexedDB加载会话失败:", event);
            setError("加载会话失败");
          };
        } catch (err) {
          console.error("加载会话时出错:", err);
          setError(err instanceof Error ? err.message : "加载会话失败");
        }
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        console.log("创建 IndexedDB 存储");

        // 创建对象存储
        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: "id" });
          console.log(`创建了名为 ${STORE_NAME} 的对象存储`);
        }
      };
    } catch (err) {
      console.error("初始化IndexedDB时出错:", err);
      setError(err instanceof Error ? err.message : "初始化失败");
      setIsLoading(false);
    }
  });

  /**
   * 保存会话到IndexedDB
   */
  const saveConversationToDB = useCallback(
    async (conversation: Conversation) => {
      if (!db) {
        console.error("数据库未初始化，无法保存会话");
        return;
      }

      try {
        console.log(`保存会话到 IndexedDB: ${conversation.id}, 标题: ${conversation.title}`);
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // 使用Promise包装IndexedDB操作
        await new Promise<void>((resolve, reject) => {
          const request = store.put(conversation);
          request.onsuccess = () => {
            console.log(`会话 ${conversation.id} 保存成功`);
            resolve();
          };
          request.onerror = (event) => {
            console.error(`会话 ${conversation.id} 保存失败:`, event);
            reject(new Error(`保存会话失败: ${event}`));
          };
        });
      } catch (err) {
        console.error("保存会话到IndexedDB失败:", err);
        setError(err instanceof Error ? err.message : "保存会话失败");
      }
    },
    [db]
  );

  /**
   * 从IndexedDB删除会话
   */
  const deleteConversationFromDB = useCallback(
    async (id: string) => {
      if (!db) {
        console.error("数据库未初始化，无法删除会话");
        return;
      }

      try {
        console.log(`从 IndexedDB 删除会话: ${id}`);
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        // 使用Promise包装IndexedDB操作
        await new Promise<void>((resolve, reject) => {
          const request = store.delete(id);
          request.onsuccess = () => {
            console.log(`会话 ${id} 删除成功`);
            resolve();
          };
          request.onerror = (event) => {
            console.error(`会话 ${id} 删除失败:`, event);
            reject(new Error(`删除会话失败: ${event}`));
          };
        });
      } catch (err) {
        console.error("从IndexedDB删除会话失败:", err);
        setError(err instanceof Error ? err.message : "删除会话失败");
      }
    },
    [db]
  );

  /**
   * 创建新会话
   * @param title 会话标题
   * @param systemPrompt 系统提示词
   * @returns 如果成功，返回包含新会话ID和会话对象的结构；如果失败，返回null
   */
  const createConversation = useCallback(
    async (title: string = "新对话", systemPrompt?: string): Promise<{ newConversationId: string } | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const id = crypto.randomUUID();
        const now = Date.now();

        // 创建新会话
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
            id: crypto.randomUUID(),
            role: MessageRole.SYSTEM,
            content: systemPrompt,
            timestamp: now,
          });
        }

        // 更新状态
        setConversations((prev) => ({
          ...prev,
          [id]: newConversation,
        }));

        setConversationIds((prev) => [...prev, id]);
        setCurrentConversationId(id);

        // 保存到IndexedDB
        await saveConversationToDB(newConversation);

        setIsLoading(false);
        return { newConversationId: id }; // 返回ID和新会话对象
      } catch (err) {
        console.error("创建会话失败:", err);
        setError(err instanceof Error ? err.message : "创建会话失败");
        setIsLoading(false);
        return null;
      }
    },
    [saveConversationToDB, setConversations, setConversationIds, setCurrentConversationId]
  );

  /**
   * 删除会话
   * @param id 会话ID
   */
  const deleteConversation = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // 检查会话是否存在
        if (!conversations[id]) {
          throw new Error(`会话不存在: ${id}`);
        }

        // 更新状态
        const newConversations = { ...conversations };
        delete newConversations[id];
        setConversations(newConversations);

        setConversationIds((prev) => prev.filter((convId) => convId !== id));

        // 如果删除的是当前会话，切换到另一个会话
        if (currentConversationId === id) {
          const remainingIds = conversationIds.filter((convId) => convId !== id);
          if (remainingIds.length > 0) {
            setCurrentConversationId(remainingIds[0]);
          } else {
            setCurrentConversationId(null);
          }
        }

        // 从IndexedDB删除
        await deleteConversationFromDB(id);

        setIsLoading(false);
        return true;
      } catch (err) {
        console.error("删除会话失败:", err);
        setError(err instanceof Error ? err.message : "删除会话失败");
        setIsLoading(false);
        return false;
      }
    },
    [conversations, conversationIds, currentConversationId, deleteConversationFromDB, setConversations, setConversationIds, setCurrentConversationId]
  );

  /**
   * 切换会话
   * @param id 会话ID
   */
  const switchConversation = useAtomCallback(
    useCallback(
      async (get, set, id: string) => {
        try {
          // 获取最新的会话列表
          const latestConversations = get(agentConversationsAtom);

          // 检查会话是否存在
          if (!latestConversations[id]) {
            throw new Error(`会话不存在: ${id}`);
          }

          // 设置当前会话ID
          set(agentCurrentConversationIdAtom, id);
          return true;
        } catch (err) {
          console.error("切换会话失败:", err);
          setError(err instanceof Error ? err.message : "切换会话失败");
          return false;
        }
      },
      [setError]
    )
  );

  /**
   * 添加消息到会话
   * @param params 参数对象
   * @param params.message 消息对象
   * @param params.conversationId 可选的会话ID，如果不提供则使用当前会话ID
   * @param params.conversation 可选的会话对象，如果提供则直接使用而不从状态中获取
   * @returns 消息ID或null（如果失败）
   */
  const addMessage = useMemoizedFn(async (params: { message: Omit<Message, "id" | "timestamp">; conversationId?: string }) => {
    try {
      const { message, conversationId } = params;
      console.log(`开始添加消息，内容: "${message.content.substring(0, 50)}${message.content.length > 50 ? "..." : ""}", 角色: ${message.role}`);
      console.log(`提供的会话ID: ${conversationId || "无"}`);

      // 获取最新的原子值
      const latestConversations = store.get(agentConversationsAtom);
      const latestCurrentConversationId = store.get(agentCurrentConversationIdAtom);

      console.log(`当前会话ID (从原子状态获取): ${latestCurrentConversationId || "无"}`);
      console.log(`可用会话数量: ${Object.keys(latestConversations).length}`);

      // 使用提供的会话ID或当前会话ID
      const targetConversationId = conversationId || latestCurrentConversationId;
      console.log(`目标会话ID: ${targetConversationId || "无"}`);

      if (!targetConversationId) {
        console.error("没有指定会话ID，且没有当前选中的会话");
        throw new Error("没有指定会话ID，且没有当前选中的会话");
      }

      // 检查会话是否存在
      if (!latestConversations[targetConversationId]) {
        console.error(`会话不存在: ${targetConversationId}`);
        console.log(`可用会话IDs: ${Object.keys(latestConversations).join(", ")}`);
        throw new Error(`会话不存在: ${targetConversationId}`);
      }

      const newConversation = latestConversations[targetConversationId];
      console.log(`找到目标会话: ${targetConversationId}, 标题: ${newConversation.title}, 当前消息数: ${newConversation.messages.length}`);

      const now = Date.now();

      // 创建完整消息
      const fullMessage: Message = {
        id: crypto.randomUUID(),
        ...message,
        timestamp: now,
      };
      console.log(`创建了新消息，ID: ${fullMessage.id}`);

      // 更新会话
      const updatedConversation: Conversation = {
        ...newConversation,
        messages: [...newConversation.messages, fullMessage],
        updatedAt: now,
      };
      console.log(`更新后的会话消息数: ${updatedConversation.messages.length}`);

      // 更新内存中的状态
      console.log(`更新内存中的会话状态`);
      setConversations((prev) => {
        const updated = {
          ...prev,
          [targetConversationId]: updatedConversation,
        };
        console.log(`内存状态更新完成，会话数: ${Object.keys(updated).length}`);
        return updated;
      });

      // 保存到IndexedDB
      console.log(`开始保存会话到IndexedDB: ${targetConversationId}`);
      await saveConversationToDB(updatedConversation);
      console.log(`会话已保存到IndexedDB: ${targetConversationId}`);

      return fullMessage.id;
    } catch (err) {
      console.error("添加消息失败:", err);
      setError(err instanceof Error ? err.message : "添加消息失败");
      return null;
    }
  });

  /**
   * 更新会话标题
   * @param id 会话ID
   * @param title 新标题
   */
  const updateConversationTitle = useCallback(
    async (id: string, title: string) => {
      try {
        // 检查会话是否存在
        if (!conversations[id]) {
          throw new Error(`会话不存在: ${id}`);
        }

        const now = Date.now();

        // 更新会话
        const updatedConversation: Conversation = {
          ...conversations[id],
          title,
          updatedAt: now,
        };

        // 更新状态
        setConversations((prev) => ({
          ...prev,
          [id]: updatedConversation,
        }));

        // 保存到IndexedDB
        await saveConversationToDB(updatedConversation);

        return true;
      } catch (err) {
        console.error("更新会话标题失败:", err);
        setError(err instanceof Error ? err.message : "更新会话标题失败");
        return false;
      }
    },
    [conversations, saveConversationToDB, setConversations]
  );

  /**
   * 清空所有会话
   */
  const clearAllConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("开始清空所有会话");

      // 清空IndexedDB
      if (db) {
        const transaction = db.transaction([STORE_NAME], "readwrite");
        const store = transaction.objectStore(STORE_NAME);

        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => {
            console.log("数据库清空成功");
            resolve();
          };
          request.onerror = (event) => {
            console.error("清空数据库失败:", event);
            reject(new Error(`清空数据库失败: ${event}`));
          };
        });
      } else {
        console.warn("数据库未初始化，无法清空数据库");
      }

      // 更新状态
      setConversations({});
      setConversationIds([]);
      setCurrentConversationId(null);

      console.log("所有会话已清空");
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("清空所有会话失败:", err);
      setError(err instanceof Error ? err.message : "清空所有会话失败");
      setIsLoading(false);
      return false;
    }
  }, [db, setConversations, setConversationIds, setCurrentConversationId]);

  /**
   * 获取当前会话
   */
  const getCurrentConversation = useCallback(() => {
    if (!currentConversationId) return null;
    return conversations[currentConversationId] || null;
  }, [currentConversationId, conversations]);

  /**
   * 获取所有会话
   */
  const getAllConversations = useCallback(() => {
    return conversationIds.map((id) => conversations[id]).filter(Boolean);
  }, [conversationIds, conversations]);

  // 初始化
  useEffect(() => {
    // 如果数据库已经初始化，直接返回
    if (dbInitialized) {
      setIsInitialized(true);
      return;
    }

    // 如果数据库正在初始化，等待它完成
    if (dbInitializing) {
      return;
    }

    // 否则初始化数据库
    initDB();
  }, [dbInitialized, dbInitializing, initDB, setIsInitialized]);

  return {
    // 状态
    isInitialized,
    isLoading,
    error,
    conversationIds,
    currentConversationId,
    conversations,
    currentConversation: getCurrentConversation(),
    allConversations: getAllConversations(),
    currentMessages,

    // 方法
    createConversation,
    deleteConversation,
    switchConversation,
    addMessage,
    updateConversationTitle,
    clearAllConversations,
  };
}

export default useConversation;
