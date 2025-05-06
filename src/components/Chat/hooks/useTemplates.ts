/**
 * 模板管理钩子
 * 提供模板选择、表单处理等功能，并使用jotai管理状态
 */
import { useCallback, useMemo } from "react";
import { useAtom } from "jotai";
import { Template } from "@/template/types";
import { selectedTemplateAtom, showTemplateFormAtom, templateErrorAtom, templateContextAtom } from "../atoms/templateAtom";
import { useTemplate } from "@/template/useTemplate";
import { TemplateService } from "@/template/templateService";
import { toast } from "@/components/ui/use-toast";
import { Message, MessageRole } from "@core/ai/types";
import useMemoizedFn from "@/hooks/useMemoizedFn";
import { useLangChainDoc } from "@/core/ai/hooks/useLangChainDoc";

export const useTemplates = () => {
  // 使用jotai原子状态
  const [selectedTemplate, setSelectedTemplate] = useAtom(selectedTemplateAtom);
  const [showTemplateForm, setShowTemplateForm] = useAtom(showTemplateFormAtom);
  const [templateError, setTemplateError] = useAtom(templateErrorAtom);
  const [templateContext, setTemplateContext] = useAtom(templateContextAtom);

  // 使用useMemo创建templateService，避免每次渲染都创建新实例
  const templateService = useMemo(() => new TemplateService(), []);
  const { loadTemplateContent } = useTemplate(templateService);

  // 使用LangChain处理模板内容
  const { loadTemplateDocuments, clearTemplateContext: clearLangChainContext } = useLangChainDoc();

  /**
   * 选择模板
   * @param template 选择的模板
   * @returns 包含模板相关消息的数组，用于在Chat组件中显示
   */
  const handleTemplateSelect = useMemoizedFn(async (template: Template): Promise<Message[]> => {
    try {
      // 切换模板前清空之前的上下文
      clearLangChainContext();

      setSelectedTemplate(template);
      setTemplateError(null);

      // 创建模板选择消息
      const templateSelectMessage: Message = {
        id: crypto.randomUUID(),
        role: MessageRole.ASSISTANT,
        content: `已选择模板: ${template.name}\n${template.description || ""}`,
        metadata: {
          timestamp: Date.now(),
        }
      };

      // 使用useTemplate钩子加载模板内容
      const loadResult = await loadTemplateContent(template.id);

      if (loadResult.success && loadResult.files) {
        // 使用LangChain处理模板内容
        const langChainResult = await loadTemplateDocuments(template, loadResult.files);

        // 创建助手消息
        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: MessageRole.ASSISTANT,
          content: `我已经加载了 ${template.name} 模板的代码。请描述您对这个模板的需求，我将根据您的需求提供帮助。`,
          metadata: {
            timestamp: Date.now(),
          }
        };

        // 更新模板上下文，包含LangChain处理结果
        setTemplateContext({
          loadResult: loadResult,
          langChainResult: langChainResult,
          template: template
        });
        aiMessage.metadata.templateSelection = {
          templateId: template.id,
          templateName: template.name,
          document: langChainResult
        }

        // 返回消息数组，由Chat组件负责将这些消息添加到会话中
        return [templateSelectMessage, aiMessage];
      } else {
        setShowTemplateForm(false);
        return [templateSelectMessage];
      }
    } catch (error) {
      console.error("加载模板失败:", error);
      setTemplateError(error instanceof Error ? error.message : "加载模板失败");

      toast({
        title: "加载模板失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "default",
      });
      setShowTemplateForm(false);

      // 返回错误消息
      return [
        {
          id: crypto.randomUUID(),
          role: MessageRole.ASSISTANT,
          content: `加载模板失败: ${error instanceof Error ? error.message : "未知错误"}`,
          metadata: {
            timestamp: Date.now(),
          }
        },
      ];
    }
  });

  /**
   * 处理模板表单提交
   * @param data 表单数据
   * @returns 包含用户消息和AI响应的数组
   */
  const handleTemplateFormSubmit = useCallback(async (data: Record<string, unknown>): Promise<Message[]> => {
    if (!selectedTemplate) return [];

    setShowTemplateForm(false);
    setTemplateError(null);
    setTemplateContext((prev) => {
      if (prev && prev.loadResult) {
        return {
          loadResult: prev.loadResult,
          formData: data,
        };
      }
      return prev;
    });
    return [];
  }, []);

  /**
   * 关闭模板表单
   */
  const handleTemplateFormClose = useCallback(() => {
    setShowTemplateForm(false);
    setSelectedTemplate(null);
  }, [setShowTemplateForm, setSelectedTemplate]);

  /**
   * 清空模板上下文
   * 在切换模板或重置状态时调用
   */
  const clearTemplateContext = useCallback(() => {
    clearLangChainContext();
    setTemplateContext(null);
    setSelectedTemplate(null);
    return { success: true };
  }, [clearLangChainContext, setTemplateContext, setSelectedTemplate]);

  return {
    // 状态
    selectedTemplate,
    showTemplateForm,
    templateContext,
    templateError,

    // 设置状态
    setSelectedTemplate,
    setShowTemplateForm,

    // 方法
    handleTemplateSelect,
    handleTemplateFormSubmit,
    handleTemplateFormClose,
    clearTemplateContext,
  };
};
