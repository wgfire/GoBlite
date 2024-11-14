import { useNode } from "@craftjs/core";
import { TextProps } from "./type";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings";

export const TextSettingsComponentFast: React.FC<SettingsComponentProps<TextProps>> = ({ Settings }) => {
  const { props } = useNode(node => ({
    displayName: node.data.custom.displayName,
    props: node.data.props as TextProps
  }));

  return (
    <Settings defaultValue={props}>
      <div className="container-settings-fast space-y-4">
        {/* 布局方向切换 */}

        <Settings.ItemSlide propKey="style.fontSize" label="字体大小" min={1} max={100} step={1} />
        <Settings.ItemColor propKey="style.color" label="字体颜色" />
      </div>
    </Settings>
  );
};

export const TextSettingsFast = SettingsHOC(TextSettingsComponentFast);
