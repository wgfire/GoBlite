import React from "react";
import { ImageProps } from "./type";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";
import { useDesignContext } from "@/context";
import events from "@go-blite/events";
import { Label, Switch } from "@go-blite/shadcn";
const ImageSettingsComponent: React.FC<SettingsComponentProps<ImageProps>> = ({ Settings }) => {
  const {
    props,
    displayName,
    actions: { setProp }
  } = useNode(node => ({
    props: node.data.props as ImageProps,
    displayName: node.data.custom.displayName
  }));
  const eventOptions = [{ url: "none", name: "无" }, ...Object.values(events)].map(key => ({
    label: key.name,
    value: key.name //key.handler
  }));
  const { assets } = useDesignContext();

  const assetsOptions = [{ url: "none", name: "无" }, ...(assets ?? [])].map(asset => ({
    label: asset.name,
    value: asset.url
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "行为"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
          <Settings.Section defaultOpen title={"图片设置"}>
            <div className="grid grid-cols-2 gap-2">
              <Settings.ItemInput propKey="style.width" type="text" />
              <Settings.ItemInput propKey="style.height" type="text" />
            </div>
            <Settings.ItemSelect
              propKey="style.objectFit"
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
            <Settings.ItemSelect propKey="src" label="图片选择" options={assetsOptions}></Settings.ItemSelect>
            <Settings.ItemUpload
              propKey="src"
              label="上传图片"
              uploadUrl="https://demo-resource.mistorebox.com/api/op/resource/v1/file/upload"
              buttonText="选择并上传图片"
            />
            <Settings.ItemInput propKey="src" label="图片地址" placeholder="输入图片URL" />
            <Settings.ItemInput propKey="alt" label="替代文本" placeholder="输入提示文案" />
          </Settings.Section>
        </Settings.Content>
        <Settings.Content>
          <Settings.Section title="点击事件" defaultOpen>
            <Settings.ItemSelect propKey="events.onClick" label="" options={eventOptions} />
          </Settings.Section>
          <Settings.Section title="水印设置" defaultOpen>
            <div className="flex items-center space-x-2 justify-between mt-2">
              <Label htmlFor="airplane-mode" className="text-gray-400">
                图片水印
              </Label>
              <Switch
                id="airplane-mode"
                checked={props.watermark}
                onCheckedChange={value => {
                  setProp((p: ImageProps) => {
                    p.watermark = value;
                  });
                }}
              />
            </div>
            {props.watermark && (
              <Settings.ItemSelect
                propKey="noWatermarkSrc"
                label="去水印图片"
                options={assetsOptions}
              ></Settings.ItemSelect>
            )}
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ImageSettings = SettingsHOC(ImageSettingsComponent);
