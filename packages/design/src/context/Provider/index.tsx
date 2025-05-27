import React, { useMemo } from "react";
import { Resolver, SerializedNodes } from "@craftjs/core";
import { useImmer, Updater } from "use-immer";
import { Container as ContainerEdit } from "@/selectors/Container/Container.edit";
import { Text as TextEdit } from "@/selectors/Text/Text.edit";
import { Button as ButtonEdit } from "@/selectors/Button/Button.edit";
import { Image as ImageEdit } from "@/selectors/Image/Image.edit";
import { NonFarm as NonFarmEdit } from "@/selectors/NonFarm/NonFarm.edit";
import { App as AppEdit } from "@/selectors/App/App.edit";
import { Container as ContainerView } from "@/selectors/Container/Container.view";
import { Text as TextView } from "@/selectors/Text/Text.view";
import { Button as ButtonView } from "@/selectors/Button/Button.view";
import { Image as ImageView } from "@/selectors/Image/Image.view";
import { NonFarm as NonFarmView } from "@/selectors/NonFarm/NonFarm.view";
import { App as AppView } from "@/selectors/App/App.view";

// 编辑模式下的默认组件
export const defaultEditResolver: Resolver = {
  Container: ContainerEdit,
  Text: TextEdit,
  Button: ButtonEdit,
  Image: ImageEdit,
  App: AppEdit,
  NonFarm: NonFarmEdit
};

// 预览模式下的默认组件
export const defaultViewResolver: Resolver = {
  Container: ContainerView,
  Text: TextView,
  Button: ButtonView,
  Image: ImageView,
  App: AppView,
  NonFarm: NonFarmView
};

// 在 DesignProvider 中根据 publish 属性决定使用哪个默认 resolver

export type assetsType = "Image" | "PDF";
export type DeviceType = "mobile" | "tablet" | "desktop";
export type PageTemplate = "static-download";

export interface Device {
  type: DeviceType;
  pageTemplate: PageTemplate;
  languagePageMap: {
    [key: string]: {
      schema: SerializedNodes | string;
    };
  };
}

export type Devices = Device[];

export interface DesignContextProps {
  publish?: boolean;
  resolver?: Resolver;
  device: Devices;
  currentInfo: {
    device: DeviceType;
    pageTemplate: PageTemplate;
    language: string;
  };
  schema?: string | SerializedNodes;
  assets?: { name: string; url: string; type: assetsType }[];
  onRender?: React.ComponentType<{ render: React.ReactElement }>;
  showSidebar?: boolean;
  /** 多端数据同步 */
  syncResponse?: boolean;
}

const mergeResolvers = (oldResolver: Resolver, newResolver?: Resolver): Resolver => {
  if (!newResolver) return oldResolver;
  return { ...oldResolver, ...newResolver };
};

export const DesignContext = React.createContext<
  | {
      state: DesignContextProps;
      updateContext: Updater<DesignContextProps>;
    }
  | undefined
>(undefined);

export const DesignProvider: React.FC<React.PropsWithChildren<{ initialProps?: Partial<DesignContextProps> }>> = ({
  children,
  initialProps = {} as DesignContextProps
}) => {
  console.log('DesignProvider - initialProps:', initialProps);
  const defaultProps = useMemo(() => {
    // 根据 publish 属性选择合适的默认 resolver
    const isPublish = initialProps.publish || false;
    const baseResolver = isPublish ? defaultViewResolver : defaultEditResolver;

    // 确保 schema 被正确初始化
    const schema = initialProps.schema || {};

    const result = {
      publish: isPublish,
      // 合并用户提供的 resolver 和默认 resolver
      resolver: mergeResolvers(baseResolver, initialProps.resolver),
      schema: schema, // 确保 schema 被正确设置
      assets: initialProps.assets || [],
      onRender: initialProps.onRender,
      device: initialProps.device,
      currentInfo: initialProps.currentInfo ?? {
        device: "desktop",
        pageTemplate: "static-download",
        language: "zh"
      },
      showSidebar: initialProps.showSidebar || false,
      syncResponse: initialProps.syncResponse || false
    };
    
    return result;
  }, [initialProps]);

  const [state, updateState] = useImmer(defaultProps as DesignContextProps);

  const contextValue = useMemo(() => ({ state, updateContext: updateState }), [state, updateState]);

  return <DesignContext.Provider value={contextValue}>{children}</DesignContext.Provider>;
};
