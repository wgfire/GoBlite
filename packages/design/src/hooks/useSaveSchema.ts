import { useDesignContext } from "@/context";
import { useEditor } from "@craftjs/core";

/**
 * 保存当前的schema信息
 */
export const useSaveSchema = () => {
  const { updateContext } = useDesignContext();
  const { query } = useEditor();
  /**
   *
   * @param isImmediately 是否保存后立即使用schema进行渲染
   */
  const saveCurrentSchema = (isImmediately = false) => {
    const currentSchema = query.getSerializedNodes();
    // 对默认的schema不进行保存
    if (Object.keys(currentSchema).length <= 1) return;

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
  };

  return { saveCurrentSchema };
};
