import React from "react";
import { ButtonProps } from "./type";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";
import events from "@go-blite/events";

const ButtonSettingsComponent: React.FC<SettingsComponentProps<ButtonProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as ButtonProps,
    displayName: node.data.custom.displayName
  }));

  const eventOptions = [{ url: "none", name: "无" }, ...Object.values(events)].map(key => ({
    label: key.name,
    value: key.name //key.handler
  }));

  // const sizeOptions = [
  //   { value: "default", label: "默认" },
  //   { value: "sm", label: "小" },
  //   { value: "lg", label: "大" },
  //   { value: "icon", label: "无边距" }
  // ];

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式", "行为"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
          <Settings.Section defaultOpen title={"按钮文本"}>
            <Settings.ItemInput propKey="text" placeholder="输入按钮文本" />
          </Settings.Section>
          <Settings.Section defaultOpen title={"尺寸设置"}>
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
          </Settings.Section>
          <Settings.Section defaultOpen title={"变体"}>
            <Settings.ItemSelect
              propKey="variant"
              label="按钮样式"
              options={[
                { value: "default", label: "默认" },
                { value: "destructive", label: "破坏性" },
                { value: "secondary", label: "次要" },
                { value: "outline", label: "轮廓" },
                { value: "ghost", label: "幽灵" },
                { value: "link", label: "链接" }
              ]}
            />
          </Settings.Section>
          <Settings.Section title={"外边距"}>
            <Settings.Margins propKeyPrefix="style.margin" label="外边距" units={["px", "%", "vw"]} slider={false} />
          </Settings.Section>
          <Settings.Section title={"内边距"}>
            <Settings.Margins propKeyPrefix="style.padding" label="内边距" units={["px", "%", "vw"]} slider={false} />
          </Settings.Section>
          <Settings.Section title={"定位"}>
            <Settings.ItemPosition propKeyPrefix="customStyle" />
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"颜色设置"}>
            <Settings.ItemColor
              propKey="style.backgroundColor"
              label={<span className="text-sm text-gray-400">背景颜色</span>}
            />
            <Settings.ItemColor propKey="style.color" label={<span className="text-sm text-gray-400">文字颜色</span>} />
            <Settings.ItemSlide propKey="style.borderRadius" label="圆角" min={0} max={100} step={1} />
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"点击事件"}>
            <Settings.ItemSelect propKey="events.onClick" label="" options={eventOptions} />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ButtonSettings = SettingsHOC<ButtonProps>(ButtonSettingsComponent);
