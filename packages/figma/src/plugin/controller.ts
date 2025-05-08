import { EventManager } from "./message";
import { ExportPreviewType } from "@/components/module/Preview";
import { debounce } from "lodash-es";
figma.showUI(__html__, {
  width: 1000,
  height: 1000
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
      const strData = JSON.stringify(data);
      console.log(strData, "字符串数据");
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

// 使用防抖函数包装选择变化的处理逻辑
const handleSelectionChange = debounce(() => {
  console.log("selectionchange", figma.currentPage.selection);
  // 检查是否有选中的节点
  if (figma.currentPage.selection.length > 0) {
    initUIData();
    initPreview();
  }
}, 300); // 300毫秒的防抖延迟

figma.on("selectionchange", handleSelectionChange);

message.addHandler("init", () => {
  initUIData();
  initPreview();
});

//figma.closePlugin();
