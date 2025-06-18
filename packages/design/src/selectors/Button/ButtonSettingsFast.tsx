import { useNode } from "@craftjs/core";
import { ButtonProps } from "./type";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings";

export const ButtonSettingsComponentFast: React.FC<SettingsComponentProps<ButtonProps>> = ({ Settings }) => {
  const { props } = useNode(node => ({
    displayName: node.data.custom.displayName,
    props: node.data.props as ButtonProps
  }));

  return (
    <Settings defaultValue={props}>
      <div className="container-settings-fast space-y-4">
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
        <Settings.ItemColor propKey="style.color" label="字体颜色" />
        <Settings.ItemInput propKey="style.fontSize" label="文字大小" />
        <Settings.GridLayout label="快速排列" justifyKey="customStyle.justifySelf" alignKey="customStyle.alignSelf" />
      </div>
    </Settings>
  );
};

export const ButtonSettingsFast = SettingsHOC(ButtonSettingsComponentFast);
