/**
 * 记忆相关的原子状态
 */
import { atomWithStorage } from "jotai/utils";
import { MemoryType } from "../types";

// 记忆类型 - 持久化
export const memoryTypeAtom = atomWithStorage<MemoryType>("ai_memory_type", MemoryType.BUFFER);

// 记忆窗口大小 - 持久化
export const memoryWindowSizeAtom = atomWithStorage<number>("ai_memory_window_size", 10);

// 记忆摘要阈值 - 持久化
export const memorySummaryThresholdAtom = atomWithStorage<number>("ai_memory_summary_threshold", 20);
