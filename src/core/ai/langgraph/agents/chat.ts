// 从"@langchain/langgraph/web"导入必要的组件
import {
  END, // 表示图的结束节点
  START, // 表示图的开始节点
  StateGraph, // 状态图类，用于构建工作流
  Annotation, // 注解工具，用于定义状态结构和合并逻辑
} from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage } from "@langchain/core/messages"; // 导入消息类型
import { type RunnableConfig, RunnableLambda } from "@langchain/core/runnables"; // 导入可运行配置和Lambda函数
import { type StreamEvent } from "@langchain/core/tracers/log_stream"; // 导入流事件类型

// 定义图的状态结构
const GraphState3 = Annotation.Root({
  // 定义messages字段，类型为BaseMessage数组
  messages: Annotation<BaseMessage[]>({
    // 定义reducer函数，用于合并消息数组
    reducer: (x, y) => x.concat(y), // 当有新消息时，将其追加到现有消息数组
  }),
});

// 注意这里的第二个参数config
const nodeFn3 = async (_state: typeof GraphState3.State, config?: RunnableConfig) => {
  // 如果需要更深层次的嵌套，记得在调用时传递配置参数
  // 创建一个嵌套的可运行Lambda函数
  const nestedFn = RunnableLambda.from(async (input: string) => {
    // 返回一个带有格式化消息的HumanMessage对象
    return new HumanMessage(`Hello from ${input}!`);
  }).withConfig({ runName: "nested" }); // 为函数添加配置，设置运行名称为"nested"

  // 调用嵌套函数并传递配置
  const responseMessage = await nestedFn.invoke("a nested function", config);
  // 返回包含消息的对象，符合GraphState3的结构
  return { messages: [responseMessage] };
};

// 定义一个新的状态图工作流
const workflow3 = new StateGraph(GraphState3)
  .addNode("node", nodeFn3) // 添加一个名为"node"的节点，使用nodeFn3函数处理
  .addEdge(START, "node") // 添加从开始节点到"node"的边
  .addEdge("node", END); // 添加从"node"到结束节点的边

// 编译工作流为可执行的应用
const app3 = workflow3.compile({});

// 从图中流式获取中间步骤的事件
const eventStream3 = app3.streamEvents(
  { messages: [] }, // 初始状态
  { version: "v2" }, // 使用v2版本的事件流
  { includeNames: ["nested"] } // 只包含名称为"nested"的事件
);

// 创建一个数组存储所有事件
const events3: StreamEvent[] = [];
// 异步迭代事件流
for await (const event of eventStream3) {
  console.log(event); // 打印每个事件
  events3.push(event); // 将事件添加到数组
}

// 打印接收到的事件总数
console.log(`Received ${events3.length} events from the nested function`);
