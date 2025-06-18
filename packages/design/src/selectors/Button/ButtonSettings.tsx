import React from "react";
import { ButtonProps } from "./type";
import { useNode } from "@craftjs/core";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings/index";
import events from "@go-blite/events";
import { Label, Switch } from "@go-blite/shadcn";
import { useDesignContext } from "@/context";

const ButtonSettingsComponent: React.FC<SettingsComponentProps<ButtonProps>> = ({ Settings }) => {
  const { props, displayName, setProp } = useNode(node => ({
    props: node.data.props as ButtonProps,
    displayName: node.data.custom.displayName
  }));

  const designContext = useDesignContext();
  if (!designContext) {
    // console.error("Design context is not available in ButtonSettingsComponent");
    return null;
  }
  const { currentInfo } = designContext;

  const eventOptions = [{ name: "无", value: "none" }, ...Object.values(events)].map(e => ({
    label: e.name,
    value: e.name
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式", "行为"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
          <Settings.Section defaultOpen title={"按钮文本"}>
            <Settings.ItemInput propKey="text" placeholder="输入按钮文本" />
            <Settings.ItemInput propKey="style.fontSize" type="number" placeholder="文字大小" />
          </Settings.Section>
          <Settings.Section defaultOpen title={"变体"}>
            <Settings.ItemSelect
              propKey="variant"
              label="按钮样式"
              options={[
                { value: "default", label: "默认" },
                { value: "destructive", label: "破坏性" },
                { value: "secondary", label: "次要" },
                { value: "link", label: "链接" }
              ]}
            />
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
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"颜色设置"}>
            <Settings.ItemColor
              propKey="style.backgroundColor"
              label={<span className="text-sm text-gray-400">背景颜色</span>}
            />
            <Settings.ItemColor propKey="style.color" label={<span className="text-sm text-gray-400">文字颜色</span>} />
          </Settings.Section>
          <Settings.ItemSlide propKey="style.borderRadius" label="圆角" min={0} max={100} step={1} />
          <Settings.Section title={"外边距"}>
            <Settings.Margins propKeyPrefix="style.margin" label="外边距" units={["px", "%", "vw"]} slider={false} />
          </Settings.Section>
          <Settings.Section title={"内边距"}>
            <Settings.Margins propKeyPrefix="style.padding" label="内边距" units={["px", "%", "vw"]} slider={false} />
          </Settings.Section>
          <Settings.Section title={"定位"}>
            <Settings.ItemPosition propKeyPrefix="customStyle" />
          </Settings.Section>
          {/* 安全区域设置，仅在移动设备模式下显示 */}
          {currentInfo.device === "mobile" && (
            <Settings.Section title={"安全区域设置"} defaultOpen>
              <div className="flex items-center space-x-2 py-2">
                <Switch
                  id="safe-area-switch"
                  checked={props.useSafeArea}
                  onCheckedChange={checked => {
                    setProp(props => {
                      // 直接设置顶层useSafeArea属性
                      props.useSafeArea = checked;
                      const newStyle = props.customStyle ?? {};
                      if (checked) {
                        // 当启用安全区域时，添加margin计算
                        const currentMargin = typeof newStyle.marginBottom === "string" ? newStyle.marginBottom : "0px";
                        newStyle.marginBottom = `calc(var(--safe-area-bottom) + ${currentMargin})`;
                      } else {
                        // 移除安全区域margin
                        if (
                          typeof newStyle.marginBottom === "string" &&
                          newStyle.marginBottom.includes("--safe-area-bottom")
                        ) {
                          newStyle.marginBottom = newStyle.marginBottom.replace(
                            /calc\(var\(--safe-area-bottom\) \+ (.+)\)/,
                            "$1"
                          );
                        }
                      }
                      props.customStyle = newStyle;
                    });
                  }}
                />
                <Label htmlFor="safe-area-switch" className="text-sm text-gray-400">
                  启用底部安全区域
                </Label>
                <div className="text-xs text-gray-400 ml-1">(适用于iOS设备底部导航栏)</div>
              </div>
            </Settings.Section>
          )}
        </Settings.Content>

        <Settings.Content>
          <Settings.Section defaultOpen title={"点击事件"}>
            {(() => {
              const selectValue = props.events?.onClick?.type === "builtin" ? props.events.onClick.value : "none";
              return (
                <Settings.ItemSelect
                  label="选择事件"
                  options={eventOptions}
                  value={selectValue}
                  onChange={val => {
                    setProp(p => {
                      p.events = p.events || {};
                      p.events.onClick =
                        val === "none" ? undefined : ({ type: "builtin", name: val, value: val } as any);
                    });
                  }}
                />
              );
            })()}
            <Settings.ItemScript
              propKey="events.onClick"
              label="自定义脚本"
              buttonText="编写脚本"
              language="javascript"
            />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const ButtonSettings = SettingsHOC<ButtonProps>(ButtonSettingsComponent);
