import mitt, { Emitter } from "./mitt";

export type Events = {
  mouseDrag: { x: number; y: number; target: HTMLElement; initx: number; inity: number; matrix: DOMMatrix };
  mouseUp: { x: number; y: number };
  mouseDown: { target: HTMLElement };
  doubleClick: { id: string };
  contextMenu: { e: React.MouseEvent<HTMLDivElement, MouseEvent> };
};

export const eventBus: Emitter<Events> = mitt<Events>();
