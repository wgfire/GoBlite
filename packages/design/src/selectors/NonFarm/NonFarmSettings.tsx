import React from "react";
import { NonFarmProps } from "./type";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";

const NonFarmSettingsComponent: React.FC<SettingsComponentProps<NonFarmProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as NonFarmProps,
    displayName: node.data.custom.displayName
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式", "行为"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
          <Settings.Section title="尺寸" defaultOpen={true}>
            <div className="grid grid-cols-2 gap-2">
              <Settings.ItemInput propKey="customStyle.width" type="text" />
              <Settings.ItemInput propKey="customStyle.height" type="text" />
            </div>
          </Settings.Section>
          <Settings.Section defaultOpen title={"边距/圆角"}>
            <div className="grid grid-cols-2 gap-4">
              <Settings.ItemSlide propKey="style.margin" min={0} max={100} step={1} label="外边距" />
              <Settings.ItemSlide propKey="style.padding" min={0} max={100} step={1} label="内边距" />
              <Settings.ItemSlide propKey="style.borderRadius" min={0} max={100} step={1} label="圆角" />
            </div>
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.ItemColor propKey="style.background" label="背景颜色" />
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const NonFarmSettings = SettingsHOC(NonFarmSettingsComponent);
