/**
 * LangChain检索集成
 */
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ModelProvider } from "../../types";

/**
 * 创建向量存储
 * @param documents 文档数组
 * @param apiKey API密钥
 * @param modelProvider 模型提供商
 * @returns 向量存储实例
 */
export async function createVectorStore(documents: Document[], apiKey: string, modelProvider: ModelProvider = ModelProvider.OPENAI): Promise<MemoryVectorStore> {
  try {
    let embeddings;

    switch (modelProvider) {
      case ModelProvider.OPENAI:
        embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
        break;
      case ModelProvider.GEMINI:
        embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey,
          model: "text-embedding-004",
        });
        break;
      // 对于DeepSeek，目前没有专门的嵌入模型，使用OpenAI作为替代
      case ModelProvider.DEEPSEEK:
      default:
        embeddings = new OpenAIEmbeddings({ openAIApiKey: apiKey });
    }

    return await MemoryVectorStore.fromDocuments(documents, embeddings);
  } catch (error) {
    console.error("创建向量存储失败:", error);
    throw error;
  }
}

/**
 * 检索相似文档
 * @param vectorStore 向量存储实例
 * @param query 查询文本
 * @param k 返回文档数量
 * @returns 相似文档数组
 */
export async function retrieveSimilarDocuments(vectorStore: MemoryVectorStore, query: string, k: number = 5): Promise<Document[]> {
  try {
    return await vectorStore.similaritySearch(query, k);
  } catch (error) {
    console.error("检索相似文档失败:", error);
    throw error;
  }
}

/**
 * 获取当前模型对应的嵌入模型
 * @param apiKey API密钥
 * @param modelProvider 模型提供商
 * @returns 嵌入模型实例
 */
export function getEmbeddingsForModel(apiKey: string, modelProvider: ModelProvider) {
  switch (modelProvider) {
    case ModelProvider.OPENAI:
      return new OpenAIEmbeddings({ openAIApiKey: apiKey });
    case ModelProvider.GEMINI:
      return new GoogleGenerativeAIEmbeddings({
        apiKey,
        model: "text-embedding-004",
      });
    // 对于DeepSeek，目前没有专门的嵌入模型，使用OpenAI作为替代
    case ModelProvider.DEEPSEEK:
    default:
      return new OpenAIEmbeddings({ openAIApiKey: apiKey });
  }
}
