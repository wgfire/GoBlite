import { EventManager } from "./message";
import { ExportPreviewType } from "@/components/module/Preview";
import { ParseManager } from "../transform";

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

  // 处理显示通知的消息
  if (type === "showNotification") {
    const { message, success } = msg;
    if (success) {
      figma.notify(message);
    } else {
      figma.notify(message, { error: true });
    }
    return;
  }

  message.trigger(type, data);
};

figma.on("selectionchange", () => {
  console.log("selectionchange", figma.currentPage.selection);
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

/**
 * 解析Figma节点为HTML并复制到剪贴板
 * @param nodeId 节点ID
 */
async function parseNodeToHtml(nodeId: string): Promise<void> {
  try {
    // 获取节点
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || !("type" in node)) {
      throw new Error("无效的节点ID");
    }

    // 创建解析管理器
    const parseManager = new ParseManager({
      outputFormat: "HTML",
      htmlOptions: {
        inlineStyles: true,
        prettify: true,
        includeComments: true
      }
    });

    // 解析节点并复制到剪贴板
    await parseManager.parseAndCopy(node as SceneNode);

    // 通知UI
    figma.notify("已成功解析节点并复制到剪贴板");

    figma.ui.postMessage({
      type: "parseComplete",
      success: true,
      message: "已成功解析节点并复制到剪贴板"
    });
  } catch (error: unknown) {
    console.error("解析节点失败:", error);

    // 显示错误通知
    figma.notify(`解析失败: ${error.message || "未知错误"}`, { error: true });

    figma.ui.postMessage({
      type: "parseComplete",
      success: false,
      message: `解析失败: ${error.message || "未知错误"}`
    });
  }
}

/**
 * 解析Figma节点为JSON并复制到剪贴板
 * @param nodeId 节点ID
 */
async function parseNodeToJson(nodeId: string): Promise<void> {
  try {
    // 获取节点
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || !("type" in node)) {
      throw new Error("无效的节点ID");
    }

    // 创建解析管理器
    const parseManager = new ParseManager({
      outputFormat: "JSON"
    });

    // 解析节点并复制到剪贴板
    await parseManager.parseAndCopy(node as SceneNode);

    // 显示成功通知
    figma.notify("已成功解析节点为JSON并复制到剪贴板");

    // 通知UI
    figma.ui.postMessage({
      type: "parseComplete",
      success: true,
      message: "已成功解析节点为JSON并复制到剪贴板"
    });
  } catch (error: unknown) {
    console.error("解析节点失败:", error);

    // 显示错误通知
    figma.notify(`解析失败: ${error.message || "未知错误"}`, { error: true });

    figma.ui.postMessage({
      type: "parseComplete",
      success: false,
      message: `解析失败: ${error.message || "未知错误"}`
    });
  }
}

/**
 * 导出节点中的所有图像
 * @param nodeId 节点ID
 */
async function exportNodeImages(nodeId: string): Promise<void> {
  try {
    // 获取节点
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || !("type" in node)) {
      throw new Error("无效的节点ID");
    }

    // 创建解析管理器
    const parseManager = new ParseManager();

    // 导出所有图像
    const imageMap = await parseManager.exportImages(node as SceneNode, {
      format: "PNG",
      scale: 2
    });

    // 将图像数据发送到UI
    figma.ui.postMessage({
      type: "exportedImages",
      success: true,
      data: imageMap,
      message: `成功导出 ${Object.keys(imageMap).length} 个图像`
    });

    // 显示成功通知
    figma.notify(`成功导出 ${Object.keys(imageMap).length} 个图像`);
  } catch (error: unknown) {
    console.error("导出图像失败:", error);

    // 显示错误通知
    figma.notify(`导出图像失败: ${error.message || "未知错误"}`, { error: true });

    figma.ui.postMessage({
      type: "exportedImages",
      success: false,
      message: `导出图像失败: ${error.message || "未知错误"}`
    });
  }
}

// 添加解析处理器
message.addHandler("parseToHtml", (args: string[]) => {
  if (args && args.length > 0) {
    parseNodeToHtml(args[0]);
  }
});

message.addHandler("parseToJson", (args: string[]) => {
  if (args && args.length > 0) {
    parseNodeToJson(args[0]);
  }
});

// 添加导出图像处理器
message.addHandler("exportImages", (args: string[]) => {
  if (args && args.length > 0) {
    exportNodeImages(args[0]);
  }
});

//figma.closePlugin();
