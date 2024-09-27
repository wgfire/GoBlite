// 设备对象接口
export interface Device {
  type: DeviceType; // 设备类型，如PC，iPad，H5
  pageType: PageType; // 页面类型，如静态图片，图文并茂
  languagePageMap: Partial<Record<Language, { ids: string[]; nodes: unknown[]; schema: object }>>;
}
export enum DeviceType {
  PC = "pc",
  IPad = "ipad",
  H5 = "h5",
}
// 页面类型枚举
export enum PageType {
  StaticImage = "STATIC_IMAGE",
  GraphicSite = "GRAPHIC_SITE",
}

// 语言类型枚举
export enum Language {
  ZH = "CN",
  EN = "EN",
  KR = "KR",
  TH = "TH",
  VN = "VN",
  MY = "MY",
  IN = "IN",
  ID = "ID",
  PH = "PH",
  PT = "PT",
}
