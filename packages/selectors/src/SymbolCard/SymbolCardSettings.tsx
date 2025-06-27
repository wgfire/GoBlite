import React from "react";
import { MainSymbolProps } from "./type";
import { useNode } from "@go-blite/design";
import { SettingsComponentProps, SettingsHOC } from "@go-blite/design";

const SymbolCardSettingsComponent: React.FC<SettingsComponentProps<MainSymbolProps>> = ({ Settings }) => {
  const { props, displayName } = useNode(node => ({
    props: node.data.props as MainSymbolProps,
    displayName: node.data.custom.displayName
  }));

  return (
    <Settings defaultValue={props}>
      <Settings.Layout tabs={["基础配置", "样式", "行为"]}>
        <Settings.Content>
          <Settings.Section defaultOpen title={"组件名称"}>
            <Settings.ItemName placeholder="请输入组件名称" value={displayName} />
          </Settings.Section>
        </Settings.Content>
      </Settings.Layout>
    </Settings>
  );
};

export const SymbolCardSettings = SettingsHOC(SymbolCardSettingsComponent);
