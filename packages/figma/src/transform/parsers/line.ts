/**
 * 线条节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";
import { colorToString } from "../utils";

/**
 * 线条节点解析器类
 */
export class LineNodeParser extends BaseNodeParser<LineNode> {
  /**
   * 解析线条节点特有属性
   * @param node 线条节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: LineNode, parsedNode: ParsedNode): void {
    // 尺寸
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 扩展样式
    if (parsedNode.style) {
      // 尺寸
      parsedNode.style.width = `${node.width}px`;
      parsedNode.style.height = `${node.height}px`;

      // 线条样式
      if (node.strokes && node.strokes.length > 0) {
        const stroke = node.strokes[0];
        if (stroke.type === "SOLID") {
          parsedNode.style.backgroundColor = "transparent";

          // 判断线条方向
          if (node.width > node.height) {
            // 水平线
            parsedNode.style.height = `${node.strokeWeight}px`;
            parsedNode.style.backgroundColor = colorToString(stroke.color);
          } else {
            // 垂直线
            parsedNode.style.width = `${node.strokeWeight}px`;
            parsedNode.style.backgroundColor = colorToString(stroke.color);
          }
        }
      }

      // 线条端点样式
      if (node.strokeCap) {
        switch (node.strokeCap) {
          case "ROUND":
            parsedNode.style.borderRadius = `${node.strokeWeight / 2}px`;
            break;
          case "SQUARE":
            parsedNode.style.borderRadius = "0";
            break;
          // 其他端点样式可以在这里处理
        }
      }
    }
  }
}
