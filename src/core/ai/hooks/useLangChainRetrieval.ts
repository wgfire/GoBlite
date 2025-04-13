/**
 * LangChain检索功能钩子
 */
import { useState, useCallback } from "react";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { DocumentLoadResult, RetrievalResult, ModelProvider } from "../types";
import { createDocumentsFromText, createDocumentsFromFile, splitDocuments } from "../langchain/documents";
import { createVectorStore, retrieveSimilarDocuments } from "../langchain/retrievers";

/**
 * LangChain检索功能钩子
 * 提供文档加载和检索功能
 */
export function useLangChainRetrieval() {
  // 本地状态
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vectorStore, setVectorStore] = useState<MemoryVectorStore | null>(null);

  /**
   * 加载文本文档
   * @param text 文本内容
   * @param metadata 元数据
   */
  const loadTextDocument = useCallback(async (text: string, metadata: Record<string, any> = {}): Promise<DocumentLoadResult> => {
    try {
      const newDocuments = createDocumentsFromText(text, metadata);
      setDocuments((prev) => [...prev, ...newDocuments]);

      return {
        success: true,
        documents: newDocuments,
      };
    } catch (error) {
      console.error("加载文本文档失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "加载文本文档失败",
      };
    }
  }, []);

  /**
   * 加载文件文档
   * @param path 文件路径
   * @param content 文件内容
   * @param metadata 元数据
   */
  const loadFileDocument = useCallback(async (path: string, content: string, metadata: Record<string, any> = {}): Promise<DocumentLoadResult> => {
    try {
      const newDocuments = createDocumentsFromFile(path, content, metadata);
      setDocuments((prev) => [...prev, ...newDocuments]);

      return {
        success: true,
        documents: newDocuments,
      };
    } catch (error) {
      console.error("加载文件文档失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "加载文件文档失败",
      };
    }
  }, []);

  /**
   * 初始化向量存储
   * @param apiKey API密钥
   * @param modelProvider 模型提供商（可选）
   */
  const initializeVectorStore = useCallback(
    async (apiKey: string, modelProvider?: ModelProvider): Promise<boolean> => {
      try {
        if (documents.length === 0) {
          throw new Error("没有文档可以索引");
        }

        // 分割文档
        const splitDocs = await splitDocuments(documents);

        // 创建向量存储
        const newVectorStore = await createVectorStore(splitDocs, apiKey, modelProvider);
        setVectorStore(newVectorStore);

        return true;
      } catch (error) {
        console.error("初始化向量存储失败:", error);
        return false;
      }
    },
    [documents]
  );

  /**
   * 检索相似文档
   * @param query 查询文本
   * @param k 返回文档数量
   */
  const retrieveDocuments = useCallback(
    async (query: string, k: number = 5): Promise<RetrievalResult> => {
      try {
        if (!vectorStore) {
          throw new Error("向量存储未初始化");
        }

        const results = await retrieveSimilarDocuments(vectorStore, query, k);

        return {
          success: true,
          documents: results,
        };
      } catch (error) {
        console.error("检索文档失败:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "检索文档失败",
        };
      }
    },
    [vectorStore]
  );

  /**
   * 清空文档
   */
  const clearDocuments = useCallback(() => {
    setDocuments([]);
    setVectorStore(null);
  }, []);

  return {
    // 状态
    documents,
    vectorStore,

    // 方法
    loadTextDocument,
    loadFileDocument,
    initializeVectorStore,
    retrieveDocuments,
    clearDocuments,
  };
}
