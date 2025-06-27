import { Time } from "lightweight-charts";

/**
 * 基础k线数据
 */
export interface KlineBase {
  open: number;
  high: number;
  low: number;
  close: number;
}

/**
 * 原始k线数据
 */
export interface KlineDataItem extends KlineBase {
  datetime: string;
}

/**
 * 格式化后的k线数据
 */
export interface KlineData extends KlineBase {
  time: Time;
}

/**
 * 格式化k线数据
 * @param {Array} data
 * @returns {Array}
 */
export const formatKlineData = (data: KlineDataItem[]): KlineData[] | undefined => {
  return data?.map(item => {
    return {
      time: formatTime(item?.datetime) as Time,
      open: Number(item?.open),
      high: Number(item?.high),
      low: Number(item?.low),
      close: Number(item?.close)
    };
  });
};

/**
 * 格式化时间
 * @param time
 * @returns 时间戳
 */
export const formatTime = (time: string): number => {
  return new Date(time).getTime() / 1000;
};
