import { useRequest } from "ahooks";
import { getSymbolData } from "../api/getSymbolData";
import { useApi } from "../../client";

/**
 * 获取 Symbol 数据的业务钩子
 */
export const useSymbolData = () => {
  const request = useApi(getSymbolData);

  const { data, loading, error, run } = useRequest(request, {
    manual: true
  });

  return { data, loading, error, run };
};
