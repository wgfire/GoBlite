import { useContext } from "react";
import { PluginContext } from "./index";

export const usePluginContext = () => {
  return useContext(PluginContext);
};
