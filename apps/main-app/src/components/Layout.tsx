import { Outlet, Link, useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation()
  
  // 判断是否在编辑器页面
  const isEditorPage = location.pathname.startsWith('/editor')
  
  return (
    <div className="flex flex-col h-screen">
      {/* 导航栏 */}
      {!isEditorPage && (
        <header className="bg-primary-800 text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Vite Goblite</Link>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link 
                    to="/" 
                    className={`hover:text-primary-200 ${location.pathname === '/' ? 'text-primary-200 font-medium' : ''}`}
                  >
                    首页
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/templates" 
                    className={`hover:text-primary-200 ${location.pathname === '/templates' ? 'text-primary-200 font-medium' : ''}`}
                  >
                    模板
                  </Link>
                </li>
                <li>
                  <a 
                    href="https://github.com/your-username/vite-goblite" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary-200"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>
      )}
      
      {/* 主内容区 */}
      <main className={`flex-1 ${isEditorPage ? '' : 'container mx-auto px-4 py-6'}`}>
        <Outlet />
      </main>
      
      {/* 页脚 */}
      {!isEditorPage && (
        <footer className="bg-gray-100 text-gray-600 py-4">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Vite Goblite. 一个简单的低代码平台。</p>
          </div>
        </footer>
      )}
    </div>
  )
}

export default Layout
