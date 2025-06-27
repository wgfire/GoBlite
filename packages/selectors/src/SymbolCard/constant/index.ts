import { MainSymbolProps } from "../type";

/**
 * @description 默认属性
 */
export const defaultProps: MainSymbolProps = {
  title: "把我关键交易时机",
  symbol: "XAUUSD",
  stressText: "非农压力位",
  supportText: "非农支撑位",
  footerContent: "若突破或跌破压力值，黄金或将引发更大波动",

  /**
   * @description 默认显示的多语言内容
   */
  i18n: {
    title: "把我关键交易时机",
    stressText: "非农压力位",
    supportText: "非农支撑位",
    footerContent: "若突破或跌破压力值，黄金或将引发更大波动",
    dayHigh: "近30天最高",
    dayLow: "近30天最低",
    sale: "卖出",
    buy: "买入"
  }
};
