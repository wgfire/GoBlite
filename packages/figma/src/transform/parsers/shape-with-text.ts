import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 带文本的形状节点解析器
 */
export class ShapeWithTextNodeParser extends BaseNodeParser<ShapeWithTextNode> {
  protected parseSpecificProps(node: ShapeWithTextNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 带文本的形状特有属性
    if (node.text) {
      parsedNode.characters = node.text.characters;
    }

    if (node.shapeType) {
      parsedNode.shapeType = node.shapeType;
    }

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.shapeWithTextData = {
      characters: node.text ? node.text.characters : "",
      shapeType: node.shapeType
    };
  }
}
