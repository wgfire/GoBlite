/**
 * LangChain链集成
 */
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";

// 导出统一响应链
export { createUnifiedResponseChain, createStrictUnifiedResponseChain } from "./unifiedResponseChain";

/**
 * 创建代码生成链
 * @param model 语言模型
 * @param language 编程语言
 * @param framework 框架
 * @param includeTests 是否包含测试
 * @param includeComments 是否包含注释
 * @returns 可运行的链实例
 */
export function createCodeGenerationChain(
  model: BaseChatModel,
  language: string = "javascript",
  framework: string = "",
  includeTests: boolean = false,
  includeComments: boolean = true
): RunnableSequence {
  const template = `你是一个专业的软件开发者，擅长编写高质量的${language}代码。
请根据用户的需求生成代码。

生成代码时请遵循以下规则：
1. 使用${language}语言${framework ? `和${framework}框架` : ""}
2. 代码应该是完整的、可运行的
3. ${includeComments ? "添加详细的注释，解释代码的关键部分" : "只添加必要的注释"}
4. ${includeTests ? "包含单元测试" : "不需要包含单元测试"}
5. 使用现代化的编码风格和最佳实践
6. 返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径
例如:
\`\`\`filepath:src/index.js
console.log('Hello');
\`\`\`

请确保代码是高质量的、可维护的，并且符合用户的需求。

用户需求: {input}`;

  const promptTemplate = PromptTemplate.fromTemplate(template);

  // 使用 LCEL 创建链
  return RunnableSequence.from([
    {
      input: (input: string) => input,
    },
    promptTemplate,
    model,
  ]);
}

/**
 * 创建模板处理链
 * @param model 语言模型
 * @returns 可运行的链实例
 */
export function createTemplateProcessingChain(model: BaseChatModel): RunnableSequence {
  const template = `你是一个专业的前端开发工程师，帮助用户根据模板创建落地页。
请根据用户的需求和提供的模板信息，生成相应的代码。

模板信息:
{templateInfo}

用户表单数据:
{formData}

业务上下文:
{businessContext}

返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。
例如:
\`\`\`filepath:src/index.js
console.log('Hello');
\`\`\`

请确保生成的代码符合模板的结构和风格，并根据用户提供的表单数据进行个性化定制。`;

  const promptTemplate = PromptTemplate.fromTemplate(template);

  // 使用 LCEL 创建链
  return RunnableSequence.from([
    {
      templateInfo: (input: Record<string, unknown>) => String(input.templateInfo || ""),
      formData: (input: Record<string, unknown>) => String(input.formData || ""),
      businessContext: (input: Record<string, unknown>) => String(input.businessContext || ""),
    },
    promptTemplate,
    model,
  ]);
}

/**
 * 创建模板优化链
 * @param model 语言模型
 * @returns 可运行的链实例
 */
export function createTemplateOptimizationChain(model: BaseChatModel): RunnableSequence {
  const template = `你是一个专业的前端开发工程师，擅长优化和生成高质量的前端代码。
请根据用户的需求和提供的模板代码，生成优化后的代码。

模板信息:
{templateInfo}

模板文件内容:
{fileContexts}

用户优化请求:
{optimizationRequest}

具体需求:
{requirements}

请根据用户的需求对模板代码进行优化和生成。你需要分析模板的结构和功能，然后生成符合用户需求的代码。

返回格式应为markdown代码块，每个文件使用单独的代码块，并在代码块前注明文件路径。
例如:
\`\`\`filepath:src/index.js
console.log('Hello');
\`\`\`

请确保生成的代码是高质量的、可维护的，并且符合用户的需求。`;

  const promptTemplate = PromptTemplate.fromTemplate(template);

  // 使用 LCEL 创建链
  return RunnableSequence.from([
    {
      templateInfo: (input: Record<string, unknown>) => String(input.templateInfo || ""),
      fileContexts: (input: Record<string, unknown>) => String(input.fileContexts || ""),
      optimizationRequest: (input: Record<string, unknown>) => String(input.optimizationRequest || ""),
      requirements: (input: Record<string, unknown>) => String(input.requirements || ""),
    },
    promptTemplate,
    model,
  ]);
}
