import { ApiRequest } from "../../client";
import { AppEnvData } from "../../hooks";

export interface SymbolListResponse {
  [key: string]: unknown;
}

interface GetSymbolListParams {
  account?: string;
}

export const getSymbolList: ApiRequest<GetSymbolListParams, SymbolListResponse> = async (
  env: AppEnvData,
  params: GetSymbolListParams = {}
) => {
  const queryParams = new URLSearchParams({
    nationalityCode: env.nationalityCode || "TW",
    account: params.account || "guest",
    license: env.license || "FSC"
  });

  const url = `https://demo-app.mitrade.com/api/v3/instruments/mixed?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("获取 symbol 列表失败");
  }

  return response.json();
};
