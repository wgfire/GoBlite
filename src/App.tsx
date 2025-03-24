import { useEffect, useState } from 'react'
import Editor from './components/Editor'
import { Toolbar } from './components/Editor/ui/Toolbar'
import FileExplorer from './components/Editor/fileSystem/FileExplorer'
import FileTabs from './components/Editor/fileSystem/FileTabs'
import { FileItem } from './components/Editor/fileSystem/types'
import useFileSystem from './components/Editor/fileSystem/useFileSystem'
import './App.css'

function App() {
  const [code, setCode] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { updateFileContent, getActiveFileContent, activeFile } = useFileSystem();

  useEffect(() => {
    // 当活动文件变化时，更新编辑器内容
    if (activeFile) {
      const content = getActiveFileContent();
      setCode(content);
    }
  }, [activeFile, getActiveFileContent]);

  const handleCodeChange = (newCode: string) => {
    // 更新当前活动文件的内容
    if (activeFile) {
      updateFileContent(activeFile, newCode);
    }
    console.log('代码已更新');
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
  };

  const handleFileOpen = (file: FileItem) => {
    console.log('打开文件:', file.path);
    // 文件打开逻辑已在 useFileSystem 钩子中处理
  };

  const handleTabSelect = (file: FileItem) => {
    console.log('选择标签:', file.path);
    // 标签选择逻辑已在 useFileSystem 钩子中处理
  };

  return (
    <div className="app-container bg-slate-100">
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
        <div className="editor-wrapper">
          <FileTabs 
            onTabSelect={handleTabSelect}
          />
          {isLoading ? (
            <div className="loading">加载中...</div>
          ) : (
            <Editor 
              initialCode={code} 
              onChange={handleCodeChange} 
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
