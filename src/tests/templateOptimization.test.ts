import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLangChainTemplate } from '../core/ai/hooks/useLangChainTemplate';
import { Template } from '../template/types';
import { FileItem, FileItemType } from '../core/fileSystem/types';
import { Document } from 'langchain/document';

// Mock the BaseChatModel
const mockModel = {
  invoke: vi.fn(),
  // Add other required methods/properties
};

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
  {
    name: 'style.css',
    path: '/style.css',
    type: FileItemType.FILE,
    content: 'body { font-family: Arial; }',
  },
];

describe('Template Optimization', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load template documents', async () => {
    // Setup
    const { loadTemplateDocuments } = useLangChainTemplate();
    
    // Execute
    const result = await loadTemplateDocuments(mockTemplate, mockFiles);
    
    // Verify
    expect(result.success).toBe(true);
    expect(result.documents).toHaveLength(2);
    expect(result.documents?.[0]).toBeInstanceOf(Document);
    expect(result.documents?.[0].metadata.templateId).toBe(mockTemplate.id);
  });

  it('should optimize template code', async () => {
    // Setup
    const { loadTemplateDocuments, optimizeTemplate } = useLangChainTemplate();
    
    // Mock the model response
    mockModel.invoke.mockResolvedValue(`
      I've optimized the template code:
      
      \`\`\`filepath:/index.html
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Optimized Template</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <header>
          <h1>Welcome to Optimized Template</h1>
        </header>
        <main>
          <p>This is an optimized template.</p>
        </main>
        <footer>
          <p>&copy; 2023 Test Company</p>
        </footer>
      </body>
      </html>
      \`\`\`
      
      \`\`\`filepath:/style.css
      body {
        font-family: 'Arial', sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        color: #333;
      }
      
      header {
        background-color: #4CAF50;
        color: white;
        text-align: center;
        padding: 1rem;
      }
      
      main {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
      }
      
      footer {
        background-color: #f1f1f1;
        text-align: center;
        padding: 1rem;
        margin-top: 2rem;
      }
      \`\`\`
    `);
    
    // Load template documents first
    await loadTemplateDocuments(mockTemplate, mockFiles);
    
    // Execute
    const result = await optimizeTemplate(mockModel as any, {
      optimizationRequest: 'Make the template more modern and add a header and footer',
      requirements: 'Use semantic HTML and improve the CSS',
    });
    
    // Verify
    expect(result.success).toBe(true);
    expect(result.files).toHaveLength(2);
    expect(result.files?.[0].path).toBe('/index.html');
    expect(result.files?.[1].path).toBe('/style.css');
    expect(result.template).toBe(mockTemplate);
  });

  it('should handle errors when loading template documents', async () => {
    // Setup
    const { loadTemplateDocuments } = useLangChainTemplate();
    
    // Execute with invalid input
    const result = await loadTemplateDocuments(null as any, [] as any);
    
    // Verify
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle errors when optimizing template', async () => {
    // Setup
    const { optimizeTemplate } = useLangChainTemplate();
    
    // Mock the model to throw an error
    mockModel.invoke.mockRejectedValue(new Error('Model error'));
    
    // Execute
    const result = await optimizeTemplate(mockModel as any, {
      optimizationRequest: 'Optimize the template',
    });
    
    // Verify
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
