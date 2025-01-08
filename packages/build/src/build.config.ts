import { BuildConfig } from "./post-build";

export const buildConfigs: Record<string, BuildConfig> = {
  email: {
    type: "email",
    inlineStyles: true,
    removeExternalResources: true
  },
  activity: {
    type: "activity",
    scripts: [""], // 可以打包到静态资源的脚步文件
    inlineStyles: false,
    removeExternalResources: false
  },
  landPage: {
    type: "landPage",
    scripts: [""], // 可以打包到静态资源的脚步文件
    inlineStyles: false,
    removeExternalResources: false
  }
};
