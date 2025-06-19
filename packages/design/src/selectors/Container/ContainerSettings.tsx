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
  const designContext = useDesignContext();
  if (!designContext) {
    return null;
  }
  const { assets } = designContext;

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
            <div className="grid grid-cols-1 gap-4">
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
          <Settings.Section defaultOpen title={"布局"}>
            <Settings.ItemSelect
              label="布局模式"
              propKey="layoutMode"
              defaultValue="absolute"
              options={[
                { value: "absolute", label: "绝对定位模式" },
                { value: "flow", label: "流式布局模式" }
              ]}
            />
            {props.layoutMode === "flow" && (
              <>
                <Settings.ItemSelect
                  label="网格流向"
                  propKey="style.gridAutoFlow"
                  defaultValue="row"
                  options={[
                    { value: "row", label: "纵向排列" },
                    { value: "column", label: "横向排列" },
                    { value: "row dense", label: "纵向密集" },
                    { value: "column dense", label: "横向密集" }
                  ]}
                />
                <Settings.ItemSlide label="元素间距" propKey="style.gap" min={0} max={50} step={1} />
              </>
            )}
            {props.layoutMode === "absolute" && <Settings.ItemPosition propKeyPrefix="customStyle" />}
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.ItemColor propKey="style.background" label="背景颜色" />
          <Settings.ItemSelect
            propKey="style.backgroundImage"
            label="背景"
            options={assetsOptions}
          ></Settings.ItemSelect>
          <Settings.Section defaultOpen title={"圆角"}>
            <Settings.ItemSInput label="圆角" propKey="style.borderRadius" units={["px", "%"]} slider={true} />
          </Settings.Section>
          <Settings.Section title={"外边距"}>
            <Settings.Margins propKeyPrefix="style.margin" label="外边距" units={["px", "%", "vw"]} slider={false} />
          </Settings.Section>
          <Settings.Section title={"内边距"}>
            <Settings.Margins propKeyPrefix="style.padding" label="内边距" units={["px", "%", "vw"]} slider={false} />
          </Settings.Section>
        </Settings.Content>

        <Settings.Content>
          <Settings.ItemScript
            propKey="events.onClick"
            label="自定义脚本"
            buttonText="编写脚本"
            language="javascript"
          />
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ContainerSettings = SettingsHOC(ContainerSettingsComponent);
