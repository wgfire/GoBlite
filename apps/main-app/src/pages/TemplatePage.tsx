import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { templateService, TemplateMetadata } from '@vite-goblite/core'

const TemplatePage = () => {
  const [templates, setTemplates] = useState<TemplateMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  
  // 获取所有可用的框架和语言
  const frameworks = [...new Set(templates.map(template => template.framework))].sort()
  const languages = [...new Set(templates.map(template => template.language))].sort()
  
  // 加载模板
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true)
        const loadedTemplates = await templateService.loadTemplates()
        setTemplates(loadedTemplates)
        setError(null)
      } catch (err) {
        console.error('加载模板失败:', err)
        setError('加载模板失败，请稍后再试')
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplates()
  }, [])
  
  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    if (selectedFramework && template.framework !== selectedFramework) {
      return false
    }
    if (selectedLanguage && template.language !== selectedLanguage) {
      return false
    }
    return true
  })
  
  // 重置过滤器
  const resetFilters = () => {
    setSelectedFramework(null)
    setSelectedLanguage(null)
  }
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">项目模板</h1>
        <p className="text-gray-600">选择一个模板开始您的项目</p>
      </div>
      
      {/* 过滤器 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">框架</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
              value={selectedFramework || ''}
              onChange={(e) => setSelectedFramework(e.target.value || null)}
            >
              <option value="">所有框架</option>
              {frameworks.map(framework => (
                <option key={framework} value={framework}>{framework}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">语言</label>
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 w-40"
              value={selectedLanguage || ''}
              onChange={(e) => setSelectedLanguage(e.target.value || null)}
            >
              <option value="">所有语言</option>
              {languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={resetFilters}
              className="text-primary-600 px-3 py-2 hover:text-primary-800"
            >
              重置过滤器
            </button>
          </div>
        </div>
      </div>
      
      {/* 模板列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">加载模板中...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">没有找到匹配的模板</p>
          <button 
            onClick={resetFilters}
            className="mt-2 text-primary-600 hover:text-primary-800"
          >
            清除过滤器
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {template.thumbnail ? (
                  <img 
                    src={template.thumbnail} 
                    alt={template.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-6xl">🖼️</div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-gray-600 mb-3 h-12 overflow-hidden">{template.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                    {template.framework}
                  </span>
                  <span className="bg-secondary-100 text-secondary-800 text-xs px-2 py-1 rounded">
                    {template.language}
                  </span>
                </div>
                
                <Link 
                  to={`/editor/${encodeURIComponent(template.name)}`}
                  className="block w-full bg-primary-600 text-white text-center py-2 rounded hover:bg-primary-700 transition-colors"
                >
                  使用此模板
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TemplatePage
