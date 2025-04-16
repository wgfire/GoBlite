/**
 * LangChain记忆集成
 */
import { BaseChatMemory } from "langchain/memory";
import { BufferMemory, ConversationSummaryMemory } from "langchain/memory";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { MemoryType, MemoryConfig } from "../../types";

/**
 * 创建LangChain记忆实例
 * @param config 记忆配置
 * @param llm 语言模型（用于摘要记忆）
 * @returns LangChain记忆实例
 */
export function createMemory(config: MemoryConfig, llm?: BaseChatModel): BaseChatMemory {
  const commonOptions = {
    returnMessages: true,
    memoryKey: "history",
    inputKey: "input",
    outputKey: "response", // 与链中的outputKey保持一致
  };

  // 添加日志以帮助诊断问题
  console.log("创建记忆实例配置:", { ...config, commonOptions });

  try {
    switch (config.type) {
      case MemoryType.BUFFER:
        return new BufferMemory({
          ...commonOptions,
          // k 已经被替换为 memoryKey
          memoryKey: "history",
          returnMessages: true,
          inputKey: "input",
          outputKey: "response",
        });

      case MemoryType.SUMMARY:
        if (!llm) {
          throw new Error("摘要记忆需要提供语言模型");
        }
        // 注意：由于类型定义问题，我们不再使用 maxTokens 参数
        return new ConversationSummaryMemory({
          ...commonOptions,
          llm,
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
