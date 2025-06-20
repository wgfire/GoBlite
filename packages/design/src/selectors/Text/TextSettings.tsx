import React from "react";
import { TextProps } from "./type";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";

const TextSettingsComponent: React.FC<SettingsComponentProps<TextProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as TextProps,
    displayName: node.data.custom.displayName
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式", "多语言"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>

          <Settings.ItemInput propKey="i18n.text" label="文本内容" placeholder="输入文本内容" />

          <Settings.Section defaultOpen title={"字体设置"}>
            <Settings.ItemInput propKey="style.fontSize" type="number" />
            <Settings.ItemSelect
              propKey="style.fontWeight"
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
          <Settings.Section defaultOpen title={"颜色设置"}>
            <Settings.ItemColor propKey="style.color" label="文本颜色" />
          </Settings.Section>
          <Settings.Section defaultOpen title={"阴影设置"}>
            <Settings.ItemSlide propKey="style.shadow" min={0} max={1} step={0.1} label="文本阴影" />
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"外边距"}>
            <Settings.Margins
              propKeyPrefix="customStyle.margin"
              label="外边距"
              units={["px", "%", "vw"]}
              slider={false}
            />
          </Settings.Section>
          <Settings.Section defaultOpen title={"内边距"}>
            <Settings.Margins
              propKeyPrefix="customStyle.padding"
              label="内边距"
              units={["px", "%", "vw"]}
              slider={false}
            />
          </Settings.Section>
        </Settings.Content>
        <Settings.Content>
          <Settings.Section defaultOpen title={"多语言设置"}>
            <Settings.ItemI18n propKeys={["text"]} label="配置多语言" />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const TextSettings = SettingsHOC<TextProps>(TextSettingsComponent);
