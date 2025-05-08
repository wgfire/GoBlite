/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Figma节点解析器入口文件
 */
import { ParseManagerConfig, ParsedNode } from "./types";
import { createParserByNodeType } from "./parsers/base";
import { jsonToHtml, copyToClipboard } from "./utils";
import { ImageNodeParser } from "./parsers/image";

/**
 * 解析管理器类
 * 负责协调各种类型的节点解析器，将Figma节点转换为HTML或JSON
 */
export class ParseManager {
  private config: ParseManagerConfig;

  /**
   * 构造函数
   * @param config 解析配置
   */
  constructor(config: ParseManagerConfig = { outputFormat: "HTML" }) {
    this.config = config;
  }

  /**
   * 解析Figma节点
   * @param node Figma节点
   * @returns 解析结果（JSON对象或HTML字符串）
   */
  public async parse(node: SceneNode): Promise<ParsedNode | string> {
    try {
      // 验证输入节点
      if (!node || typeof node !== "object" || !("id" in node) || !("type" in node)) {
        console.error("无效的Figma节点:", node);
        throw new Error("无效的Figma节点");
      }

      // 创建对应类型的解析器
      const parser = createParserByNodeType(node);

      // 解析节点为JSON对象
      const parsedNode = await this.parseNodeWithChildren(node, parser);

      // 根据配置决定输出格式
      if (this.config.outputFormat === "JSON") {
        return parsedNode;
      } else {
        // 转换为HTML字符串
        try {
          return jsonToHtml(parsedNode, this.config.htmlOptions);
        } catch (htmlError) {
          console.error("转换为HTML时出错:", htmlError);
          // 如果HTML转换失败，返回JSON
          return JSON.stringify(parsedNode, null, 2);
        }
      }
    } catch (error) {
      console.error("解析节点时出错:", error);
      // 返回错误信息
      const errorNode: ParsedNode = {
        name: node?.name || "error",
        id: node?.id || "error",
        type: node?.type || "unknown",
        tag: "div",
        error: error instanceof Error ? error.message : "未知错误"
      };

      // 根据配置决定输出格式
      if (this.config.outputFormat === "JSON") {
        return errorNode;
      } else {
        return `<div class="parse-error">${errorNode.error}</div>`;
      }
    }
  }

  /**
   * 递归解析节点及其子节点
   * @param node Figma节点
   * @param parser 节点解析器
   * @returns 解析后的节点
   */
  private async parseNodeWithChildren(node: SceneNode, parser: unknown): Promise<ParsedNode> {
    try {
      // 验证解析器是否有效
      if (!parser || typeof parser !== "object" || typeof (parser as any).parse !== "function") {
        console.error("无效的解析器:", parser);
        throw new Error("无效的解析器");
      }

      // 安全地调用解析器的parse方法
      const parsedNode = await (parser as any).parse(node);

      // 验证解析结果
      if (!parsedNode || typeof parsedNode !== "object") {
        console.error("解析结果无效:", parsedNode);
        throw new Error("解析结果无效");
      }

      // 如果节点有子节点，递归解析
      if (
        node &&
        typeof node === "object" &&
        "children" in node &&
        Array.isArray(node.children) &&
        node.children.length > 0
      ) {
        // 创建一个安全的子节点数组
        const validChildren = node.children.filter(
          child => child && typeof child === "object" && "id" in child && child.visible !== false
        );

        if (validChildren.length > 0) {
          const childPromises = validChildren.map(async child => {
            try {
              const childParser = createParserByNodeType(child);
              return await this.parseNodeWithChildren(child, childParser);
            } catch (childError) {
              console.error(`解析子节点 ${child.id || "未知"} 时出错:`, childError);
              // 返回一个最小化的有效节点，避免整个解析过程失败
              return { id: child.id || "unknown", type: child.type || "unknown", tag: "div" };
            }
          });

          // 确保children属性存在
          if (!parsedNode.children) {
            parsedNode.children = [];
          }

          // 等待所有子节点解析完成
          const childResults = await Promise.all(childPromises);
          parsedNode.children = childResults.filter(result => result !== null);
        }
      }

      return parsedNode;
    } catch (error) {
      console.error(`解析节点 ${node?.id || "未知"} 时出错:`, error);
      // 返回一个最小化的有效节点，避免整个解析过程失败
      return {
        name: node?.name || "error",
        id: node?.id || "error",
        type: node?.type || "unknown",
        tag: "div",
        error: error instanceof Error ? error.message : "未知错误"
      };
    }
  }

  /**
   * 解析Figma节点并复制到剪贴板
   * @param node Figma节点
   * @returns 解析结果的Promise
   */
  public async parseAndCopy(node: SceneNode): Promise<void> {
    try {
      // 验证输入节点
      if (!node || typeof node !== "object" || !("id" in node)) {
        console.error("无效的Figma节点:", node);
        throw new Error("无效的Figma节点");
      }

      const result = await this.parse(node);
      const textToCopy = typeof result === "string" ? result : JSON.stringify(result, null, 2);
      await copyToClipboard(textToCopy);
      console.log(`成功解析并复制节点 ${node.id}`);
    } catch (error) {
      console.error("解析并复制节点时出错:", error);
      throw error; // 重新抛出错误，让调用者处理
    }
  }

  /**
   * 批量解析多个Figma节点
   * @param nodes Figma节点数组
   * @returns 解析结果数组
   */
  public async parseMultiple(nodes: SceneNode[]): Promise<(ParsedNode | string)[]> {
    try {
      // 验证输入节点数组
      if (!Array.isArray(nodes)) {
        console.error("无效的Figma节点数组:", nodes);
        throw new Error("无效的Figma节点数组");
      }

      // 过滤掉无效节点
      const validNodes = nodes.filter(node => node && typeof node === "object" && "id" in node);

      if (validNodes.length === 0) {
        console.warn("没有有效的节点可以解析");
        return [];
      }

      // 使用Promise.allSettled确保即使部分节点解析失败，也能获得其他节点的结果
      const results = await Promise.allSettled(validNodes.map(node => this.parse(node)));

      // 处理结果
      return results.map((result, index) => {
        if (result.status === "fulfilled") {
          return result.value;
        } else {
          console.error(`解析节点 ${validNodes[index]?.id || "未知"} 时出错:`, result.reason);
          // 返回错误信息
          const errorNode: ParsedNode = {
            name: validNodes[index]?.name || "error",
            id: validNodes[index]?.id || "error",
            type: validNodes[index]?.type || "unknown",
            tag: "div",
            error: result.reason instanceof Error ? result.reason.message : "未知错误"
          };

          return this.config.outputFormat === "JSON" ? errorNode : `<div class="parse-error">${errorNode.error}</div>`;
        }
      });
    } catch (error) {
      console.error("批量解析节点时出错:", error);
      throw error;
    }
  }

  /**
   * 导出节点中的所有图像
   * @param node Figma节点
   * @param options 导出选项
   * @returns 导出的图像数据
   */
  public async exportImages(
    node: SceneNode,
    options: {
      format?: "PNG" | "JPG" | "SVG" | "PDF";
      quality?: number;
      scale?: number;
      uploadEndpoint?: string;
    } = {}
  ): Promise<Record<string, string>> {
    const imageMap: Record<string, string> = {};

    // 递归查找所有可导出的节点
    const collectExportableNodes = (node: SceneNode): SceneNode[] => {
      let nodes: SceneNode[] = [];

      // 检查当前节点是否可导出
      if (node.exportSettings && node.exportSettings.length > 0) {
        nodes.push(node);
      }

      // 检查是否有图片填充
      if (
        "fills" in node &&
        node.fills &&
        Array.isArray(node.fills) &&
        node.fills.some((fill: Paint) => fill.type === "IMAGE")
      ) {
        nodes.push(node);
      }

      // 递归检查子节点
      if ("children" in node && Array.isArray(node.children)) {
        for (const child of node.children) {
          nodes = nodes.concat(collectExportableNodes(child));
        }
      }

      return nodes;
    };

    const exportableNodes = collectExportableNodes(node);

    // 导出所有可导出的节点
    for (const exportableNode of exportableNodes) {
      try {
        const imageUrl = await ImageNodeParser.exportAndUpload(exportableNode, options);
        imageMap[exportableNode.id] = imageUrl;
      } catch (error) {
        console.error(`导出节点 ${exportableNode.id} 失败:`, error);
      }
    }

    return imageMap;
  }

  /**
   * 获取解析配置
   * @returns 当前配置
   */
  public getConfig(): ParseManagerConfig {
    return { ...this.config };
  }

  /**
   * 更新解析配置
   * @param config 新配置
   */
  public updateConfig(config: Partial<ParseManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
