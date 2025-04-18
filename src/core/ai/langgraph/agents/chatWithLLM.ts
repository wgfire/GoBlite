// 从"@langchain/langgraph/web"导入必要的组件
import {
  END, // 表示图的结束节点
  START, // 表示图的开始节点
  StateGraph, // 状态图类，用于构建工作流
  Annotation, // 注解工具，用于定义状态结构和合并逻辑
} from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages"; // 导入消息类型
import { type RunnableConfig, RunnableLambda } from "@langchain/core/runnables"; // 导入可运行配置和Lambda函数
import { type StreamEvent } from "@langchain/core/tracers/log_stream"; // 导入流事件类型
import { ModelFactory } from "../../langchain/models/modelFactory"; // 导入模型工厂
import { ModelProvider, ModelType } from "../../types";

// 定义图的状态结构
const ChatAgentState = Annotation.Root({
  // 定义messages字段，类型为BaseMessage数组
  messages: Annotation<BaseMessage[]>({
    // 定义reducer函数，用于合并消息数组
    reducer: (x, y) => x.concat(y), // 当有新消息时，将其追加到现有消息数组
  }),
  // 定义模型配置
  modelConfig: Annotation<{
    provider: ModelProvider;
    modelType: ModelType;
    apiKey: string;
    temperature?: number;
    maxTokens?: number;
  }>({
    // 配置更新时替换整个对象
    reducer: (_, y) => y,
  }),
});

/**
 * 创建LLM模型节点
 * 根据状态中的模型配置创建并调用LLM
 */
const llmNode = async (state: typeof ChatAgentState.State, config?: RunnableConfig) => {
  // 获取消息历史
  const messages = state.messages;
  
  // 如果没有消息，返回空结果
  if (!messages || messages.length === 0) {
    return { messages: [] };
  }
  
  // 获取模型配置
  const modelConfig = state.modelConfig;
  if (!modelConfig || !modelConfig.apiKey) {
    // 如果没有配置模型，返回错误消息
    return {
      messages: [
        new AIMessage("错误：未配置模型或API密钥。请先设置模型配置。")
      ]
    };
  }
  
  try {
    // 使用ModelFactory创建模型
    const model = ModelFactory.createModel(modelConfig);
    
    if (!model) {
      return {
        messages: [
          new AIMessage(`错误：无法创建模型 (${modelConfig.provider}:${modelConfig.modelType})。请检查API密钥和配置。`)
        ]
      };
    }
    
    // 调用模型获取响应
    const response = await model.invoke(messages, config);
    
    // 返回模型响应
    return {
      messages: [response]
    };
  } catch (error) {
    console.error("LLM调用失败:", error);
    return {
      messages: [
        new AIMessage(`调用模型时出错: ${error instanceof Error ? error.message : String(error)}`)
      ]
    };
  }
};

/**
 * 用户输入处理节点
 * 将用户输入转换为HumanMessage并添加到状态
 */
const userInputNode = async (
  state: typeof ChatAgentState.State,
  options: Record<string, any>
) => {
  // 创建用户消息
  const userMessage = new HumanMessage(options.userInput);
  
  // 返回更新后的消息数组
  return {
    messages: [userMessage]
  };
};

/**
 * 创建聊天代理
 * @param apiKey API密钥
 * @param provider 模型提供商
 * @param modelType 模型类型
 * @param temperature 温度参数
 * @param maxTokens 最大token数
 */
export function createChatAgent(
  apiKey: string,
  provider: ModelProvider = ModelProvider.OPENAI,
  modelType: ModelType = ModelType.GPT4O,
  temperature: number = 0.7,
  maxTokens: number = 2000
) {
  // 创建初始状态
  const initialState = {
    messages: [
      new SystemMessage("你是一个有用的AI助手，能够回答用户的问题并提供帮助。")
    ],
    modelConfig: {
      provider,
      modelType,
      apiKey,
      temperature,
      maxTokens
    }
  };
  
  // 定义工作流图
  const workflow = new StateGraph(ChatAgentState)
    .addNode("userInput", userInputNode)
    .addNode("llm", llmNode) // 添加LLM处理节点
    .addEdge(START, "userInput") // 从开始到用户输入
    .addEdge("userInput", "llm") // 从用户输入到LLM
    .addEdge("llm", END); // 从LLM到结束
  
  // 编译工作流
  const app = workflow.compile();
  
  // 返回应用和初始状态
  return {
    app,
    initialState
  };
}

/**
 * 使用聊天代理发送消息
 * @param app 编译后的应用
 * @param state 当前状态
 * @param userInput 用户输入
 * @param streaming 是否使用流式响应
 * @param onUpdate 流式更新回调
 */
export async function sendMessage(
  app: any,
  state: typeof ChatAgentState.State,
  userInput: string,
  streaming: boolean = false,
  onUpdate?: (content: string) => void
) {
  try {
    if (streaming && onUpdate) {
      // 使用流式响应
      const eventStream = app.streamEvents(
        state,
        { userInput },
        { version: "v2" }
      );
      
      let currentContent = "";
      
      // 处理流式事件
      for await (const event of eventStream) {
        if (event.event === "on_chain_end" && event.name === "llm") {
          const output = event.data.output;
          if (output && output.messages && output.messages[0]) {
            currentContent = output.messages[0].content;
            onUpdate(currentContent);
          }
        }
      }
      
      // 返回最终状态和内容
      return {
        newState: await app.invoke(state, { userInput }),
        content: currentContent
      };
    } else {
      // 非流式响应
      const newState = await app.invoke(state, { userInput });
      
      // 获取最新的AI消息
      const messages = newState.messages;
      const lastMessage = messages[messages.length - 1];
      
      return {
        newState,
        content: lastMessage.content
      };
    }
  } catch (error) {
    console.error("发送消息失败:", error);
    throw error;
  }
}

// 示例用法
async function example() {
  // 创建聊天代理（使用您的API密钥）
  const { app, initialState } = createChatAgent(
    "your-api-key-here", // 替换为您的API密钥
    ModelProvider.OPENAI,
    ModelType.GPT4O
  );
  
  // 发送消息并获取响应
  const { newState, content } = await sendMessage(
    app,
    initialState,
    "你好，请介绍一下自己！"
  );
  
  console.log("AI响应:", content);
  
  // 继续对话（使用更新后的状态）
  const { newState: updatedState, content: secondResponse } = await sendMessage(
    app,
    newState,
    "你能帮我解释一下什么是LangGraph吗？"
  );
  
  console.log("AI第二次响应:", secondResponse);
}

// 如果需要运行示例，取消下面的注释
// example().catch(console.error);
