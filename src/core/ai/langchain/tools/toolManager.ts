/**
 * Tool manager for LangChain integration
 * Manages tools that can be used by the AI agent
 */

import { FileItem } from '@/core/fileSystem/types';

/**
 * Tool interface
 */
export interface Tool {
  name: string;
  description: string;
  execute: (args: any) => Promise<any>;
}

/**
 * File system tool
 */
export class FileSystemTool implements Tool {
  name: string;
  description: string;
  fileSystem: any;
  
  constructor(name: string, description: string, fileSystem: any) {
    this.name = name;
    this.description = description;
    this.fileSystem = fileSystem;
  }
  
  async execute(args: any): Promise<any> {
    throw new Error('Not implemented');
  }
}

/**
 * Read file tool
 */
export class ReadFileTool extends FileSystemTool {
  constructor(fileSystem: any) {
    super(
      'readFile',
      'Read the content of a file',
      fileSystem
    );
  }
  
  async execute(args: { path: string }): Promise<string> {
    const file = this.fileSystem.findItem(this.fileSystem.files, args.path);
    
    if (!file) {
      throw new Error(`File not found: ${args.path}`);
    }
    
    return file.content || '';
  }
}

/**
 * Write file tool
 */
export class WriteFileTool extends FileSystemTool {
  constructor(fileSystem: any) {
    super(
      'writeFile',
      'Write content to a file',
      fileSystem
    );
  }
  
  async execute(args: { path: string, content: string }): Promise<boolean> {
    const file = this.fileSystem.findItem(this.fileSystem.files, args.path);
    
    if (file) {
      this.fileSystem.updateFileContent(args.path, args.content);
    } else {
      const pathParts = args.path.split('/');
      const fileName = pathParts.pop() || '';
      const parentPath = pathParts.join('/') || '/';
      
      this.fileSystem.createFile(parentPath, {
        name: fileName,
        path: args.path,
        type: 'file',
        content: args.content,
      });
    }
    
    return true;
  }
}

/**
 * List files tool
 */
export class ListFilesTool extends FileSystemTool {
  constructor(fileSystem: any) {
    super(
      'listFiles',
      'List files in a directory',
      fileSystem
    );
  }
  
  async execute(args: { path: string }): Promise<FileItem[]> {
    const directory = this.fileSystem.findItem(this.fileSystem.files, args.path);
    
    if (!directory) {
      throw new Error(`Directory not found: ${args.path}`);
    }
    
    if (directory.type !== 'directory') {
      throw new Error(`Not a directory: ${args.path}`);
    }
    
    return directory.children || [];
  }
}

/**
 * WebContainer tool interface
 */
export interface WebContainerTool extends Tool {
  webContainer: any;
}

/**
 * Start app tool
 */
export class StartAppTool implements WebContainerTool {
  name: string = 'startApp';
  description: string = 'Start the application in WebContainer';
  webContainer: any;
  
  constructor(webContainer: any) {
    this.webContainer = webContainer;
  }
  
  async execute(args: { files?: FileItem[] }): Promise<boolean> {
    return await this.webContainer.startApp(args.files);
  }
}

/**
 * Tool manager class
 * Manages tools that can be used by the AI agent
 */
export class ToolManager {
  private tools: Map<string, Tool> = new Map();
  private fileSystem: any = null;
  private webContainer: any = null;
  
  /**
   * Initialize the tool manager
   * @returns Promise<boolean> Whether initialization was successful
   */
  public async initialize(): Promise<boolean> {
    try {
      // Tools will be initialized when fileSystem and webContainer are set
      return true;
    } catch (error) {
      console.error('Failed to initialize tool manager:', error);
      return false;
    }
  }
  
  /**
   * Set the file system
   * @param fileSystem File system
   */
  public setFileSystem(fileSystem: any): void {
    this.fileSystem = fileSystem;
    
    // Initialize file system tools
    if (this.fileSystem) {
      this.registerTool(new ReadFileTool(this.fileSystem));
      this.registerTool(new WriteFileTool(this.fileSystem));
      this.registerTool(new ListFilesTool(this.fileSystem));
    }
  }
  
  /**
   * Set the WebContainer
   * @param webContainer WebContainer
   */
  public setWebContainer(webContainer: any): void {
    this.webContainer = webContainer;
    
    // Initialize WebContainer tools
    if (this.webContainer) {
      this.registerTool(new StartAppTool(this.webContainer));
    }
  }
  
  /**
   * Register a tool
   * @param tool Tool
   */
  public registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }
  
  /**
   * Get a tool by name
   * @param name Tool name
   * @returns Tool
   */
  public getTool(name: string): Tool {
    const tool = this.tools.get(name);
    
    if (!tool) {
      throw new Error(`Tool not found: ${name}`);
    }
    
    return tool;
  }
  
  /**
   * Get all tools
   * @returns Array of tools
   */
  public getTools(): Tool[] {
    return Array.from(this.tools.values());
  }
  
  /**
   * Execute a tool
   * @param name Tool name
   * @param args Tool arguments
   * @returns Promise<any> Tool result
   */
  public async executeTool(name: string, args: any): Promise<any> {
    const tool = this.getTool(name);
    return await tool.execute(args);
  }
}
