// import { deepCloneWithEnumerableProperties } from "@/lib/utils";
import { EventManager } from "./message";
import { ExportData } from "@/components/module/Preview";
figma.showUI(__html__, {
  width: 1000,
  height: 1000,
});


/**
 * 导出选中节点下的所有图片。
 * @param selectedNodes
 * @param result
 * @returns
 */
async function exportHandel(
  selectedNodes: readonly SceneNode[],
  arg2?: ExportData[] | ((data: ExportData[]) => void),
  arg3?: (data: ExportData[]) => void
): Promise<ExportData[]> {
  const result: ExportData[] = Array.isArray(arg2) ? arg2 : [];
  const callback = typeof arg2 === "function" ? arg2 : arg3;
  console.log(selectedNodes, "选中的节点");
  for (const node of selectedNodes) {
    const res = await node.exportAsync({ format: "PNG" });
    const base64Image = figma.base64Encode(res);
    result.push({ props: { src: base64Image, name: node.name } });
  }

  if (callback) {
    callback(result);
  }

  return result;
}
const message = new EventManager();

figma.ui.onmessage = (msg) => {
  const currentPage = figma.currentPage;
  const selectedNodes = currentPage.selection[0];
  console.log(currentPage, "当前页面");
  const { type } = msg;

  message.addHandler("init", () => {
    figma.ui.postMessage({
      type: "init",
      data: { id: selectedNodes.id, name: currentPage.name, width: selectedNodes.width, height: selectedNodes.height },
    });
  });
  message.addHandler("FigmaExport", () => {
    //@ts-ignore
    const selectedNodes = figma.currentPage.selection[0].children;
    if (selectedNodes.length > 0) {
      exportHandel(selectedNodes, (data) => {
        figma.ui.postMessage({
          type: "FigmaExport",
          data
        });
      });
    }
  });

  message.trigger(type);
};

//figma.closePlugin();
