import { useState, useCallback, useEffect } from 'react';
import { TemplateService } from './templateService';
import { Template, TemplateLoadResult } from './types';


/**
 * 模板钩子函数
 * @param templateService 模板服务实例
 * @returns 模板相关状态和方法
 */
export const useTemplate = (templateService: TemplateService) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // 加载模板列表
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const templateList = await templateService.getTemplates();
        setTemplates(templateList);
        
        // 如果有模板且没有选择模板，默认选择第一个
        if (templateList.length > 0 && !selectedTemplate) {
          setSelectedTemplate(templateList[0].id);
        }
      } catch (err) {
        console.error('加载模板列表失败:', err);
        setError('加载模板列表失败');
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, [templateService]);
  
  // 加载模板内容
  const loadTemplateContent = useCallback(async (templateId: string): Promise<TemplateLoadResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await templateService.loadTemplate(templateId);
      if (!result.success) {
        setError(result.error || '加载模板内容失败');
      }
      return result;
    } catch (err) {
      console.error(`加载模板 ${templateId} 内容失败:`, err);
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(`加载模板内容失败: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  }, [templateService]);
  
  // 选择模板
  const selectTemplate = useCallback((templateId: string) => {
    setSelectedTemplate(templateId);
  }, []);
  
  return {
    templates,
    selectedTemplate,
    loading,
    error,
    loadTemplateContent,
    selectTemplate
  };
};
