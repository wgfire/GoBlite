import "./styles/tailwind.css";

export * from "./types/schema";

export { default as Loading } from "./components/Loading";
export * from "./components/ElementBox";

export * from "./editor/Design";
export { Preview } from "./editor/Preview";
export * from "./context";
export * from "./utils";
export * from "./hooks";

/**导出setting组件 */

export * from "./components/Settings";
export { default as SettingsHOC } from "./components/Settings";

/**导出carft.js */
export * from "@craftjs/core";
