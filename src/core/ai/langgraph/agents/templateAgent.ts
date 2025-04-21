// 从"@langchain/langgraph/web"导入必要的组件
import { END, START, StateGraph, Annotation, messagesStateReducer } from "@langchain/langgraph/web";
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";
import { type RunnableConfig } from "@langchain/core/runnables";
import { ModelFactory } from "../../langchain/models/modelFactory";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// 定义模板类型
export enum TemplateType {
  REACT_COMPONENT = "react_component",
  VUE_COMPONENT = "vue_component",
  HTML_PAGE = "html_page",
  CSS_STYLESHEET = "css_stylesheet",
  JAVASCRIPT_MODULE = "javascript_module",
  TYPESCRIPT_MODULE = "typescript_module",
  CUSTOM = "custom",
}

// 定义模板参数输出格式
const templateParamsSchema = z.object({
  templateType: z.nativeEnum(TemplateType).describe("模板类型"),
  componentName: z.string().optional().describe("组件名称（如适用）"),
  props: z
    .array(
      z.object({
        name: z.string().describe("属性名称"),
        type: z.string().describe("属性类型"),
        required: z.boolean().describe("是否必需"),
        defaultValue: z.any().optional().describe("默认值"),
      })
    )
    .optional()
    .describe("组件属性（如适用）"),
  styling: z
    .object({
      framework: z.string().optional().describe("样式框架（如 Tailwind、Bootstrap 等）"),
      customStyles: z.record(z.string()).optional().describe("自定义样式"),
    })
    .optional()
    .describe("样式信息"),
  functionality: z.array(z.string()).optional().describe("需要实现的功能"),
  additionalContext: z.record(z.unknown()).optional().describe("其他上下文信息"),
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
  templateContext: Annotation<Record<string, unknown> | null>({
    reducer: (_, y) => y,
  }),
  // 解析后的模板参数
  templateParams: Annotation<z.infer<typeof templateParamsSchema> | null>({
    reducer: (_, y) => y,
  }),
  // 生成的代码
  generatedCode: Annotation<string | null>({
    reducer: (_, y) => y,
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
  console.log(`[TemplateAgent] userInputNode 更新后的消息历史有 ${updatedMessages.length} 条消息`);

  return {
    messages: updatedMessages,
    userInput: null, // 清空用户输入，防止重复处理
  };
};

/**
 * 模板参数解析节点
 * 分析用户需求，提取模板类型和参数
 */
const parseTemplateParamsNode = async (state: TemplateAgentStateType, config?: RunnableConfig) => {
  console.log(`[TemplateAgent] parseTemplateParamsNode 开始解析模板参数`);

  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    console.log(`[TemplateAgent] parseTemplateParamsNode 没有消息历史，返回错误`);
    return {
      error: "没有消息历史，无法解析模板参数",
    };
  }

  try {
    // 使用ModelFactory创建模型
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    const model = ModelFactory.createModel(modelConfig);

    if (!model) {
      console.error(`[TemplateAgent] parseTemplateParamsNode 无法创建模型，返回错误消息`);
      return {
        error: "无法创建 AI 模型",
      };
    }

    // 创建结构化输出解析器
    const parser = StructuredOutputParser.fromZodSchema(templateParamsSchema);

    // 创建系统提示
    const systemPrompt = new SystemMessage(
      `你是一个专业的前端开发模板参数解析专家。你的任务是分析用户的需求，根据模版的信息，分析改动的点。
      
      请根据用户的描述，提取以下信息：
     
      
      ${parser.getFormatInstructions()}
      
      请确保你的分析全面且准确，这将直接影响到生成的代码质量。`
    );

    // 获取模板上下文（如果有）
    const templateContext = state.templateContext;
    let contextPrompt = "";

    if (templateContext && Object.keys(templateContext).length > 0) {
      contextPrompt = `\n\n额外上下文信息：\n${JSON.stringify(templateContext, null, 2)}`;
    }
    // 过滤掉其他的系统消息，只保留用户和助手的消息
    const filteredMessages = messages.filter((msg) => msg.getType() === "human" || msg.getType() === "ai");
    // 准备发送给模型的消息
    const promptMessages = [
      systemPrompt,
      ...filteredMessages.slice(-5), // 只取最近的5条用户消息 方便模型理解用户需求
    ];

    if (contextPrompt) {
      promptMessages.push(new SystemMessage(contextPrompt));
    }

    // 调用模型
    console.log(`[TemplateAgent] parseTemplateParamsNode 调用模型解析参数`);
    const response = await model.invoke(promptMessages, config);

    // 解析结构化输出
    const parsedOutput = await parser.parse(typeof response.content === "string" ? response.content : JSON.stringify(response.content));
    console.log(`[TemplateAgent] 解析到的模板参数:`, parsedOutput);

    return {
      templateParams: parsedOutput,
    };
  } catch (error) {
    console.error(`[TemplateAgent] parseTemplateParamsNode 处理失败:`, error);
    const errorMessage = new AIMessage({
      content: `解析模板参数时出错: ${error instanceof Error ? error.message : String(error)}`,
    });
    errorMessage.additional_kwargs = {
      metadata: { isError: true },
    };
    return {
      error: `解析模板参数失败: ${error instanceof Error ? error.message : String(error)}`,
      messages: [...messages, errorMessage],
    };
  }
};

/**
 * 代码生成节点
 * 根据解析的参数生成代码
 */
const generateCodeNode = async (state: TemplateAgentStateType, config?: RunnableConfig) => {
  console.log(`[TemplateAgent] generateCodeNode 开始生成代码`);

  // 获取消息历史和模板参数
  const messages = state.messages;
  const templateParams = state.templateParams;

  // 如果有错误，直接返回
  if (state.error) {
    console.log(`[TemplateAgent] generateCodeNode 存在错误，跳过代码生成: ${state.error}`);
    return { error: state.error };
  }

  // 如果没有模板参数，返回错误
  if (!templateParams) {
    console.log(`[TemplateAgent] generateCodeNode 没有模板参数，返回错误`);
    return {
      error: "没有模板参数，无法生成代码",
    };
  }

  try {
    // 使用ModelFactory创建模型
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    const model = ModelFactory.createModel(modelConfig);

    if (!model) {
      console.error(`[TemplateAgent] generateCodeNode 无法创建模型，返回错误消息`);
      return {
        error: "无法创建 AI 模型",
      };
    }
    // 创建系统提示
    const systemPrompt = new SystemMessage(
      `你是一个专业的前端开发代码生成专家。你的任务是根据提供的模版信息生成高质量的代码。
      
      请根据以下参数生成代码：
      ${JSON.stringify(templateParams, null, 2)}
      
      请遵循以下原则：
      1. 代码应该遵循最佳实践和设计模式
      2. 代码应该清晰、可读、易于维护
      3. 代码应该包含适当的注释
      4. 代码应该考虑性能和可扩展性
      
      请生成完整的代码，不要省略任何部分。代码应该可以直接复制粘贴使用。`
    );

    // 获取模板上下文（如果有）
    const templateContext = state.templateContext;
    let contextPrompt = "";

    if (templateContext && Object.keys(templateContext).length > 0) {
      contextPrompt = `\n\n额外上下文信息：\n${JSON.stringify(templateContext, null, 2)}`;
    }

    // 准备发送给模型的消息
    const promptMessages = [systemPrompt];

    if (contextPrompt) {
      promptMessages.push(new SystemMessage(contextPrompt));
    }

    // 添加最后一条用户消息，以便模型了解具体需求
    const lastUserMessage = messages.filter((m) => m.getType() === "human").pop();
    if (lastUserMessage) {
      promptMessages.push(lastUserMessage);
    }

    // 调用模型
    console.log(`[TemplateAgent] generateCodeNode 调用模型生成代码`);
    const response = await model.invoke(promptMessages, config);

    // 提取代码
    const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);

    // 尝试从回复中提取代码块
    const codeBlockRegex = /```(?:jsx|tsx|vue|html|css|javascript|typescript)?\n([\s\S]*?)\n```/;
    const match = content.match(codeBlockRegex);
    const generatedCode = match ? match[1] : content;

    console.log(`[TemplateAgent] 生成的代码长度: ${generatedCode.length} 字符`);

    // 创建AI回复消息
    const responseMessage = new AIMessage({
      content: `我已根据您的需求生成了以下代码：\n\n\`\`\`\n${generatedCode}\n\`\`\`\n\n您可以直接复制使用这段代码。如果需要任何修改或有其他问题，请告诉我。`,
    });

    return {
      generatedCode: generatedCode,
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
 */
export function createTemplateAgent() {
  console.log("开始创建模板代理");

  try {
    // 定义工作流图
    console.log("[TemplateAgent] 创建状态图工作流");
    const workflow = new StateGraph(TemplateAgentState)
      .addNode("processUserInput", userInputNode)
      .addNode("parseTemplateParams", parseTemplateParamsNode)
      .addNode("generateCode", generateCodeNode)
      .addEdge(START, "processUserInput")
      .addEdge("processUserInput", "parseTemplateParams")
      .addEdge("parseTemplateParams", "generateCode")
      .addEdge("generateCode", END);

    console.log("[TemplateAgent] 工作流图创建成功");

    // 编译工作流
    console.log("[TemplateAgent] 编译工作流");
    const app = workflow.compile();

    console.log("[TemplateAgent] 已成功创建模板代理");

    // 返回应用
    return {
      app,
      // 提供一个处理函数，用于从主图调用
      handler: async (state: any, config?: RunnableConfig) => {
        try {
          // 准备模板代理的初始状态
          const templateAgentState = {
            messages: state.messages || [],
            userInput: state.userInput,
            templateContext: state.templateContext,
            templateParams: null,
            generatedCode: null,
            error: null,
          };

          // 调用模板代理
          console.log("[TemplateAgent] 调用模板代理处理请求");
          const result = await app.invoke(templateAgentState, config);

          // 返回处理结果
          return {
            messages: result.messages,
            generatedCode: result.generatedCode,
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
