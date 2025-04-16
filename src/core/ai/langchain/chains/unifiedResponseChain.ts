/**
 * 统一响应链
 * 用于生成结构化的统一响应
 */

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { RunnableSequence, RunnableWithMessageHistory } from "@langchain/core/runnables";
import { createUnifiedResponsePrompt, createStrictUnifiedResponsePrompt } from "../prompts/unifiedResponsePrompt";
import { messageStore } from "../memory/inMemoryMessageStore";
import { UnifiedResponse } from "../../utils/responseValidator";

/**
 * 创建统一响应链
 * @param model 语言模型
 * @returns 可运行的链实例
 */
export function createUnifiedResponseChain(model: BaseChatModel): RunnableWithMessageHistory<Record<string, unknown>, UnifiedResponse> {
  const { prompt, parser } = createUnifiedResponsePrompt();
  console.log("创建统一响应链");

  // 创建基本链
  const chain = RunnableSequence.from([
    {
      userInput: (input: Record<string, unknown>) => String(input.userInput || ""),
      templateInfo: (input: Record<string, unknown>) => String(input.templateInfo || ""),
      formatInstructions: () => parser.getFormatInstructions(),
    },
    prompt,
    model,
    parser,
  ]);

  // 使用 RunnableWithMessageHistory 包装链
  return new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (sessionId: string) => messageStore.getMessageHistory(sessionId),
    inputMessagesKey: "userInput",
    historyMessagesKey: "history",
  });
}

/**
 * 创建严格的统一响应链
 * 当模型多次失败时使用更严格的提示词
 * @param model 语言模型
 * @returns 可运行的链实例
 */
export function createStrictUnifiedResponseChain(model: BaseChatModel): RunnableWithMessageHistory<Record<string, unknown>, UnifiedResponse> {
  const { prompt, parser } = createStrictUnifiedResponsePrompt();
  console.log("创建严格统一响应链");

  // 创建基本链
  const chain = RunnableSequence.from([
    {
      userInput: (input: Record<string, unknown>) => String(input.userInput || ""),
      templateInfo: (input: Record<string, unknown>) => String(input.templateInfo || ""),
      formatInstructions: () => parser.getFormatInstructions(),
    },
    prompt,
    model,
    parser,
  ]);

  // 使用 RunnableWithMessageHistory 包装链
  return new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (sessionId: string) => messageStore.getMessageHistory(sessionId),
    inputMessagesKey: "userInput",
    historyMessagesKey: "history",
  });
}
