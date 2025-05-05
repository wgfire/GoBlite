// 从"@langchain/langgraph/web"导入必要的组件
import { END, START, StateGraph, Annotation, messagesStateReducer, MemorySaver } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";
import { createTemplateAgent } from "./templateAgent";
import { getRouterAnalysisPrompt } from "../prompts/routerPrompts";
import { getGeneralChatPrompt } from "../prompts/generalChatPrompts";
import { invokeModel } from "../utils/modelUtils";

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
      next: "generalChat", // 默认到通用对话
    };
  }

  try {
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
    
    // 检查是否有模板上下文
    const hasTemplateContext = state.templateContext !== null;
    console.log(`[RouterAgent] routerAnalysisNode 是否有模板上下文: ${hasTemplateContext}`);
    
    // 初始化意图覆盖变量
    let intentOverride = null;
    let nextOverride = null;
    
    // 如果有模板上下文，检查是否是模板相关的问题
    if (hasTemplateContext) {
      const userContent = typeof lastUserMessage.content === 'string' 
        ? lastUserMessage.content 
        : JSON.stringify(lastUserMessage.content);
      
      // 简单判断是否是模板相关的问题
      if (userContent.includes('模板') || userContent.includes('代码') || 
          userContent.includes('文件') || userContent.includes('实现')) {
        intentOverride = IntentType.TEMPLATE_QUERY;
        nextOverride = 'templateCreation';
        console.log(`[RouterAgent] 检测到模板相关问题，覆盖意图为: ${intentOverride}`);
      }
    }

    // 过滤掉错误消息后再发送给模型
    const filteredMessages = filterMessages(messages);
    const limitedMessages = filteredMessages.slice(-10); // 只取最近的10条消息，避免上下文过长

    // 使用工具函数调用模型
    const response = await invokeModel(limitedMessages, getRouterAnalysisPrompt(parser.getFormatInstructions()), config);

    // 解析结构化输出
    const parsedOutput = await parser.parse(typeof response.content === "string" ? response.content : JSON.stringify(response.content));
    console.log("路由分析结果:", parsedOutput);
    
    // 如果有意图覆盖，应用它
    if (intentOverride) {
      parsedOutput.intent = intentOverride;
      parsedOutput.next = nextOverride || parsedOutput.next;
      console.log(`[RouterAgent] 应用意图覆盖: ${intentOverride}, 下一步: ${parsedOutput.next}`);
    }

    // 如果是一般对话，直接将分析结果中的内容作为AI回复添加到消息历史
    if (parsedOutput.intent === IntentType.GENERAL_CHAT && !intentOverride) {
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
      next: nextOverride || parsedOutput.next,
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
 * 处理模板创建请求和模板查询请求
 */
const templateAgentNode = async (state: RouterStateType, config?: RunnableConfig) => {
  console.log(`[RouterAgent] templateAgentNode 开始处理模板相关请求`);

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
    const limitedMessages = filteredMessages.slice(-10); // 只取最近的10条消息
    
    // 获取模板文档信息
    const templateDocuments = templateContext.documents || [];
    console.log(`[RouterAgent] templateAgentNode 模板文档数量: ${templateDocuments.length}`);
   
    
    // 创建模板代理
    console.log(`[RouterAgent] 创建模板代理`);
    const templateAgent = createTemplateAgent();

    // 准备模板代理的初始状态
    const templateAgentState = {
      messages: limitedMessages,
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
 * 通用对话处理节点
 * 处理一般对话请求
 */
const generalChatNode = async (state: RouterStateType, config?: RunnableConfig) => {
  console.log(`[RouterAgent] generalChatNode 开始处理一般对话请求`, state.messages);

  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    return state;
  }

  try {
    // 过滤掉错误消息后再发送给模型
    const filteredMessages = filterMessages(messages);
    console.log(` generalChatNode 过滤后的消息历史有 ${filteredMessages.length} 条消息`);
    const limitedMessages = filteredMessages.slice(-10); // 只取最近10条消息，避免上下文过长
    
    // 检查是否有模板上下文
    const hasTemplateContext = state.templateContext !== null;
    console.log(`[RouterAgent] generalChatNode 是否有模板上下文: ${hasTemplateContext}`);
    
    // 准备提示词
    let prompt = getGeneralChatPrompt();
    
    // 如果有模板上下文，添加模板信息到提示词
    if (hasTemplateContext && state.templateContext) {
      const templateInfo = state.templateContext.template ? 
        `模板名称: ${state.templateContext.template.name}\n模板描述: ${state.templateContext.template.description || '无描述'}` : 
        '有模板上下文但缺少模板信息';
      
      // 扩展提示词，添加模板信息
      prompt = `${prompt}\n\n当前已加载模板信息:\n${templateInfo}\n\n请在回答用户问题时考虑这个模板的上下文。`;
      console.log(`[RouterAgent] generalChatNode 添加了模板信息到提示词`);
    }

    // 使用工具函数调用模型
    console.log(`[RouterAgent] generalChatNode 调用模型处理对话`);
    const response = await invokeModel(limitedMessages, prompt, config);

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
