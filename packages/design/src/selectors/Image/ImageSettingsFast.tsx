import { useNode } from "@craftjs/core";
import { ImageProps } from "./type";
import SettingsHOC, { SettingsComponentProps } from "@/components/Settings";
import { useDesignContext } from "@/context";

export const ImageSettingsComponentFast: React.FC<SettingsComponentProps<ImageProps>> = ({ Settings }) => {
  const { props } = useNode(node => ({
    props: node.data.props as ImageProps
  }));
  const { assets } = useDesignContext();
  const assetsOptions = [{ url: "none", name: "无" }, ...(assets ?? [])].map(asset => ({
    label: asset.name,
    value: asset.url
  }));
  return (
    <Settings defaultValue={props}>
      <div className="container-settings-fast space-y-4">
        <Settings.ItemSelect propKey="src" label="图片选择" options={assetsOptions}></Settings.ItemSelect>
        <Settings.GridLayout label="快速排列" justifyKey="customStyle.justifySelf" alignKey="customStyle.alignSelf" />
      </div>
    </Settings>
  );
};

export const ImageSettingsFast = SettingsHOC(ImageSettingsComponentFast);
