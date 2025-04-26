// 从"@langchain/langgraph/web"导入必要的组件
import { END, START, StateGraph, Annotation, messagesStateReducer, MemorySaver } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { ModelFactory } from "../../langchain/models/modelFactory";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { createTemplateAgent } from "./templateAgent";

// 定义意图类型
export enum IntentType {
  TEMPLATE_CREATION = "template_creation", // 用户想要基于模板创建代码
  TEMPLATE_QUERY = "template_query", // 用户想要查询模板信息
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
  templateContext: Annotation<Record<string, unknown> | null>({
    reducer: (_, y) => y,
  }),
  /**生成的代码 */
  generatedCode: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
});

export type RouterStateType = typeof RouterState.State;

/**
 * 用户输入处理节点
 * 处理用户输入并添加到消息历史
 */
const userInputNode = async (state: RouterStateType) => {
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
  };
};

/**
 * 路由分析节点
 * 分析用户意图并确定下一步操作
 */
const routerAnalysisNode = async (state: RouterStateType, config?: RunnableConfig) => {
  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回空结果
  if (!messages || messages.length === 0) {
    console.log("routerAnalysisNode 没有消息历史，返回空结果");
    return {
      error: "没有消息历史",
      next: "generalChat", // 默认到通用对话
    };
  }

  try {
    // 使用ModelFactory创建模型
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    const model = ModelFactory.createModel(modelConfig);

    if (!model) {
      console.error("routerAnalysisNode 无法创建模型，返回错误消息");
      return {
        error: "无法创建 AI 模型",
        next: "generalChat", // 默认到通用对话
      };
    }

    // 创建结构化输出解析器
    const parser = StructuredOutputParser.fromZodSchema(routerOutputSchema);

    // 获取最后一条用户消息
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.getType() !== "human") {
      return {
        error: "最后一条消息不是用户消息",
        next: "generalChat", // 默认到通用对话
      };
    }

    // 创建系统提示
    const systemPrompt = new SystemMessage(
      `你是一个意图分析专家，负责分析用户输入并确定他们想要执行的操作。
      可能的意图有：
      - template_creation: 用户想要基于模板创建代码
      - template_query: 用户想要查询模板信息
      - document_analysis: 用户想要分析上传的文档
      - image_analysis: 用户想要分析上传的图片
      - general_chat: 用户想要进行一般对话
      如果是一般对话的意图，你是一个专业的前端开发和网页设计师，能够回答用户相关的前端问题和设计页面问题，其他问题回复不知道即可
      ${parser.getFormatInstructions()}`
    );

    // 过滤掉错误消息后再发送给模型
    const filteredMessages = filterMessages(messages);

    // 准备发送给模型的消息
    const promptMessages = [
      systemPrompt,
      ...filteredMessages.slice(-5), // 只取最近的5条消息，避免上下文过长
    ];

    // 调用模型
    const response = await model.invoke(promptMessages, config);

    // 解析结构化输出
    const parsedOutput = await parser.parse(typeof response.content === "string" ? response.content : JSON.stringify(response.content));
    console.log("路由分析结果:", parsedOutput);

    return {
      routerAnalysis: parsedOutput,
      messages: [...messages],
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
      next: "generalChat", // 出错时默认到通用对话
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
    return { next: "generalChat" }; // 默认到通用对话
  }

  // 根据分析的意图决定下一步
  switch (analysis.intent) {
    case IntentType.TEMPLATE_CREATION:
      return { next: "templateCreation" };
    case IntentType.DOCUMENT_ANALYSIS:
      return { next: "documentAnalysis" };
    case IntentType.IMAGE_ANALYSIS:
      return { next: "imageAnalysis" };
    case IntentType.TEMPLATE_QUERY:
      return { next: "templateQuery" };
    default:
      return { next: "generalChat" };
  }
};

/**
 * 模板代理处理节点
 * 处理模板创建请求
 */
const templateAgentNode = async (state: RouterStateType, config?: RunnableConfig) => {
  console.log(`[RouterAgent] templateAgentNode 开始处理模板创建请求`);

  // 获取消息历史和模板上下文
  const messages = state.messages;
  const templateContext = state.templateContext;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    console.log(`[RouterAgent] templateAgentNode 没有消息历史，返回错误`);
    return {
      error: "没有消息历史，无法处理模板创建请求",
    };
  }

  try {
    // 创建模板代理
    console.log(`[RouterAgent] 创建模板代理`);
    const templateAgent = createTemplateAgent();

    // 准备模板代理的初始状态
    const templateAgentState = {
      messages: messages, // 只取最近的10条消息,
      userInput: state.userInput,
      templateContext: templateContext,
      templateParams: null,
      generatedCode: null,
      error: null,
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
    };
  } catch (error) {
    console.error(`[RouterAgent] templateAgentNode 处理失败:`, error);
    const errorMessage = new AIMessage({
      content: `模板创建失败: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `模板创建失败: ${error instanceof Error ? error.message : String(error)}`,
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 通用对话处理节点
 * 处理一般对话请求
 */
const generalChatNode = async (state: RouterStateType, config?: RunnableConfig) => {
  console.log(`[RouterAgent] generalChatNode 开始处理一般对话请求`,state.messages);

  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    return state;
  }

  try {
    // 使用ModelFactory创建模型
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    const model = ModelFactory.createModel(modelConfig);

    if (!model) {
      console.error(`[RouterAgent] generalChatNode 无法创建模型，返回错误消息`);
      return {
        error: "无法创建 AI 模型",
      };
    }

    // 创建系统提示
    const systemPrompt = new SystemMessage(
      `你是一个专业的前端开发和网页设计师，能够回答用户相关的前端问题和设计页面问题。
      你应该提供清晰、准确、有用的信息，并尽量包含代码示例或具体建议。
      如果用户提出的问题与前端开发或网页设计无关，请礼谐地说明你只能回答相关领域的问题。`
    );

    // 过滤掉错误消息后再发送给模型
    const filteredMessages = filterMessages(messages);
    console.log(` generalChatNode 过滤后的消息历史有 ${filteredMessages.length} 条消息`);

    // 准备发送给模型的消息
    const promptMessages = [
      systemPrompt,
      ...filteredMessages.slice(-10), // 只取最近10条消息，避免上下文过长
    ];

    // 调用模型
    console.log(`[RouterAgent] generalChatNode 调用模型处理对话`);
    const response = await model.invoke(promptMessages, config);

    // 创建AI回复消息
    const responseMessage = new AIMessage({
      content: typeof response.content === "string" ? response.content : JSON.stringify(response.content),
    });

    return {
      messages: [...messages, responseMessage],
    };
  } catch (error) {
    console.error(`[RouterAgent] generalChatNode 处理失败:`, error);
    const errorMessage = new AIMessage({
      content: `处理对话失败: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `处理对话失败: ${error instanceof Error ? error.message : String(error)}`,
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 创建带有路由功能的代理
 *
 * 注意：此函数仅创建代理的结构，不会执行任何节点
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
      .addNode("templateCreation", templateAgentNode)
      .addNode("generalChat", generalChatNode)
      .addEdge(START, "processUserInput") // 从开始到用户输入
      .addEdge("processUserInput", "analysis") // 从用户输入到路由分析
      .addEdge("analysis", "routerDecision") // 从路由分析到路由决策
      .addConditionalEdges("routerDecision", (state) => state.next || "generalChat", {
        templateCreation: "templateCreation",
        generalChat: "generalChat",
        // 其他节点可以在这里添加
      })
      .addEdge("templateCreation", END) // 从模板创建到结束
      .addEdge("generalChat", END); // 从通用对话到结束

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
