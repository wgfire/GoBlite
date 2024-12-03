import { useNode } from "@craftjs/core";
import { AppProps } from "./type";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings";

export const ContainerSettingsComponentFast: React.FC<SettingsComponentProps<AppProps>> = ({ Settings }) => {
  const { props } = useNode(node => ({
    displayName: node.data.custom.displayName,
    props: node.data.props as AppProps
  }));

  return (
    <Settings defaultValue={props}>
      <div className="container-settings-fast space-y-2">
        {/* 布局方向切换 */}

        {/* <Settings.GridLayout label="快速排列" justifyKey="customStyle.justifySelf" alignKey="customStyle.alignSelf" /> */}
        <Settings.ItemSlide propKey="style.gap" min={0} max={100} step={1} label="内部间距" />
        <Settings.ItemColor propKey="style.background" label="背景颜色" />
        {/* <Settings.ItemSelect propKey="style.backgroundImage" label="背景" options={assetsOptions}></Settings.ItemSelect> */}
      </div>
    </Settings>
  );
};

export const ContainerSettingsFast = SettingsHOC(ContainerSettingsComponentFast);
