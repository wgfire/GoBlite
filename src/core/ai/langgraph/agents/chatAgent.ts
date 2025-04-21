// 从"@langchain/langgraph/web"导入必要的组件
import {
  END, // 表示图的结束节点
  START, // 表示图的开始节点
  StateGraph, // 状态图类，用于构建工作流
  Annotation, // 注解工具，用于定义状态结构和合并逻辑
  messagesStateReducer,
  MemorySaver,
} from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages"; // 导入消息类型
import { type RunnableConfig } from "@langchain/core/runnables"; // 导入可运行配置和Lambda函数
import { ModelFactory } from "../../langchain/models/modelFactory"; // 导入模型工厂

// 使用内置MemorySaver

// 定义图的状态结构
const ChatState = Annotation.Root({
  // 定义messages字段，类型为BaseMessage数组
  messages: Annotation<BaseMessage[]>({
    // 定义reducer函数，用于合并消息数组
    reducer: messagesStateReducer,
  }),
  userInput: Annotation<string | null>({
    reducer: (_, y) => y,
  }),
});

console.log("初始化了ChatState状态结构");

export type ChatStateType = typeof ChatState.State;

/**
 * 创建LLM模型节点
 * 根据状态中的模型配置创建并调用LLM
 */
const llmNode = async (state: ChatStateType, config?: RunnableConfig) => {
  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回空结果
  if (!messages || messages.length === 0 || messages.length === 1) {
    console.log("llmNode 没有消息历史或者只有一个系统提示词，返回空结果");
    return { messages };
  }

  try {
    // 使用ModelFactory创建模型
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    const model = ModelFactory.createModel(modelConfig);

    if (!model) {
      console.error("llmNode 无法创建模型，返回错误消息");
      return {
        messages: [
          new AIMessage({
            content: `错误：无法创建 AI 模型。请检查模型配置和 API 密钥。`,
          }),
        ],
      };
    }

    try {
      const response = await model.invoke(messages, config);
      return {
        messages: [response],
      };
    } catch (invokeError) {
      console.error("llmNode 调用模型失败:", invokeError);
    }
  } catch (error) {
    console.error("llmNode 处理失败:", error);
  }
};

/**
 * 用户输入处理节点
 * 处理用户输入并添加到消息历史
 */
const userInputNode = async (state: typeof ChatState.State) => {
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
  console.log(`userInputNode 更新后的消息历史有 ${updatedMessages.length} 条消息`);

  return {
    messages: updatedMessages,
    userInput: null, // 清空用户输入，防止重复处理
  };
};

/**
 * 创建带有记忆功能的聊天代理
 * 使用MemorySaver自动保存状态
 */
export function createChatAgent() {
  console.log("开始创建带有记忆功能的聊天代理");

  // 创建内置MemorySaver实例用于保存历史记录
  const memorySaver = new MemorySaver();
  console.log(`创建了MemorySaver实例用于保存历史记录，将自动保存到浏览器存储`);

  try {
    // 定义工作流图
    console.log("创建状态图工作流");
    const workflow = new StateGraph(ChatState)
      .addNode("processUserInput", userInputNode)
      .addNode("llm", llmNode) // 添加LLM处理节点
      .addEdge(START, "processUserInput") // 从开始到用户输入
      .addEdge("processUserInput", "llm") // 从用户输入到LLM
      .addEdge("llm", END); // 从LLM到结束
    console.log("工作流图创建成功，包含 processUserInput 和 llm 节点");

    // 编译工作流，并传入checkpointer
    console.log("编译工作流并配置 MemorySaver");
    const app = workflow.compile({
      checkpointer: memorySaver,
    });

    console.log("已成功创建带有记忆功能的聊天代理");

    // 返回应用、初始状态和记忆保存器
    return {
      app,
    };
  } catch (error) {
    console.error("创建聊天代理失败:", error);
    throw new Error(`创建聊天代理失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}
