/**
 * 统一响应链
 * 用于生成结构化的统一响应
 */

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableSequence } from "@langchain/core/runnables";
import { createUnifiedResponsePrompt, createStrictUnifiedResponsePrompt } from "../prompts/unifiedResponsePrompt";
import { BaseChatMemory } from "langchain/memory";

/**
 * 创建统一响应链
 * @param model 语言模型
 * @returns 可运行的链实例
 */
export function createUnifiedResponseChain(model: BaseChatModel, memory: BaseChatMemory): RunnableSequence {
  const { prompt, parser } = createUnifiedResponsePrompt();
  console.log("创建统一响应链", memory);

  return RunnableSequence.from([
    {
      userInput: (input: Record<string, unknown>) => String(input.userInput || ""),
      templateInfo: (input: Record<string, unknown>) => String(input.templateInfo || ""),
      formatInstructions: () => parser.getFormatInstructions(),
      // 从记忆中加载历史消息
      history: async () => {
        if (memory) {
          // 使用 LangChain 的消息历史功能
          const messages = await memory.chatHistory.getMessages();
          console.log("加载历史消息:", messages);
          return messages;
        }
        return [];
      },
    },
    prompt,
    model,
    parser,
  ]);
}

/**
 * 创建严格的统一响应链
 * 当模型多次失败时使用更严格的提示词
 * @param model 语言模型
 * @param memory 记忆实例
 * @returns 可运行的链实例
 */
export function createStrictUnifiedResponseChain(model: BaseChatModel, memory: BaseChatMemory): RunnableSequence {
  const { prompt, parser } = createStrictUnifiedResponsePrompt();
  console.log("创建严格统一响应链", memory);

  return RunnableSequence.from([
    {
      userInput: (input: Record<string, unknown>) => String(input.userInput || ""),
      templateInfo: (input: Record<string, unknown>) => String(input.templateInfo || ""),
      formatInstructions: () => parser.getFormatInstructions(),
      // 从记忆中加载历史消息
      history: async () => {
        if (memory) {
          // 使用 LangChain 的消息历史功能
          const messages = await memory.chatHistory.getMessages();
          console.log("加载历史消息(严格模式):", messages);
          return messages;
        }
        return [];
      },
    },
    prompt,
    model,
    parser,
  ]);
}
