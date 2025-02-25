import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";

/**
 * 便签节点解析器
 */
export class StickyNodeParser extends BaseNodeParser<StickyNode> {
  protected parseSpecificProps(node: StickyNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 便签特有属性
    if (node.text) {
      parsedNode.characters = node.text.characters;
    }

    // 保存原始信息到 JSON 输出，方便后续处理
    parsedNode.stickyData = {
      characters: node.text ? node.text.characters : "",
      authorName: node.authorName,
      authorId: node.authorId
    };
  }
}
