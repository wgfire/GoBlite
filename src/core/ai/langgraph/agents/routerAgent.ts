// 从"@langchain/langgraph/web"导入必要的组件
import { END, START, StateGraph, Annotation, messagesStateReducer, MemorySaver } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { createTemplateAgent } from "./templateAgent";
import { getRouterAnalysisPrompt } from "../prompts/routerPrompts";
import { invokeModel } from "../utils/modelUtils";
import { Template, TemplateLoadResult } from "@/template/types";
import { DocumentLoadResult } from "@/core/ai";
// 定义意图类型
export enum IntentType {
  TEMPLATE_CREATION = "template_creation", // 用户想要基于模板创建代码
  DOCUMENT_ANALYSIS = "document_analysis", // 用户想要分析上传的文档
  IMAGE_ANALYSIS = "image_analysis", // 用户想要分析上传的图片
  GENERAL_CHAT = "general_chat", // 用户想要进行一般对话
}

// 定义路由结果的输出格式
const routerOutputSchema = z.object({
  intent: z.nativeEnum(IntentType).describe("用户意图类型"),
  confidence: z.number().min(0).max(1).describe("意图识别的置信度"),
  explanation: z.string().describe("意图识别的解释"),
  next: z.string().describe("下一个要执行的节点名称"),
  content: z.string().describe("大模型对用户的回复内容"),
});

// 定义错误消息元数据类型
export interface ErrorMetadata {
  isError: boolean;
}

/**
 * 过滤消息历史，移除错误消息
 * @param messages 消息历史
 * @returns 过滤后的消息历史
 */
const filterMessages = (messages: BaseMessage[]): BaseMessage[] => {
  // 过滤掉带有 isError 元数据的消息
  return messages.filter((message) => {
    // 检查消息是否有元数据，以及元数据中是否标记为错误消息
    const metadata = message.additional_kwargs?.metadata as ErrorMetadata | undefined;
    return !metadata?.isError;
  });
};

// 定义图的状态结构
const RouterState = Annotation.Root({
  // 定义messages字段，类型为BaseMessage数组
  messages: Annotation<BaseMessage[]>({
    // 定义reducer函数，用于合并消息数组
    reducer: messagesStateReducer,
  }),
  userInput: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
  // 下一个要执行的节点
  next: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
  // 路由分析的详细结果
  routerAnalysis: Annotation<z.infer<typeof routerOutputSchema> | null>({
    reducer: (_, y) => y,
  }),
  // 错误信息
  error: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
  /**前端模版上下文 */
  templateContext: Annotation<{
    loadResult: TemplateLoadResult;
    langChainResult?: DocumentLoadResult;
    template?: Template;
  } | null>({
    reducer: (_, y) => y,
  }),
  /**生成的代码 */
  generatedCode: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
  /**初始化标记，用于标识是否是初始化调用 */
  isInitializing: Annotation<boolean>({
    reducer: (_, y) => y,
  }),
  /**标记是否已经有回复，避免重复调用大模型 */
  hasResponse: Annotation<boolean>({
    reducer: (_, y) => y,
  }),
});

export type RouterStateType = typeof RouterState.State;

/**
 * 用户输入处理节点
 * 处理用户输入并添加到消息历史
 */
const userInputNode = async (state: RouterStateType) => {
  // 检查是否是初始化调用
  if (state.isInitializing === true) {
    console.log("userInputNode 检测到初始化调用，跳过消息处理");
    // 返回当前状态，但设置标记表明这是初始化调用
    return {
      ...state,
      isInitializing: true,
    };
  }

  // 获取用户输入
  const userInput = state.userInput;
  console.log(`userInputNode 收到输入: ${userInput ? `"${userInput}"` : "无输入"}`);

  // 获取当前状态中的消息数组
  const currentMessages = state.messages || [];
  console.log(`userInputNode 当前消息历史有 ${currentMessages.length} 条消息`);

  // 如果没有用户输入，直接返回当前状态
  if (!userInput) {
    console.log(`userInputNode 没有输入，返回当前消息历史`);
    return { messages: currentMessages };
  }

  // 创建用户消息
  const userMessage = new HumanMessage({
    content: userInput,
  });
  console.log(`userInputNode 创建了新的用户消息: "${userInput}"`);

  // 返回更新后的消息数组和清空用户输入
  const updatedMessages = [...currentMessages, userMessage];

  return {
    messages: updatedMessages,
    userInput: null, // 清空用户输入，防止重复处理
    isInitializing: false, // 确保初始化标记被清除
  };
};

/**
 * 路由分析节点
 * 分析用户意图并确定下一步操作
 */
const routerAnalysisNode = async (state: RouterStateType, config?: RunnableConfig) => {
  // 获取消息历史
  const messages = state.messages;
  console.log(messages, "历史消息");

  // 如果没有消息，返回空结果
  if (!messages || messages.length === 0) {
    console.log("routerAnalysisNode 没有消息历史，返回空结果");
    return {
      error: "没有消息历史",
      next: null, // 由于 generalChat 已被移除，直接返回 null
    };
  }

  try {
    // 创建结构化输出解析器
    const parser = StructuredOutputParser.fromZodSchema(routerOutputSchema);
    // 过滤掉错误消息后再发送给模型
    const filteredMessages = filterMessages(messages);
    const limitedMessages = filteredMessages.slice(-10); // 只取最近的10条消息，避免上下文过长

    // 使用工具函数调用模型
    const response = await invokeModel(limitedMessages, getRouterAnalysisPrompt(parser.getFormatInstructions()), config);

    // 解析结构化输出
    const parsedOutput = await parser.parse(typeof response.content === "string" ? response.content : JSON.stringify(response.content));
    console.log("路由分析结果:", parsedOutput);

    // 如果是一般对话，直接将分析结果中的内容作为AI回复添加到消息历史
    if (parsedOutput.intent === IntentType.GENERAL_CHAT) {
      console.log("检测到一般对话意图，直接使用分析结果中的内容作为回复");

      // 创建AI回复消息
      const responseMessage = new AIMessage({
        content: parsedOutput.content,
      });

      return {
        routerAnalysis: parsedOutput,
        messages: [...messages, responseMessage],
        // 设置标记，表示已经有回复，避免generalChatNode再次调用大模型
        hasResponse: true,
      };
    }

    // 其他意图正常返回
    return {
      routerAnalysis: parsedOutput,
      messages: [...messages],
      next: parsedOutput.next,
      hasResponse: false,
      error: "",
    };
  } catch (error) {
    console.error("routerAnalysisNode 处理失败:", error);
    const errorMessage = new AIMessage({
      content: `调用模型时出错: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `路由分析失败: ${error instanceof Error ? error.message : String(error)}`,
      next: null, // 由于 generalChat 已被移除，直接返回 null
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 路由决策节点
 * 根据分析结果决定使用哪个子图处理请求
 */
const routerDecisionNode = async (state: RouterStateType) => {
  const analysis = state.routerAnalysis;

  if (!analysis) {
    // 由于 generalChat 已被移除，直接返回 null
    // routerDecision 节点会将 null 视为直接结束
    return { next: null };
  }

  // 根据分析的意图决定下一步
  switch (analysis.intent) {
    case IntentType.TEMPLATE_CREATION:
      return { next: "templateCreation" };
    case IntentType.DOCUMENT_ANALYSIS:
      return { next: "documentAnalysis" };
    case IntentType.IMAGE_ANALYSIS:
      return { next: "imageAnalysis" };
    default:
      return { next: null };
  }
};

// 缓存模板代理实例，避免重复创建
let cachedTemplateAgent: ReturnType<typeof createTemplateAgent> | null = null;

/**
 * 模板代理处理节点
 * 统一处理所有模板相关请求，包括模板创建和模板查询
 * 模板代理内部会根据用户意图决定具体操作
 */
const templateAgentNode = async (
  state: RouterStateType,
  config?: RunnableConfig
): Promise<{
  messages?: BaseMessage[];
  generatedCode?: string | null;
  fileOperations?: Array<{
    path: string;
    content: string;
    action: string;
    language?: string;
  }>;
  error?: string;
}> => {
  console.log(`[RouterAgent] templateAgentNode 开始统一处理模板相关请求`);

  // 获取消息历史和模板上下文
  const messages = state.messages;
  const templateContext = state.templateContext;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    console.log(`[RouterAgent] templateAgentNode 没有消息历史，返回错误`);
    return {
      error: "没有消息历史，无法处理模板相关请求",
    };
  }

  // 检查是否有模板上下文
  if (!templateContext) {
    console.log(`[RouterAgent] templateAgentNode 没有模板上下文，返回错误`);
    const errorMessage = new AIMessage({
      content: `请先选择一个模板，然后再进行模板相关的操作。`,
    });
    return {
      error: "没有模板上下文，请先选择模板",
      messages: [...messages, errorMessage],
    };
  }

  try {
    // 过滤掉错误消息后再发送给模型
    const filteredMessages = filterMessages(messages);

    // 只取最近的消息，优化上下文长度
    // 对于模板操作，通常只需要最近的几条消息就足够了
    const limitedMessages = filteredMessages.slice(-5); // 减少到5条消息，提高效率

    // 获取模板文档信息
    const templateDocuments = templateContext?.langChainResult?.documents || [];
    console.log(`[RouterAgent] templateAgentNode 模板文档数量: ${templateDocuments.length}`);

    // 创建或获取缓存的模板代理
    // 使用模块级缓存，避免重复创建模板代理实例
    if (!cachedTemplateAgent) {
      console.log(`[RouterAgent] 首次创建模板代理并缓存`);
      cachedTemplateAgent = createTemplateAgent();
    } else {
      console.log(`[RouterAgent] 使用缓存的模板代理实例`);
    }

    const templateAgent = cachedTemplateAgent;

    // 准备模板代理的初始状态
    const templateAgentState = {
      messages: limitedMessages,
      userInput: state.userInput || undefined, // 使用undefined而不是null，以匹配templateAgent的类型
      templateContext: templateContext,
      fileOperations: [], // 添加fileOperations字段
      generatedCode: null,
    };

    // 调用模板代理
    console.log(`[RouterAgent] 调用模板代理处理请求`);
    const result = await templateAgent.handler(templateAgentState, config);

    // 如果有错误，返回错误
    if (result.error) {
      console.error(`[RouterAgent] 模板代理处理失败:`, result.error);
      return {
        error: result.error,
        messages: result.messages || messages,
      };
    }

    // 返回处理结果
    return {
      messages: result.messages,
      generatedCode: result.generatedCode,
      fileOperations: result.fileOperations || [], // 添加文件操作
    };
  } catch (error) {
    console.error(`[RouterAgent] templateAgentNode 处理失败:`, error);
    const errorMessage = new AIMessage({
      content: `处理模板请求失败: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `处理模板请求失败: ${error instanceof Error ? error.message : String(error)}`,
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 创建带有路由功能的代理
 * 实际的节点执行将在首次调用app.invoke()时发生
 */
export function createRouterAgent() {
  console.log("开始创建带有路由功能的代理");

  // 创建内置MemorySaver实例用于保存历史记录
  const memorySaver = new MemorySaver();
  try {
    // 定义工作流图
    console.log("创建状态图工作流");
    const workflow = new StateGraph(RouterState)
      .addNode("processUserInput", userInputNode)
      .addNode("analysis", routerAnalysisNode)
      .addNode("routerDecision", routerDecisionNode)
      .addNode("templateAgent", templateAgentNode)
      .addNode("resetInitializing", () => {
        return { isInitializing: false };
      })
      .addEdge(START, "processUserInput") // 从开始到用户输入
      // 添加条件边，检查是否是初始化调用
      .addConditionalEdges(
        "processUserInput",
        (state) => {
          // 如果是初始化调用，直接跳到结束
          if (state.isInitializing === true) {
            console.log("检测到初始化调用，直接跳到结束");
            return "resetInitializing";
          }
          // 否则继续正常流程
          return "analysis";
        },
        {
          resetInitializing: "resetInitializing",
          analysis: "analysis", // 正常流程继续分析
        }
      )

      .addEdge("resetInitializing", END)
      .addConditionalEdges("analysis", (state) => {
        if (state.hasResponse === true) {
          return END;
        }
        return "routerDecision";
      })
      .addConditionalEdges(
        "routerDecision",
        (state) => {
          console.log(state.next, "下一步操作节点");
          if (!state.next) {
            return END;
          }
          return state.next;
        },
        {
          // 所有模板相关操作都路由到统一的templateAgent节点
          templateCreation: "templateAgent",
          // 其他节点可以在这里添加
        }
      )
      .addEdge("templateAgent", END); // 从模板代理到结束

    // 编译工作流但不执行任何节点
    const app = workflow.compile({
      checkpointer: memorySaver,
    });

    console.log("已成功创建带有路由功能的代理");

    // 返回应用
    return {
      app,
    };
  } catch (error) {
    console.error("创建路由代理失败:", error);
    throw new Error(`创建路由代理失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}
