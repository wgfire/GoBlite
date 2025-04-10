/**
 * Conversation manager for LangChain integration
 * Manages conversations and messages
 */

import { Conversation, ConversationInfo, Message } from '@core/ai/types';
import { ModelManager } from '../models/modelManager';
import { MemoryManager } from '../memory/memoryManager';
import { ToolManager } from '../tools/toolManager';

/**
 * Configuration for conversation manager initialization
 */
export interface ConversationManagerConfig {
  modelManager: ModelManager;
  memoryManager: MemoryManager;
  toolManager: ToolManager;
}

/**
 * Conversation manager class
 * Manages conversations and messages
 */
export class ConversationManager {
  private conversations: Map<string, Conversation> = new Map();
  private modelManager: ModelManager | null = null;
  private memoryManager: MemoryManager | null = null;
  private toolManager: ToolManager | null = null;
  private storage: Storage = localStorage;
  
  /**
   * Initialize the conversation manager
   * @param config Configuration
   * @returns Promise<boolean> Whether initialization was successful
   */
  public async initialize(config: ConversationManagerConfig): Promise<boolean> {
    try {
      this.modelManager = config.modelManager;
      this.memoryManager = config.memoryManager;
      this.toolManager = config.toolManager;
      
      // Load existing conversations from storage
      await this.loadConversationsFromStorage();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize conversation manager:', error);
      return false;
    }
  }
  
  /**
   * Create a new conversation
   * @param id Conversation ID
   * @param options Optional configuration
   * @returns Promise<Conversation> The created conversation
   */
  public async createConversation(id: string, options?: any): Promise<Conversation> {
    if (!this.modelManager || !this.memoryManager) {
      throw new Error('Conversation manager not initialized');
    }
    
    const now = Date.now();
    const conversation: Conversation = {
      id,
      name: options?.name || `Conversation ${id}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    
    this.conversations.set(id, conversation);
    
    // Initialize memory for this conversation
    this.memoryManager.getMemory(id);
    
    // Save to storage
    await this.saveConversationsToStorage();
    
    return conversation;
  }
  
  /**
   * Get a conversation by ID
   * @param id Conversation ID
   * @returns Promise<Conversation | null> The conversation or null if not found
   */
  public async getConversation(id: string): Promise<Conversation | null> {
    return this.conversations.get(id) || null;
  }
  
  /**
   * List all conversations
   * @returns Promise<ConversationInfo[]> List of conversation info
   */
  public async listConversations(): Promise<ConversationInfo[]> {
    const conversations: ConversationInfo[] = [];
    
    for (const conversation of this.conversations.values()) {
      conversations.push({
        id: conversation.id,
        name: conversation.name,
        lastMessage: conversation.messages.length > 0 
          ? conversation.messages[conversation.messages.length - 1].content 
          : undefined,
        messageCount: conversation.messages.length,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      });
    }
    
    return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  
  /**
   * Delete a conversation
   * @param id Conversation ID
   * @returns Promise<boolean> Whether deletion was successful
   */
  public async deleteConversation(id: string): Promise<boolean> {
    try {
      this.conversations.delete(id);
      
      // Delete memory for this conversation
      if (this.memoryManager) {
        await this.memoryManager.deleteMemory(id);
      }
      
      // Save to storage
      await this.saveConversationsToStorage();
      
      return true;
    } catch (error) {
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
    if (!this.modelManager || !this.memoryManager) {
      throw new Error('Conversation manager not initialized');
    }
    
    const conversation = this.conversations.get(conversationId);
    
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }
    
    const now = Date.now();
    
    // Add user message to conversation
    const userMessage: Message = {
      id: `user_${now}`,
      role: 'user',
      content: message,
      timestamp: now,
    };
    
    conversation.messages.push(userMessage);
    
    // Add message to memory
    const memory = this.memoryManager.getMemory(conversationId);
    memory.addMessage('user', message);
    
    // Get model
    const model = this.modelManager.getModel();
    
    // Generate response
    // This is a placeholder implementation
    // When LangChain is installed, we'll use actual model call
    let response = '';
    try {
      // Simulate model call
      response = await model.call(message);
    } catch (error) {
      console.error('Failed to generate response:', error);
      response = 'Sorry, I encountered an error while processing your request.';
    }
    
    // Add assistant message to conversation
    const assistantMessage: Message = {
      id: `assistant_${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: Date.now(),
    };
    
    conversation.messages.push(assistantMessage);
    
    // Add message to memory
    memory.addMessage('assistant', response);
    
    // Update conversation
    conversation.updatedAt = Date.now();
    
    // Save to storage
    await this.saveConversationsToStorage();
    await this.memoryManager.saveMemoriesToStorage();
    
    return response;
  }
  
  /**
   * Save conversations to storage
   * @returns Promise<void>
   */
  private async saveConversationsToStorage(): Promise<void> {
    try {
      const conversationsToSave = Array.from(this.conversations.values());
      this.storage.setItem('langchain_conversations', JSON.stringify(conversationsToSave));
    } catch (error) {
      console.error('Failed to save conversations to storage:', error);
    }
  }
  
  /**
   * Load conversations from storage
   * @returns Promise<void>
   */
  private async loadConversationsFromStorage(): Promise<void> {
    try {
      const savedConversations = this.storage.getItem('langchain_conversations');
      
      if (savedConversations) {
        const parsedConversations = JSON.parse(savedConversations) as Conversation[];
        
        for (const conversation of parsedConversations) {
          this.conversations.set(conversation.id, conversation);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations from storage:', error);
    }
  }
}
