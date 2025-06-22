import React from "react";
import { NonFarmProps } from "./type";
import { useNode } from "@go-blite/design";
import { SettingsComponentProps, SettingsHOC } from "@go-blite/design";

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
          <Settings.Section title="发布时间" defaultOpen={true}>
            <Settings.ItemInput propKey="time" type="text" />
          </Settings.Section>
          <Settings.Section title="尺寸" defaultOpen={true}>
            <div className="grid grid-cols-2 gap-2">
              <Settings.ItemSInput
                label="宽度"
                propKey="customStyle.width"
                units={["px", "%", "auto", "vw", "vh"]}
                slider={true}
              />
              <Settings.ItemSInput
                label="高度"
                propKey="customStyle.height"
                units={["px", "%", "auto", "vw", "vh"]}
                slider={true}
              />
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
