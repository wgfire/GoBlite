/**
 * LangChain service implementation
 */

import { LangChainServiceConfig, LangChainService as ILangChainService, Conversation, ConversationInfo } from './types';
import { AIServiceStatus } from '../types';
import { ModelManager } from './models/modelManager';
import { MemoryManager } from './memory/memoryManager';
import { ToolManager } from './tools/toolManager';
import { ConversationManager } from './conversation/conversationManager';

/**
 * LangChain service class
 * Provides integration with LangChain.js for AI capabilities
 */
export class LangChainService implements ILangChainService {
  private static instance: LangChainService | null = null;
  private status: AIServiceStatus = AIServiceStatus.UNINITIALIZED;
  private modelManager: ModelManager;
  private memoryManager: MemoryManager;
  private toolManager: ToolManager;
  private conversationManager: ConversationManager;
  private config: LangChainServiceConfig | null = null;
  private error: string | null = null;

  /**
   * Private constructor (singleton pattern)
   */
  private constructor() {
    this.modelManager = new ModelManager();
    this.memoryManager = new MemoryManager();
    this.toolManager = new ToolManager();
    this.conversationManager = new ConversationManager();
  }

  /**
   * Get the singleton instance
   * @returns LangChainService instance
   */
  public static getInstance(): LangChainService {
    if (!LangChainService.instance) {
      LangChainService.instance = new LangChainService();
    }
    return LangChainService.instance;
  }

  /**
   * Initialize the LangChain service
   * @param config Service configuration
   * @returns Promise<boolean> Whether initialization was successful
   */
  public async initialize(config: LangChainServiceConfig): Promise<boolean> {
    try {
      this.status = AIServiceStatus.INITIALIZING;
      this.config = config;
      
      // Initialize model manager with the configured model
      await this.modelManager.initialize({
        defaultModelName: config.defaultModelName,
        apiKey: config.apiKey,
        baseUrl: config.baseUrl,
      });
      
      // Initialize memory manager
      await this.memoryManager.initialize({
        type: config.memoryType || 'buffer',
        persistenceProvider: config.persistenceProvider || 'localStorage',
      });
      
      // Initialize tool manager
      await this.toolManager.initialize();
      
      // Initialize conversation manager
      await this.conversationManager.initialize({
        modelManager: this.modelManager,
        memoryManager: this.memoryManager,
        toolManager: this.toolManager,
      });
      
      this.status = AIServiceStatus.READY;
      return true;
    } catch (error) {
      this.status = AIServiceStatus.ERROR;
      this.error = error instanceof Error ? error.message : 'Failed to initialize LangChain service';
      console.error('Failed to initialize LangChain service:', error);
      return false;
    }
  }

  /**
   * Get the current service status
   * @returns AIServiceStatus
   */
  public getStatus(): AIServiceStatus {
    return this.status;
  }

  /**
   * Get the current error message
   * @returns Error message or null
   */
  public getError(): string | null {
    return this.error;
  }

  /**
   * Create a new conversation
   * @param id Conversation ID
   * @param options Optional configuration
   * @returns Promise<Conversation> The created conversation
   */
  public async createConversation(id: string, options?: any): Promise<Conversation> {
    try {
      return await this.conversationManager.createConversation(id, options);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to create conversation';
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }

  /**
   * Get a conversation by ID
   * @param id Conversation ID
   * @returns Promise<Conversation | null> The conversation or null if not found
   */
  public async getConversation(id: string): Promise<Conversation | null> {
    try {
      return await this.conversationManager.getConversation(id);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to get conversation';
      console.error('Failed to get conversation:', error);
      return null;
    }
  }

  /**
   * List all conversations
   * @returns Promise<ConversationInfo[]> List of conversation info
   */
  public async listConversations(): Promise<ConversationInfo[]> {
    try {
      return await this.conversationManager.listConversations();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to list conversations';
      console.error('Failed to list conversations:', error);
      return [];
    }
  }

  /**
   * Delete a conversation
   * @param id Conversation ID
   * @returns Promise<boolean> Whether deletion was successful
   */
  public async deleteConversation(id: string): Promise<boolean> {
    try {
      return await this.conversationManager.deleteConversation(id);
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to delete conversation';
      console.error('Failed to delete conversation:', error);
      return false;
    }
  }

  /**
   * Send a message to a conversation
   * @param conversationId Conversation ID
   * @param message Message content
   * @returns Promise<string> The response
   */
  public async sendMessage(conversationId: string, message: string): Promise<string> {
    try {
      this.status = AIServiceStatus.PROCESSING;
      const response = await this.conversationManager.sendMessage(conversationId, message);
      this.status = AIServiceStatus.READY;
      return response;
    } catch (error) {
      this.status = AIServiceStatus.ERROR;
      this.error = error instanceof Error ? error.message : 'Failed to send message';
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  /**
   * Reset the service
   */
  public reset(): void {
    this.status = AIServiceStatus.UNINITIALIZED;
    this.error = null;
    this.config = null;
  }
}
