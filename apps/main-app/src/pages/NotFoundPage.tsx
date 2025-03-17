import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <h2 className="text-2xl font-medium text-gray-600 mb-6">页面未找到</h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页。
      </p>
      <Link 
        to="/" 
        className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
      >
        返回首页
      </Link>
    </div>
  )
}

export default NotFoundPage
