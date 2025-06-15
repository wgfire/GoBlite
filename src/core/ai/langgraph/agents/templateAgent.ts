// 从"@langchain/langgraph/web"导入必要的组件
import { END, START, StateGraph, Annotation, messagesStateReducer } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { Template, TemplateLoadResult } from "@/template/types";
import { DocumentLoadResult } from "@/core/ai";
import { invokeModel } from "../utils";
import { FileOperation } from "@/core/fileSystem/types"; // 从文件系统类型中导入 FileOperation

import { getTemplateAnalysisPrompt, getTemplateBasedCodeGenerationPrompt, extractTemplateStructure, extractUserRequirements } from "../prompts/templatePrompts";

// 响应结构 Schema（支持 content_base64，可兼容 create/edit）
const responseTypeSchema = z.object({
  responseType: z.enum(["TEMPLATE_INFO", "CODE_GENERATION", "CLARIFY"]).describe("响应类型"),
  explanation: z.string().describe("原因说明"),
  content: z.string().describe("自然语言回复"),
  fileOperations: z
    .array(
      z.object({
        path: z.string().describe("文件路径"),
        type: z.enum(["create", "update", "delete", "rename"]).describe("操作类型"), // 将 action 改为 type
        content: z.string().optional().describe("代码内容（plain）"), // 默认可选，但会根据 type 进行条件验证
        newPath: z.string().optional().describe("新路径（重命名操作时）"),
        isFolder: z.boolean().optional().describe("是否为文件夹"),
        timestamp: z.number().optional().describe("操作时间戳"),
      })
    )
    .optional()
    .describe("文件操作列表，仅在 CODE_GENERATION 时使用")
    .superRefine((fileOperations, ctx) => {
      if (fileOperations) {
        fileOperations.forEach((op, index) => {
          if ((op.type === "create" || op.type === "update") && op.content === undefined) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `文件操作 ${index} (路径: ${op.path}) 的 'content' 字段在 'create' 或 'update' 操作时是必需的。`,
              path: [`fileOperations`, index, `content`],
            });
          }
        });
      }
    }),
});

// 定义错误消息元数据类型
export interface ErrorMetadata {
  isError: boolean;
}

// 定义模板代理状态
const TemplateAgentState = Annotation.Root({
  // 消息历史
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
  }),
  // 用户输入
  userInput: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
  // 模板上下文（从主图传入）
  templateContext: Annotation<{
    loadResult: TemplateLoadResult;
    langChainResult?: DocumentLoadResult;
    template?: Template;
  } | null>({
    reducer: (_, y) => y,
  }),
  // 是否应该生成代码
  shouldGenerateCode: Annotation<boolean>({
    reducer: (_, y) => y,
    default: () => false,
  }),
  // 生成的代码
  generatedCode: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
  // 文件操作列表
  fileOperations: Annotation<FileOperation[]>({
    reducer: (_, y) => y,
    default: () => [],
  }),
  // 错误信息
  error: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
});

export type TemplateAgentStateType = typeof TemplateAgentState.State;

/**
 * 用户输入处理节点
 * 处理用户输入并添加到消息历史
 */
const userInputNode = async (state: TemplateAgentStateType) => {
  // 获取用户输入
  const userInput = state.userInput;
  console.log(`[TemplateAgent] userInputNode 收到输入: ${userInput ? `"${userInput}"` : "无输入"}`);

  // 获取当前状态中的消息数组
  const currentMessages = state.messages || [];
  console.log(`[TemplateAgent] userInputNode 当前消息历史有 ${currentMessages.length} 条消息`);

  // 如果没有用户输入，直接返回当前状态
  if (!userInput) {
    console.log(`[TemplateAgent] userInputNode 没有输入，返回当前消息历史`);
    return { messages: currentMessages };
  }

  // 创建用户消息
  const userMessage = new HumanMessage({
    content: userInput,
  });
  console.log(`[TemplateAgent] userInputNode 创建了新的用户消息: "${userInput}"`);

  // 返回更新后的消息数组和清空用户输入
  const updatedMessages = [...currentMessages, userMessage];

  return {
    messages: updatedMessages,
    userInput: null, // 清空用户输入，防止重复处理
  };
};

/**
 * 模板信息查询节点
 * 只负责分析用户意图和模板信息，判断是回答模板问题还是生成代码
 * 不负责实际生成代码，只做意图判断和模板信息提供
 */
const queryTemplateInfoNode = async (state: TemplateAgentStateType, config?: RunnableConfig) => {
  console.log(`[TemplateAgent] queryTemplateInfoNode 开始分析用户意图和模板信息`);

  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    console.log(`[TemplateAgent] queryTemplateInfoNode 没有消息历史，返回错误`);
    return {
      error: "没有消息历史，无法分析用户意图",
    };
  }

  try {
    // 获取模板上下文（如果有）
    const templateContext = state.templateContext;

    // 创建响应类型解析器
    const responseTypeParser = StructuredOutputParser.fromZodSchema(responseTypeSchema);

    let templateSummary = "";

    if (templateContext?.langChainResult?.documents && templateContext.langChainResult.documents.length > 0) {
      const structureInfo = extractTemplateStructure(templateContext.langChainResult.documents);

      templateSummary = structureInfo.summary;

      console.log(`[TemplateAgent] 提取到模板结构信息，包含 ${structureInfo.keyFiles.length} 个文件`);
    }

    // 使用优化的模板分析提示词
    const systemPrompt = getTemplateAnalysisPrompt(responseTypeParser.getFormatInstructions(), templateSummary);

    // 过滤掉其他的系统消息，只保留用户和助手的消息
    const filteredMessages = messages.filter((msg) => msg.getType() === "human" || msg.getType() === "ai");

    // 准备发送给模型的消息
    const promptMessages = filteredMessages.slice(-5);

    // 调用模型
    console.log(`[TemplateAgent] queryTemplateInfoNode 调用模型处理请求`);
    const response = await invokeModel(promptMessages, systemPrompt, config);

    // 提取模型回复内容
    const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    console.log(`[TemplateAgent] 模型回复内容长度: ${content.length} 字符`);

    try {
      // 使用增强的响应解析器
      console.log(`[TemplateAgent] 解析器处理内容`);

      const parsedResponse = await responseTypeParser.parse(cleanJsonResponse(content)); //EnhancedResponseParser.parseResponse(content, responseTypeSchema);
      console.log(`[TemplateAgent] 解析到的响应类型:`, parsedResponse);

      // 创建AI回复消息
      const responseMessage = new AIMessage({
        content: parsedResponse.content,
      });

      // 直接返回是否继续生成代码
      return {
        messages: [...messages, responseMessage],
        // 添加一个标记，指示是否继续进行代码生成
        shouldGenerateCode: parsedResponse.responseType === "CODE_GENERATION",
      };
    } catch (parseError) {
      console.warn(`[TemplateAgent] 解析响应类型失败，默认视为模板信息响应:`, parseError);
      console.log(`[TemplateAgent] 原始内容:`, content);

      // 使用默认值不生成代码
      return {
        messages: [...messages, content],
        shouldGenerateCode: false,
      };
    }
  } catch (error) {
    console.error(`[TemplateAgent] queryTemplateInfoNode 处理失败:`, error);
    const errorMessage = new AIMessage({
      content: `查询模板信息时出错: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `查询模板信息失败: ${error instanceof Error ? error.message : String(error)}`,
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 代码生成节点
 * 专门负责根据用户需求和模板信息生成高质量代码
 * 这个节点只在用户需要生成代码时被调用
 */
const generateCodeNode = async (state: TemplateAgentStateType, config?: RunnableConfig) => {
  console.log(`[TemplateAgent] generateCodeNode 开始生成代码`);

  // 获取消息历史
  const messages = state.messages;

  // 如果有错误，直接返回
  if (state.error) {
    console.log(`[TemplateAgent] generateCodeNode 存在错误，跳过代码生成: ${state.error}`);
    return { error: state.error };
  }

  try {
    const responseTypeParser = StructuredOutputParser.fromZodSchema(responseTypeSchema);

    // 获取模板上下文（如果有）
    const templateContext = state.templateContext;

    // 提取模板结构信息和用户需求
    let templateStructure = "";
    if (templateContext?.langChainResult?.documents && templateContext.langChainResult.documents.length > 0) {
      const structureInfo = extractTemplateStructure(templateContext.langChainResult.documents);
      templateStructure = structureInfo.structure;
      console.log(`[TemplateAgent] 代码生成基于模板结构，包含 ${structureInfo.keyFiles.length} 个文件`);
    }

    // 提取用户具体需求
    const userRequirements = extractUserRequirements(messages);
    console.log(`[TemplateAgent] 提取到用户需求: ${userRequirements.substring(0, 100)}...`);

    // 使用优化的基于模板的代码生成提示词
    const systemPrompt = getTemplateBasedCodeGenerationPrompt(responseTypeParser.getFormatInstructions(), templateStructure, userRequirements);

    // 添加用户消息，以便模型了解具体需求
    const lastUserMessage = messages.filter((m) => m.getType() === "human");

    // 调用模型
    console.log(`[TemplateAgent] generateCodeNode 调用模型生成代码`);
    const response = await invokeModel(lastUserMessage!, systemPrompt, config);

    // 提取模型回复内容
    const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

    console.log(`[TemplateAgent] 原始模型回复长度: ${content.length} 字符`);
    console.log(`[TemplateAgent] 原始模型回复前200字符:`, content.substring(0, 200));

    // 使用多层解析策略
    let responseData: z.infer<typeof responseTypeSchema> | null = null;
    const responseMessage: AIMessage = new AIMessage({
      content: "",
    });
    let fileOperations: FileOperation[] | undefined = [];

    try {
      responseData = await responseTypeParser.parse(cleanJsonResponse(content));
      if (responseData) {
        console.log(`[TemplateAgent] 增强解析器成功解析`);
        fileOperations = responseData.fileOperations;
        responseMessage.content = responseData.content;
      }
    } catch (error) {
      console.warn(`[TemplateAgent] 增强解析器失败:`, error);
      console.warn(`[TemplateAgent] 原始模型回复内容 (可能导致解析失败):`, content);
    }

    return {
      fileOperations,
      messages: [...messages, responseMessage],
    };
  } catch (error) {
    console.error(`[TemplateAgent] generateCodeNode 处理失败:`, error);
    const errorMessage = new AIMessage({
      content: `生成代码时出错: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `生成代码失败: ${error instanceof Error ? error.message : String(error)}`,
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 创建模板代理
 *
 * 注意：此函数仅创建代理的结构，不会执行任何节点
 * 实际的节点执行将在首次调用app.invoke()时发生
 */
export function createTemplateAgent() {
  console.log("开始创建模板代理");

  try {
    // 定义工作流图
    console.log("[TemplateAgent] 创建状态图工作流");
    const workflow = new StateGraph(TemplateAgentState)
      .addNode("processUserInput", userInputNode)
      .addNode("queryTemplateInfo", queryTemplateInfoNode)
      .addNode("generateCode", generateCodeNode)
      .addEdge(START, "processUserInput")
      // 修改工作流程图中的节点连接关系
      .addEdge("processUserInput", "queryTemplateInfo")
      // 添加条件边，根据shouldGenerateCode决定是否生成代码
      .addConditionalEdges("queryTemplateInfo", (state) => {
        console.log(`[TemplateAgent] 条件边判断 shouldGenerateCode: ${state.shouldGenerateCode}`);
        return state.shouldGenerateCode ? "generateCode" : END;
      })
      .addEdge("generateCode", END);

    console.log("[TemplateAgent] 工作流图创建成功");

    console.log("[TemplateAgent] 编译工作流");
    const app = workflow.compile();

    console.log("[TemplateAgent] 已成功创建模板代理");

    // 返回应用
    return {
      app,
      // 提供一个处理函数，用于从主图调用
      handler: async (
        state: {
          messages?: BaseMessage[];
          userInput?: string;
          templateContext?: {
            loadResult: TemplateLoadResult;
            langChainResult?: DocumentLoadResult;
            template?: Template;
          } | null;
          [key: string]: unknown;
        },
        config?: RunnableConfig
      ) => {
        try {
          const templateAgentState = {
            messages: state.messages || [],
            userInput: state.userInput,
            templateContext: state.templateContext,
            generatedCode: null,
            fileOperations: [],
            error: null,
          };

          // 调用模板代理
          console.log("[TemplateAgent] 调用模板代理处理请求");
          const result = await app.invoke(templateAgentState, config);

          // 返回处理结果
          return {
            messages: result.messages,
            generatedCode: result.generatedCode,
            fileOperations: result.fileOperations || [],
            error: result.error,
          };
        } catch (error) {
          console.error("[TemplateAgent] 处理请求失败:", error);
          return {
            error: `模板代理处理失败: ${error instanceof Error ? error.message : String(error)}`,
          };
        }
      },
    };
  } catch (error) {
    console.error("创建模板代理失败:", error);
    throw new Error(`创建模板代理失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// 尝试修复常见的JSON问题
function fixCommonJsonIssues(jsonStr: string): string {
  // 尝试修复JSON中的换行符问题
  jsonStr = jsonStr
    .replace(/\\n/g, "\\n")
    .replace(/\\'/g, "\\'")
    .replace(/\\"/g, '\\"')
    .replace(/\\&/g, "\\&")
    .replace(/\\r/g, "\\r")
    .replace(/\\t/g, "\\t")
    .replace(/\\b/g, "\\b")
    .replace(/\\f/g, "\\f");
  // 尝试修复JSON中的注释问题
  jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  return jsonStr;
}

function cleanJsonResponse(content: string): string {
  // 移除```json 和 ``` 标记
  content = content.replace(/```json\s*/g, "");
  content = content.replace(/```\s*/g, "");

  // 移除其他可能的JSON标记
  content = content.replace(/<json>/g, "");
  content = content.replace(/<\/json>/g, "");

  // 提取JSON对象（从第一个 { 到最后一个 }）
  // 改进：使用更精确的正则表达式来匹配最外层的JSON对象
  const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    content = jsonMatch[1];
  } else {
    // 如果没有 ```json``` 标记，尝试匹配最外层的 {}
    const bracketMatch = content.match(/\{[\s\S]*\}/);
    if (bracketMatch) {
      content = bracketMatch[0];
    }
  }

  // 清理内容但保持JSON结构
  content = content.trim();

  // 应用通用的JSON修复
  content = fixCommonJsonIssues(content);

  return content;
}
