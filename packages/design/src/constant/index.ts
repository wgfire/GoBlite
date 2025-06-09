import { Devices } from "@/context/Provider";
import { SerializedNodes } from "@craftjs/core";

export const languages = [
  { value: "en-US", label: "英语" },
  { value: "zh-CN", label: "简体中文" },
  { value: "zh-TW", label: "繁体中文" },
  { value: "ko-KR", label: "韩语" },
  { value: "vi-VN", label: "越南语" },
  { value: "ms-MY", label: "马来语" },
  { value: "th-TH", label: "泰语" },
  { value: "id-ID", label: "印尼语" },
  { value: "hi-IN", label: "印地语" },
  { value: "es-ES", label: "西班牙语" },
  { value: "pt-BR", label: "葡萄牙语" },
  { value: "pl-PL", label: "波兰语" },
  { value: "de-DE", label: "德语" }
];

export const DEVICES = ["mobile", "tablet", "desktop"];

export const defaultNode: SerializedNodes = {
  ROOT: {
    type: {
      resolvedName: "App"
    },
    isCanvas: true,
    props: {},
    nodes: [],
    linkedNodes: {},
    parent: null,
    hidden: false,
    displayName: "App",
    custom: { displayName: "App" }
  }
};

export const defaultDevice: Devices = [
  {
    type: "desktop",
    pageTemplate: "static-download",
    languagePageMap: {
      zh: {
        schema: defaultNode
      }
    }
  }
];
