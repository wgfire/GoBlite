import { useContext, useCallback, useMemo } from "react";
import { DesignContext, DesignContextProps, DeviceType } from "./Provider";
import { Resolver } from "@craftjs/core";

interface FindSchemaParams {
  device?: DeviceType;
  language?: string;
}

export const useDesignContext = (initialProps?: Partial<DesignContextProps>) => {
  const context = useContext(DesignContext);

  if (!context) {
    throw new Error("useDesignContext must be used within a DesignProvider");
  }

  const { state, updateContext } = context;
  const mergeResolvers = (oldResolver: Resolver, newResolver?: Resolver): Resolver => {
    if (!newResolver) return oldResolver;
    return { ...oldResolver, ...newResolver };
  };

  //   useEffect(() => {
  //     console.log(initialProps, "initialProps");
  //     if (initialProps) {
  //       updateContext(initialProps);
  //     }
  //   }, [initialProps]);
  //   if (initialProps) {
  //     updateContext(initialProps);
  //   }
  useMemo(() => {
    if (initialProps) {
      const newValue = { ...state, ...initialProps };
      if (initialProps.resolver) {
        //默认对传入的resolver进行合并处理
        newValue.resolver = mergeResolvers(state.resolver!, initialProps.resolver);
      }

      updateContext(newValue);
    }
  }, [initialProps]);

  const findSchema = useCallback(
    ({ device, language }: FindSchemaParams): boolean => {
      if (!device || !state.device) {
        return false;
      }
      const deviceData = state.device.find(d => d.type === device);
      if (!deviceData) {
        return false;
      }
      if (language) {
        // 如果指定了语言，检查该设备下特定语言的 schema
        return !!deviceData.languagePageMap[language]?.schema;
      } else {
        // 如果只指定了设备，检查该设备下是否有任何语言的 schema
        return Object.values(deviceData.languagePageMap).some(lang => !!lang.schema);
      }
    },
    [state.device]
  );

  return { ...state, updateContext, findSchema };
};
