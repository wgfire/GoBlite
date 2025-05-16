import { useContext, useCallback } from "react";
import { DesignContext, DeviceType } from "./Provider";
import { SerializedNodes } from "@craftjs/core";

interface FindSchemaParams {
  device?: DeviceType;
  language?: string;
}

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

  const findSchema = useCallback(
    ({ device, language }: FindSchemaParams): boolean => {
      if (!device || !state.device) {
        return false;
      }
      const deviceData = state.device.find(d => d.type === device);
      if (!deviceData) {
        return false;
      }
      if (language) {
        // 如果指定了语言，检查该设备下特定语言的 schema
        const schema = deviceData.languagePageMap[language]?.schema as SerializedNodes;
        return schema && schema["ROOT"].nodes.length >= 1;
      } else {
        // 如果只指定了设备，检查该设备下是否有任何语言的 schema
        return Object.values(deviceData.languagePageMap).some(lang => Object.keys(lang.schema).length > 1);
      }
    },
    [state.device]
  );

  return { ...state, updateContext, findSchema };
};
