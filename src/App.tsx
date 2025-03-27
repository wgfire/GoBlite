import React, { useState, useEffect, useRef } from 'react';
import { Toolbar } from './components/Editor/ui/Toolbar'
import { FileExplorer } from './components/Editor/fileSystem/FileExplorer'
import { FileTabs } from './components/Editor/ui/FileTabs'
import { FileItem, FileItemType } from './components/Editor/fileSystem/types'
import { useFileSystem } from './components/Editor/fileSystem/useFileSystem'
import { Editor } from './components/Editor';
import { WebContainer } from './components/Editor/ui/WebContainer';
import './App.css'

export const App: React.FC = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'editor' | 'webcontainer'>('editor');

  const {
    updateFileContent,
    getActiveFileContent,
    activeFile,
    openFile,
    files,
    findItem,
    openFiles,
    setActiveTab
  } = useFileSystem();

  // 初始化时打开默认文件
  useEffect(() => {
    console.log('App 初始化 useEffect 触发', { files, openFiles });

    // 应用加载时显示加载状态
    setIsLoading(true);

    // 如果没有打开的文件，则打开一个默认文件
    if (openFiles.length === 0 && files.length > 0) {
      console.log('App 尝试打开默认文件');
      // 尝试打开 /src/index.js 文件
      const defaultFile = findItem(files, '/src/index.js');
      console.log('App 默认文件:', defaultFile);

      if (defaultFile && defaultFile.type === FileItemType.FILE) {
        console.log('App 打开默认文件:', defaultFile.path);
        openFile(defaultFile);
        setCode(defaultFile.content || '');
      } else {
        // 如果找不到 /src/index.js，尝试打开第一个文件
        console.log('App 找不到默认文件，尝试打开第一个文件');
        const firstFile = findFirstFile(files);
        if (firstFile) {
          console.log('App 打开第一个文件:', firstFile.path);
          openFile(firstFile);
          setCode(firstFile.content || '');
        }
      }
    }

    // 加载完成后关闭加载状态
    setIsLoading(false);
  }, [files, openFiles, openFile, findItem]);

  // 查找第一个可用的文件
  const findFirstFile = (items: FileItem[]): FileItem | null => {
    for (const item of items) {
      if (item.type === FileItemType.FILE) {
        return item;
      } else if (item.children && item.children.length > 0) {
        const file = findFirstFile(item.children);
        if (file) return file;
      }
    }
    return null;
  };

  // 当活动文件变化时，更新编辑器内容
  const prevActiveFileRef = useRef(activeFile);
  const prevCodeRef = useRef(code);

  useEffect(() => {
    console.log('App 活动文件变化:', activeFile);
    // 只有当活动文件真正变化时才更新内容
    if (activeFile && activeFile !== prevActiveFileRef.current) {
      prevActiveFileRef.current = activeFile;

      const content = getActiveFileContent();
      // 只在内容确实发生变化时才更新状态
      if (content !== prevCodeRef.current) {
        prevCodeRef.current = content;
        setCode(content);
      }
    }
  }, [activeFile, getActiveFileContent]);

  const handleCodeChange = (newCode: string) => {
    // 更新当前活动文件的内容
    if (activeFile) {
      updateFileContent(activeFile, newCode);
    }
  };

  const handleSave = () => {
    console.log('保存文件');
    // 这里可以实现实际的文件保存逻辑
  };

  const handleRedo = () => {
    console.log('重做操作');
  };

  const handleSearch = () => {
    console.log('搜索内容');
  };

  const handleRun = () => {
    console.log('运行代码');
    // 切换视图
    setCurrentView(currentView === 'editor' ? 'webcontainer' : 'editor');
  };

  const handleFileOpen = (file: FileItem) => {
    console.log('App 打开文件:', file.path);
    if (file && file.type === FileItemType.FILE) {
      openFile(file);
      setCode(file.content || '');
    }
  };

  const handleTabSelect = (filePath: string) => {
    console.log('App 选择标签:', filePath);
    // 设置活动文件
    setActiveTab(filePath);
    // 获取文件内容
    const file = findItem(files, filePath);
    if (file && file.type === FileItemType.FILE) {
      setCode(file.content || '');
    }
  };

  return (
    <div className="app-container">
      <Toolbar
        onSave={handleSave}
        onRedo={handleRedo}
        onSearch={handleSearch}
        onRun={handleRun}
      />
      <div className="app-content">
        <div className="file-explorer-container">
          <FileExplorer
            onFileOpen={handleFileOpen}
          />
        </div>
        <div className="editor-box">
          {currentView === 'editor' && <FileTabs
            onTabSelect={handleTabSelect}
          />}

          {currentView === 'editor' ? (
            isLoading ? (
              <div className="loading">加载中...</div>
            ) : (
              <Editor
                initialCode={code}
                onChange={handleCodeChange}
              />
            )
          ) : (
            <WebContainer isVisible={true} />
          )}
        </div>
      </div>
    </div>
  );
};
