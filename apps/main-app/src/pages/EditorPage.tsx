import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  templateService, 
  TemplateMetadata,
  FileSystemTree,
  eventBus,
  EventType
} from '@vite-goblite/core'
import { 
  Editor, 
  EditorFile 
} from '@vite-goblite/editor'
import { 
  WebContainerProvider, 
  WebContainerPreview, 
  WebContainerTerminal 
} from '@vite-goblite/web-container'

/**
 * 编辑器页面流程图
 * ```mermaid
 * graph TD
 *   A[页面加载] --> B{是否有模板ID?}
 *   B -->|是| C[加载模板]
 *   B -->|否| D[跳转到模板选择页]
 *   C --> E{模板加载成功?}
 *   E -->|是| F[初始化编辑器和WebContainer]
 *   E -->|否| G[显示错误信息]
 *   F --> H[用户编辑代码]
 *   H --> I[实时预览]
 *   I --> J{构建成功?}
 *   J -->|是| K[显示应用预览]
 *   J -->|否| L[显示错误信息]
 * ```
 */
const EditorPage = () => {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()
  
  const [template, setTemplate] = useState<TemplateMetadata | null>(null)
  const [files, setFiles] = useState<EditorFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<'preview' | 'terminal'>('preview')
  
  // 如果没有模板ID，跳转到模板选择页面
  useEffect(() => {
    if (!templateId) {
      navigate('/templates')
    }
  }, [templateId, navigate])
  
  // 加载模板
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return
      
      try {
        setLoading(true)
        
        // 加载模板元数据
        const templates = await templateService.loadTemplates('/templates')
        const selectedTemplate = templates.find(t => t.name === decodeURIComponent(templateId))
        
        if (!selectedTemplate) {
          throw new Error(`未找到模板: ${decodeURIComponent(templateId)}`)
        }
        
        setTemplate(selectedTemplate)
        
        // 加载模板文件
        const templateFiles = await templateService.loadTemplateFiles(selectedTemplate)
        
        // 转换为编辑器文件格式
        const editorFiles = Object.entries(templateFiles).map(([path, content]) => ({
          path,
          content: typeof content === 'string' ? content : '',
          language: getLanguageFromPath(path)
        }))
        
        setFiles(editorFiles)
        setError(null)
      } catch (err) {
        console.error('加载模板失败:', err)
        setError(`加载模板失败: ${err instanceof Error ? err.message : '未知错误'}`)
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplate()
  }, [templateId, navigate])
  
  // 监听文件变更事件
  useEffect(() => {
    const handleFileChanged = (data: { path: string; content: string }) => {
      setFiles(prevFiles => 
        prevFiles.map(file => 
          file.path === data.path 
            ? { ...file, content: data.content } 
            : file
        )
      )
    }
    
    eventBus.on(EventType.FILE_CHANGED, handleFileChanged)
    
    return () => {
      eventBus.off(EventType.FILE_CHANGED, handleFileChanged)
    }
  }, [])
  
  // 将编辑器文件转换为WebContainer文件系统格式
  const getFileSystemTree = (): FileSystemTree => {
    const fileSystem: FileSystemTree = {}
    
    files.forEach(file => {
      fileSystem[file.path] = {
        file: {
          contents: file.content
        }
      }
    })
    
    return fileSystem
  }
  
  // 渲染加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">加载模板中...</p>
        </div>
      </div>
    )
  }
  
  // 渲染错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-semibold mb-2">加载失败</h2>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/templates')}
            className="mt-4 bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
          >
            返回模板选择
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <WebContainerProvider>
      <div className="flex flex-col h-full">
        {/* 顶部工具栏 */}
        <div className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/templates')}
              className="mr-4 hover:text-gray-300"
            >
              ← 返回
            </button>
            <h1 className="text-lg font-medium">{template?.name}</h1>
          </div>
          
          <div className="flex space-x-2">
            <WebContainerControls />
          </div>
        </div>
        
        {/* 主内容区 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 编辑器区域 */}
          <div className="w-1/2 h-full border-r border-gray-300">
            <Editor 
              initialOptions={{
                theme: 'vs-dark',
                fontSize: 14,
                minimap: { enabled: true }
              }}
            />
          </div>
          
          {/* 预览区域 */}
          <div className="w-1/2 h-full flex flex-col">
            {/* 预览/终端切换标签 */}
            <div className="bg-gray-100 border-b border-gray-300 flex">
              <button 
                className={`px-4 py-2 ${activePanel === 'preview' ? 'bg-white border-b-2 border-primary-500' : 'hover:bg-gray-200'}`}
                onClick={() => setActivePanel('preview')}
              >
                预览
              </button>
              <button 
                className={`px-4 py-2 ${activePanel === 'terminal' ? 'bg-white border-b-2 border-primary-500' : 'hover:bg-gray-200'}`}
                onClick={() => setActivePanel('terminal')}
              >
                终端
              </button>
            </div>
            
            {/* 预览/终端内容 */}
            <div className="flex-1 overflow-hidden">
              {activePanel === 'preview' ? (
                <WebContainerPreview />
              ) : (
                <WebContainerTerminal />
              )}
            </div>
          </div>
        </div>
      </div>
    </WebContainerProvider>
  )
}

/**
 * WebContainer控制组件
 * 提供安装依赖、启动服务器等操作
 */
const WebContainerControls = () => {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // 初始化WebContainer
  const handleInitialize = async () => {
    try {
      setLoading(true)
      // 这里应该调用WebContainer的初始化方法
      // 由于这是一个UI组件，我们假设这个操作已经完成
      setInitialized(true)
    } catch (error) {
      console.error('初始化WebContainer失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 安装依赖
  const handleInstallDependencies = async () => {
    try {
      setLoading(true)
      // 这里应该调用WebContainer的安装依赖方法
      // 由于这是一个UI组件，我们假设这个操作已经完成
    } catch (error) {
      console.error('安装依赖失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  // 启动开发服务器
  const handleStartDevServer = async () => {
    try {
      setLoading(true)
      // 这里应该调用WebContainer的启动服务器方法
      // 由于这是一个UI组件，我们假设这个操作已经完成
    } catch (error) {
      console.error('启动服务器失败:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex space-x-2">
      <button
        onClick={handleInitialize}
        disabled={initialized || loading}
        className={`px-3 py-1 rounded text-sm ${
          initialized 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {initialized ? '已初始化' : '初始化'}
      </button>
      
      <button
        onClick={handleInstallDependencies}
        disabled={!initialized || loading}
        className="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        安装依赖
      </button>
      
      <button
        onClick={handleStartDevServer}
        disabled={!initialized || loading}
        className="px-3 py-1 rounded text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        启动服务器
      </button>
    </div>
  )
}

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

export default EditorPage
