/**
 * 基础节点解析器
 */
import { ParsedNode, CSSProperties } from "../types";
import {
  nodeBasicStyleToCss,
  paintToCss,
  strokeToCss,
  effectsToCss,
  constraintsToCss,
  generateClassName
} from "../utils";

/**
 * 基础节点解析器类
 * 提供通用的节点解析功能
 */
export abstract class BaseNodeParser<T extends SceneNode> {
  /**
   * 解析节点
   * @param node Figma节点
   * @returns 解析后的节点数据
   */
  public parse(node: T): ParsedNode {
    // 基本属性
    const parsedNode: ParsedNode = {
      id: node.id,
      name: node.name,
      type: node.type,
      style: this.parseStyle(node),
      className: generateClassName(node)
    };

    // 解析特定类型的属性
    this.parseSpecificProps(node, parsedNode);

    // 解析子节点
    if (this.hasChildren(node)) {
      parsedNode.children = this.parseChildren(node);
    }

    return parsedNode;
  }

  /**
   * 解析节点样式
   * @param node Figma节点
   * @returns CSS样式对象
   */
  protected parseStyle(node: T): CSSProperties {
    let style: CSSProperties = {
      position: "absolute", // 默认使用绝对定位
      ...nodeBasicStyleToCss(node)
    };

    // 填充
    if ("fills" in node && node.fills && Array.isArray(node.fills)) {
      style = { ...style, ...paintToCss(node.fills) };
    }

    // 描边
    style = { ...style, ...strokeToCss(node) };

    // 效果（阴影、模糊等）
    if ("effects" in node && node.effects && Array.isArray(node.effects)) {
      style = { ...style, ...effectsToCss(node.effects) };
    }

    // 约束
    style = { ...style, ...constraintsToCss(node) };

    // 圆角
    if ("cornerRadius" in node && node.cornerRadius !== undefined && typeof node.cornerRadius === "number") {
      style.borderRadius = `${String(node.cornerRadius)}px`;
    } else if (
      "topLeftRadius" in node &&
      node.topLeftRadius !== undefined &&
      node.topRightRadius !== undefined &&
      node.bottomLeftRadius !== undefined &&
      node.bottomRightRadius !== undefined
    ) {
      // 处理不同角的圆角
      const { topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius } = node;
      style.borderRadius = `${topLeftRadius}px ${topRightRadius}px ${bottomRightRadius}px ${bottomLeftRadius}px`;
    }

    return style;
  }

  /**
   * 检查节点是否有子节点
   * @param node Figma节点
   * @returns 是否有子节点
   */
  protected hasChildren(node: T): boolean {
    return "children" in node && Array.isArray((node as unknown).children) && (node as unknown).children.length > 0;
  }

  /**
   * 解析子节点
   * @param node Figma节点
   * @returns 解析后的子节点数组
   */
  protected parseChildren(node: T): ParsedNode[] {
    if (!this.hasChildren(node)) return [];

    const children = (node as unknown).children as SceneNode[];
    return children
      .filter(child => child.visible !== false) // 过滤掉不可见的节点
      .map(child => {
        // 根据节点类型创建对应的解析器
        const parser = createParserByNodeType(child);
        return parser.parse(child);
      });
  }

  /**
   * 解析特定类型节点的属性
   * 由子类实现
   * @param node Figma节点
   * @param parsedNode 解析后的节点数据
   */
  protected abstract parseSpecificProps(node: T, parsedNode: ParsedNode): void;
}

// 导入所有解析器
import { TextNodeParser } from "./text";
import { RectangleNodeParser } from "./rectangle";
import { FrameNodeParser } from "./frame";
import { GroupNodeParser } from "./group";
import { EllipseNodeParser } from "./ellipse";
import { VectorNodeParser } from "./vector";
import { ComponentNodeParser } from "./component";
import { InstanceNodeParser } from "./instance";
import { ImageNodeParser } from "./image";
import { LineNodeParser } from "./line";
import { PolygonNodeParser } from "./polygon";
import { StarNodeParser } from "./star";
import { BooleanOperationNodeParser } from "./boolean-operation";
import { ComponentSetNodeParser } from "./component-set";
import { ConnectorNodeParser } from "./connector";
import { ShapeWithTextNodeParser } from "./shape-with-text";
import { StickyNodeParser } from "./sticky";

/**
 * 根据节点类型创建对应的解析器
 * @param node Figma节点
 * @returns 对应类型的解析器
 */
export function createParserByNodeType(node: SceneNode): BaseNodeParser<unknown> {
  switch (node.type) {
    case "TEXT":
      return new TextNodeParser();
    case "RECTANGLE":
      // 检查是否为图片填充
      if (
        "fills" in node &&
        node.fills &&
        Array.isArray(node.fills) &&
        node.fills.some((fill: Paint) => fill.type === "IMAGE")
      ) {
        return new ImageNodeParser();
      }
      return new RectangleNodeParser();
    case "FRAME":
      // 检查是否为图片填充
      if (
        "fills" in node &&
        node.fills &&
        Array.isArray(node.fills) &&
        node.fills.some((fill: Paint) => fill.type === "IMAGE")
      ) {
        return new ImageNodeParser();
      }
      return new FrameNodeParser();
    case "GROUP":
      return new GroupNodeParser();
    case "ELLIPSE":
      // 检查是否为图片填充
      if (
        "fills" in node &&
        node.fills &&
        Array.isArray(node.fills) &&
        node.fills.some((fill: Paint) => fill.type === "IMAGE")
      ) {
        return new ImageNodeParser();
      }
      return new EllipseNodeParser();
    case "VECTOR":
      return new VectorNodeParser();
    case "COMPONENT":
      return new ComponentNodeParser();
    case "INSTANCE":
      return new InstanceNodeParser();
    case "LINE":
      return new LineNodeParser();
    case "POLYGON":
      return new PolygonNodeParser();
    case "STAR":
      return new StarNodeParser();
    case "BOOLEAN_OPERATION":
      return new BooleanOperationNodeParser();
    case "COMPONENT_SET":
      return new ComponentSetNodeParser();
    case "CONNECTOR":
      return new ConnectorNodeParser();
    case "SHAPE_WITH_TEXT":
      return new ShapeWithTextNodeParser();
    case "STICKY":
      return new StickyNodeParser();
    default:
      return createDefaultParser(node);
  }
}

/**
 * 创建默认解析器
 * @param node Figma节点
 * @returns 默认解析器
 */
function createDefaultParser(node: SceneNode): BaseNodeParser<unknown> {
  // 根据节点类型选择合适的默认解析器
  if ("children" in node) {
    return new FrameNodeParser(); // 对于有子节点的未知类型，使用Frame解析器
  }
  return new GenericNodeParser();
}

/**
 * 通用节点解析器
 * 用于处理未知类型的节点
 */
class GenericNodeParser extends BaseNodeParser<SceneNode> {
  protected parseSpecificProps(node: SceneNode, parsedNode: ParsedNode): void {
    // 通用解析器不需要特殊处理
    if ("width" in node) {
      parsedNode.width = node.width;
    }

    if ("height" in node) {
      parsedNode.height = node.height;
    }
  }
}
