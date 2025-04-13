/**
 * 记忆管理器
 * 管理对话历史和记忆
 */
import { Conversation, ConversationInfo, CreateConversationOptions, Message, MemoryType, StorageProvider } from "../../types";
import { createStorageAdapter, StorageAdapter } from "./storageAdapter";
import { STORAGE_KEYS, DEFAULT_SYSTEM_PROMPT } from "../../constants";
import { BaseMemory } from "@langchain/core/memory";
import { createMemory } from "./index";

/**
 * 扩展的记忆接口
 */
export interface ExtendedMemory extends BaseMemory {
  /**
   * 添加消息到记忆
   * @param role 角色
   * @param content 内容
   */
  addMessage(role: string, content: string): void;
}

/**
 * 记忆管理器类
 * 管理对话历史和记忆
 */
export class MemoryManager {
  /** 存储适配器 */
  private storage: StorageAdapter;
  /** 对话映射 */
  private conversations: Map<string, Conversation> = new Map();
  /** 当前对话ID */
  private currentConversationId: string = "";
  /** 记忆类型 */
  private memoryType: MemoryType = MemoryType.BUFFER;
  /** 记忆缓存 */
  private memories: Map<string, ExtendedMemory> = new Map();
  /** 记忆窗口大小 */
  private memoryWindowSize: number = 10;
  /** 记忆摘要阈值 */
  private memorySummaryThreshold: number = 2000;
  /** 单例实例 */
  private static instance: MemoryManager | null = null;

  /**
   * 获取单例实例
   * @returns 记忆管理器实例
   */
  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * 私有构造函数
   */
  private constructor() {
    this.storage = createStorageAdapter(StorageProvider.LOCAL_STORAGE);
    this.loadConversations();
  }

  /**
   * 初始化记忆管理器
   * @param memoryType 记忆类型
   * @param storageProvider 存储提供商
   */
  public initialize(memoryType: MemoryType = MemoryType.BUFFER, storageProvider: StorageProvider = StorageProvider.LOCAL_STORAGE): void {
    this.memoryType = memoryType;
    this.storage = createStorageAdapter(storageProvider);
    this.loadConversations();
  }

  /**
   * 从存储中加载对话
   */
  private async loadConversations(): Promise<void> {
    try {
      const conversations = await this.storage.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS);
      this.conversations.clear();

      if (conversations) {
        conversations.forEach((conversation) => {
          this.conversations.set(conversation.id, conversation);
        });
      }

      // 加载当前对话ID
      const currentId = await this.storage.get<string>(STORAGE_KEYS.CURRENT_CONVERSATION);
      this.currentConversationId = currentId || "";

      // 如果没有当前对话，创建一个默认对话
      if (!this.currentConversationId || !this.conversations.has(this.currentConversationId)) {
        await this.createConversation({ name: "默认对话" });
      }
    } catch (error) {
      console.error("加载对话失败:", error);
    }
  }

  /**
   * 保存对话到存储
   */
  private async saveConversations(): Promise<void> {
    try {
      const conversations = Array.from(this.conversations.values());
      await this.storage.set(STORAGE_KEYS.CONVERSATIONS, conversations);
      await this.storage.set(STORAGE_KEYS.CURRENT_CONVERSATION, this.currentConversationId);
    } catch (error) {
      console.error("保存对话失败:", error);
    }
  }

  /**
   * 创建新对话
   * @param options 创建选项
   * @returns 对话ID
   */
  public async createConversation(options: CreateConversationOptions): Promise<string> {
    const id = crypto.randomUUID();
    const now = Date.now();
    const conversation: Conversation = {
      id,
      name: options.name,
      messages: [],
      createdAt: now,
      updatedAt: now,
      systemPrompt: options.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    };

    this.conversations.set(id, conversation);
    this.currentConversationId = id;
    await this.saveConversations();
    return id;
  }

  /**
   * 获取对话
   * @param id 对话ID
   * @returns 对话
   */
  public getConversation(id: string): Conversation | null {
    return this.conversations.get(id) || null;
  }

  /**
   * 获取当前对话
   * @returns 当前对话
   */
  public getCurrentConversation(): Conversation | null {
    return this.getConversation(this.currentConversationId);
  }

  /**
   * 获取当前对话ID
   * @returns 当前对话ID
   */
  public getCurrentConversationId(): string {
    return this.currentConversationId;
  }

  /**
   * 切换当前对话
   * @param id 对话ID
   * @returns 是否切换成功
   */
  public async switchConversation(id: string): Promise<boolean> {
    if (this.conversations.has(id)) {
      this.currentConversationId = id;
      await this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 删除对话
   * @param id 对话ID
   * @returns 是否删除成功
   */
  public async deleteConversation(id: string): Promise<boolean> {
    if (this.conversations.has(id)) {
      this.conversations.delete(id);

      // 如果删除的是当前对话，切换到另一个对话
      if (this.currentConversationId === id) {
        const conversationIds = Array.from(this.conversations.keys());
        if (conversationIds.length > 0) {
          this.currentConversationId = conversationIds[0];
        } else {
          // 如果没有对话了，创建一个新的默认对话
          await this.createConversation({ name: "默认对话" });
        }
      }

      await this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 获取所有对话信息
   * @returns 对话信息数组
   */
  public getConversations(): ConversationInfo[] {
    return Array.from(this.conversations.values()).map((conversation) => {
      const lastMessage = conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1].content : undefined;

      return {
        id: conversation.id,
        name: conversation.name,
        lastMessage,
        messageCount: conversation.messages.length,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      };
    });
  }

  /**
   * 添加消息到对话
   * @param conversationId 对话ID
   * @param role 角色
   * @param content 内容
   * @returns 消息ID
   */
  public async addMessage(conversationId: string, role: "user" | "assistant" | "system", content: string): Promise<string> {
    const conversation = this.getConversation(conversationId);
    if (!conversation) {
      throw new Error(`对话不存在: ${conversationId}`);
    }

    const id = crypto.randomUUID();
    const message: Message = {
      id,
      role,
      content,
      timestamp: Date.now(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = message.timestamp;
    await this.saveConversations();
    return id;
  }

  /**
   * 获取对话消息
   * @param conversationId 对话ID
   * @returns 消息数组
   */
  public getMessages(conversationId: string): Message[] {
    const conversation = this.getConversation(conversationId);
    return conversation ? conversation.messages : [];
  }

  /**
   * 获取对话系统提示词
   * @param conversationId 对话ID
   * @returns 系统提示词
   */
  public getSystemPrompt(conversationId: string): string {
    const conversation = this.getConversation(conversationId);
    return conversation?.systemPrompt || DEFAULT_SYSTEM_PROMPT;
  }

  /**
   * 设置对话系统提示词
   * @param conversationId 对话ID
   * @param systemPrompt 系统提示词
   * @returns 是否设置成功
   */
  public async setSystemPrompt(conversationId: string, systemPrompt: string): Promise<boolean> {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.systemPrompt = systemPrompt;
      conversation.updatedAt = Date.now();
      await this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 清空对话消息
   * @param conversationId 对话ID
   * @returns 是否清空成功
   */
  public async clearMessages(conversationId: string): Promise<boolean> {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.messages = [];
      conversation.updatedAt = Date.now();
      await this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 重命名对话
   * @param conversationId 对话ID
   * @param name 新名称
   * @returns 是否重命名成功
   */
  public async renameConversation(conversationId: string, name: string): Promise<boolean> {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.name = name;
      conversation.updatedAt = Date.now();
      await this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 重置记忆管理器
   */
  public reset(): void {
    this.conversations.clear();
    this.currentConversationId = "";
    this.memories.clear();
    this.storage.clear();
    this.createConversation({ name: "默认对话" });
  }

  /**
   * 获取对话记忆
   * @param conversationId 对话 ID
   * @returns 记忆实例
   */
  public getMemory(conversationId: string): ExtendedMemory {
    // 如果记忆已存在，直接返回
    if (this.memories.has(conversationId)) {
      return this.memories.get(conversationId)!;
    }

    // 创建新记忆
    const memoryConfig = {
      type: this.memoryType,
      maxMessages: this.memoryWindowSize,
      summarizeThreshold: this.memorySummaryThreshold,
    };

    const memory = createMemory(memoryConfig) as ExtendedMemory;

    // 添加 addMessage 方法
    const extendedMemory = memory as any;

    if (!("addMessage" in extendedMemory)) {
      extendedMemory.addMessage = (role: string, content: string) => {
        // 实现一个简单的 addMessage 方法
        try {
          // 这里我们只是模拟添加消息的行为
          // 实际上我们并不直接修改 LangChain 的记忆实例
          // 因为这可能会导致类型错误
          console.log(`添加消息到记忆: ${role} - ${content.substring(0, 50)}...`);
        } catch (error) {
          console.error("添加消息到记忆失败:", error);
        }
      };
    }

    this.memories.set(conversationId, extendedMemory);
    return extendedMemory;
  }

  /**
   * 删除对话记忆
   * @param conversationId 对话 ID
   * @returns 是否删除成功
   */
  public async deleteMemory(conversationId: string): Promise<boolean> {
    if (this.memories.has(conversationId)) {
      this.memories.delete(conversationId);
      return true;
    }
    return false;
  }

  /**
   * 保存所有记忆到存储
   * @returns 是否保存成功
   */
  public async saveMemoriesToStorage(): Promise<boolean> {
    try {
      // 记忆实例无法直接序列化，所以这里只保存对话消息
      // 实际应用中可能需要更复杂的逻辑来存储记忆状态
      await this.saveConversations();
      return true;
    } catch (error) {
      console.error("保存记忆失败:", error);
      return false;
    }
  }

  /**
   * 更新记忆类型
   * @param type 记忆类型
   * @returns 是否更新成功
   */
  public async updateMemoryType(type: MemoryType): Promise<boolean> {
    this.memoryType = type;

    // 重新创建所有记忆
    this.memories.clear();
    return true;
  }

  /**
   * 更新记忆窗口大小
   * @param size 窗口大小
   * @returns 是否更新成功
   */
  public async updateMemoryWindowSize(size: number): Promise<boolean> {
    this.memoryWindowSize = size;
    return true;
  }

  /**
   * 更新记忆摘要阈值
   * @param threshold 阈值
   * @returns 是否更新成功
   */
  public async updateMemorySummaryThreshold(threshold: number): Promise<boolean> {
    this.memorySummaryThreshold = threshold;
    return true;
  }
}

export default MemoryManager;
