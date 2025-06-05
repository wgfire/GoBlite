import { useContext } from "react";
import { DesignContext } from "./Provider"; // DeviceType 和 SerializedNodes 不再直接在此处使用
// FindSchemaParams 已移至 useSchemaOperations.ts

/**
 * 使用设计上下文钩子
 *
 * 注意：不再接受 initialProps 参数，所有初始化配置应该通过 DesignProvider 的 initialProps 提供
 * 这样可以避免多次更新状态，减少不必要的渲染
 */
export const useDesignContext = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error("useDesignContext must be used within a DesignProvider");
  }

  const { state, updateContext } = context;

  return { ...state, updateContext };
};
