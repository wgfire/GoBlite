import React from "react";
import { TextProps } from "./index";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";

const TextSettingsComponent: React.FC<SettingsComponentProps<TextProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as TextProps,
    displayName: node.data.custom.displayName
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>

          <Settings.ItemInput propKey="text" label="文本内容" placeholder="输入文本内容" />

          <Settings.Section defaultOpen title={"字体设置"}>
            <Settings.ItemInput propKey="fontSize" type="number" />
            <Settings.ItemSelect
              propKey="fontWeight"
              label="字体粗细"
              options={[
                { value: "normal", label: "正常" },
                { value: "bold", label: "粗体" },
                { value: "100", label: "100" },
                { value: "200", label: "200" },
                { value: "300", label: "300" },
                { value: "400", label: "400" },
                { value: "500", label: "500" },
                { value: "600", label: "600" },
                { value: "700", label: "700" },
                { value: "800", label: "800" },
                { value: "900", label: "900" }
              ]}
            />
          </Settings.Section>
          <Settings.Section defaultOpen title={"文本对齐"}>
            <Settings.ItemSelect
              propKey="textAlign"
              options={[
                { value: "left", label: "左对齐" },
                { value: "center", label: "居中" },
                { value: "right", label: "右对齐" },
                { value: "justify", label: "两端对齐" }
              ]}
            />
          </Settings.Section>
          <Settings.Section defaultOpen title={"边距"}>
            <div className="grid grid-cols-2 gap-4">
              <Settings.ItemSlide propKey="margin" min={0} max={100} step={1} label="外边距" />
              <Settings.ItemSlide propKey="padding" min={0} max={100} step={1} label="内边距" />
            </div>
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"颜色设置"}>
            <Settings.ItemColor propKey="color" label="文本颜色" />
          </Settings.Section>
          <Settings.Section defaultOpen title={"阴影设置"}>
            <Settings.ItemSlide propKey="shadow" min={0} max={1} step={0.1} label="文本阴影" />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const TextSettings = SettingsHOC<TextProps>(TextSettingsComponent);

export default TextSettings;
