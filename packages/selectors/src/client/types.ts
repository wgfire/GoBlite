import { AppEnvData } from "../hooks/useAppEnv";

/**
 * API请求函数类型
 * @template T - 请求参数的类型
 * @template R - 响应数据的类型
 * @param env - 应用环境变量
 * @param params - 请求参数
 * @returns 返回一个 Promise，解析为响应数据
 */
export type ApiRequest<T, R> = (env: AppEnvData, params?: T) => Promise<R>;

/**
 * 封装后的API调用函数类型
 * @template T - 请求参数的类型
 * @template R - 响应数据的类型
 * @param params - 请求参数
 * @returns 返回一个 Promise，解析为响应数据
 */
export type ApiFunction<T, R> = (params?: T) => Promise<R>;
