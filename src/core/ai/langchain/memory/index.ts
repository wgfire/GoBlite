/**
 * LangChain记忆集成
 */
import { BaseChatMemory } from "@langchain/core/memory";
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { MemoryType, MemoryConfig } from "../../types";

/**
 * 创建LangChain记忆实例
 * @param config 记忆配置
 * @param llm 语言模型（用于摘要记忆）
 * @returns LangChain记忆实例
 */
export function createMemory(config: MemoryConfig, llm?: any): BaseChatMemory {
  const commonOptions = {
    returnMessages: true,
    memoryKey: "history",
    inputKey: "input",
    outputKey: "output",
  };

  try {
    switch (config.type) {
      case MemoryType.BUFFER:
        return new BufferMemory({
          ...commonOptions,
          k: config.maxMessages || 10,
        });

      case MemoryType.SUMMARY:
        if (!llm) {
          throw new Error("摘要记忆需要提供语言模型");
        }
        return new ConversationSummaryMemory({
          ...commonOptions,
          llm,
          maxTokenLimit: config.summarizeThreshold || 2000,
        });

      case MemoryType.CONVERSATION:
        return new BufferMemory({
          ...commonOptions,
          // 对话记忆不限制消息数量
        });

      case MemoryType.VECTOR:
        // 向量记忆暂未实现，使用缓冲记忆代替
        console.warn("向量记忆暂未实现，使用缓冲记忆代替");
        return new BufferMemory({
          ...commonOptions,
          k: config.maxMessages || 10,
        });

      default:
        return new BufferMemory(commonOptions);
    }
  } catch (error) {
    console.error("创建记忆实例失败:", error);
    // 出错时使用默认缓冲记忆
    return new BufferMemory(commonOptions);
  }
}
