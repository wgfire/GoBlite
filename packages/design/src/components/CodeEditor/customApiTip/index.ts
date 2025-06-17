import { CustomApiType } from "../types";
import { nativeAppApis } from "./windowApi";
import { webApis } from "./webApi";

/**
 * 合并所有自定义API提示
 */
export const mergeCustomApis = (): CustomApiType => {
  // 深度合并API定义
  const mergedApis: CustomApiType = {
    apis: [],
    globals: {}
  };

  // 合并 nativeAppApis
  if (nativeAppApis.apis && Array.isArray(nativeAppApis.apis)) {
    if (!mergedApis.apis) mergedApis.apis = [];
    mergedApis.apis = [...mergedApis.apis, ...nativeAppApis.apis];
  }
  if (nativeAppApis.globals) {
    mergedApis.globals = { ...mergedApis.globals, ...nativeAppApis.globals };
  }

  // 合并 webApis
  if (webApis.apis && Array.isArray(webApis.apis)) {
    // 检查是否有重复的API对象，如果有则合并它们
    webApis.apis.forEach(webApi => {
      if (!mergedApis.apis) {
        mergedApis.apis = [];
      }
      const existingApiIndex = mergedApis.apis.findIndex(api => api.name === webApi.name);
      if (existingApiIndex !== -1) {
        // 合并相同名称的API对象
        const existingApi = mergedApis.apis[existingApiIndex];
        // 合并方法
        if (webApi.methods && existingApi.methods) {
          existingApi.methods = [...existingApi.methods, ...webApi.methods];
        } else if (webApi.methods) {
          existingApi.methods = [...webApi.methods];
        }
        // 合并属性
        if (webApi.properties && existingApi.properties) {
          existingApi.properties = [...existingApi.properties, ...webApi.properties];
        } else if (webApi.properties) {
          existingApi.properties = [...webApi.properties];
        }
      } else {
        // 添加新的API对象
        mergedApis.apis.push(webApi);
      }
    });
  }
  if (webApis.globals) {
    mergedApis.globals = { ...mergedApis.globals, ...webApis.globals };
  }

  return mergedApis;
};

// 导出合并后的API提示
export const customApis = mergeCustomApis();

// 导出各个API提示，方便单独使用
export { nativeAppApis, webApis };
