import React from "react";
import { ContainerProps } from "./type";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";
import { useDesignContext } from "@/context";

const ContainerSettingsComponent: React.FC<SettingsComponentProps<ContainerProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as ContainerProps,
    displayName: node.data.custom.displayName
  }));
  const { assets } = useDesignContext();

  const assetsOptions = [{ url: "none", name: "无" }, ...(assets ?? [])].map(asset => ({
    label: asset.name,
    value: asset.url
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
              <Settings.ItemInput propKey="style.width" type="text" />
              <Settings.ItemInput propKey="style.height" type="text" />
            </div>
          </Settings.Section>
          {/* <Settings.Section defaultOpen title={"布局"}>
            <Settings.ItemSelect
              className="w-full"
              propKey="style.display"
              defaultValue="flex"
              options={[
                { value: "block", label: "常规" },
                { value: "flex", label: "Flex 布局" },
                { value: "grid", label: "Grid 布局" }
              ]}
            />
            {props.style.display === "grid" && (
              <div className="grid grid-cols-1 gap-2">
                <Settings.ItemSelect
                  propKey="style.gridArea"
                  label="排列方式"
                  options={[
                    { value: "1 / 1 / 2 / 2", label: "自由排列" },
                    { value: "auto", label: "默认排列" }
                  ]}
                />
              </div>
            )}
            {props.style.display === "flex" && (
              <Settings.FlexLayout label="弹性布局" justifyKey="style.justifyContent" alignKey="style.alignItems" />
            )}
            <div className="grid grid-cols-1 gap-4">
              <Settings.ItemSlide propKey="style.gap" min={0} max={100} step={1} label="内部间距" />
            </div>
          </Settings.Section> */}

          <Settings.Section defaultOpen title={"边距"}>
            <div className="grid grid-cols-2 gap-4">
              <Settings.ItemSlide propKey="style.margin" min={0} max={100} step={1} label="外边距" />
              <Settings.ItemSlide propKey="style.padding" min={0} max={100} step={1} label="内边距" />
            </div>
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.ItemColor propKey="style.background" label="背景颜色" />
          <Settings.ItemSelect
            propKey="style.backgroundImage"
            label="背景"
            options={assetsOptions}
          ></Settings.ItemSelect>
        </Settings.Content>

        <Settings.Content>
          <Settings.ItemInput type="textarea" propKey="events.onClick" label="加载完成事件" />
          <Settings.ItemInput type="textarea" propKey="events.onClick" label="点击事件" />
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ContainerSettings = SettingsHOC(ContainerSettingsComponent);
