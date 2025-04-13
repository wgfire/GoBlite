/**
 * LangChain记忆管理钩子
 */
import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { BaseChatMemory } from "@langchain/core/memory";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { memoryTypeAtom, memoryWindowSizeAtom, memorySummaryThresholdAtom } from "../atoms/memoryAtoms";
import { MemoryType, MemoryConfig } from "../types";
import { createMemory } from "../langchain/memory";

/**
 * LangChain记忆管理钩子
 * 提供记忆初始化和配置功能
 */
export function useLangChainMemory() {
  // 状态原子
  const [memoryType, setMemoryType] = useAtom(memoryTypeAtom);
  const [memoryWindowSize, setMemoryWindowSize] = useAtom(memoryWindowSizeAtom);
  const [memorySummaryThreshold, setMemorySummaryThreshold] = useAtom(memorySummaryThresholdAtom);

  // 本地状态
  const [memory, setMemory] = useState<BaseChatMemory | null>(null);

  /**
   * 初始化记忆
   * @param model 语言模型（用于摘要记忆）
   */
  const initializeMemory = useCallback(
    async (model?: BaseChatModel) => {
      try {
        const memoryConfig: MemoryConfig = {
          type: memoryType,
          maxMessages: memoryWindowSize,
          summarizeThreshold: memorySummaryThreshold,
        };

        const newMemory = createMemory(memoryConfig, model);
        setMemory(newMemory);

        return newMemory;
      } catch (error) {
        console.error("初始化记忆失败:", error);
        return null;
      }
    },
    [memoryType, memoryWindowSize, memorySummaryThreshold]
  );

  /**
   * 更新记忆类型
   * @param type 记忆类型
   * @param model 语言模型（用于摘要记忆）
   */
  const updateMemoryType = useCallback(
    async (type: MemoryType, model?: BaseChatModel) => {
      try {
        setMemoryType(type);

        // 如果需要立即初始化新记忆，可以在这里调用initializeMemory
        if (model) {
          const memoryConfig: MemoryConfig = {
            type,
            maxMessages: memoryWindowSize,
            summarizeThreshold: memorySummaryThreshold,
          };

          const newMemory = createMemory(memoryConfig, model);
          setMemory(newMemory);
        }

        return true;
      } catch (error) {
        console.error("更新记忆类型失败:", error);
        return false;
      }
    },
    [setMemoryType, memoryWindowSize, memorySummaryThreshold]
  );

  /**
   * 更新记忆窗口大小
   * @param size 窗口大小
   */
  const updateMemoryWindowSize = useCallback(
    (size: number) => {
      setMemoryWindowSize(size);
    },
    [setMemoryWindowSize]
  );

  /**
   * 更新记忆摘要阈值
   * @param threshold 摘要阈值
   */
  const updateMemorySummaryThreshold = useCallback(
    (threshold: number) => {
      setMemorySummaryThreshold(threshold);
    },
    [setMemorySummaryThreshold]
  );

  /**
   * 重置记忆
   */
  const resetMemory = useCallback(() => {
    setMemory(null);
  }, []);

  return {
    // 状态
    memoryType,
    memoryWindowSize,
    memorySummaryThreshold,
    memory,

    // 方法
    initializeMemory,
    updateMemoryType,
    updateMemoryWindowSize,
    updateMemorySummaryThreshold,
    resetMemory,
  };
}
