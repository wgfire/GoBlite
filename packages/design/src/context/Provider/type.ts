import { SerializedNodes } from "@craftjs/core";

export type assetsType = "Image" | "PDF";
export type DeviceType = "mobile" | "tablet" | "desktop";
export type PageTemplate = "static-download";

export interface Device {
  type: DeviceType;
  pageTemplate?: PageTemplate;
  languagePageMap: {
    [key: string]: {
      schema: SerializedNodes | string;
    };
  };
}

export type Devices = Device[];

export type BusinessComponents = {
  name: string;
  icon?: React.ReactNode;
  editResolver: React.ElementType;
  viewResolver: React.ElementType;
  description?: string;
  category?: string;
};

export interface DesignContextProps {
  publish?: boolean;
  resolver?: BusinessComponents[];
  device: Devices;
  currentInfo: {
    device: DeviceType;
    pageTemplate?: PageTemplate;
    language: string;
  };
  schema?: string | SerializedNodes;
  assets?: { name: string; url: string; type: assetsType }[];
  onRender?: React.ComponentType<{ render: React.ReactElement }>;
  showSidebar?: boolean;
  /** 多端数据同步 */
  syncResponse?: boolean;
  /** 模板 */
  templates?: {
    type: string;
    list: {
      name: string;
      devices: Devices;
    }[];
  }[];
  metadata?: {
    [key: string]: unknown;
  };
}
