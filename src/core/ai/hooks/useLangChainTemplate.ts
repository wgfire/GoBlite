/**
 * LangChain模板处理钩子
 */
import { useCallback, useState } from "react";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  TemplateProcessingParams,
  TemplateProcessingResult,
  TemplateOptimizationParams,
  TemplateOptimizationResult,
  DocumentLoadResult,
} from "../types";
import { createTemplateProcessingChain, createTemplateOptimizationChain } from "../langchain/chains";
import { parseCodeResponse, mapToCodeFiles } from "../utils/responseParser";
import { Document } from "langchain/document";
import { Template } from "@/template/types";
import { FileItem, FileItemType } from "@/core/fileSystem/types";

/**
 * LangChain模板处理钩子
 * 提供模板处理功能
 */
export function useLangChainTemplate() {
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
   * 处理模板
   * @param model 语言模型
   * @param params 模板处理参数
   */
  const processTemplate = useCallback(async (model: BaseChatModel, params: TemplateProcessingParams): Promise<TemplateProcessingResult> => {
    try {
      // 创建模板处理链
      const chain = createTemplateProcessingChain(model);

      // 准备模板信息
      // 实际应用中，这里应该从模板系统获取模板信息
      const templateInfo = `模板ID: ${params.templateId}`;

      // 准备表单数据
      const formData = JSON.stringify(params.formData, null, 2);

      // 调用链 - 使用LCEL的invoke方法
      const response = await chain.invoke({
        templateInfo,
        formData,
        businessContext: params.businessContext || "",
      });

      // 解析响应 - 处理不同的响应格式
      const responseText = typeof response === "string" ? response : response?.text || response?.content || JSON.stringify(response);

      const files = parseCodeResponse(responseText);
      const codeFiles = mapToCodeFiles(files);

      return {
        success: true,
        files: codeFiles,
      };
    } catch (error) {
      console.error("处理模板失败:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "处理模板失败",
      };
    }
  }, []);

  /**
   * 优化模板代码
   * @param model 语言模型
   * @param params 模板优化参数
   */
  const optimizeTemplate = useCallback(
    async (model: BaseChatModel, params: TemplateOptimizationParams): Promise<TemplateOptimizationResult> => {
      try {
        // 检查是否有模板上下文
        if (!templateContext.template || !templateContext.documents) {
          throw new Error("没有加载模板上下文，请先加载模板");
        }

        // 创建模板优化链
        const chain = createTemplateOptimizationChain(model);

        // 准备模板信息
        const templateInfo = {
          id: templateContext.template.id,
          name: templateContext.template.name,
          description: templateContext.template.description || "",
        };

        // 提取文件内容作为上下文
        const fileContexts = templateContext.documents
          .map((doc) => {
            return `文件: ${doc.metadata.path}\n\n${doc.pageContent}\n\n`;
          })
          .join("---\n");

        // 调用链 - 使用LCEL的invoke方法
        const response = await chain.invoke({
          templateInfo: JSON.stringify(templateInfo),
          fileContexts,
          optimizationRequest: params.optimizationRequest,
          requirements: params.requirements || "",
        });

        // 解析响应 - 处理不同的响应格式
        const responseText = typeof response === "string" ? response : response?.text || response?.content || JSON.stringify(response);

        const files = parseCodeResponse(responseText);
        const codeFiles = mapToCodeFiles(files);

        return {
          success: true,
          files: codeFiles,
          template: templateContext.template,
        };
      } catch (error) {
        console.error("优化模板失败:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "优化模板失败",
        };
      }
    },
    [templateContext]
  );

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
    processTemplate,
    optimizeTemplate,
    clearTemplateContext,
  };
}
