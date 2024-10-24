import React, { useMemo } from "react";
import { Resolver, SerializedNodes } from "@craftjs/core";
import { useImmer, Updater } from "use-immer";

const defaultResolver = {};

export type assetsType = "Image" | "PDF";
export type DeviceType = "mobile" | "tablet" | "desktop";
export type PageTemplate = "static-download";

export interface Device {
  type: DeviceType;
  pageTemplate: PageTemplate;
  languagePageMap: {
    [key: string]: {
      schema: SerializedNodes;
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
  const defaultProps = useMemo(
    () => ({
      publish: initialProps.publish || false,
      resolver: mergeResolvers(defaultResolver, initialProps.resolver),
      schema: initialProps.schema,
      assets: initialProps.assets || [],
      onRender: initialProps.onRender,
      device: initialProps.device,
      currentInfo: initialProps.currentInfo ?? {
        device: "desktop",
        pageTemplate: "static-download",
        language: "zh"
      }
    }),
    [initialProps]
  );

  const [state, updateState] = useImmer(defaultProps as DesignContextProps);

  const contextValue = useMemo(() => ({ state, updateContext: updateState }), [state, updateState]);

  return <DesignContext.Provider value={contextValue}>{children}</DesignContext.Provider>;
};
