/**
 * 统一响应提示词模板
 * 用于生成结构化的统一响应
 */

import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

// 定义统一响应的schema
const unifiedResponseSchema = z.object({
  intent: z.object({
    isInfoRequest: z.boolean().describe("用户是否在查询信息"),
    isCodeRequest: z.boolean().describe("用户是否在请求生成或修改代码"),
    isTemplateRequest: z.boolean().describe("用户是否在请求处理模板"),
  }),
  fileOperations: z.array(
    z.object({
      path: z.string().describe("文件路径"),
      content: z.string().describe("文件内容"),
      action: z.enum(["create", "update", "delete"]).describe("操作类型"),
    })
  ),
  preview: z.object({
    shouldStartPreview: z.boolean().describe("是否应该启动预览"),
  }),
  response: z.object({
    text: z.string().describe("给用户的文本回复"),
  }),
});

// 创建输出解析器
export const unifiedResponseParser = StructuredOutputParser.fromZodSchema(unifiedResponseSchema);

/**
 * 创建统一响应提示词模板
 * @returns 统一响应提示词模板
 */
export function createUnifiedResponsePrompt() {
  // 获取格式化指令
  // const formatInstructions = unifiedResponseParser.getFormatInstructions();
  // console.log(formatInstructions, "格式化指令");

  // 使用简单的模板字符串，避免复杂的格式化
  return {
    prompt: ChatPromptTemplate.fromMessages([
      [
        "system",
        `你是一个专业的前端开发助手，可以帮助用户理解代码、回答问题和生成代码。当用户提供输入时，你需要分析用户的意图并提供相应的帮助。
         {formatInstructions}
         当前上下文信息：{templateInfo}`,
      ],
      new MessagesPlaceholder("history"),
      ["human", "{userInput}"],
    ]),
    parser: unifiedResponseParser,
  };
}

/**
 * 创建严格的统一响应提示词模板
 * 当模型多次失败时使用更严格的提示词
 * @returns 严格的统一响应提示词模板
 */
export function createStrictUnifiedResponsePrompt() {
  // 使用模板字符串直接创建
  return {
    prompt: ChatPromptTemplate.fromMessages([
      [
        "system",
        `你是一个专业的前端开发助手，可以帮助用户理解代码、回答问题和生成代码。

  我需要你严格按照指定的JSON格式返回响应。这是非常重要的，你必须遵循这个格式，不要添加任何额外的文本。

  你的响应必须是一个有效的JSON对象，包含以下字段：
  - intent: 包含isInfoRequest、isCodeRequest和isTemplateRequest三个布尔字段
  - fileOperations: 一个数组，每个元素包含path、content和action字段
  - preview: 包含shouldStartPreview布尔字段
  - response: 包含text字段

  例如：

  {formatInstructions}

  当前上下文信息：{templateInfo}

  记住，你的整个响应必须是一个有效的JSON对象，不要添加任何其他文本或解释。`,
      ],
      new MessagesPlaceholder("history"),
      ["human", "{userInput}"],
    ]),
    parser: unifiedResponseParser,
  };
}
