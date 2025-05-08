import { EventManager, MyEventMap } from "./message";
import { ImageParser } from "../transform/ImageParses";
import { debounce } from "lodash-es";

figma.showUI(__html__, {
  width: 600,
  height: 600
});

const message = new EventManager<MyEventMap>({ debug: true });

// 设置解析状态
enum ParseStatus {
  IDLE = "idle",
  PARSING = "parsing",
  SUCCESS = "success",
  ERROR = "error",
  EMPTY = "empty"
}

// 使用防抖函数包装选择变化的处理逻辑
const handleSelectionChange = debounce(() => {
  try {
    const nodes = figma.currentPage.selection as SceneNode[];
    console.log("选中的节点数量:", nodes?.length);

    if (!nodes || nodes.length === 0) {
      console.log("没有选中节点");
      // 发送空状态消息到UI
      figma.ui.postMessage({
        type: "autoParserEmpty",
        message: "请选择一个节点"
      });
      return;
    }
    console.log(`将解析节点: ${nodes})`);
    message.trigger("parseToImage", nodes);
  } catch (error) {
    console.error("处理选择变化事件时出错:", error);
    figma.ui.postMessage({
      type: "autoParserError",
      error: error instanceof Error ? error.message : "处理选择变化时出错"
    });
  }
}, 1000); // 1000毫秒的防抖延迟
/**
 * 解析Figma节点为HTML并复制到剪贴板
 * @param node 节点对象
 */
async function parseToImage(node: SceneNode[]): Promise<void> {
  try {
    // 验证输入节点
    if (!node) {
      throw new Error("节点不存在");
    }

    console.log(`开始解析节点: ${node}`);

    // 通知UI开始解析
    figma.ui.postMessage({
      type: "autoParserParsing",
      status: ParseStatus.PARSING,
      message: "正在解析节点..."
    });

    // 解析节点并复制到剪贴板
    try {
      // 创建解析管理器
      console.log("selectionchange", figma.currentPage.selection);
      const imageParser = new ImageParser(node as SceneNode[], {});
      const data = await imageParser.parse();
      console.log(data, "解析后的数据");

      // 发送解析结果到UI
      figma.ui.postMessage({
        type: "autoParserResult",
        data: data
      });
    } catch (parseError) {
      console.error("解析节点失败:", parseError);

      // 发送错误信息到UI
      figma.ui.postMessage({
        type: "autoParserError",
        error: parseError instanceof Error ? parseError.message : "解析节点失败"
      });

      throw parseError; // 将错误向上传递
    }
  } catch (error: unknown) {
    console.error("解析节点失败:", error);
    // 显示错误通知
    figma.notify(`解析失败: ${error instanceof Error ? error.message : "未知错误"}`, { error: true });

    // 发送错误信息到UI
    figma.ui.postMessage({
      type: "autoParserError",
      error: error instanceof Error ? error.message : "未知错误"
    });
  }
}
message.addHandler("parseToImage", async (node: SceneNode[]) => {
  try {
    console.log("收到parseToImage请求:");

    // 验证输入节点
    if (!node) {
      throw new Error("未提供节点");
    }

    // 执行解析
    await parseToImage(node);
  } catch (error) {
    console.error("处理parseToHtml事件失败:", error);

    // 显示错误通知
    figma.notify(`解析失败: ${error instanceof Error ? error.message : "未知错误"}`, { error: true });

    // 发送错误信息到UI
    figma.ui.postMessage({
      type: "autoParserError",
      error: error instanceof Error ? error.message : "处理parseToHtml事件失败"
    });
  }
});

// 监听选择变化事件
figma.on("selectionchange", handleSelectionChange);
// 监听UI到插件的消息
figma.ui.onmessage = msg => {
  const { type, data } = msg;
  console.log(type, data, "插件接收消息");
  message.trigger(type, data);
};

// 处理来自UI的初始化消息
message.addHandler("init", () => {
  console.log("收到UI初始化请求");

  // 检查当前是否有选中的节点
  const nodes = figma.currentPage.selection as SceneNode[];

  if (!nodes || nodes.length === 0) {
    // 发送空状态消息到UI
    figma.ui.postMessage({
      type: "autoParserEmpty",
      message: "请选择一个节点"
    });
    return;
  }

  // 有选中节点，触发解析
  handleSelectionChange();
});
