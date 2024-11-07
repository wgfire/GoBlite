import { useEditor } from "@craftjs/core";

import { Selectors } from "./Selectors";
import { Assets } from "./Assets";
import { Layout } from "./Layout";
import { useDelayedState } from "@/hooks/useDelayedState";

export type SelectType = "selectors" | "assets";

export const Toolbox: React.FC = () => {
  const { enabled } = useEditor(state => ({
    enabled: state.options.enabled
  }));

  const [shouldRender] = useDelayedState(enabled, {
    delay: 300,
    immediate: false
  });

  if (!shouldRender) return null;

  return (
    <div
      className={`flex flex-col space-y-6 bg-white shadow-md px-4 flex-shrink-0 flex-grow-[0] transition-all duration-300 z-10
        ${!enabled ? "opacity-0 translate-x-[-100%] " : "opacity-100 translate-x-0"}`}
    >
      <Selectors />
      <Assets />
      <Layout />
    </div>
  );
};
