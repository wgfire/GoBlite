/**
 * 模型相关工具函数
 */
import { ModelFactory } from "../../langchain/models/modelFactory";
import { BaseMessage, SystemMessage } from "@langchain/core/messages";
import { RunnableConfig } from "@langchain/core/runnables";

/**
 * 从本地存储获取模型配置并创建模型
 * @returns 创建的模型实例或null
 */
export const createModelFromLocalStorage = () => {
  try {
    const modelConfigStr = localStorage.getItem("ai_current_model");
    const modelConfig = modelConfigStr ? JSON.parse(modelConfigStr) : {};
    return ModelFactory.createModel(modelConfig);
  } catch (error) {
    console.error("创建模型失败:", error);
    return null;
  }
};

/**
 * 调用模型处理消息
 * @param messages 消息历史
 * @param systemPrompt 系统提示词
 * @param config 运行配置
 * @returns 模型响应或错误
 */
export const invokeModel = async (
  messages: BaseMessage[],
  systemPrompt: string,
  config?: RunnableConfig
) => {
  try {
    const model = createModelFromLocalStorage();
    
    if (!model) {
      throw new Error("无法创建AI模型");
    }
    
    // 创建系统提示
    const systemMessage = new SystemMessage(systemPrompt);
    
    // 准备发送给模型的消息
    const promptMessages = [
      systemMessage,
      ...messages,
    ];
    
    // 调用模型
    return await model.invoke(promptMessages, config);
  } catch (error) {
    console.error("调用模型失败:", error);
    throw error;
  }
};
