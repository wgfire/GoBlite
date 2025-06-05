import React, { useMemo } from "react";
import { useImmer, Updater } from "use-immer";
import { internalBusinessComponents } from "@/selectors";
import { DesignContextProps } from "./type";

export * from "./type";
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
  console.log("DesignProvider - initialProps:", initialProps);
  const defaultProps = useMemo(() => {
    const isPublish = initialProps.publish || false;

    // 合并内部组件和外部传入的业务组件
    const allBusinessComponents = [...internalBusinessComponents, ...(initialProps.resolver || [])];

    // 确保 schema 被正确初始化
    const schema = initialProps.schema || {};

    const result = {
      publish: isPublish,
      resolver: allBusinessComponents,
      schema: schema,
      assets: initialProps.assets || [],
      onRender: initialProps.onRender,
      device: initialProps.device,
      currentInfo: initialProps.currentInfo ?? {
        device: "desktop",
        pageTemplate: "static-download",
        language: "zh"
      },
      showSidebar: initialProps.showSidebar || false,
      syncResponse: initialProps.syncResponse || false,
      templates: initialProps.templates || []
    };

    return result;
  }, [initialProps]);

  const [state, updateState] = useImmer(defaultProps as DesignContextProps);

  const contextValue = useMemo(() => ({ state, updateContext: updateState }), [state, updateState]);

  return <DesignContext.Provider value={contextValue}>{children}</DesignContext.Provider>;
};
