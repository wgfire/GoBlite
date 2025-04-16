import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Chat from '../components/Chat';
import { useLangChainAI } from '../core/ai';
import { Template } from '../template/types';
import { FileItem, FileItemType } from '../core/fileSystem/types';

// Mock the useLangChainAI hook
vi.mock('../core/ai', () => ({
  useLangChainAI: vi.fn(),
  ModelType: {
    GPT4O: 'gpt-4o',
  },
  ServiceStatus: {
    READY: 'ready',
  },
}));

// Mock the useFileSystem hook
vi.mock('../core/fileSystem', () => ({
  useFileSystem: () => ({
    writeFile: vi.fn().mockResolvedValue(true),
    files: [],
  }),
}));

// Mock the useWebContainer hook
vi.mock('../core/webContainer', () => ({
  useWebContainer: () => ({
    startApp: vi.fn().mockResolvedValue(true),
  }),
}));

// Mock template
const mockTemplate: Template = {
  id: 'test-template',
  name: 'Test Template',
  description: 'A test template',
};

// Mock files
const mockFiles: FileItem[] = [
  {
    name: 'index.html',
    path: '/index.html',
    type: FileItemType.FILE,
    content: '<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>',
  },
];

// Mock template service
vi.mock('../template/templateService', () => ({
  TemplateService: class {
    loadTemplate() {
      return Promise.resolve({
        success: true,
        files: mockFiles,
      });
    }
  },
}));

describe('Chat Template Optimization', () => {
  const mockLoadTemplateDocuments = vi.fn().mockResolvedValue({ success: true });
  const mockOptimizeTemplate = vi.fn().mockResolvedValue({
    success: true,
    files: [
      {
        path: '/index.html',
        content: '<!DOCTYPE html><html><head><title>Optimized</title></head><body><h1>Optimized Template</h1></body></html>',
      },
    ],
    template: mockTemplate,
  });
  const mockSendChatRequest = vi.fn().mockResolvedValue({ success: true, content: 'Test response' });

  beforeEach(() => {
    // Setup mock implementation
    (useLangChainAI as any).mockReturnValue({
      status: 'ready',
      isSending: false,
      sendMessage: mockSendChatRequest,
      loadTemplateDocuments: mockLoadTemplateDocuments,
      optimizeTemplate: mockOptimizeTemplate,
      templateContext: {
        template: null,
        documents: null,
        files: null,
      },
      initialize: vi.fn().mockResolvedValue(true),
      cancelRequest: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load template documents when template is selected', async () => {
    // Render the component
    render(<Chat />);
    
    // Mock the handleTemplateSelect function
    const mockHandleTemplateSelect = (useLangChainAI as any).mock.results[0].value.loadTemplateDocuments;
    
    // Simulate template selection
    await mockHandleTemplateSelect(mockTemplate, mockFiles);
    
    // Verify
    expect(mockLoadTemplateDocuments).toHaveBeenCalledWith(mockTemplate, mockFiles);
  });

  it('should optimize template when user sends a message with template context', async () => {
    // Update the mock to include template context
    (useLangChainAI as any).mockReturnValue({
      status: 'ready',
      isSending: false,
      sendMessage: mockSendChatRequest,
      loadTemplateDocuments: mockLoadTemplateDocuments,
      optimizeTemplate: mockOptimizeTemplate,
      templateContext: {
        template: mockTemplate,
        documents: [],
        files: mockFiles,
      },
      initialize: vi.fn().mockResolvedValue(true),
      cancelRequest: vi.fn(),
    });
    
    // Render the component
    const { container } = render(<Chat />);
    
    // Find the input area
    const inputArea = container.querySelector('textarea');
    expect(inputArea).not.toBeNull();
    
    if (inputArea) {
      // Type a message
      fireEvent.change(inputArea, { target: { value: 'Please optimize this template' } });
      
      // Find and click the send button
      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);
      
      // Wait for the optimization to be called
      await waitFor(() => {
        expect(mockOptimizeTemplate).toHaveBeenCalledWith({
          optimizationRequest: 'Please optimize this template',
          requirements: expect.any(String),
        });
      });
    }
  });
});
