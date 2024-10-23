import React from "react";
import { ButtonProps } from "./index";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";
import events from "@go-blite/events";

const ButtonSettingsComponent: React.FC<SettingsComponentProps<ButtonProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as ButtonProps,
    displayName: node.data.custom.displayName
  }));

  const eventOptions = Object.values(events).map(key => ({
    label: key.name,
    value: key.name //key.handler
  }));

  const sizeOptions = [
    { value: "sm", label: "小" },
    { value: "md", label: "中" },
    { value: "icon", label: "大" }
  ];

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式", "事件"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
          <Settings.Section defaultOpen title={"按钮文本"}>
            <Settings.ItemInput propKey="text" placeholder="输入按钮文本" />
          </Settings.Section>
          <Settings.Section defaultOpen title={"尺寸设置"}>
            <Settings.ItemSelect propKey="size" label="按钮大小" options={sizeOptions} />
          </Settings.Section>
          <Settings.Section defaultOpen title={"变体"}>
            <Settings.ItemSelect
              propKey="variant"
              label="按钮样式"
              options={[
                { value: "default", label: "默认" },
                { value: "secondary", label: "次要" },
                { value: "outline", label: "轮廓" },
                { value: "ghost", label: "幽灵" },
                { value: "link", label: "链接" }
              ]}
            />
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"颜色设置"}>
            <Settings.ItemColor propKey="background" label="背景颜色" />
            <Settings.ItemColor propKey="color" label="文字颜色" />
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"点击事件"}>
            <Settings.ItemSelect propKey="events.onClick" options={eventOptions} />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ButtonSettings = SettingsHOC<ButtonProps>(ButtonSettingsComponent);
