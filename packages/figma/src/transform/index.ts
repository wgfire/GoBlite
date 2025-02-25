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
    // 创建对应类型的解析器
    const parser = createParserByNodeType(node);

    // 解析节点为JSON对象
    const parsedNode = await this.parseNodeWithChildren(node, parser);

    // 根据配置决定输出格式
    if (this.config.outputFormat === "JSON") {
      return parsedNode;
    } else {
      // 转换为HTML字符串
      return jsonToHtml(parsedNode, this.config.htmlOptions);
    }
  }

  /**
   * 递归解析节点及其子节点
   * @param node Figma节点
   * @param parser 节点解析器
   * @returns 解析后的节点
   */
  private async parseNodeWithChildren(node: SceneNode, parser: unknown): Promise<ParsedNode> {
    // 解析当前节点
    const parsedNode = parser.parse(node);

    // 如果节点有子节点，递归解析
    if ("children" in node && Array.isArray(node.children) && node.children.length > 0) {
      const childPromises = node.children
        .filter(child => child.visible !== false) // 过滤掉不可见的节点
        .map(async child => {
          const childParser = createParserByNodeType(child);
          return this.parseNodeWithChildren(child, childParser);
        });

      parsedNode.children = await Promise.all(childPromises);
    }

    return parsedNode;
  }

  /**
   * 解析Figma节点并复制到剪贴板
   * @param node Figma节点
   * @returns 解析结果的Promise
   */
  public async parseAndCopy(node: SceneNode): Promise<void> {
    const result = await this.parse(node);
    const textToCopy = typeof result === "string" ? result : JSON.stringify(result, null, 2);
    await copyToClipboard(textToCopy);
  }

  /**
   * 批量解析多个Figma节点
   * @param nodes Figma节点数组
   * @returns 解析结果数组
   */
  public async parseMultiple(nodes: SceneNode[]): Promise<(ParsedNode | string)[]> {
    const promises = nodes.map(node => this.parse(node));
    return Promise.all(promises);
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

// 导出类型定义
export * from "./types";
// 导出工具函数
export * from "./utils";
// 导出解析器
export * from "./parsers/base";
