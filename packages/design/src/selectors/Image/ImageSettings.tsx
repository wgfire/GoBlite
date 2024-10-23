import React from "react";
import { ImageProps } from "./index";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";

const ImageSettingsComponent: React.FC<SettingsComponentProps<ImageProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as ImageProps,
    displayName: node.data.custom.displayName
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
          <Settings.Section defaultOpen title={"图片设置"}>
            <div className="grid grid-cols-2 gap-2">
              <Settings.ItemInput propKey="width" type="text" />
              <Settings.ItemInput propKey="height" type="text" />
            </div>
            <Settings.ItemSelect
              propKey="objectFit"
              label="填充方式"
              options={[
                { value: "contain", label: "包含" },
                { value: "cover", label: "覆盖" },
                { value: "fill", label: "填充" },
                { value: "none", label: "无" },
                { value: "initial", label: "初始" },
                { value: "scale-down", label: "缩小" }
              ]}
            />
            <Settings.ItemInput propKey="src" label="图片地址" placeholder="输入图片URL" />
            <Settings.ItemInput propKey="alt" label="替代文本" placeholder="输入提示文案" />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ImageSettings = SettingsHOC<ImageProps>(ImageSettingsComponent);
