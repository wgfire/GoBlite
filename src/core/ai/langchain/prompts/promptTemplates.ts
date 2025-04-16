/**
 * 提示词模板
 * 提供各种场景的提示词模板
 */

import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import {
  DEFAULT_SYSTEM_PROMPT,
  CODE_GENERATION_SYSTEM_PROMPT,
  IMAGE_GENERATION_SYSTEM_PROMPT,
  TEMPLATE_PROCESSING_SYSTEM_PROMPT,
} from "../../constants";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

/**
 * 创建基础聊天提示词模板
 * @param systemPrompt 系统提示词
 * @returns 提示词模板
 */
export function createBasicChatPrompt(systemPrompt: string = DEFAULT_SYSTEM_PROMPT) {
  return ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{input}"],
  ]);
}

/**
 * 创建代码生成提示词模板
 * @param systemPrompt 系统提示词
 * @returns 提示词模板
 */
export function createCodeGenerationPrompt(systemPrompt: string = CODE_GENERATION_SYSTEM_PROMPT) {
  return ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{input}"],
  ]);
}

/**
 * 创建图像生成提示词模板
 * @param systemPrompt 系统提示词
 * @returns 提示词模板
 */
export function createImageGenerationPrompt(systemPrompt: string = IMAGE_GENERATION_SYSTEM_PROMPT) {
  return ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    ["human", "{input}"],
  ]);
}

/**
 * 创建模板处理提示词模板
 * @param systemPrompt 系统提示词
 * @returns 提示词模板
 */
export function createTemplateProcessingPrompt(systemPrompt: string = TEMPLATE_PROCESSING_SYSTEM_PROMPT) {
  return ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    [
      "human",
      `
请根据以下模板和数据生成代码：

模板ID: {templateId}

模板数据:
{templateData}

业务上下文:
行业: {industry}
业务目标: {businessGoal}
目标受众: {targetAudience}
设计风格: {designStyle}

请生成完整的代码文件，每个文件使用单独的代码块，并在代码块前注明文件路径。
    `,
    ],
  ]);
}

/**
 * 创建提示词优化模板
 * @returns 提示词模板
 */
export function createPromptOptimizationPrompt() {
  return ChatPromptTemplate.fromMessages([
    [
      "system",
      "你是一个专业的提示词优化专家。你的任务是帮助用户优化他们的提示词，使其更加清晰、具体和有效。请分析原始提示词，并提供优化后的版本，同时解释你做了哪些改进。",
    ],
    [
      "human",
      `
请帮我优化以下提示词，使其更加清晰、具体和有效：

原始提示词：
"{originalPrompt}"

请提供优化后的提示词，并解释你做了哪些改进。
    `,
    ],
  ]);
}

/**
 * 创建意图分析提示词模板
 * @returns 意图分析提示词模板
 */
export function createIntentAnalysisPrompt() {
  // 定义意图分析结果的schema
  const intentAnalysisSchema = z.object({
    isInfoRequest: z.boolean().describe("用户是否在询问模板的信息，而不是要求生成或修改代码"),
    isCreationRequest: z.boolean().describe("用户是否在要求创建、生成、修改、优化或实现某些功能"),
  });

  // 创建输出解析器
  const parser = StructuredOutputParser.fromZodSchema(intentAnalysisSchema);

  // 创建提示词模板
  return ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
      `你是一个用户意图分析器，专门分析用户输入的意图。
你的任务是判断用户的输入是属于"信息查询"还是"创建请求"。

- 信息查询：用户询问模板的结构、组件、功能、特性等信息，而不是要求生成或修改代码。
- 创建请求：用户要求创建、生成、修改、优化或实现某些功能。

请根据用户的输入，返回一个结构化的JSON对象，包含以下字段：
${parser.getFormatInstructions()}`
    ),
    HumanMessagePromptTemplate.fromTemplate(
      `当前模板上下文: 用户正在使用 {templateName} 模板。

用户输入: "{userInput}"

请分析这个输入的意图，并返回结构化的JSON结果。`
    ),
  ]);
}

export default {
  createBasicChatPrompt,
  createCodeGenerationPrompt,
  createImageGenerationPrompt,
  createTemplateProcessingPrompt,
  createPromptOptimizationPrompt,
  createIntentAnalysisPrompt,
};
