import { EventManager } from "./message";
import { ExportPreviewType } from "@/components/module/Preview";

figma.showUI(__html__, {
  width: 1000,
  height: 1000
});

/**有其他类型的arg后可不传此泛型 */
const message = new EventManager<string[]>();

/**
 * 导出选中节点下的所有图片。
 * @param selectedNodes
 * @param result
 * @returns
 */
async function exportHandel(
  selectedNodes: readonly SceneNode[],
  arg2?: ExportPreviewType[] | ((data: ExportPreviewType[]) => void),
  arg3?: (data: ExportPreviewType[]) => void
): Promise<ExportPreviewType[]> {
  const result: ExportPreviewType[] = Array.isArray(arg2) ? arg2 : [];
  const callback = typeof arg2 === "function" ? arg2 : arg3;
  console.log(selectedNodes, "选中的节点");
  for (const node of selectedNodes) {
    const res = await node.exportAsync({ format: "PNG" });
    const base64Image = `data:image/png;base64,${figma.base64Encode(res)}`;
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
  //@ts-expect-error ts类型有误
  const allChildren = currentPage.selection[0].parent.children
    .map(item => {
      //@ts-expect-error ts类型有误
      return item.children.map(child => {
        return {
          value: child.id,
          label: child.name
        };
      });
    })
    .flat();
  //@ts-expect-error ts类型有误
  const previewData = selectedNodes.children.map(el => {
    return {
      value: el.id,
      label: el.name
    };
  });

  console.log(currentPage, "当前页面", previewData, figma.fileKey, "文件key");

  if (selectedNodes) {
    figma.ui.postMessage({
      type: "init",
      data: {
        fileKey: figma.fileKey,
        id: selectedNodes.id,
        name: currentPage.name,
        width: selectedNodes.width,
        height: selectedNodes.height,
        allChildren: allChildren,
        selection: selectedNodes,
        previewData: previewData
      }
    });
  }
};
const initPreview = (nodes?: BaseNode[]) => {
  //@ts-expect-error ts类型有误
  const selectedNodes = nodes || figma.currentPage.selection[0].children;
  if (selectedNodes.length > 0) {
    exportHandel(selectedNodes, data => {
      figma.ui.postMessage({
        type: "FigmaPreview",
        data
      });
    });
  }
};

figma.ui.onmessage = msg => {
  const { type, data } = msg;
  console.log(type, data, "插件接收消息");
  message.trigger(type, data);
};

figma.on("selectionchange", () => {
  initUIData();
  initPreview();
});

message.addHandler("init", () => {
  initUIData();
  initPreview();
});

message.addHandler("FigmaPreview", async arg => {
  const sceneNodePromise = arg.map(async (el: string) => {
    const result = await figma.getNodeByIdAsync(el);
    return result;
  });
  const sceneNode = (await Promise.all(sceneNodePromise)).filter(node => !!node);
  initPreview(sceneNode);
});

//figma.closePlugin();
