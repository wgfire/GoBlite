import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { editor as monacoEditor } from 'monaco-editor';
import { EditorFile, EditorOptions, EditorEventType, FileTreeNode } from '../types';
import { eventBus, EventType as CoreEventType } from '@vite-goblite/core';

// 编辑器上下文接口
interface EditorContextProps {
  // 状态
  files: EditorFile[];
  activeFile: EditorFile | null;
  fileTree: FileTreeNode[];
  options: EditorOptions;
  isReady: boolean;
  
  // 编辑器实例
  editorInstance: monacoEditor.IStandaloneCodeEditor | null;
  
  // 方法
  setEditorInstance: (instance: monacoEditor.IStandaloneCodeEditor) => void;
  loadFiles: (files: EditorFile[]) => void;
  openFile: (path: string) => void;
  saveFile: (path: string, content: string) => void;
  createFile: (path: string, content?: string, language?: string) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  updateOptions: (options: Partial<EditorOptions>) => void;
  getFileContent: (path: string) => string | null;
  getFileLanguage: (path: string) => string;
}

// 创建编辑器上下文
const EditorContext = createContext<EditorContextProps | undefined>(undefined);

// 编辑器Provider接口
interface EditorProviderProps {
  children: ReactNode;
  initialOptions?: Partial<EditorOptions>;
}

/**
 * 编辑器Provider组件
 * 提供编辑器相关功能的上下文
 */
export const EditorProvider: React.FC<EditorProviderProps> = ({ 
  children, 
  initialOptions = {} 
}) => {
  // 状态
  const [files, setFiles] = useState<EditorFile[]>([]);
  const [activeFile, setActiveFile] = useState<EditorFile | null>(null);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [options, setOptions] = useState<EditorOptions>({
    theme: 'vs-dark',
    lineNumbers: 'on',
    folding: true,
    autoSave: true,
    autoSaveDelay: 1000,
    renderIndentGuides: true,
    suggestOnTriggerCharacters: true,
    formatOnPaste: true,
    formatOnSave: true,
    formatOnType: false,
    ...initialOptions
  });
  const [isReady, setIsReady] = useState(false);
  const [editorInstance, setEditorInstanceState] = useState<monacoEditor.IStandaloneCodeEditor | null>(null);

  // 设置编辑器实例
  const setEditorInstance = useCallback((instance: monacoEditor.IStandaloneCodeEditor) => {
    setEditorInstanceState(instance);
    setIsReady(true);
    
    // 触发编辑器就绪事件
    eventBus.emit(EditorEventType.EDITOR_READY, { instance });
  }, []);

  // 加载文件
  const loadFiles = useCallback((newFiles: EditorFile[]) => {
    setFiles(newFiles);
    
    // 构建文件树
    const tree = buildFileTree(newFiles);
    setFileTree(tree);
    
    // 如果有文件，默认打开第一个
    if (newFiles.length > 0) {
      setActiveFile(newFiles[0]);
      eventBus.emit(EditorEventType.ACTIVE_FILE_CHANGE, { file: newFiles[0] });
    }
  }, []);

  // 打开文件
  const openFile = useCallback((path: string) => {
    const file = files.find(f => f.path === path);
    if (file) {
      setActiveFile(file);
      eventBus.emit(EditorEventType.ACTIVE_FILE_CHANGE, { file });
    }
  }, [files]);

  // 保存文件
  const saveFile = useCallback((path: string, content: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.map(file => {
        if (file.path === path) {
          const updatedFile = { ...file, content };
          
          // 如果是当前活动文件，更新活动文件
          if (activeFile && activeFile.path === path) {
            setActiveFile(updatedFile);
          }
          
          return updatedFile;
        }
        return file;
      });
      
      // 触发文件保存事件
      eventBus.emit(EditorEventType.SAVE, { path, content });
      
      // 触发核心文件变更事件
      eventBus.emit(CoreEventType.FILE_CHANGED, { path, content });
      
      return newFiles;
    });
  }, [activeFile]);

  // 创建文件
  const createFile = useCallback((path: string, content: string = '', language?: string) => {
    // 检查文件是否已存在
    const fileExists = files.some(file => file.path === path);
    if (fileExists) {
      console.warn(`文件 ${path} 已存在`);
      return;
    }
    
    // 确定文件语言
    const fileLanguage = language || getLanguageFromPath(path);
    
    // 创建新文件
    const newFile: EditorFile = {
      path,
      content,
      language: fileLanguage
    };
    
    setFiles(prevFiles => {
      const newFiles = [...prevFiles, newFile];
      
      // 更新文件树
      const tree = buildFileTree(newFiles);
      setFileTree(tree);
      
      // 触发文件创建事件
      eventBus.emit(EditorEventType.FILE_CREATE, { file: newFile });
      
      return newFiles;
    });
    
    // 打开新创建的文件
    setActiveFile(newFile);
    eventBus.emit(EditorEventType.ACTIVE_FILE_CHANGE, { file: newFile });
  }, [files]);

  // 删除文件
  const deleteFile = useCallback((path: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.filter(file => file.path !== path);
      
      // 更新文件树
      const tree = buildFileTree(newFiles);
      setFileTree(tree);
      
      // 如果删除的是当前活动文件，切换到其他文件
      if (activeFile && activeFile.path === path) {
        const nextFile = newFiles.length > 0 ? newFiles[0] : null;
        setActiveFile(nextFile);
        if (nextFile) {
          eventBus.emit(EditorEventType.ACTIVE_FILE_CHANGE, { file: nextFile });
        }
      }
      
      // 触发文件删除事件
      eventBus.emit(EditorEventType.FILE_DELETE, { path });
      
      return newFiles;
    });
  }, [activeFile, files]);

  // 重命名文件
  const renameFile = useCallback((oldPath: string, newPath: string) => {
    setFiles(prevFiles => {
      const newFiles = prevFiles.map(file => {
        if (file.path === oldPath) {
          const updatedFile = { ...file, path: newPath };
          
          // 如果是当前活动文件，更新活动文件
          if (activeFile && activeFile.path === oldPath) {
            setActiveFile(updatedFile);
          }
          
          return updatedFile;
        }
        return file;
      });
      
      // 更新文件树
      const tree = buildFileTree(newFiles);
      setFileTree(tree);
      
      // 触发文件重命名事件
      eventBus.emit(EditorEventType.FILE_RENAME, { oldPath, newPath });
      
      return newFiles;
    });
  }, [activeFile]);

  // 更新编辑器选项
  const updateOptions = useCallback((newOptions: Partial<EditorOptions>) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      ...newOptions
    }));
    
    // 如果编辑器实例存在，应用新选项
    if (editorInstance) {
      editorInstance.updateOptions(newOptions);
    }
  }, [editorInstance]);

  // 获取文件内容
  const getFileContent = useCallback((path: string): string | null => {
    const file = files.find(f => f.path === path);
    return file ? file.content : null;
  }, [files]);

  // 获取文件语言
  const getFileLanguage = useCallback((path: string): string => {
    const file = files.find(f => f.path === path);
    if (file && file.language) {
      return file.language;
    }
    return getLanguageFromPath(path);
  }, [files]);

  // 构建上下文值
  const contextValue: EditorContextProps = {
    files,
    activeFile,
    fileTree,
    options,
    isReady,
    editorInstance,
    setEditorInstance,
    loadFiles,
    openFile,
    saveFile,
    createFile,
    deleteFile,
    renameFile,
    updateOptions,
    getFileContent,
    getFileLanguage
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

/**
 * 使用编辑器的hook
 * 提供编辑器的状态和方法
 */
export const useEditor = (): EditorContextProps => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor必须在EditorProvider内部使用');
  }
  return context;
};

/**
 * 根据文件路径获取语言
 * @param path 文件路径
 * @returns 语言标识符
 */
function getLanguageFromPath(path: string): string {
  const extension = path.split('.').pop()?.toLowerCase() || '';
  
  // 常见文件扩展名映射
  const extensionMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'less': 'less',
    'json': 'json',
    'md': 'markdown',
    'vue': 'html',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'py': 'python',
    'java': 'java',
    'c': 'c',
    'cpp': 'cpp',
    'cs': 'csharp',
    'go': 'go',
    'php': 'php',
    'rb': 'ruby',
    'rs': 'rust',
    'sh': 'shell'
  };
  
  return extensionMap[extension] || 'plaintext';
}

/**
 * 构建文件树
 * @param files 文件列表
 * @returns 文件树节点数组
 */
function buildFileTree(files: EditorFile[]): FileTreeNode[] {
  const root: Record<string, FileTreeNode> = {};
  
  // 遍历所有文件
  files.forEach(file => {
    const parts = file.path.split('/').filter(Boolean);
    let currentLevel = root;
    
    // 处理路径中的每一部分
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLastPart = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join('/');
      
      // 如果是最后一部分，则是文件
      if (isLastPart) {
        const extension = part.includes('.') ? part.split('.').pop() : '';
        currentLevel[part] = {
          id: file.path,
          name: part,
          isDirectory: false,
          path: file.path,
          extension
        };
      } 
      // 否则是目录
      else {
        if (!currentLevel[part]) {
          currentLevel[part] = {
            id: currentPath,
            name: part,
            isDirectory: true,
            children: {},
            path: currentPath
          };
        }
        currentLevel = currentLevel[part].children as Record<string, FileTreeNode>;
      }
    }
  });
  
  // 将对象转换为数组，并递归处理子节点
  function convertToArray(obj: Record<string, FileTreeNode>): FileTreeNode[] {
    return Object.values(obj).map(node => {
      if (node.isDirectory && node.children) {
        return {
          ...node,
          children: convertToArray(node.children as Record<string, FileTreeNode>)
        };
      }
      return node;
    }).sort((a, b) => {
      // 目录排在前面
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      // 同类型按名称排序
      return a.name.localeCompare(b.name);
    });
  }
  
  return convertToArray(root);
}
