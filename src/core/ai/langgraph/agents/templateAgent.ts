// 从"@langchain/langgraph/web"导入必要的组件
import { END, START, StateGraph, Annotation, messagesStateReducer } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { ModelFactory } from "../../langchain/models/modelFactory";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { Template, TemplateLoadResult } from "@/template/types";
import { DocumentLoadResult } from "@/core/ai";
import { invokeModel } from "../utils";
import { FileOperationType, FileOperation } from "../../types/templateResponse";
import { extractFileOperationsFromCodeBlocks } from "../../utils/fileOperationTools";

// 定义响应类型结构
const responseTypeSchema = z.object({
  responseType: z.enum(["TEMPLATE_INFO", "CODE_GENERATION"]).describe("响应类型，表明是提供模板信息还是生成代码"),
  explanation: z.string().describe("选择该响应类型的原因说明"),
  content: z.string().describe("响应内容"),
  fileOperations: z
    .array(
      z.object({
        path: z.string().describe("文件路径"),
        content: z.string().describe("文件内容"),
        action: z.enum(["create", "update", "delete"]).describe("操作类型"),
        language: z.string().optional().describe("文件语言"),
      })
    )
    .optional()
    .describe("文件操作列表，仅在CODE_GENERATION类型时使用"),
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
    // 使用ModelFactory创建模型
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    const model = ModelFactory.createModel(modelConfig);

    if (!model) {
      console.error(`[TemplateAgent] queryTemplateInfoNode 无法创建模型，返回错误消息`);
      return {
        error: "无法创建 AI 模型",
      };
    }

    // 获取模板上下文（如果有）
    const templateContext = state.templateContext;

    // 创建响应类型解析器
    const responseTypeParser = StructuredOutputParser.fromZodSchema(responseTypeSchema);

    // 提取模板文档内容（如果有）
    let documentContents = "";
    if (templateContext?.langChainResult?.documents && templateContext.langChainResult.documents.length > 0) {
      documentContents = templateContext.langChainResult.documents
        .map((doc: { metadata?: { source?: string }; pageContent?: string }) => {
          const source = doc.metadata?.source || "未知文件";
          const content = doc.pageContent ? doc.pageContent : "无内容";
          return `文件: ${source}\n内容:\n${content}`;
        })
        .join("\n\n====================\n\n");
    }

    // 创建系统提示 - 专注于意图分析，不生成代码
    const systemPrompt = `你是一个专业的前端开发模板分析专家。你的任务是分析用户的请求，判断用户意图：

      1. 如果用户想了解模板信息，请提供详细的模板解释，帮助用户理解模板里的前端组件功能，不需要关注前端代码层面的实现细节
      2. 如果用户想要生成代码，请简要说明你理解的需求，并标记为需要代码生成，但不要在这个阶段生成实际代码

      请注意：你的任务是判断用户意图并提供分析，不是生成代码。如果用户需要代码生成，另一个专门的代码生成专家会处理。

      ${responseTypeParser.getFormatInstructions()}

      ${documentContents ? `模板文件内容：\n${documentContents}` : "无可用的模板文件内容"}
`;

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
      // 预处理内容，处理可能包含的代码块
      console.log(`[TemplateAgent] 预处理响应内容`);
      // const preprocessedContent = preprocessContentWithCodeBlocks(content);

      // 尝试解析响应类型
      let parsedResponse;
      try {
        parsedResponse = await responseTypeParser.parse(content);
      } catch (preprocessError) {
        console.warn(`[TemplateAgent] 预处理后解析仍然失败，尝试直接解析原始内容:`, preprocessError);
        // 如果预处理后仍然解析失败，尝试直接解析原始内容
        parsedResponse = await responseTypeParser.parse(content);
      }

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
      shouldGenerateCode: false,
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
    let documentContents = "";
    if (templateContext?.langChainResult?.documents && templateContext.langChainResult.documents.length > 0) {
      documentContents = templateContext.langChainResult.documents
        .map((doc: { metadata?: { source?: string }; pageContent?: string }) => {
          const source = doc.metadata?.source || "未知文件";
          const content = doc.pageContent ? doc.pageContent : "无内容";
          return `文件: ${source}\n内容:\n${content}`;
        })
        .join("\n\n====================\n\n");
    }

    // 创建专门的代码生成系统提示
    const systemPrompt = `你是一个专业的前端开发代码生成专家。你的任务是根据提供的模板和用户需求生成高质量的代码。

      请遵循以下原则：
      1. 代码应该遵循最佳实践和设计模式
      2. 代码应该清晰、可读、易于维护
      3. 代码应该包含适当的注释
      4. 代码应该考虑性能和可扩展性

      请以文件操作的形式返回代码，每个文件应该包含完整的代码，格式如下：

      ${responseTypeParser.getFormatInstructions()}

      你可以生成多个文件，每个文件都应该使用上述格式。
      请确保生成的代码是完整的，可以直接使用的。
      ${documentContents ? `代码模板文件内容：\n${documentContents}` : "无可用的模板文件内容"}
      `;

    // 添加用户消息，以便模型了解具体需求
    const lastUserMessage = messages.filter((m) => m.getType() === "human");

    // 调用模型
    console.log(`[TemplateAgent] generateCodeNode 调用模型生成代码`);
    const response = await invokeModel(lastUserMessage!, systemPrompt, config);

    // 提取代码
    const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

    // 从回复中提取文件操作
    const responseData = await responseTypeParser.parse(content);
    const fileOperations = responseData.fileOperations ?? [];
    // extractFileOperationsFromCodeBlocks(content);

    console.log(`[TemplateAgent] 提取到 ${fileOperations.length} 个文件操作`);

    // 如果没有提取到文件操作，尝试从代码块中提取
    let generatedCode = "";
    if (fileOperations.length === 0) {
      // 尝试从回复中提取代码块
      const codeBlockRegex = /```(?:jsx|tsx|vue|html|css|javascript|typescript)?\n([\s\S]*?)\n```/;
      const match = content.match(codeBlockRegex);
      generatedCode = match ? match[1] : content;

      // 如果提取到代码，创建一个默认的文件操作
      if (generatedCode) {
        fileOperations.push({
          path: "generated_code.js", // 默认文件名
          content: generatedCode,
          action: FileOperationType.CREATE,
          language: "javascript",
        });
      }
    } else {
      // 使用第一个文件操作的内容作为生成的代码
      generatedCode = fileOperations[0].content;
    }

    console.log(`[TemplateAgent] 生成的代码长度: ${generatedCode.length} 字符`);

    // 创建文件操作描述
    const fileOperationsDescription = fileOperations
      .map((op) => `- ${op.action === FileOperationType.CREATE ? "创建" : op.action === FileOperationType.UPDATE ? "更新" : "删除"} 文件: ${op.path}`)
      .join("\n");

    // 创建AI回复消息
    const responseMessage = new AIMessage({
      content: `我已根据您的需求生成了以下代码：

\`\`\`
${generatedCode}
\`\`\`

${fileOperations.length > 0 ? `将执行以下文件操作：\n${fileOperationsDescription}` : ""}

您可以直接使用这些代码。如果需要任何修改或有其他问题，请告诉我。`,
    });

    return {
      generatedCode,
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
          [key: string]: any;
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
