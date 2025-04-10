/**
 * 记忆管理器
 * 管理对话历史和记忆
 */
import { Conversation, ConversationInfo, CreateConversationOptions, Message, MemoryType, StorageProvider } from "../../types";
import { createStorageAdapter, StorageAdapter } from "./storageAdapter";
import { STORAGE_KEYS, DEFAULT_SYSTEM_PROMPT } from "../../constants";

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
  private loadConversations(): void {
    const conversations = this.storage.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS) || [];
    this.conversations.clear();
    conversations.forEach((conversation) => {
      this.conversations.set(conversation.id, conversation);
    });

    // 加载当前对话ID
    this.currentConversationId = this.storage.get<string>(STORAGE_KEYS.CURRENT_CONVERSATION) || "";

    // 如果没有当前对话，创建一个默认对话
    if (!this.currentConversationId || !this.conversations.has(this.currentConversationId)) {
      this.createConversation({ name: "默认对话" });
    }
  }

  /**
   * 保存对话到存储
   */
  private saveConversations(): void {
    const conversations = Array.from(this.conversations.values());
    this.storage.set(STORAGE_KEYS.CONVERSATIONS, conversations);
    this.storage.set(STORAGE_KEYS.CURRENT_CONVERSATION, this.currentConversationId);
  }

  /**
   * 创建新对话
   * @param options 创建选项
   * @returns 对话ID
   */
  public createConversation(options: CreateConversationOptions): string {
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
    this.saveConversations();
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
  public switchConversation(id: string): boolean {
    if (this.conversations.has(id)) {
      this.currentConversationId = id;
      this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 删除对话
   * @param id 对话ID
   * @returns 是否删除成功
   */
  public deleteConversation(id: string): boolean {
    if (this.conversations.has(id)) {
      this.conversations.delete(id);

      // 如果删除的是当前对话，切换到另一个对话
      if (this.currentConversationId === id) {
        const conversationIds = Array.from(this.conversations.keys());
        if (conversationIds.length > 0) {
          this.currentConversationId = conversationIds[0];
        } else {
          // 如果没有对话了，创建一个新的默认对话
          this.createConversation({ name: "默认对话" });
        }
      }

      this.saveConversations();
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
  public addMessage(conversationId: string, role: "user" | "assistant" | "system", content: string): string {
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
    this.saveConversations();
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
  public setSystemPrompt(conversationId: string, systemPrompt: string): boolean {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.systemPrompt = systemPrompt;
      conversation.updatedAt = Date.now();
      this.saveConversations();
      return true;
    }
    return false;
  }

  /**
   * 清空对话消息
   * @param conversationId 对话ID
   * @returns 是否清空成功
   */
  public clearMessages(conversationId: string): boolean {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.messages = [];
      conversation.updatedAt = Date.now();
      this.saveConversations();
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
  public renameConversation(conversationId: string, name: string): boolean {
    const conversation = this.getConversation(conversationId);
    if (conversation) {
      conversation.name = name;
      conversation.updatedAt = Date.now();
      this.saveConversations();
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
    this.storage.clear();
    this.createConversation({ name: "默认对话" });
  }
}

export default MemoryManager;
