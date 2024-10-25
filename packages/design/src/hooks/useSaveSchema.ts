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
   * @param isPreview 是否保存后理解使用schema进行渲染
   */
  const saveCurrentSchema = (isPreview = false) => {
    const currentSchema = query.getSerializedNodes();
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
      if (isPreview) {
        draft.schema = currentSchema;
      }
    });
  };

  return { saveCurrentSchema };
};
