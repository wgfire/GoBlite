import { CommonComponentProps } from "@go-blite/design";

export interface MainSymbolProps extends CommonComponentProps {
  title: string;
  symbol: string;
  supportText: string;
  stressText: string;
  footerContent: string;
  i18n: {
    title: string;
    footerContent: string;
    supportText: string;
    stressText: string;
    dayHigh: string;
    dayLow: string;
    sale: string;
    buy: string;
  };
}
