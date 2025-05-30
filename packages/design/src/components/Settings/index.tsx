import React, { useMemo } from "react";
import { useNode } from "@craftjs/core";
import { SettingsContext } from "./Context";
import { ItemInput } from "@/components/Settings/ItemInput";
import { ItemSelect } from "@/components/Settings/ItemSelect";
import { ItemColor } from "@/components/Settings/ItemColor";
import { ItemSlide } from "@/components/Settings/ItemSlider";
import { Layout } from "@/components/Settings/Layout";
import { Content } from "@/components/Settings/Content";
import { Section } from "@/components/Settings/Section";
import { FlexLayout } from "@/components/Settings/FlexLayout";
import { GridLayout } from "@/components/Settings/GridLayout";
import { ItemName } from "./ItemName";
import { ItemUpload } from "@/components/Settings/ItemUpload";

export interface SettingsProps<T> {
  defaultValue: T;
  children: React.ReactNode;
}

export interface SettingsComponent<T> extends React.FC<SettingsProps<T>> {
  ItemInput: typeof ItemInput<T>;
  ItemSelect: typeof ItemSelect<T>;
  ItemColor: typeof ItemColor<T>;
  ItemSlide: typeof ItemSlide<T>;
  ItemName: typeof ItemName<T>;
  ItemUpload: typeof ItemUpload<T>;
  Layout: typeof Layout;
  Content: typeof Content;
  Section: typeof Section;
  FlexLayout: typeof FlexLayout<T>;
  GridLayout: typeof GridLayout<T>;
}

function createSettings<T>(): SettingsComponent<T> {
  const Settings: React.FC<SettingsProps<T>> & SettingsComponent<T> = ({ defaultValue, children }) => {
    const {
      actions: { setProp, setCustom }
    } = useNode();

    const contextValue = useMemo(
      () => ({
        setCustom,
        setProp,
        value: defaultValue
      }),
      [defaultValue]
    );

    return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
  };

  Settings.ItemInput = ItemInput;
  Settings.ItemSelect = ItemSelect;
  Settings.ItemColor = ItemColor;
  Settings.ItemSlide = ItemSlide;
  Settings.ItemName = ItemName;
  Settings.ItemUpload = ItemUpload;
  Settings.Layout = Layout;
  Settings.Content = Content;
  Settings.Section = Section;
  Settings.FlexLayout = FlexLayout;
  Settings.GridLayout = GridLayout;
  return Settings;
}

export interface SettingsComponentProps<T> {
  Settings: SettingsComponent<T>;
}

function SettingsHOC<T>(Component: React.ComponentType<SettingsComponentProps<T>>) {
  const WrappedComponent: React.FC = () => {
    const Settings = useMemo(() => createSettings<T>(), []);
    return <Component Settings={Settings} />;
  };
  return WrappedComponent;
}

export default SettingsHOC;
