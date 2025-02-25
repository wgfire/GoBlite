/**
 * 图片节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 图像节点解析器
 */
export class ImageNodeParser extends BaseNodeParser<SceneNode> {
  /**
   * 解析图片节点特有属性
   * @param node 带有图片填充的节点
   * @param parsedNode 解析后的节点数据
   */
  protected async parseSpecificProps(node: SceneNode, parsedNode: ParsedNode): Promise<void> {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 设置图像特有属性
    parsedNode.type = "IMAGE"; // 强制设置为图像类型

    try {
      // 导出图像为 PNG
      const imageData = await node.exportAsync({
        format: "PNG",
        constraint: { type: "SCALE", value: 1 }
      });

      // 转换为 base64
      const base64Image = `data:image/png;base64,${figma.base64Encode(imageData)}`;
      parsedNode.src = base64Image;

      // 保存图像信息到 JSON 输出，方便后续处理
      parsedNode.imageData = {
        format: "PNG",
        width: node.width,
        height: node.height,
        aspectRatio: node.width / node.height,
        originalNodeType: node.type
      };
    } catch (error) {
      console.error("导出图像失败:", error);
    }
  }

  /**
   * 导出图像并上传到服务器（预留接口）
   * @param node Figma节点
   * @param options 导出选项
   * @returns 上传后的图像URL
   */
  public static async exportAndUpload(
    node: SceneNode,
    options: {
      format?: "PNG" | "JPG" | "SVG" | "PDF";
      quality?: number;
      scale?: number;
      uploadEndpoint?: string;
      uploadHeaders?: Record<string, string>;
      uploadParams?: Record<string, string>;
    } = {}
  ): Promise<string> {
    const { format = "PNG", scale = 1, uploadEndpoint, uploadHeaders = {}, uploadParams = {} } = options;

    try {
      // 导出图像
      const imageData = await node.exportAsync({
        format,
        constraint: { type: "SCALE", value: scale }
      });

      // 如果没有提供上传端点，则返回 base64 数据
      if (!uploadEndpoint) {
        return `data:image/${format.toLowerCase()};base64,${figma.base64Encode(imageData)}`;
      }

      // 预留：上传图像到服务器的逻辑
      // 这部分代码将在后续实现，目前仅返回 base64 数据
      console.log("图像将上传到:", uploadEndpoint);
      console.log("上传参数:", uploadParams);
      console.log("上传头信息:", uploadHeaders);

      // 模拟上传成功，返回 base64 数据
      return `data:image/${format.toLowerCase()};base64,${figma.base64Encode(imageData)}`;
    } catch (error) {
      console.error("导出或上传图像失败:", error);
      throw error;
    }
  }
}
