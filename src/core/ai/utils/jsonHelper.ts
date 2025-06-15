/**
 * JSON 辅助工具
 * 用于处理 JSON 相关的操作
 */

/**
 * 预处理包含代码块的内容，确保代码块被正确处理以便 JSON 解析
 * @param content 需要预处理的内容
 * @returns 预处理后的内容
 */
export function preprocessContentWithCodeBlocks(content: string): string {
  try {
    // 尝试直接解析，如果成功则直接返回
    try {
      JSON.parse(content);
      return content;
    } catch (e) {
      // 解析失败，需要预处理
      console.log(e);
    }

    // 检查内容是否是 JSON 格式
    if (content.trim().startsWith("{") && content.trim().endsWith("}")) {
      // 尝试处理内容中的代码块，将三重反引号转义
      // 这里使用正则表达式匹配代码块，并将其中的内容进行转义
      const processedContent = content.replace(/(```[a-zA-Z0-9_-]*\n)([\s\S]*?)(```)/g, (_match, _start, code) => {
        // 将代码块中的内容转义，确保 JSON.parse 能够正确处理
        const escapedCode = code
          .replace(/\\/g, "\\\\") // 先转义反斜杠
          .replace(/"/g, '\\"') // 转义双引号
          .replace(/\n/g, "\\n"); // 转义换行符

        // 返回转义后的代码块表示
        return `代码块: "${escapedCode}"`;
      });

      return processedContent;
    }

    // 如果内容不是 JSON 格式，尝试从中提取 JSON 部分
    const jsonMatch = content.match(/(\{[\s\S]*\})/);
    if (jsonMatch && jsonMatch[1]) {
      // 递归处理提取出的 JSON 部分
      return preprocessContentWithCodeBlocks(jsonMatch[1]);
    }

    // 如果无法处理，返回原始内容
    return content;
  } catch (error) {
    console.error("预处理内容时出错:", error);
    // 出错时返回原始内容
    return content;
  }
}
