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
            { value: "outline", label: "轮廓" },
            { value: "ghost", label: "幽灵" },
            { value: "link", label: "链接" }
          ]}
        />
        <Settings.ItemColor propKey="style.color" label="字体颜色" />
      </div>
    </Settings>
  );
};

export const ButtonSettingsFast = SettingsHOC(ButtonSettingsComponentFast);
