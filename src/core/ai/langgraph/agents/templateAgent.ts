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

// 已移除templateInfoSchema定义

// 定义响应类型结构
const responseTypeSchema = z.object({
  responseType: z.enum(["TEMPLATE_INFO", "CODE_GENERATION"]).describe("响应类型，表明是提供模板信息还是生成代码"),
  explanation: z.string().describe("选择该响应类型的原因说明"),
  content: z.string().describe("响应内容"),
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
 * 查询模板信息并将文档传递给大模型，区分是回答模板问题还是生成代码
 */
const queryTemplateInfoNode = async (state: TemplateAgentStateType, config?: RunnableConfig) => {
  console.log(`[TemplateAgent] queryTemplateInfoNode 开始查询模板信息`);

  // 获取消息历史
  const messages = state.messages;

  // 如果没有消息，返回错误
  if (!messages || messages.length === 0) {
    console.log(`[TemplateAgent] queryTemplateInfoNode 没有消息历史，返回错误`);
    return {
      error: "没有消息历史，无法查询模板信息",
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
      documentContents = templateContext.langChainResult.documents.map((doc: any) => {
        const source = doc.metadata?.source || "未知文件";
        const content = doc.pageContent ? doc.pageContent : "无内容";
        return `文件: ${source}\n内容:\n${content}`;
      }).join('\n\n====================\n\n');
    }



    // 创建系统提示
    const systemPrompt =
      `你是一个专业的前端开发模板专家。你的任务有两个可能的目标：

      1. 回答用户关于模板的问题，帮助用户理解模板的结构和用途
      2. 根据模板和用户需求生成代码

      请根据用户的提问，判断用户是想了解模板信息还是想要你生成代码。

      ${responseTypeParser.getFormatInstructions()}

      ${documentContents ? `模板文件内容：\n${documentContents}` : "无可用的模板文件内容"}

      请首先判断用户的意图，然后提供相应的帮助。如果用户想了解模板信息，请详细解释；如果用户想要生成代码，请表明你将帮助用户生成代码。`


    // 过滤掉其他的系统消息，只保留用户和助手的消息
    const filteredMessages = messages.filter((msg) => msg.getType() === "human" || msg.getType() === "ai");

    // 准备发送给模型的消息
    const promptMessages = [
      ...filteredMessages.slice(-5), // 只取最近的5条消息
    ];

    // 调用模型
    console.log(`[TemplateAgent] queryTemplateInfoNode 调用模型处理请求`);
    const response = await invokeModel(promptMessages, systemPrompt, config);


    // 提取模型回复内容
    const content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    console.log(`[TemplateAgent] 模型回复内容长度: ${content.length} 字符`);

    try {
      // 尝试解析响应类型
      const parsedResponse = await responseTypeParser.parse(content);

      console.log(`[TemplateAgent] 解析到的响应类型:`, parsedResponse);
      // 创建AI回复消息
      const responseMessage = new AIMessage({
        content: parsedResponse.content,
      });
      // 直接返回是否继续生成代码
      return {
        messages: [...messages, responseMessage],
        // 添加一个标记，指示是否继续进行代码生成
        shouldGenerateCode: parsedResponse.responseType === "CODE_GENERATION"
      };
    } catch (parseError) {
      console.warn(`[TemplateAgent] 解析响应类型失败，默认视为模板信息响应:`, parseError);

      // 使用默认值不生成代码
      return {
        messages: [...messages, content],
        shouldGenerateCode: false
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
      shouldGenerateCode: false
    };
  }
};

/**
 * 代码生成节点
 * 根据解析的参数生成代码
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
      `你是一个专业的前端开发代码生成专家。你的任务是根据提供的模板和用户需求生成高质量的代码。

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
      .addConditionalEdges(
        "queryTemplateInfo",
        (state) => {
          console.log(`[TemplateAgent] 条件边判断 shouldGenerateCode: ${state.shouldGenerateCode}`);
          return state.shouldGenerateCode ? "generateCode" : END;
        }
      )
      .addEdge("generateCode", END);

    console.log("[TemplateAgent] 工作流图创建成功");

    console.log("[TemplateAgent] 编译工作流");
    const app = workflow.compile();

    console.log("[TemplateAgent] 已成功创建模板代理");

    // 返回应用
    return {
      app,
      // 提供一个处理函数，用于从主图调用
      handler: async (state: any, config?: RunnableConfig) => {
        try {
          const templateAgentState = {
            messages: state.messages || [],
            userInput: state.userInput,
            templateContext: state.templateContext,
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
