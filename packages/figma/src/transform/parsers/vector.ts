/**
 * 矢量节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode, ParsedVectorNode } from "../types";

/**
 * 矢量节点解析器类
 */
export class VectorNodeParser extends BaseNodeParser<VectorNode> {
  /**
   * 解析矢量节点特有属性
   * @param node 矢量节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: VectorNode, parsedNode: ParsedNode): void {
    const vectorNode = parsedNode as ParsedVectorNode;

    // 尺寸
    vectorNode.width = node.width;
    vectorNode.height = node.height;

    // 扩展样式
    if (vectorNode.style) {
      // 尺寸
      vectorNode.style.width = `${node.width}px`;
      vectorNode.style.height = `${node.height}px`;
    }

    // 尝试获取SVG数据
    // 注意：这需要Figma API支持，在实际使用时需要通过Figma API获取SVG
    this.getSvgData(node)
      .then(svg => {
        if (svg) {
          vectorNode.svg = svg;
        }
      })
      .catch(error => {
        console.error("获取SVG数据失败:", error);
      });
  }

  /**
   * 获取矢量节点的SVG数据
   * @param node 矢量节点
   * @returns SVG字符串的Promise
   */
  private async getSvgData(node: VectorNode): Promise<string | null> {
    try {
      // 这里需要通过Figma API获取SVG数据
      // 在实际使用时，可以使用figma.getNodeById(node.id).exportAsync({ format: 'SVG' })
      // 然后将二进制数据转换为字符串

      // 模拟获取SVG数据
      // 实际实现时需要替换为真实的API调用
      console.log(node);
      return null;
    } catch (error) {
      console.error("获取SVG数据失败:", error);
      return null;
    }
  }
}
