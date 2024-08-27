import React, { createContext } from "react";
export interface CustomContextProps {
  /**
   * 是否是构建发布状态,与预览状态区分
   */
  publish?: boolean;
}
const defaultValue: CustomContextProps = {
  publish: false,
};
export const CustomContext = createContext(defaultValue);
export const PlatformProvider: React.FC<React.PropsWithChildren<CustomContextProps>> = (props) => {
  return <CustomContext.Provider value={props}>{props.children}</CustomContext.Provider>;
};
