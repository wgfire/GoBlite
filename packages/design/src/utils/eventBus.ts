import mitt, { Emitter } from "./mitt";

export interface MousePosition {
  mouseX: number;
  mouseY: number;
}
export interface Position {
  x: number;
  y: number;
}
export interface ElementInfo {
  target: HTMLElement | null;
  rect: DOMRect;
  parentRect?: DOMRect;
  matrix?: DOMMatrix | null;
}

export type BusinessEventPayload = {
  // 可以根据需要添加更多字段
  source?: string;
  data?: unknown;
  timestamp?: number;
  success?: boolean;
  error?: Error | string;
  // 回调函数，用于通知事件处理完成状态
  _callback?: (success: boolean, data?: any) => void;
};

export type BusinessEventTypes = {
  // 保存相关事件
  onSave: BusinessEventPayload;
  onSaveSuccess: BusinessEventPayload;
  onSaveError: BusinessEventPayload;

  // 下载相关事件
  onDownload: BusinessEventPayload;
  onDownloadSuccess: BusinessEventPayload;
  onDownloadError: BusinessEventPayload;

  // 预览相关事件
  onPreview: BusinessEventPayload;
  onPreviewExit: BusinessEventPayload;

  // 设备切换事件
  onDeviceChange: BusinessEventPayload & { device: string };

  // 语言切换事件
  onLanguageChange: BusinessEventPayload & { language: string };

  // 清空事件
  onClear: BusinessEventPayload;

  // i18n events
  onI18nUpload: BusinessEventPayload & { data: Record<string, any> };
  onI18nDownload: BusinessEventPayload & { language: string };
};

export type Events = {
  // UI 交互事件
  mouseDrag: MousePosition & ElementInfo & Position;
  mouseUp: Position;
  mouseDown: MousePosition & ElementInfo;
  doubleClick: { id: string };
  contextMenu: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
} & BusinessEventTypes;

export const eventBus: Emitter<Events> = mitt<Events>();
