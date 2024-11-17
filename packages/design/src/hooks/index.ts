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

export type Events = {
  mouseDrag: MousePosition & ElementInfo & Position;
  mouseUp: Position;
  mouseDown: MousePosition & ElementInfo;
  doubleClick: { id: string };
  contextMenu: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
};

export type MouseHandlers = {
  mouseDrag: MousePosition & ElementInfo & Position;
  mouseUp: Position;
  mouseDown: MousePosition & ElementInfo;
};
