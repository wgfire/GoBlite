import { useCallback } from "react";
import { useAppEnv } from "../hooks/useAppEnv";
import { ApiRequest, ApiFunction } from "./types";

/**
 * 创建一个封装了环境变量的 API 调用钩子
 * @template T - 请求参数的类型
 * @template R - 响应数据的类型
 * @param apiRequest - 一个接受 env 和 params 的原始 API 请求函数
 * @returns 返回一个只接受 params 的新函数，并自动注入环境变量
 */
export function useApi<T, R>(apiRequest: ApiRequest<T, R>): ApiFunction<T, R> {
  const { envData, loading } = useAppEnv();

  // 使用 useCallback 封装 API 调用，以避免在每次渲染时都创建新函数
  const callApi = useCallback(
    async (params?: T): Promise<R> => {
      if (!envData || Object.keys(envData).length === 0 || loading) {
        // 在环境变量准备好之前，可以抛出错误或返回一个挂起的Promise
        // 这里我们抛出错误，以便调用者可以捕获并处理
        throw new Error("环境变量尚未加载，无法进行 API 调用");
      }
      return apiRequest(envData, params);
    },
    [envData, apiRequest, loading]
  );

  return callApi;
}
