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
import { ItemSInput } from "@/components/Settings/ItemSInput";
import { Margins } from "@/components/Settings/Margins";
import { ItemPosition } from "./ItemPosition"; // Added ItemPosition import

export interface SettingsProps<T extends Record<string, any>> {
  defaultValue: T;
  children: React.ReactNode;
}

export interface SettingsComponent<T extends Record<string, any>> extends React.FC<SettingsProps<T>> {
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
  ItemSInput: typeof ItemSInput<T>;
  Margins: typeof Margins<T>;
  ItemPosition: typeof ItemPosition<T>; // Added ItemPosition to interface
}

function createSettings<T extends Record<string, any>>(): SettingsComponent<T> {
  const Settings: SettingsComponent<T> = ({ defaultValue, children }) => {
    const {
      actions: { setProp, setCustom }
    } = useNode();

    const contextValue = useMemo(
      () => ({
        setCustom,
        setProp,
        value: defaultValue
      }),
      [defaultValue, setProp, setCustom] // Corrected dependencies
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
  Settings.ItemSInput = ItemSInput;
  Settings.Margins = Margins;
  Settings.ItemPosition = ItemPosition; // Added ItemPosition to Settings object
  return Settings;
}

export interface SettingsComponentProps<T extends Record<string, any>> {
  Settings: SettingsComponent<T>;
}

function SettingsHOC<T extends Record<string, any>>(Component: React.ComponentType<SettingsComponentProps<T>>) {
  const WrappedComponent: React.FC = () => {
    const Settings = useMemo(() => createSettings<T>(), []);
    return <Component Settings={Settings} />;
  };
  return WrappedComponent;
}

export default SettingsHOC;
