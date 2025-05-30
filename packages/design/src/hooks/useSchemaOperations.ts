import { useCallback } from "react";
import { useEditor } from "@craftjs/core";
import { useToast } from "@go-blite/shadcn/hooks/use-toast";
import { defaultNode } from "@/constant";
import { useDesignContext } from "@/context/useDesignContext";
import { BusinessEvents } from "@/utils/BusinessEvents";
import { SerializedNodes } from "@craftjs/core";

/**
 * 提供与 schema 操作相关的功能
 * 如：保存、清空、重置、导入模板等所有与 schema 相关的操作
 */
export const useSchemaOperations = () => {
  const { toast } = useToast();
  const { actions, query } = useEditor();
  const { updateContext, currentInfo } = useDesignContext();

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
    (isImmediately = false) => {
      const currentSchema = query.getSerializedNodes();
      // 对默认的 schema 不进行保存
      if (Object.keys(currentSchema).length < 1) return false;

      updateContext(draft => {
        const currentDevice = draft.device.find(device => device.type === draft.currentInfo.device);
        if (currentDevice) {
          currentDevice.languagePageMap[draft.currentInfo.language] = {
            ...currentDevice.languagePageMap[draft.currentInfo.language],
            schema: currentSchema
          };
        } else {
          // 第一次点击
          draft.device.push({
            type: draft.currentInfo.device,
            pageTemplate: draft.currentInfo.pageTemplate,
            languagePageMap: {
              [draft.currentInfo.language]: { schema: currentSchema }
            }
          });
        }
        if (isImmediately) {
          draft.schema = currentSchema;
        }
      });

      return true;
    },
    [query, updateContext]
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

  return {
    clearCurrentSchema,
    saveCurrentSchema,
    loadSchema
  };
};
