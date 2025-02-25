/**
 * 组件实例节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode, ParsedInstanceNode } from "../types";

/**
 * 组件实例节点解析器类
 */
export class InstanceNodeParser extends BaseNodeParser<InstanceNode> {
  /**
   * 解析组件实例节点特有属性
   * @param node 组件实例节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: InstanceNode, parsedNode: ParsedNode): void {
    const instanceNode = parsedNode as ParsedInstanceNode;

    // 尺寸
    instanceNode.width = node.width;
    instanceNode.height = node.height;

    // 组件ID
    instanceNode.componentId = node.componentId;

    // 扩展样式
    if (instanceNode.style) {
      // 尺寸
      instanceNode.style.width = `${node.width}px`;
      instanceNode.style.height = `${node.height}px`;
    }

    // 添加组件实例特有的属性
    // 可以添加组件属性覆盖等信息
    if (node.overrides && node.overrides.length > 0) {
      instanceNode.overrides = node.overrides;
    }
  }
}
