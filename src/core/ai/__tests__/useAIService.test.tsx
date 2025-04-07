/**
 * useAIService 钩子测试
 */

import { renderHook, act } from '@testing-library/react-hooks';
import useAIService from '../hooks/useAIService';
import { AIService } from '../service';
import { PromptManager } from '../prompts/promptManager';
import { AIGenerationType } from '../types';

// 模拟依赖
jest.mock('../service');
jest.mock('../prompts/promptManager');
jest.mock('@/core/fileSystem', () => ({
  useFileSystem: () => ({
    files: [],
    findItem: jest.fn(),
    createFile: jest.fn(),
    createFolder: jest.fn(),
  }),
}));
jest.mock('@/core/webContainer', () => ({
  useWebContainer: () => ({
    startApp: jest.fn(),
  }),
}));
jest.mock('@/template/useTemplate', () => ({
  __esModule: true,
  default: () => ({}),
}));

describe('useAIService', () => {
  // 模拟AIService实例
  const mockAIService = {
    initialize: jest.fn(),
    sendRequest: jest.fn(),
    generateCode: jest.fn(),
    generateImage: jest.fn(),
    optimizePrompt: jest.fn(),
    cancelRequest: jest.fn(),
    reset: jest.fn(),
    getStatus: jest.fn(),
    getError: jest.fn(),
  };
  
  // 模拟PromptManager实例
  const mockPromptManager = {
    initialize: jest.fn(),
    getTemplates: jest.fn(),
    getTemplateById: jest.fn(),
    createPrompt: jest.fn(),
    optimizePrompt: jest.fn(),
    saveTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // 设置模拟实现
    (AIService.getInstance as jest.Mock).mockReturnValue(mockAIService);
    (PromptManager.getInstance as jest.Mock).mockReturnValue(mockPromptManager);
    
    // 默认成功初始化
    mockAIService.initialize.mockResolvedValue(true);
    mockPromptManager.initialize.mockResolvedValue(true);
    mockAIService.getStatus.mockReturnValue('ready');
    mockAIService.getError.mockReturnValue(null);
  });
  
  it('应该自动初始化', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    expect(mockAIService.initialize).toHaveBeenCalled();
    expect(mockPromptManager.initialize).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
  });
  
  it('初始化失败时应该设置错误状态', async () => {
    mockAIService.initialize.mockResolvedValue(false);
    mockAIService.getError.mockReturnValue('初始化失败');
    
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    expect(result.current.error).toBe('初始化失败');
  });
  
  it('应该成功生成代码', async () => {
    mockAIService.generateCode.mockResolvedValue({
      success: true,
      files: [
        { path: 'src/index.js', content: 'console.log("Hello");' }
      ]
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    // 生成代码
    let codeResult;
    await act(async () => {
      codeResult = await result.current.generateCode('Generate a simple JavaScript file');
    });
    
    expect(mockAIService.generateCode).toHaveBeenCalledWith({
      prompt: 'Generate a simple JavaScript file'
    });
    expect(codeResult.success).toBe(true);
    expect(codeResult.files).toHaveLength(1);
    expect(result.current.isProcessing).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('生成代码失败时应该设置错误状态', async () => {
    mockAIService.generateCode.mockResolvedValue({
      success: false,
      error: '生成代码失败'
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    // 生成代码
    let codeResult;
    await act(async () => {
      codeResult = await result.current.generateCode('Generate a simple JavaScript file');
    });
    
    expect(codeResult.success).toBe(false);
    expect(codeResult.error).toBe('生成代码失败');
    expect(result.current.error).toBe('生成代码失败');
  });
  
  it('应该成功优化提示词', async () => {
    mockAIService.optimizePrompt.mockResolvedValue('优化后的提示词');
    
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    // 优化提示词
    let optimizedPrompt;
    await act(async () => {
      optimizedPrompt = await result.current.optimizePrompt('原始提示词');
    });
    
    expect(mockAIService.optimizePrompt).toHaveBeenCalledWith('原始提示词');
    expect(optimizedPrompt).toBe('优化后的提示词');
  });
  
  it('应该成功处理模板', async () => {
    // 模拟模板处理
    mockAIService.generateCode.mockResolvedValue({
      success: true,
      files: [
        { path: 'src/index.js', content: 'console.log("Hello");' }
      ]
    });
    
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    // 处理模板
    let templateResult;
    await act(async () => {
      templateResult = await result.current.processTemplate({
        template: {
          id: 'test-template',
          name: 'Test Template',
          description: 'A test template',
          fields: [
            { id: 'name', name: 'Name', type: 'text' }
          ]
        },
        formData: { name: 'Test' },
        generationType: AIGenerationType.CODE
      });
    });
    
    expect(mockAIService.generateCode).toHaveBeenCalled();
    expect(templateResult.success).toBe(true);
  });
  
  it('应该成功取消请求', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    // 取消请求
    act(() => {
      result.current.cancelRequest();
    });
    
    expect(mockAIService.cancelRequest).toHaveBeenCalled();
  });
  
  it('应该成功重置状态', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAIService({ autoInit: true }));
    
    // 等待初始化完成
    await waitForNextUpdate();
    
    // 重置状态
    act(() => {
      result.current.reset();
    });
    
    expect(mockAIService.reset).toHaveBeenCalled();
  });
});
