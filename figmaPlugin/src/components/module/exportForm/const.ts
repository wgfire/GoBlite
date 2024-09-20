import { Language, DeviceType, PageType } from "./types";

export const languageData: { label: string; value: Language }[] = [
    { value: Language.ZH, label: "中文" },
    { value: Language.EN, label: "英文" },
    { value: Language.KR, label: "韩文" },
    { value: Language.TH, label: "泰文" },
    { value: Language.VN, label: "越南文" },
    { value: Language.MY, label: "马来文" },
    { value: Language.IN, label: "印尼文" },
    { value: Language.ID, label: "印度文" },
    { value: Language.PH, label: "菲律宾文" },
    { value: Language.PT, label: "葡萄牙" },
  ];
  export const devicesData: { label: keyof typeof DeviceType; value: DeviceType }[] = [
    {
      label: "PC",
      value: DeviceType.PC,
    },
    {
      label: "IPad",
      value: DeviceType.IPad,
    },
    {
      label: "H5",
      value: DeviceType.H5,
    },
  ];
 export  const pageTypeData: { label: string; value: PageType; disabled?: boolean }[] = [
    {
      label: "静态图片",
      value: PageType.StaticImage,
    },
    {
      label: "图文并茂",
      value: PageType.GraphicSite,
      disabled: true,
    },
  ];