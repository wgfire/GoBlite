/**
 * 文本节点解析器
 */
import { BaseNodeParser } from "./base";
import { ParsedNode } from "../types";
import { colorToString } from "../utils";

/**
 * 文本节点解析器类
 */
export class TextNodeParser extends BaseNodeParser<TextNode> {
  /**
   * 解析文本节点特有属性
   * @param node 文本节点
   * @param parsedNode 解析后的节点数据
   */
  protected parseSpecificProps(node: TextNode, parsedNode: ParsedNode): void {
    // 基本属性
    parsedNode.characters = node.characters;
    parsedNode.width = node.width;
    parsedNode.height = node.height;

    // 确保 style 对象存在
    if (!parsedNode.style) {
      parsedNode.style = {};
    }

    // 处理字体样式
    if (node.fontName !== figma.mixed) {
      parsedNode.style.fontFamily = `"${node.fontName.family}", sans-serif`;

      // 处理字体粗细
      const fontStyle = node.fontName.style.toLowerCase();
      if (fontStyle.includes("bold")) {
        parsedNode.style.fontWeight = "bold";
      } else if (fontStyle.includes("medium")) {
        parsedNode.style.fontWeight = "500";
      } else if (fontStyle.includes("light")) {
        parsedNode.style.fontWeight = "300";
      } else if (fontStyle.includes("thin")) {
        parsedNode.style.fontWeight = "100";
      } else if (fontStyle.includes("black")) {
        parsedNode.style.fontWeight = "900";
      } else {
        parsedNode.style.fontWeight = "normal";
      }

      // 处理斜体
      if (fontStyle.includes("italic")) {
        parsedNode.style.fontStyle = "italic";
      }
    }

    // 处理字体大小
    if (node.fontSize !== figma.mixed && typeof node.fontSize === "number") {
      parsedNode.style.fontSize = `${node.fontSize}px`;
    }

    // 处理文本对齐
    if (node.textAlignHorizontal !== figma.mixed) {
      switch (node.textAlignHorizontal) {
        case "LEFT":
          parsedNode.style.textAlign = "left";
          break;
        case "CENTER":
          parsedNode.style.textAlign = "center";
          break;
        case "RIGHT":
          parsedNode.style.textAlign = "right";
          break;
        case "JUSTIFIED":
          parsedNode.style.textAlign = "justify";
          break;
      }
    }

    // 处理垂直对齐
    if (node.textAlignVertical !== figma.mixed) {
      switch (node.textAlignVertical) {
        case "TOP":
          parsedNode.style.display = "flex";
          parsedNode.style.flexDirection = "column";
          parsedNode.style.justifyContent = "flex-start";
          break;
        case "CENTER":
          parsedNode.style.display = "flex";
          parsedNode.style.flexDirection = "column";
          parsedNode.style.justifyContent = "center";
          break;
        case "BOTTOM":
          parsedNode.style.display = "flex";
          parsedNode.style.flexDirection = "column";
          parsedNode.style.justifyContent = "flex-end";
          break;
      }
    }

    // 处理行高
    if (node.lineHeight !== figma.mixed && node.lineHeight !== "AUTO") {
      if (node.lineHeight.unit === "PIXELS") {
        parsedNode.style.lineHeight = `${node.lineHeight.value}px`;
      } else if (node.lineHeight.unit === "PERCENT") {
        parsedNode.style.lineHeight = `${node.lineHeight.value / 100}`;
      }
    }

    // 处理字间距
    if (node.letterSpacing !== figma.mixed && typeof node.letterSpacing !== "number") {
      if (node.letterSpacing.unit === "PIXELS") {
        parsedNode.style.letterSpacing = `${node.letterSpacing.value}px`;
      } else if (node.letterSpacing.unit === "PERCENT") {
        // 将百分比转换为 em
        parsedNode.style.letterSpacing = `${node.letterSpacing.value / 100}em`;
      }
    }

    // 处理文本装饰
    if (node.textDecoration !== figma.mixed) {
      switch (node.textDecoration) {
        case "UNDERLINE":
          parsedNode.style.textDecoration = "underline";
          break;
        case "STRIKETHROUGH":
          parsedNode.style.textDecoration = "line-through";
          break;
      }
    }

    // 处理文本大小写
    if (node.textCase !== figma.mixed) {
      switch (node.textCase) {
        case "UPPER":
          parsedNode.style.textTransform = "uppercase";
          break;
        case "LOWER":
          parsedNode.style.textTransform = "lowercase";
          break;
        case "TITLE":
          parsedNode.style.textTransform = "capitalize";
          break;
      }
    }

    // 处理段落缩进
    if (node.paragraphIndent !== figma.mixed && node.paragraphIndent !== 0) {
      parsedNode.style.textIndent = `${node.paragraphIndent}px`;
    }

    // 处理段落间距
    if (node.paragraphSpacing !== figma.mixed && node.paragraphSpacing !== 0) {
      parsedNode.style.marginBottom = `${node.paragraphSpacing}px`;
    }

    // 处理混合样式文本
    try {
      // 检查是否有混合样式
      const hasMixedStyles =
        node.fontName === figma.mixed ||
        node.fontSize === figma.mixed ||
        node.fills === figma.mixed ||
        node.textDecoration === figma.mixed;

      if (hasMixedStyles && node.getStyledTextSegments) {
        // 获取样式段
        const segments = node.getStyledTextSegments([
          "fontName",
          "fontSize",
          "fills",
          "textDecoration",
          "letterSpacing",
          "lineHeight",
          "textCase"
        ]);

        // 保存样式段信息，用于生成 HTML 时使用
        parsedNode.styledSegments = segments.map(segment => {
          const segmentStyle: Record<string, unknown> = {};

          // 处理字体
          if (segment.fontName && segment.fontName !== figma.mixed) {
            segmentStyle.fontFamily = `"${segment.fontName.family}", sans-serif`;

            // 处理字体粗细
            const fontStyle = segment.fontName.style.toLowerCase();
            if (fontStyle.includes("bold")) {
              segmentStyle.fontWeight = "bold";
            } else if (fontStyle.includes("medium")) {
              segmentStyle.fontWeight = "500";
            } else if (fontStyle.includes("light")) {
              segmentStyle.fontWeight = "300";
            } else if (fontStyle.includes("thin")) {
              segmentStyle.fontWeight = "100";
            } else if (fontStyle.includes("black")) {
              segmentStyle.fontWeight = "900";
            } else {
              segmentStyle.fontWeight = "normal";
            }

            // 处理斜体
            if (fontStyle.includes("italic")) {
              segmentStyle.fontStyle = "italic";
            }
          }

          // 处理字体大小
          if (segment.fontSize !== figma.mixed && typeof segment.fontSize === "number") {
            segmentStyle.fontSize = `${segment.fontSize}px`;
          }

          // 处理填充颜色
          if (
            segment.fills &&
            segment.fills !== figma.mixed &&
            Array.isArray(segment.fills) &&
            segment.fills.length > 0
          ) {
            const fill = segment.fills[0];
            if (fill.type === "SOLID") {
              segmentStyle.color = colorToString(fill.color);
            }
          }

          // 处理文本装饰
          if (segment.textDecoration !== figma.mixed) {
            switch (segment.textDecoration) {
              case "UNDERLINE":
                segmentStyle.textDecoration = "underline";
                break;
              case "STRIKETHROUGH":
                segmentStyle.textDecoration = "line-through";
                break;
            }
          }

          // 处理字间距
          if (segment.letterSpacing !== figma.mixed && typeof segment.letterSpacing !== "number") {
            if (segment.letterSpacing.unit === "PIXELS") {
              segmentStyle.letterSpacing = `${segment.letterSpacing.value}px`;
            } else if (segment.letterSpacing.unit === "PERCENT") {
              segmentStyle.letterSpacing = `${segment.letterSpacing.value / 100}em`;
            }
          }

          // 处理行高
          if (segment.lineHeight !== figma.mixed && segment.lineHeight !== "AUTO") {
            if (segment.lineHeight.unit === "PIXELS") {
              segmentStyle.lineHeight = `${segment.lineHeight.value}px`;
            } else if (segment.lineHeight.unit === "PERCENT") {
              segmentStyle.lineHeight = `${segment.lineHeight.value / 100}`;
            }
          }

          // 处理文本大小写
          if (segment.textCase !== figma.mixed) {
            switch (segment.textCase) {
              case "UPPER":
                segmentStyle.textTransform = "uppercase";
                break;
              case "LOWER":
                segmentStyle.textTransform = "lowercase";
                break;
              case "TITLE":
                segmentStyle.textTransform = "capitalize";
                break;
            }
          }

          return {
            characters: segment.characters,
            start: segment.start,
            end: segment.end,
            style: segmentStyle
          };
        });
      }
    } catch (error) {
      console.error("处理混合样式文本时出错:", error);
    }

    // 保存原始文本信息到 JSON 输出，方便后续处理
    parsedNode.textData = {
      characters: node.characters,
      fontName: node.fontName !== figma.mixed ? node.fontName : undefined,
      fontSize: node.fontSize !== figma.mixed ? node.fontSize : undefined,
      textAlignHorizontal: node.textAlignHorizontal !== figma.mixed ? node.textAlignHorizontal : undefined,
      textAlignVertical: node.textAlignVertical !== figma.mixed ? node.textAlignVertical : undefined,
      lineHeight: node.lineHeight !== figma.mixed ? node.lineHeight : undefined,
      letterSpacing: node.letterSpacing !== figma.mixed ? node.letterSpacing : undefined,
      textDecoration: node.textDecoration !== figma.mixed ? node.textDecoration : undefined,
      textCase: node.textCase !== figma.mixed ? node.textCase : undefined,
      paragraphIndent: node.paragraphIndent !== figma.mixed ? node.paragraphIndent : undefined,
      paragraphSpacing: node.paragraphSpacing !== figma.mixed ? node.paragraphSpacing : undefined
    };
  }
}
