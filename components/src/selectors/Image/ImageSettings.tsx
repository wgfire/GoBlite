import { ToolbarSection, ToolbarItem } from "../../editor/Toolbar";
import { ToolbarRadio } from "../../editor/Toolbar/ToolbarRadio";

/**
 * 图片组件的配置设置界面
 */
export const ImageSettings = () => {
  return (
    <div>
      <ToolbarSection
        title="图片设置"
        props={["src"]}
   
      >
        <ToolbarItem label="图片地址" type="text" propKey="src" full></ToolbarItem>
      </ToolbarSection>
    </div>
  );
};
