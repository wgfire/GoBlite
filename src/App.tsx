import React, { useState, useEffect, useRef, useCallback } from "react";
import { Toolbar } from "@components/Toolbar";
import { FileExplorer } from "@components/FileExplorer";
import { FileTabs } from "@components/FileTabs";
import { Editor } from "@components/Editor";
import { WebContainer } from "@components/WebContainer";

import { TemplateService } from "./template/templateService";
import { FileItem, FileItemType, useFileSystem } from "./core/fileSystem";
import { useWebContainer } from "./core/webContainer";
import { useTemplate } from "./template/useTemplate";
import "./App.css";
import { debounce } from "@/utils/debounce";

// 创建模板服务实例
const templateService = new TemplateService();

export const App: React.FC = () => {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<"editor" | "webcontainer">("editor");
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [isBuilt, setIsBuilt] = useState(false); // 新增状态，标记是否已经构建

  // 使用模板钩子
  const { selectedTemplate, loading: templateLoading, error: templateError, loadTemplateContent } = useTemplate(templateService);

  // 使用文件系统钩子
  const { updateFileContent, activeFileContent, activeFile, openFile, files, findItem, openFiles, setActiveTab, resetFileSystem, findFirstFile } = useFileSystem();

  // 使用WebContainer钩子
  const { previewUrl, error: webContainerError, isRunning, startApp } = useWebContainer();

  // 加载模板内容
  useEffect(() => {
    const loadTemplate = async () => {
      if (templateLoaded || !selectedTemplate) return;

      setIsLoading(true);
      try {
        console.log(`加载模板: ${selectedTemplate}`);
        const result = await loadTemplateContent(selectedTemplate);

        if (result.success && result.files) {
          console.log("模板加载成功，重置文件系统");
          resetFileSystem(result.files);
          setTemplateLoaded(true);
        } else {
          console.error("模板加载失败:", result.error);
        }
      } catch (error) {
        console.error("加载模板出错:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplate();
  }, [selectedTemplate, templateLoaded, loadTemplateContent, resetFileSystem]);

  // 初始化时打开默认文件
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // 添加一个标志，避免重复执行
    if (isInitializedRef.current) return;
    
    console.log("App 初始化 useEffect 触发", { files, openFiles });

    // 如果模板正在加载，保持加载状态
    if (templateLoading) {
      setIsLoading(true);
      return;
    }

    // 如果没有打开的文件，则打开一个默认文件
    if (openFiles.length === 0 && files.length > 0) {
      console.log("App 尝试打开默认文件");
      // 尝试打开 /src/App.tsx 文件，使用模板中定义的大小写
      const defaultFile = findItem(files, "/src/App.tsx");
      console.log("App 默认文件:", defaultFile);
      if (defaultFile && defaultFile.type === FileItemType.FILE) {
        console.log("App 打开默认文件:", defaultFile.path);
        openFile(defaultFile);
        setCode(defaultFile.content || "");
      } else {
        // 如果找不到 /src/App.tsx，尝试打开第一个文件
        console.log("App 找不到默认文件，尝试打开第一个文件");
        const firstFile = findFirstFile(files);
        if (firstFile) {
          console.log("App 打开第一个文件:", firstFile.path);
          openFile(firstFile);
          setCode(firstFile.content || "");
        }
      }
    }

    // 加载完成后关闭加载状态
    setIsLoading(false);
    isInitializedRef.current = true;
  }, [files.length, openFiles.length, templateLoading, setIsLoading]);

  // 当活动文件变化时，更新编辑器内容
  const prevActiveFileRef = useRef(activeFile);
  const prevCodeRef = useRef(code);

  useEffect(() => {
    console.log("App 活动文件变化:", activeFile);
    // 只有当活动文件真正变化时才更新内容
    if (activeFile && activeFile !== prevActiveFileRef.current) {
      prevActiveFileRef.current = activeFile;

      const content = activeFileContent;
      // 只在内容确实发生变化时才更新状态
      if (content !== prevCodeRef.current) {
        prevCodeRef.current = content;
        setCode(content);
      }
    }
  }, [activeFile, activeFileContent]);

  // 使用useCallback包装handleCodeChange，并添加防抖
  const handleCodeChange = useCallback((newCode: string) => {
    // 只设置本地状态，不立即更新文件系统
    setCode(newCode);
    
    // 使用防抖更新文件内容，减少文件系统更新频率
    debouncedUpdateRef.current(newCode);
  }, []);

  // 创建防抖更新函数
  const debouncedUpdateRef = useRef(debounce((newCode: string) => {
    if (activeFile) {
      updateFileContent(activeFile, newCode);
    }
  }, 500));

  // 确保在组件卸载时清理防抖函数
  useEffect(() => {
    return () => {
      debouncedUpdateRef.current.cancel();
    };
  }, []);

  const handleSave = () => {
    console.log("保存文件");
    // 这里可以实现实际的文件保存逻辑
  };

  const handleRedo = () => {
    console.log("重做操作");
  };

  const handleSearch = () => {
    console.log("搜索内容");
  };

  /**
   * 处理构建和运行
   * 首次构建时，会初始化WebContainer、同步文件、安装依赖并启动服务
   */
  const handleRun = async () => {
    console.log("构建并运行代码");

    // 保存所有打开的文件，确保最新内容被同步
    if (activeFile && code !== undefined) {
      updateFileContent(activeFile, code);
    }

    // 启动WebContainer并同步文件
    try {
      // 自动切换到预览视图
      setCurrentView("webcontainer");
      console.log("正在启动WebContainer并同步文件...", files);
      
      // 添加更详细的日志，显示每个文件的路径和类型
      console.log("同步的文件列表详情:", files.map(f => ({
        path: f.path,
        type: f.type === FileItemType.FILE ? 'FILE' : 'FOLDER',
        hasContent: f.type === FileItemType.FILE ? (f.content ? true : false) : 'N/A'
      })));

      // 使用startApp方法一次性完成初始化、文件同步和依赖安装
      const success = await startApp(files);

      if (!success) {
        const errorMsg = webContainerError || "未知错误";
        console.error("启动WebContainer失败:", errorMsg);
        throw new Error(errorMsg);
      } else {
        console.log("WebContainer启动成功，内部服务URL:", previewUrl);
        // 标记已构建状态
        setIsBuilt(true);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("启动WebContainer出错 - 详细错误:", {
        error: errorMsg,
        stack: error instanceof Error ? error.stack : undefined,
        files: files.map(f => f.path)
      });
      throw error;
    }
  };

  /**
   * 处理重新构建
   * 当已经构建过一次后，只需要同步最新文件并重启服务
   */
  const handleRebuild = async () => {
    console.log("重新构建代码");

    // 保存所有打开的文件，确保最新内容被同步
    if (activeFile && code !== undefined) {
      updateFileContent(activeFile, code);
    }

    // 同步文件并重启服务
    try {
      console.log("正在同步最新文件并重启服务...");

      // 使用startApp方法同步文件和重启服务
      const success = await startApp(files);

      if (!success) {
        console.error("重新构建失败:", webContainerError);
      } else {
        console.log("重新构建成功，内部服务URL:", previewUrl);
      }
    } catch (error) {
      console.error("重新构建出错:", error);
    }
  };

  /**
   * 切换编辑器和预览视图
   */
  const handleToggleView = () => {
    console.log("切换视图");
    setCurrentView(currentView === "editor" ? "webcontainer" : "editor");
  };

  const handleFileOpen = (file: FileItem) => {
    console.log("App 打开文件:", file.path);
    if (file && file.type === FileItemType.FILE) {
      openFile(file);
      setCode(file.content || "");
    }
  };

  const handleTabSelect = (filePath: string) => {
    console.log("App 选择标签:", filePath);
    // 设置活动文件
    setActiveTab(filePath);
    // 获取文件内容
    const file = findItem(files, filePath);
    if (file && file.type === FileItemType.FILE) {
      setCode(file.content || "");
    }
  };

  // 显示加载或错误状态
  if (isLoading || templateLoading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading">加载模板中...</div>
        </div>
      </div>
    );
  }

  if (templateError) {
    return (
      <div className="app-container">
        <div className="error-container">
          <div className="error">加载模板出错: {templateError}</div>
          <button onClick={() => window.location.reload()}>重试</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Toolbar
        onSave={handleSave}
        onRedo={handleRedo}
        onSearch={handleSearch}
        onRun={handleRun}
        onRebuild={handleRebuild}
        onToggleView={handleToggleView}
        isRunning={isRunning}
        isBuilt={isBuilt}
        disabled={isLoading || templateLoading}
      />
      <div className="app-content">
        <div className="file-explorer-container">
          <FileExplorer onFileOpen={handleFileOpen} />
        </div>
        <div className="editor-box">
          {currentView === "editor" && <FileTabs onTabSelect={handleTabSelect} />}

          {currentView === "editor" ? <Editor initialCode={code} onChange={handleCodeChange} /> : <WebContainer isVisible={true} />}
        </div>
      </div>
    </div>
  );
};
