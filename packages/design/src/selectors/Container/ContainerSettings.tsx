import React from "react";
import { ContainerProps } from "./index";
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
              <Settings.ItemInput propKey="width" type="text" />
              <Settings.ItemInput propKey="height" type="text" />
            </div>
          </Settings.Section>
          <Settings.Section defaultOpen title={"布局"}>
            <Settings.ItemSelect
              className="w-full"
              propKey="display"
              defaultValue="flex"
              options={[
                { value: "flex", label: "Flex 布局" },
                { value: "grid", label: "Grid 布局" }
              ]}
            />
            {props.display === "grid" && (
              <div className="grid grid-cols-2 gap-2">
                <Settings.ItemInput propKey="gridRows" type="number" placeholder="行数" />
                <Settings.ItemInput propKey="gridCols" type="number" placeholder="列数" />
              </div>
            )}
            {props.display === "flex" && (
              <Settings.ItemSelect
                propKey="flexDirection"
                label="排列方向"
                options={[
                  { value: "row", label: "水平" },
                  { value: "column", label: "垂直" }
                ]}
              />
            )}
            <div className="grid grid-cols-1 gap-4">
              <Settings.ItemSlide propKey="gap" min={0} max={100} step={1} label="内部间距" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Settings.ItemSelect
                className=""
                propKey="justifyContent"
                label="主轴对齐"
                options={[
                  { value: "flex-start", label: "起始" },
                  { value: "center", label: "居中" },
                  { value: "flex-end", label: "末尾" },
                  { value: "space-between", label: "两端对齐" },
                  { value: "space-around", label: "平均分布" }
                ]}
              />
              <Settings.ItemSelect
                className=""
                propKey="alignItems"
                label="纵轴对齐"
                options={[
                  { value: "flex-start", label: "起始" },
                  { value: "center", label: "居中" },
                  { value: "flex-end", label: "末尾" },
                  { value: "stretch", label: "拉伸" },
                  { value: "baseline", label: "基线对齐" }
                ]}
              />
            </div>
          </Settings.Section>

          <Settings.Section defaultOpen title={"边距"}>
            <div className="grid grid-cols-2 gap-4">
              <Settings.ItemSlide propKey="margin" min={0} max={100} step={1} label="外边距" />
              <Settings.ItemSlide propKey="padding" min={0} max={100} step={1} label="内边距" />
            </div>
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.ItemColor propKey="background" label="背景颜色" />
          <Settings.ItemSelect propKey="backgroundImage" label="背景" options={assetsOptions}></Settings.ItemSelect>
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
