/**
 * 内存消息存储
 * 用于存储对话历史记录
 */
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";

/**
 * 内存消息存储
 */
class InMemoryMessageStore {
  private store: Record<string, BaseChatMessageHistory> = {};

  /**
   * 获取会话历史
   * @param sessionId 会话ID
   * @returns 会话历史
   */
  getMessageHistory(sessionId: string): BaseChatMessageHistory {
    if (!this.store[sessionId]) {
      // 使用类型断言解决类型兼容性问题
      this.store[sessionId] = new ChatMessageHistory() as unknown as BaseChatMessageHistory;
    }
    return this.store[sessionId];
  }

  /**
   * 清除会话历史
   * @param sessionId 会话ID
   */
  clearMessageHistory(sessionId: string): void {
    if (this.store[sessionId]) {
      delete this.store[sessionId];
    }
  }
}

// 创建单例实例
const messageStore = new InMemoryMessageStore();

// 导出消息存储和 ChatMessageHistory 类
export { messageStore, ChatMessageHistory };
