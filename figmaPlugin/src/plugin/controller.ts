// import { deepCloneWithEnumerableProperties } from "@/lib/utils";
import { EventManager } from "./message";
import { ExportPreview } from "@/components/module/Preview";
// import { clone } from "lodash-es";

figma.showUI(__html__, {
  width: 1000,
  height: 1000,
});
const message = new EventManager();
/**
 * 导出选中节点下的所有图片。
 * @param selectedNodes
 * @param result
 * @returns
 */
async function exportHandel(
  selectedNodes: readonly SceneNode[],
  arg2?: ExportPreview[] | ((data: ExportPreview[]) => void),
  arg3?: (data: ExportPreview[]) => void
): Promise<ExportPreview[]> {
  const result: ExportPreview[] = Array.isArray(arg2) ? arg2 : [];
  const callback = typeof arg2 === "function" ? arg2 : arg3;
  console.log(selectedNodes, "选中的节点");
  for (const node of selectedNodes) {
    const res = await node.exportAsync({ format: "PNG" });
    const base64Image = figma.base64Encode(res);
    result.push({ src: base64Image, name: node.name, id: node.id });
  }

  if (callback) {
    callback(result);
  }

  return result;
}
const initUIData = () => {
  const currentPage = figma.currentPage;
  const selectedNodes = currentPage.selection[0];
  //@ts-ignore
  const allChildren = currentPage.selection[0].parent.children.map((item) => {
    //@ts-ignore
    return item.children.map((child) => {
      return {
        value: child.id,
        label: child.name,
      };
    });
  }).flat();
  // const prototype = Object.getPrototypeOf(selectedNodes);
  console.log(currentPage, "当前页面", allChildren);
  if (selectedNodes) {
    figma.ui.postMessage({
      type: "init",
      data: {
        id: selectedNodes.id,
        name: currentPage.name,
        width: selectedNodes.width,
        height: selectedNodes.height,
        allChildren: allChildren,
        selection: selectedNodes,
      },
    });
  }
};
const initPreview = () => {
  //@ts-ignore
  const selectedNodes = figma.currentPage.selection[0].children;
  if (selectedNodes.length > 0) {
    exportHandel(selectedNodes, (data) => {
      figma.ui.postMessage({
        type: "FigmaPreview",
        data,
      });
    });
  }
};

figma.ui.onmessage = (msg) => {
  const { type } = msg;
  message.addHandler("init", () => {
    initUIData();
    initPreview();
  });
  message.trigger(type);
};

figma.on("selectionchange", () => {
  initUIData();
  initPreview();
});
//figma.closePlugin();
