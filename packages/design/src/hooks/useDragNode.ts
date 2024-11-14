import { useEditor } from "@craftjs/core";
import { useRef } from "react";

export const useDragNode = () => {
  const {
    query,
    actions: { setProp }
  } = useEditor();
  const currentTransform = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragNode = ({
    x,
    y,
    initx,
    inity,
    target,
    matrix
  }: {
    x: number;
    y: number;
    target: HTMLElement;
    initx: number;
    inity: number;
    matrix: DOMMatrix;
  }) => {
    currentTransform.current = { x: matrix.e, y: matrix.f };

    const node = query.getNodes()[target.dataset!.id!];
    const offsetX = x - initx;
    const offsetY = y - inity;
    console.log(offsetX, offsetY, "offset");

    // todo 限制拖动范围
    const translateX = offsetX + currentTransform.current.x;
    const translateY = offsetY + currentTransform.current.y;

    setProp(node.id, p => {
      p.customStyle!.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  };

  return {
    dragNode
  };
};
