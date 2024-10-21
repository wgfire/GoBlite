import React, { useContext } from "react";

// const ComponentsIntercept = <T,>({
//   children,
//   setProp,
//   defaultProps
// }: React.PropsWithChildren & { setProp: any; defaultProps: any }) => {
//   const recursiveCloneChildren = (children: React.ReactNode): React.ReactNode => {
//     return React.Children.map(children, child => {
//       if (!React.isValidElement(child)) {
//         return child;
//       }

//       const childProps = {
//         ...child.props,
//         setProp,
//         props: defaultProps
//       };

//       if (child.props.children) {
//         childProps.children = recursiveCloneChildren(child.props.children);
//       }

//       return React.cloneElement(child, childProps);
//     });
//   };

//   return <div>{recursiveCloneChildren(children)}</div>;
// };

export interface SettingsContextType<T> {
  setCustom: (cb: (props: T) => void, throttleRate?: number) => void;
  setProp: (cb: (props: T) => void, throttleRate?: number) => void;
  value: T;
}

export const SettingsContext = React.createContext({} as SettingsContextType<unknown>);

export const useSettings = <T,>() => {
  return useContext(SettingsContext) as SettingsContextType<T>;
};
// const useCreateSetting = <T,>(defaultProps?: T) => {
//   const {
//     actions: { setProp }
//   } = useNode();

//   const Settings = ({ children }: React.PropsWithChildren) => {
//     return (
//       <SettingsContext.Provider value={{ setProp, value: defaultProps ?? ({} as T) }} key={0}>
//         {/* {ComponentsIntercept({ children, setProp, defaultProps })} */} {children}
//       </SettingsContext.Provider>
//     );
//   };

//   Settings.ItemInput = ItemInput<T>;
//   Settings.ItemSelect = ItemSelect<T>;
//   Settings.ItemColor = ItemColor<T>;
//   Settings.ItemSlider = ItemSlide<T>;
//   Settings.Layout = Layout;
//   Settings.Content = Content;
//   Settings.Section = Section;

//   return Settings;
// };

// export default useCreateSetting;
