import React, { useReducer, useMemo, useCallback } from "react";
import { Resolver, SerializedNodes } from "@craftjs/core";
import { isEqual } from "lodash-es";

const defaultResolver = {};

export type assetsType = "Image" | "PDF";

export interface DesignContextProps {
  publish?: boolean;
  resolver?: Resolver;
  schema?: string | SerializedNodes;
  assets?: { name: string; url: string; type: assetsType }[];
  onRender?: React.ComponentType<{ render: React.ReactElement }>;
}

type DesignContextAction =
  | { type: "UPDATE_CONTEXT"; payload: Partial<DesignContextProps> }
  | { type: "RESET_CONTEXT"; payload: DesignContextProps }
  | { type: "NO_CHANGE" };

const mergeResolvers = (oldResolver: Resolver, newResolver?: Resolver): Resolver => {
  if (!newResolver) return oldResolver;
  return { ...oldResolver, ...newResolver };
};

const designContextReducer = (state: DesignContextProps, action: DesignContextAction): DesignContextProps => {
  switch (action.type) {
    case "UPDATE_CONTEXT":
      return {
        ...state,
        ...action.payload,
        resolver: mergeResolvers(state.resolver || {}, action.payload.resolver)
      };
    case "RESET_CONTEXT":
      return {
        ...action.payload,
        resolver: mergeResolvers(defaultResolver, action.payload.resolver)
      };
    case "NO_CHANGE":
      return state;
    default:
      return state;
  }
};

export const DesignContext = React.createContext<
  | {
      state: DesignContextProps;
      updateContext: (
        newValue: Partial<DesignContextProps> | ((prevState: DesignContextProps) => Partial<DesignContextProps>)
      ) => void;
    }
  | undefined
>(undefined);

export const DesignProvider: React.FC<React.PropsWithChildren<{ initialProps?: DesignContextProps }>> = ({
  children,
  initialProps = {}
}) => {
  const defaultProps = useMemo(
    () => ({
      publish: initialProps.publish || false,
      resolver: mergeResolvers(defaultResolver, initialProps.resolver),
      schema: initialProps.schema,
      assets: initialProps.assets || [],
      onRender: initialProps.onRender
    }),
    [initialProps]
  );

  const [state, dispatch] = useReducer(designContextReducer, defaultProps);

  const updateContext = useCallback(
    (newValue: Partial<DesignContextProps> | ((prevState: DesignContextProps) => Partial<DesignContextProps>)) => {
      const updatedValue = typeof newValue === "function" ? newValue(state) : newValue;
      const newState = {
        ...state,
        ...updatedValue,
        resolver: mergeResolvers(state.resolver || {}, updatedValue.resolver)
      };
      if (!isEqual(newState, state)) {
        dispatch({ type: "UPDATE_CONTEXT", payload: newState });
      }
    },
    [state]
  );

  const contextValue = useMemo(() => ({ state, updateContext }), [state, updateContext]);

  return <DesignContext.Provider value={contextValue}>{children}</DesignContext.Provider>;
};
