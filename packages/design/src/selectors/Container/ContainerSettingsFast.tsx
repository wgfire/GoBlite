import { useNode } from "@craftjs/core";
import { ContainerProps } from "./type";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings";

export const ContainerSettingsComponentFast: React.FC<SettingsComponentProps<ContainerProps>> = ({ Settings }) => {
  const { props } = useNode(node => ({
    displayName: node.data.custom.displayName,
    props: node.data.props as ContainerProps
  }));

  return (
    <Settings defaultValue={props}>
      <div className="container-settings-fast space-y-2">
        {/* 布局方向切换 */}

        <Settings.GridLayout label="快速排列" justifyKey="customStyle.justifySelf" alignKey="customStyle.alignSelf" />
        <Settings.Section defaultOpen title={"内边距"}>
          <Settings.Margins propKeyPrefix="style.padding" label="内边距" units={["px", "%", "vw"]} slider={false} />
        </Settings.Section>
        <Settings.ItemColor propKey="style.background" label="背景颜色" />
        {/* <Settings.ItemSelect propKey="style.backgroundImage" label="背景" options={assetsOptions}></Settings.ItemSelect> */}
      </div>
    </Settings>
  );
};

export const ContainerSettingsFast = SettingsHOC(ContainerSettingsComponentFast);
