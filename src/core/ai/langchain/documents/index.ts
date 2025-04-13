/**
 * LangChain文档处理集成
 */
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

/**
 * 从文本创建文档
 * @param text 文本内容
 * @param metadata 元数据
 * @returns 文档数组
 */
export function createDocumentsFromText(text: string, metadata: Record<string, any> = {}): Document[] {
  return [new Document({ pageContent: text, metadata })];
}

/**
 * 从文件创建文档
 * @param path 文件路径
 * @param content 文件内容
 * @param metadata 元数据
 * @returns 文档数组
 */
export function createDocumentsFromFile(
  path: string,
  content: string,
  metadata: Record<string, any> = {}
): Document[] {
  return [
    new Document({
      pageContent: content,
      metadata: {
        ...metadata,
        path,
        source: path,
      },
    }),
  ];
}

/**
 * 分割文档
 * @param documents 文档数组
 * @param chunkSize 块大小
 * @param chunkOverlap 块重叠
 * @returns 分割后的文档数组
 */
export async function splitDocuments(
  documents: Document[],
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  
  return await splitter.splitDocuments(documents);
}
