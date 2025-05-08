/**
 * 图片解析器
 * @description 接受一个节点数组，遍历节点数据 默认使用figma导出图片的base64数据
 * 返回格式如下
 * ```
 * {
 * [nodeid]:{
 * resolvedName: "Image"
 * }
 * props:{
 * src:base64数据
 * }
 * }
 * ```
 * 主要功能 base64数据可能比较大，可以转成二进制数据，或者其他方式压缩数据 然后复制的剪贴板里，
 * 提供将转成二进制的数据 在还原成json的方法
 */

/**
 * 图片解析结果接口
 */
export interface ImageParseResult {
  [nodeId: string]: {
    resolvedName: string;
    props: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };
    imageData?: {
      format: string;
      width: number;
      height: number;
      aspectRatio: number;
      originalNodeType: string;
    };
  };
}

/**
 * 压缩选项接口
 */
export interface CompressionOptions {
  /** 压缩质量 (0-1) */
  quality?: number;
  /** 压缩格式 */
  format?: "jpeg" | "png" | "webp";
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 是否使用二进制格式存储 */
  useBinary?: boolean;
}

/**
 * 图片解析器类
 */
export class ImageParser {
  private nodes: SceneNode[];
  private result: ImageParseResult = {};
  private options: CompressionOptions;

  /**
   * 构造函数
   * @param nodes Figma节点数组
   * @param options 压缩选项
   */
  constructor(nodes: SceneNode[], options: CompressionOptions = {}) {
    // 防御性编程，确保nodes是数组
    this.nodes = Array.isArray(nodes) ? nodes : [];
    this.options = {
      quality: 0.8,
      format: "png",
      useBinary: false,
      ...options
    };
  }

  /**
   * 解析所有节点
   * @returns 解析结果Promise
   */
  public async parse(): Promise<ImageParseResult> {
    try {
      // 清空之前的结果
      this.result = {};

      // 验证节点数组
      if (!this.nodes || this.nodes.length === 0) {
        console.warn("没有有效的节点可以解析");
        return this.result;
      }

      // 使用Promise.allSettled确保即使部分节点解析失败，也能获得其他节点的结果
      const parsePromises = this.nodes.map(node => this.parseNode(node));
      await Promise.allSettled(parsePromises);

      return this.result;
    } catch (error) {
      console.error("解析图片节点时出错:", error);
      throw error;
    }
  }

  /**
   * 解析单个节点
   * @param node Figma节点
   */
  private async parseNode(node: SceneNode): Promise<void> {
    try {
      // 验证节点
      if (!node || typeof node !== "object" || !("id" in node)) {
        console.error("无效的Figma节点:", node);
        return;
      }

      // 导出图像为指定格式
      const format = (this.options.format?.toUpperCase() as "PNG" | "JPG" | "SVG" | "PDF") || "PNG";
      const imageData = await node.exportAsync({
        format,
        constraint: { type: "SCALE", value: 1 }
      });

      // 处理图像数据
      let imageSource: string;
      if (this.options.useBinary) {
        // 转换为二进制格式
        imageSource = await this.compressToBinary(imageData, format);
      } else {
        // 转换为base64
        imageSource = `data:image/${format.toLowerCase()};base64,${figma.base64Encode(imageData)}`;
      }

      // 保存解析结果
      this.result[node.id] = {
        resolvedName: "Image",
        props: {
          src: imageSource,
          alt: node.name || "",
          width: node.width,
          height: node.height
        },
        imageData: {
          format,
          width: node.width,
          height: node.height,
          aspectRatio: node.width / node.height,
          originalNodeType: node.type
        }
      };
    } catch (error) {
      console.error(`解析节点 ${node?.id || "未知"} 时出错:`, error);
    }
  }

  /**
   * 将图像数据压缩为二进制格式
   * @param imageData 图像数据
   * @param format 图像格式
   * @returns 压缩后的二进制字符串
   */
  private async compressToBinary(imageData: Uint8Array, format: string): Promise<string> {
    try {
      // 将Uint8Array转换为二进制字符串
      // 这里使用一种简单的编码方式，实际应用中可能需要更高效的压缩算法
      const binaryString = Array.from(imageData)
        .map(byte => String.fromCharCode(byte))
        .join("");

      return `binary:${format.toLowerCase()}:${binaryString}`;
    } catch (error) {
      console.error("压缩图像数据时出错:", error);
      throw error;
    }
  }

  /**
   * 将解析结果转换为JSON字符串
   * @returns JSON字符串
   */
  public toJSON(): string {
    try {
      return JSON.stringify(this.result, null, 2);
    } catch (error) {
      console.error("转换为JSON时出错:", error);
      return JSON.stringify({});
    }
  }

  /**
   * 从二进制字符串还原图像数据
   * @param binaryString 二进制字符串
   * @returns 还原后的base64图像数据
   */
  public static restoreFromBinary(binaryString: string): string {
    try {
      // 验证输入格式
      if (!binaryString.startsWith("binary:")) {
        throw new Error("无效的二进制图像数据格式");
      }

      // 解析格式和数据
      const parts = binaryString.split(":");
      if (parts.length < 3) {
        throw new Error("无效的二进制图像数据格式");
      }

      const format = parts[1];
      const data = parts.slice(2).join(":"); // 处理可能在数据中存在的冒号

      // 将二进制字符串转换回Uint8Array
      const uint8Array = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) {
        uint8Array[i] = data.charCodeAt(i);
      }

      // 转换为base64
      const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
      return `data:image/${format};base64,${base64}`;
    } catch (error) {
      console.error("还原二进制图像数据时出错:", error);
      throw error;
    }
  }

  /**
   * 从JSON字符串还原解析结果
   * @param jsonString JSON字符串
   * @returns 还原后的解析结果
   */
  public static restoreFromJSON(jsonString: string): ImageParseResult {
    try {
      // 解析JSON
      const parsedData = JSON.parse(jsonString) as ImageParseResult;

      // 处理可能的二进制数据
      Object.keys(parsedData).forEach(nodeId => {
        const nodeData = parsedData[nodeId];
        if (nodeData.props.src && nodeData.props.src.startsWith("binary:")) {
          // 还原二进制图像数据
          nodeData.props.src = ImageParser.restoreFromBinary(nodeData.props.src);
        }
      });

      return parsedData;
    } catch (error) {
      console.error("从JSON还原时出错:", error);
      return {};
    }
  }

  /**
   * 批量压缩图像
   * @param options 压缩选项
   * @returns 压缩后的解析结果
   */
  public async compress(options: CompressionOptions = {}): Promise<ImageParseResult> {
    try {
      // 合并选项
      const compressOptions = {
        ...this.options,
        ...options
      };

      // 创建一个新的解析器实例，使用相同的节点和新的选项
      const compressedParser = new ImageParser(this.nodes, compressOptions);
      return await compressedParser.parse();
    } catch (error) {
      console.error("压缩图像时出错:", error);
      return this.result;
    }
  }
}
