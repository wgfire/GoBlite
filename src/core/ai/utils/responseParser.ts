/**
 * 响应解析工具
 * 解析AI响应内容
 */

import { AIMessageContent, AIMessageType, GeneratedFile } from "../types";

/**
 * 解析代码块
 * @param text 文本内容
 * @returns 代码块数组
 */
export function parseCodeBlocks(text: string): Array<{
  language: string;
  content: string;
}> {
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const codeBlocks: Array<{ language: string; content: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1].trim() || "plaintext";
    const content = match[2].trim();
    codeBlocks.push({ language, content });
  }

  return codeBlocks;
}

/**
 * 解析文件路径代码块
 * @param text 文本内容
 * @returns 文件数组
 */
export function parseCodeFromResponse(text: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // 匹配文件路径和代码块
  // 支持两种格式:
  // 1. ```filepath:path/to/file.js\ncontent```
  // 2. 文件路径: path/to/file.js\n```js\ncontent```
  const filePathCodeBlockRegex = /```filepath:([^\n]+)\n([\s\S]*?)```|文件(?:路径)?[:：]\s*([^\n]+)\n```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;

  let match;
  while ((match = filePathCodeBlockRegex.exec(text)) !== null) {
    if (match[1] && match[2]) {
      // 第一种格式
      const path = match[1].trim();
      const content = match[2].trim();
      const language = getLanguageFromPath(path);
      files.push({ path, content, language });
    } else if (match[3] && match[5]) {
      // 第二种格式
      const path = match[3].trim();
      const language = match[4].trim() || getLanguageFromPath(path);
      const content = match[5].trim();
      files.push({ path, content, language });
    }
  }

  // 如果没有找到文件，尝试解析普通代码块
  if (files.length === 0) {
    const codeBlocks = parseCodeBlocks(text);
    codeBlocks.forEach((block, index) => {
      const path = `file${index + 1}.${getExtensionFromLanguage(block.language)}`;
      files.push({
        path,
        content: block.content,
        language: block.language,
      });
    });
  }

  return files;
}

/**
 * 从文件路径获取语言
 * @param path 文件路径
 * @returns 语言
 */
function getLanguageFromPath(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase() || "";
  switch (extension) {
    case "js":
      return "javascript";
    case "ts":
      return "typescript";
    case "jsx":
      return "jsx";
    case "tsx":
      return "tsx";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "py":
      return "python";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
      return "cpp";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "rb":
      return "ruby";
    case "php":
      return "php";
    case "sh":
      return "bash";
    default:
      return "plaintext";
  }
}

/**
 * 从语言获取扩展名
 * @param language 语言
 * @returns 扩展名
 */
function getExtensionFromLanguage(language: string): string {
  switch (language.toLowerCase()) {
    case "javascript":
      return "js";
    case "typescript":
      return "ts";
    case "jsx":
      return "jsx";
    case "tsx":
      return "tsx";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "json":
      return "json";
    case "markdown":
      return "md";
    case "python":
      return "py";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
      return "cpp";
    case "go":
      return "go";
    case "rust":
      return "rs";
    case "ruby":
      return "rb";
    case "php":
      return "php";
    case "bash":
      return "sh";
    default:
      return "txt";
  }
}

/**
 * 解析AI响应内容
 * @param text 文本内容
 * @returns 消息内容数组
 */
export function parseAIResponse(text: string): AIMessageContent[] {
  const contents: AIMessageContent[] = [];

  // 解析代码块
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // 添加代码块前的文本
    if (match.index > lastIndex) {
      const textContent = text.substring(lastIndex, match.index).trim();
      if (textContent) {
        contents.push({
          type: AIMessageType.TEXT,
          content: textContent,
        });
      }
    }

    // 添加代码块
    const language = match[1].trim() || "plaintext";
    const content = match[2].trim();
    contents.push({
      type: AIMessageType.CODE,
      content,
      language,
    });

    lastIndex = match.index + match[0].length;
  }

  // 添加剩余的文本
  if (lastIndex < text.length) {
    const textContent = text.substring(lastIndex).trim();
    if (textContent) {
      contents.push({
        type: AIMessageType.TEXT,
        content: textContent,
      });
    }
  }

  // 如果没有解析出任何内容，将整个文本作为一个文本内容
  if (contents.length === 0) {
    contents.push({
      type: AIMessageType.TEXT,
      content: text,
    });
  }

  return contents;
}

export default {
  parseCodeBlocks,
  parseCodeFromResponse,
  parseAIResponse,
};
