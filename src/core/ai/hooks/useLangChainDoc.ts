/**
 * LangChain模板处理钩子
 */
import { useCallback, useState } from "react";
import { Document } from "langchain/document";
import { Template } from "@/template/types";
import { FileItem, FileItemType } from "@/core/fileSystem/types";
import { DocumentLoadResult } from "../types";

/**
 * LangChain模板处理钩子
 * 提供模板处理功能
 */
export function useLangChainDoc() {
  // 存储当前加载的模板上下文
  const [templateContext, setTemplateContext] = useState<{
    template: Template | null;
    documents: Document[] | null;
    files: FileItem[] | null;
  }>({
    template: null,
    documents: null,
    files: null,
  });

  /**
   * 加载模板文档
   * @param template 模板对象
   * @param files 模板文件
   */
  const loadTemplateDocuments = useCallback(async (template: Template, files: FileItem[]): Promise<DocumentLoadResult> => {
    try {
      console.log("加载模板文档:", template.id, files.length);

      // 将文件转换为Document对象
      const documents: Document[] = [];

      // 递归处理文件及其子文件
      const processFiles = (fileItems: FileItem[]) => {
        for (const file of fileItems) {
          if (file.type === FileItemType.FILE && file.content) {
            // 创建文档对象
            const doc = new Document({
              id: file.path,
              pageContent: file.content,
              metadata: {
                path: file.path,
                name: file.name,
                templateId: template.id,
              },
            });
            documents.push(doc);
            console.log(`加载文件: ${file.path}`);
          } else if (file.type === FileItemType.FOLDER && file.children && file.children.length > 0) {
            // 递归处理子文件
            console.log(`处理目录: ${file.path}, 包含 ${file.children.length} 个子文件`);
            processFiles(file.children);
          }
        }
      };

      // 开始处理文件
      processFiles(files);

      // 更新模板上下文
      setTemplateContext({
        template,
        documents,
        files,
      });

      return {
        success: true,
        documents,
      };
    } catch (error) {
      console.error("加载模板文档失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "加载模板文档失败",
      };
    }
  }, []);

  /**
   * 清除模板上下文
   * 在切换模板或重置状态时调用
   */
  const clearTemplateContext = useCallback(() => {
    console.log("清除模板上下文");
    setTemplateContext({
      template: null,
      documents: null,
      files: null,
    });

    return {
      success: true,
    };
  }, []);

  return {
    templateContext,
    loadTemplateDocuments,
    clearTemplateContext,
  };
}
