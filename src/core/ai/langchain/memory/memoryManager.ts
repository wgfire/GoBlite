/**
 * Memory manager for LangChain integration
 * Handles conversation memory and persistence
 */

import { Message } from '../types';

/**
 * Configuration for memory initialization
 */
export interface MemoryManagerConfig {
  type: string;
  persistenceProvider: string;
}

/**
 * Memory manager class
 * Manages conversation memory and persistence
 */
export class MemoryManager {
  private memories: Map<string, any> = new Map();
  private persistenceProvider: 'localStorage' | 'indexedDB' | 'custom' = 'localStorage';
  private storage: Storage = localStorage;
  
  /**
   * Initialize the memory manager
   * @param config Configuration
   * @returns Promise<boolean> Whether initialization was successful
   */
  public async initialize(config: MemoryManagerConfig): Promise<boolean> {
    try {
      this.persistenceProvider = config.persistenceProvider as any;
      
      // Initialize storage based on provider
      if (this.persistenceProvider === 'localStorage') {
        this.storage = localStorage;
      } else if (this.persistenceProvider === 'indexedDB') {
        // Placeholder for IndexedDB implementation
        console.warn('IndexedDB persistence not yet implemented, falling back to localStorage');
        this.storage = localStorage;
      }
      
      // Load existing memories from storage
      await this.loadMemoriesFromStorage();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize memory manager:', error);
      return false;
    }
  }
  
  /**
   * Get memory for a conversation
   * @param conversationId Conversation ID
   * @returns Memory object
   */
  public getMemory(conversationId: string): any {
    let memory = this.memories.get(conversationId);
    
    if (!memory) {
      // Create a new memory object
      memory = {
        messages: [],
        addMessage: (role: string, content: string) => {
          const message: Message = {
            id: `${role}_${Date.now()}`,
            role: role as any,
            content,
            timestamp: Date.now(),
          };
          memory.messages.push(message);
          return message;
        },
        getMessages: () => memory.messages,
        clear: () => {
          memory.messages = [];
        },
      };
      
      this.memories.set(conversationId, memory);
    }
    
    return memory;
  }
  
  /**
   * Save all memories to storage
   * @returns Promise<void>
   */
  public async saveMemoriesToStorage(): Promise<void> {
    try {
      const memoriesToSave: Record<string, any> = {};
      
      for (const [id, memory] of this.memories.entries()) {
        memoriesToSave[id] = {
          messages: memory.messages,
        };
      }
      
      this.storage.setItem('langchain_memories', JSON.stringify(memoriesToSave));
    } catch (error) {
      console.error('Failed to save memories to storage:', error);
    }
  }
  
  /**
   * Load memories from storage
   * @returns Promise<void>
   */
  private async loadMemoriesFromStorage(): Promise<void> {
    try {
      const savedMemories = this.storage.getItem('langchain_memories');
      
      if (savedMemories) {
        const parsedMemories = JSON.parse(savedMemories) as Record<string, any>;
        
        for (const [id, memoryData] of Object.entries(parsedMemories)) {
          const memory = this.getMemory(id);
          
          // Restore memory state
          if (memoryData.messages) {
            memory.messages = memoryData.messages;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load memories from storage:', error);
    }
  }
  
  /**
   * Clear memory for a conversation
   * @param conversationId Conversation ID
   * @returns Promise<boolean> Whether clearing was successful
   */
  public async clearMemory(conversationId: string): Promise<boolean> {
    try {
      const memory = this.memories.get(conversationId);
      
      if (memory) {
        memory.clear();
        await this.saveMemoriesToStorage();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to clear memory:', error);
      return false;
    }
  }
  
  /**
   * Delete memory for a conversation
   * @param conversationId Conversation ID
   * @returns Promise<boolean> Whether deletion was successful
   */
  public async deleteMemory(conversationId: string): Promise<boolean> {
    try {
      this.memories.delete(conversationId);
      await this.saveMemoriesToStorage();
      return true;
    } catch (error) {
      console.error('Failed to delete memory:', error);
      return false;
    }
  }
}
