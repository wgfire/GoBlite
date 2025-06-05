import { useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { useToast } from "@go-blite/shadcn/hooks/use-toast";
import { defaultNode } from "@/constant";
import { useDesignContext } from "@/context/useDesignContext";
import { BusinessEvents } from "@/utils/BusinessEvents";
import { SerializedNodes } from "@craftjs/core";
import { DeviceType } from "@/context/Provider"; // 新增导入

interface FindSchemaParams {
  device?: DeviceType;
  language?: string;
}

/**
 * 提供与 schema 操作相关的功能
 * 如：保存、清空、重置、导入模板等所有与 schema 相关的操作
 */
export const useSchemaOperations = () => {
  const { toast } = useToast();
  const { actions, query } = useEditor();

  const { updateContext, currentInfo, device } = useDesignContext();

  /**
   * 清空当前设备和语言下的 schema 数据
   * 将其重置为默认的 schema 数据
   */
  const clearCurrentSchema = useCallback(() => {
    // 触发清空事件
    BusinessEvents.emit("onClear", {});

    // 将当前设备和语言的 schema 重置为默认数据
    updateContext(draft => {
      const currentDevice = draft.currentInfo.device;
      const currentLanguage = draft.currentInfo.language;

      // 查找当前设备的数据
      const deviceIndex = draft.device.findIndex(d => d.type === currentDevice);
      if (deviceIndex !== -1) {
        // 更新当前语言下的 schema 为默认 schema
        if (draft.device[deviceIndex].languagePageMap[currentLanguage]) {
          draft.device[deviceIndex].languagePageMap[currentLanguage].schema = { ...defaultNode };

          // 更新编辑器中显示的 schema
          draft.schema = { ...defaultNode };

          // 提示用户清空成功
          toast({
            title: "已清空当前页面",
            description: `设备: ${currentDevice}, 语言: ${currentLanguage}`
          });
        }
      }
    });

    // 通知编辑器更新
    actions.deserialize(defaultNode);
  }, [actions, updateContext, currentInfo, toast]);

  // 可以在这里添加其他与 schema 操作相关的函数
  // 例如：导入模板、复制到其他设备/语言等

  /**
   * 保存当前的 schema 信息
   * @param isImmediately 是否保存后立即使用 schema 进行渲染
   * @returns 是否保存成功
   */
  const saveCurrentSchema = useCallback(
    (isImmediately = false): { success: boolean; updatedDevice: any[] | null } => {
      const currentSchema = query.getSerializedNodes();
      // 对默认的 schema 不进行保存
      if (Object.keys(currentSchema).length < 1) return { success: false, updatedDevice: null };

      let updatedDeviceData: any[] | null = null;

      updateContext(draft => {
        const deviceToUpdate = draft.device.find(d => d.type === currentInfo.device);
        if (deviceToUpdate) {
          deviceToUpdate.languagePageMap[currentInfo.language] = {
            ...deviceToUpdate.languagePageMap[currentInfo.language],
            schema: currentSchema
          };
        } else {
          // 第一次点击
          draft.device.push({
            type: currentInfo.device,
            pageTemplate: currentInfo.pageTemplate,
            languagePageMap: {
              [currentInfo.language]: { schema: currentSchema }
            }
          });
        }
        if (isImmediately) {
          draft.schema = currentSchema;
        }
        // 深拷贝以获取更新后的值，确保返回的是一个新对象，而不是 Immer 的 draft 代理
        updatedDeviceData = JSON.parse(JSON.stringify(draft.device));
      });

      return { success: true, updatedDevice: updatedDeviceData };
    },
    [query, updateContext, currentInfo]
  );

  /**
   * 加载指定设备和语言的 schema
   * @param device 设备类型
   * @param language 语言
   * @returns 是否加载成功
   */
  const loadSchema = useCallback(
    (device: string, language: string) => {
      let schemaToLoad: SerializedNodes | null = null;

      // 查找指定设备和语言的 schema
      updateContext(draft => {
        const deviceData = draft.device.find(d => d.type === device);
        if (deviceData && deviceData.languagePageMap[language]) {
          const schema = deviceData.languagePageMap[language].schema as SerializedNodes;
          if (schema && Object.keys(schema).length > 1) {
            schemaToLoad = schema;
            draft.schema = schema;
          }
        }
      });

      // 如果找到了 schema，更新编辑器
      if (schemaToLoad) {
        actions.deserialize(schemaToLoad);
        return true;
      }

      return false;
    },
    [actions, updateContext]
  );

  const findSchema = useCallback(
    ({ device: findDevice, language }: FindSchemaParams): boolean => {
      if (!findDevice || !device) {
        return false;
      }
      const deviceData = device.find(d => d.type === findDevice);
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
    [device]
  );
  return {
    clearCurrentSchema,
    saveCurrentSchema,
    loadSchema,
    findSchema
  };
};
