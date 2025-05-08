import { createContext, useMemo, useState } from "react";

export interface StateProps {
  nodes: { label: string; value: string }[];
}

export const PluginContext = createContext<{
  state: StateProps;
  setState: React.Dispatch<React.SetStateAction<StateProps>>;
}>({ state: { nodes: [] }, setState: () => {} });

export const PluginProvider: React.FC<React.PropsWithChildren> = props => {
  const [state, setState] = useState<StateProps>({ nodes: [] });
  // 后续扩展可以改成 Reducer形式来避免刷新
  const value = useMemo(() => {
    return {
      state,
      setState
    };
  }, [state]);

  return <PluginContext.Provider value={value}>{props.children}</PluginContext.Provider>;
};
