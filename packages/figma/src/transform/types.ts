/**
 * Figma节点解析器的类型定义
 */

// 解析结果的基本类型
export interface ParsedNode {
  type: string;
  id: string;
  name: string;
  style?: CSSProperties;
  children?: ParsedNode[];
  [key: string]: unknown;
}

// CSS属性类型
export interface CSSProperties {
  [key: string]: string | number | undefined;
}

// 文本节点特有属性
export interface ParsedTextNode extends ParsedNode {
  type: "TEXT";
  characters: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  textDecoration?: string;
  textCase?: string;
  letterSpacing?: number;
  lineHeight?: number | string;
}

// 图片节点特有属性
export interface ParsedImageNode extends ParsedNode {
  type: "IMAGE";
  src: string;
  width: number;
  height: number;
  imageData?: {
    format: string;
    width: number;
    height: number;
    aspectRatio: number;
    originalNodeType: string;
  };
}

// 矩形节点特有属性
export interface ParsedRectangleNode extends ParsedNode {
  type: "RECTANGLE";
  width: number;
  height: number;
  cornerRadius?: number;
}

// 椭圆节点特有属性
export interface ParsedEllipseNode extends ParsedNode {
  type: "ELLIPSE";
  width: number;
  height: number;
}

// 框架节点特有属性
export interface ParsedFrameNode extends ParsedNode {
  type: "FRAME";
  width: number;
  height: number;
  layoutMode?: "NONE" | "HORIZONTAL" | "VERTICAL";
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  layoutData?: {
    layoutMode: string;
    primaryAxisAlignItems?: string;
    counterAxisAlignItems?: string;
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    itemSpacing?: number;
    layoutGrow?: number;
  };
}

// 组节点特有属性
export interface ParsedGroupNode extends ParsedNode {
  type: "GROUP";
  width: number;
  height: number;
}

// 组件节点特有属性
export interface ParsedComponentNode extends ParsedNode {
  type: "COMPONENT";
  width: number;
  height: number;
}

// 组件实例节点特有属性
export interface ParsedInstanceNode extends ParsedNode {
  type: "INSTANCE";
  width: number;
  height: number;
  componentId: string;
}

// 矢量节点特有属性
export interface ParsedVectorNode extends ParsedNode {
  type: "VECTOR";
  width: number;
  height: number;
  svg?: string;
}

// 线条节点特有属性
export interface ParsedLineNode extends ParsedNode {
  type: "LINE";
  width: number;
  height: number;
  strokeWeight?: number;
  strokeCap?: string;
}

// 多边形节点特有属性
export interface ParsedPolygonNode extends ParsedNode {
  type: "POLYGON";
  width: number;
  height: number;
  pointCount: number;
  polygonData?: {
    pointCount: number;
  };
}

// 星形节点特有属性
export interface ParsedStarNode extends ParsedNode {
  type: "STAR";
  width: number;
  height: number;
  pointCount: number;
  innerRadius?: number;
  starData?: {
    pointCount: number;
    innerRadius?: number;
  };
}

// 布尔运算节点特有属性
export interface ParsedBooleanOperationNode extends ParsedNode {
  type: "BOOLEAN_OPERATION";
  width: number;
  height: number;
  booleanOperation: string;
  booleanOperationData?: {
    booleanOperation: string;
  };
}

// 组件集合节点特有属性
export interface ParsedComponentSetNode extends ParsedNode {
  type: "COMPONENT_SET";
  width: number;
  height: number;
  defaultVariantId?: string;
  componentSetData?: {
    defaultVariantId: string | null;
    variantGroupProperties: Record<string, { values: string[] }>;
  };
}

// 连接器节点特有属性
export interface ParsedConnectorNode extends ParsedNode {
  type: "CONNECTOR";
  width: number;
  height: number;
  connectorStart?: ConnectorEndpoint;
  connectorEnd?: ConnectorEndpoint;
  connectorData?: {
    connectorStart?: ConnectorEndpoint;
    connectorEnd?: ConnectorEndpoint;
    connectorLineType?: string;
  };
}

// 带文本的形状节点特有属性
export interface ParsedShapeWithTextNode extends ParsedNode {
  type: "SHAPE_WITH_TEXT";
  width: number;
  height: number;
  characters: string;
  shapeType?: string;
  shapeWithTextData?: {
    characters: string;
    shapeType?: string;
  };
}

// 便签节点特有属性
export interface ParsedStickyNode extends ParsedNode {
  type: "STICKY";
  width: number;
  height: number;
  characters: string;
  stickyData?: {
    characters: string;
    authorName?: string;
    authorId?: string;
  };
}

// 解析器接口
export interface NodeParser<T extends SceneNode> {
  parse(node: T): ParsedNode;
}

// HTML转换选项
export interface HTMLConvertOptions {
  inlineStyles?: boolean;
  prettify?: boolean;
  includeComments?: boolean;
}

// 解析管理器配置
export interface ParseManagerConfig {
  outputFormat: "JSON" | "HTML";
  htmlOptions?: HTMLConvertOptions;
}
