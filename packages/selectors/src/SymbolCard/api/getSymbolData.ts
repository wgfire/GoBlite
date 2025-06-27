import { ApiRequest } from "../../client";
import { AppEnvData } from "../../hooks";
export interface SymbolDataResponse {}

export const getSymbolData: ApiRequest<{ account?: string }, SymbolDataResponse> = async (
  env: AppEnvData,
  params?: { account?: string }
) => {
  const queryParams = new URLSearchParams({
    nationalityCode: env.nationalityCode || "TW",
    account: params?.account || "guest",
    license: env.license || "FSC"
  });

  const url = `https://demo-app.mitrade.com/api/v1/cms/mixed-data?${queryParams.toString()}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("获取 symbol 数据失败");
  }

  return response.json();
};
