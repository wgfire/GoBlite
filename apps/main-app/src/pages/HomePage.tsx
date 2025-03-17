import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* 英雄区 */}
      <section className="w-full py-20 bg-gradient-to-r from-primary-700 to-primary-900 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Vite Goblite 低代码平台</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto px-4">
          选择模板，在线编辑代码，直接在浏览器中构建应用
        </p>
        <Link 
          to="/templates" 
          className="bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
        >
          开始使用
        </Link>
      </section>
      
      {/* 特性区 */}
      <section className="py-16 w-full max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-12">主要特性</h2>
        
        <div className="grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">丰富的模板</h3>
            <p className="text-gray-600">
              提供多种流行框架的模板，包括React、Vue等，快速开始您的项目。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">💻</div>
            <h3 className="text-xl font-semibold mb-2">在线编辑</h3>
            <p className="text-gray-600">
              强大的在线代码编辑器，支持语法高亮、代码补全等功能。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-primary-600 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">浏览器构建</h3>
            <p className="text-gray-600">
              直接在浏览器中构建和预览应用，无需安装任何开发环境。
            </p>
          </div>
        </div>
      </section>
      
      {/* 工作流程 */}
      <section className="py-16 bg-gray-50 w-full">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">如何使用</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">选择模板</h3>
              <p className="text-gray-600">从我们提供的模板库中选择一个适合您项目的模板</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">编辑代码</h3>
              <p className="text-gray-600">使用在线编辑器修改代码，实现您的功能需求</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">实时预览</h3>
              <p className="text-gray-600">在浏览器中实时预览您的应用效果</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 text-primary-800 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">导出项目</h3>
              <p className="text-gray-600">完成后导出项目代码，进行进一步开发或部署</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/templates" 
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              浏览模板
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
