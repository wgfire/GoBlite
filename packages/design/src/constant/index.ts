import { Devices } from "@/context/Provider";
import { SerializedNodes } from "@craftjs/core";

export const languages = [
  { value: "en", label: "EN" },
  { value: "zh", label: "Zh" },
  { value: "vn", label: "VN" },
  { value: "kr", label: "KR" },
  { value: "id", label: "ID" }
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
