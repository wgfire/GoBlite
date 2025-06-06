/* eslint-disable quotes */
/**
 * 解析器工具函数
 */
import { CSSProperties, HTMLConvertOptions, ParsedNode } from "./types";

/**
 * 将Figma颜色对象转换为CSS颜色字符串
 */
export function colorToString(color: RGBA | RGB): string {
  if ("a" in color) {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
  } else {
    return `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
  }
}

/**
 * 将Figma的填充转换为CSS样式
 */
export function paintToCss(paints: ReadonlyArray<Paint>): Partial<CSSProperties> {
  const styles: Partial<CSSProperties> = {};

  if (!paints || paints.length === 0) {
    return styles;
  }

  // 处理纯色填充
  const solidPaint = paints.find(paint => paint.type === "SOLID");
  if (solidPaint && solidPaint.type === "SOLID") {
    styles.backgroundColor = colorToString(solidPaint.color);
    if ("opacity" in solidPaint) {
      styles.opacity = solidPaint.opacity;
    }
  }

  // 处理渐变填充
  const gradientPaint = paints.find(
    paint => paint.type === "GRADIENT_LINEAR" || paint.type === "GRADIENT_RADIAL" || paint.type === "GRADIENT_ANGULAR"
  );

  if (gradientPaint) {
    if (gradientPaint.type === "GRADIENT_LINEAR") {
      const { gradientStops } = gradientPaint;
      const gradientColors = gradientStops
        .map(stop => `${colorToString(stop.color)} ${Math.round(stop.position * 100)}%`)
        .join(", ");

      styles.backgroundImage = `linear-gradient(${gradientColors})`;
    }
    // 可以添加其他渐变类型的处理
  }

  // 处理图片填充
  const imagePaint = paints.find(paint => paint.type === "IMAGE");
  if (imagePaint && imagePaint.type === "IMAGE") {
    if (imagePaint.imageHash) {
      // 这里需要通过Figma API获取图片
      // styles.backgroundImage = `url(${imageUrl})`;
    }
  }

  return styles;
}

/**
 * 将Figma的描边转换为CSS样式
 */
export function strokeToCss(node: SceneNode): Partial<CSSProperties> {
  const styles: Partial<CSSProperties> = {};

  if ("strokes" in node && node.strokes && Array.isArray(node.strokes) && node.strokes.length > 0) {
    const stroke = node.strokes[0];
    if (stroke.type === "SOLID") {
      styles.borderColor = colorToString(stroke.color);
    }
  }

  if ("strokeWeight" in node && node.strokeWeight !== undefined && typeof node.strokeWeight === "number") {
    styles.borderWidth = `${node.strokeWeight}px`;
  }

  if ("strokeAlign" in node && node.strokeAlign !== undefined) {
    // 处理描边对齐方式
    // CENTER, INSIDE, OUTSIDE
  }

  if ("strokeCap" in node && node.strokeCap !== undefined) {
    // 处理描边端点样式
    // NONE, ROUND, SQUARE, ARROW_LINES, ARROW_EQUILATERAL
    if (node.strokeCap === "ROUND") {
      styles.borderRadius = "round";
    } else if (node.strokeCap === "SQUARE") {
      styles.borderRadius = "0";
    }
  }

  if ("strokeJoin" in node) {
    // 处理描边连接样式
    // MITER, BEVEL, ROUND
  }

  if ("strokeDashes" in node && Array.isArray(node.strokeDashes) && node.strokeDashes.length > 0) {
    styles.borderStyle = "dashed";
    styles.borderDasharray = node.strokeDashes.join(" ");
  } else if ("strokes" in node && Array.isArray(node.strokes) && node.strokes.length > 0) {
    styles.borderStyle = "solid";
  }

  return styles;
}

/**
 * 将Figma的效果转换为CSS样式
 */
export function effectsToCss(effects: ReadonlyArray<Effect>): Partial<CSSProperties> {
  const styles: Partial<CSSProperties> = {};

  if (!effects || effects.length === 0) {
    return styles;
  }

  // 处理阴影效果
  const dropShadows = effects.filter(effect => effect.type === "DROP_SHADOW" || effect.type === "INNER_SHADOW");

  if (dropShadows.length > 0) {
    const shadowStrings = dropShadows
      .map(shadow => {
        if (shadow.type === "DROP_SHADOW" || shadow.type === "INNER_SHADOW") {
          const { color, offset, radius, spread, visible } = shadow;
          if (!visible) return "";

          const inset = shadow.type === "INNER_SHADOW" ? "inset " : "";
          return `${inset}${offset.x}px ${offset.y}px ${radius}px ${spread || 0}px ${colorToString(color)}`;
        }
        return "";
      })
      .filter(s => s !== "");

    if (shadowStrings.length > 0) {
      styles.boxShadow = shadowStrings.join(", ");
    }
  }

  // 处理模糊效果
  const blurEffect = effects.find(effect => effect.type === "LAYER_BLUR");
  if (blurEffect && blurEffect.type === "LAYER_BLUR" && blurEffect.visible) {
    styles.filter = `blur(${blurEffect.radius}px)`;
  }

  return styles;
}

/**
 * 将Figma的约束转换为CSS样式
 */
export function constraintsToCss(node: SceneNode): Partial<CSSProperties> {
  const styles: Partial<CSSProperties> = {};

  if ("constraints" in node && node.constraints) {
    const { horizontal, vertical } = node.constraints;

    // 水平约束
    if (horizontal === "MIN") {
      styles.left = `${node.x}px`;
    } else if (horizontal === "MAX") {
      if ("parent" in node && node.parent && "width" in node.parent) {
        styles.right = `${(node.parent as FrameNode).width - (node.x + node.width)}px`;
      }
    } else if (horizontal === "CENTER") {
      styles.left = "50%";
      styles.transform = "translateX(-50%)";
    } else if (horizontal === "STRETCH" || horizontal === "SCALE") {
      styles.left = `${node.x}px`;
      if ("parent" in node && node.parent && "width" in node.parent) {
        styles.right = `${(node.parent as FrameNode).width - (node.x + node.width)}px`;
      }
      styles.width = "auto";
    }

    // 垂直约束
    if (vertical === "MIN") {
      styles.top = `${node.y}px`;
    } else if (vertical === "MAX") {
      if ("parent" in node && node.parent && "height" in node.parent) {
        styles.bottom = `${(node.parent as FrameNode).height - (node.y + node.height)}px`;
      }
    } else if (vertical === "CENTER") {
      styles.top = "50%";
      styles.transform = styles.transform ? `${styles.transform} translateY(-50%)` : "translateY(-50%)";
    } else if (vertical === "STRETCH" || vertical === "SCALE") {
      styles.top = `${node.y}px`;
      if ("parent" in node && node.parent && "height" in node.parent) {
        styles.bottom = `${(node.parent as FrameNode).height - (node.y + node.height)}px`;
      }
      styles.height = "auto";
    }
  }

  return styles;
}

/**
 * 将Figma节点的基本属性转换为CSS样式
 */
export function nodeBasicStyleToCss(node: SceneNode): Partial<CSSProperties> {
  const styles: Partial<CSSProperties> = {};

  // 位置
  if ("x" in node) {
    styles.left = `${node.x}px`;
  }

  if ("y" in node) {
    styles.top = `${node.y}px`;
  }

  // 尺寸
  if ("width" in node) {
    styles.width = `${node.width}px`;
  }

  if ("height" in node) {
    styles.height = `${node.height}px`;
  }

  // 不透明度
  if ("opacity" in node && node.opacity !== undefined && typeof node.opacity === "number" && node.opacity < 1) {
    styles.opacity = node.opacity;
  }

  // 可见性
  if ("visible" in node && node.visible === false) {
    styles.display = "none";
  }

  // 旋转
  if ("rotation" in node && node.rotation !== 0) {
    styles.transform = `rotate(${node.rotation}deg)`;
  }

  return styles;
}

/**
 * 将CSS样式对象转换为内联样式字符串
 */
export function styleObjectToString(style: CSSProperties): string {
  try {
    // 验证样式对象
    if (!style || typeof style !== "object") {
      return "";
    }

    return Object.entries(style)
      .filter(([key, value]) => {
        // 过滤无效的样式属性
        return key && value !== undefined && value !== null && value !== "" && typeof key === "string";
      })
      .map(([key, value]) => {
        // 安全地处理样式值
        const safeValue =
          typeof value === "string"
            ? value.replace(/"/g, "'") // 将双引号替换为单引号
            : String(value);
        return `${key}: ${safeValue};`;
      })
      .join(" ");
  } catch (error) {
    console.error("处理样式对象时出错:", error);
    return "";
  }
}

/**
 * 将解析后的节点转换为HTML字符串
 */
export function jsonToHtml(node: ParsedNode, options: HTMLConvertOptions = {}): string {
  try {
    // 验证输入节点
    if (!node || typeof node !== "object") {
      console.error("无效的解析节点:", node);
      return '<div class="parse-error">无效的解析节点</div>';
    }

    // 安全地解构选项
    const { inlineStyles = true, prettify = false, includeComments = false } = options || {};

    // 确保节点有必要的属性
    const safeNode: ParsedNode = {
      style: node.style || {},
      children: Array.isArray(node.children) ? node.children : [],
      ...node
    };

    // 安全地确定标签名
    let tagName = safeNode.tag || "div";
    if (safeNode.type === "TEXT" && !safeNode.tag) {
      tagName = "p";
    } else if (safeNode.type === "IMAGE" && !safeNode.tag) {
      tagName = "img";
    }

    // 处理属性
    const attributes: string[] = [];

    // 添加类名
    if (safeNode.className) {
      attributes.push(`class="${safeNode.className}"`);
    }

    // 添加ID
    attributes.push(`id="${safeNode.id}"`);

    // 添加内联样式
    if (inlineStyles && safeNode.style && typeof safeNode.style === "object") {
      try {
        attributes.push(`style="${styleObjectToString(safeNode.style)}"`);
      } catch (styleError) {
        console.error("处理样式时出错:", styleError);
        // 出错时使用空样式
        attributes.push('style=""');
      }
    }

    // 处理特殊属性
    if (safeNode.type === "IMAGE") {
      if ("src" in safeNode && safeNode.src) {
        attributes.push(`src="${safeNode.src}"`);
      } else {
        attributes.push(
          `src="data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'/>"`
        );
      }
      attributes.push(`alt="${safeNode.name || "image"}"`);
    }

    // 生成HTML标签
    const indent = prettify ? "  " : "";
    const newline = prettify ? "\n" : "";

    // 添加注释
    const comment = includeComments ? `<!-- Figma ${safeNode.type}: ${safeNode.name || "unnamed"} -->${newline}` : "";

    // 处理自闭合标签
    if (tagName === "img") {
      return `${comment}${indent}<${tagName} ${attributes.join(" ")} />`;
    }

    // 处理文本内容
    let content = "";
    if (safeNode.type === "TEXT" && "characters" in safeNode && typeof safeNode.characters === "string") {
      content = safeNode.characters;
    }

    // 处理子节点
    if (Array.isArray(safeNode.children) && safeNode.children.length > 0) {
      try {
        const childrenHtml = safeNode.children
          .filter(child => child && typeof child === "object") // 过滤无效子节点
          .map(child => {
            try {
              const childHtml = jsonToHtml(child, options);
              return prettify ? `${indent}${indent}${childHtml.replace(/\n/g, `\n${indent}`)}` : childHtml;
            } catch (childError) {
              console.error("处理子节点时出错:", childError);
              return `${indent}${indent}<div class="parse-error">子节点解析错误</div>`;
            }
          })
          .join(newline);

        content = `${newline}${childrenHtml}${newline}${indent}`;
      } catch (childrenError) {
        console.error("处理子节点列表时出错:", childrenError);
        content = "";
      }
    }

    // 返回完整的HTML
    return `${comment}${indent}<${tagName} ${attributes.join(" ")}>${content}</${tagName}>`;
  } catch (error) {
    console.error("转换为HTML时出错:", error);
    return `<div class="parse-error">转换为HTML时出错: ${error instanceof Error ? error.message : "未知错误"}</div>`;
  }
}

/**
 * 将文本复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<void> {
  try {
    // 验证输入
    if (typeof text !== "string") {
      console.error("复制到剪贴板的文本无效:", text);
      text = String(text) || "";
    }

    // 验证 figma API 是否可用
    if (typeof figma === "undefined" || !figma.ui || typeof figma.ui.postMessage !== "function") {
      console.error("复制到剪贴板失败: figma API 不可用");
      return Promise.reject(new Error("figma API 不可用"));
    }

    // 在Figma插件中，使用figma.ui.postMessage发送消息到UI，然后在UI中执行复制操作
    figma.ui.postMessage({
      type: "copyToClipboard",
      text
    });

    // 返回成功的Promise
    return Promise.resolve();
  } catch (error) {
    console.error("复制到剪贴板失败:", error);
    return Promise.reject(error);
  }
}

/**
 * 将Figma节点转换为CSS类名
 */
export function generateClassName(node: SceneNode): string {
  // 将节点名称转换为有效的CSS类名
  const baseName = node.name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 添加节点类型前缀
  return `figma-${node.type.toLowerCase()}-${baseName || "unnamed"}-${node.id.substring(0, 8)}`;
}

/**
 * 美化HTML代码
 */
export function prettifyHtml(html: string): string {
  let formatted = "";
  let indent = 0;

  // 简单的HTML格式化
  html.split(/>\s*</).forEach(element => {
    if (element.match(/^\/\w/)) {
      indent -= 2;
    }

    formatted += "\n" + " ".repeat(indent) + "<" + element + ">";

    if (element.match(/^<?\w[^>]*[^/]$/) && !element.startsWith("input") && !element.startsWith("img")) {
      indent += 2;
    }
  });

  return formatted.substring(1);
}
