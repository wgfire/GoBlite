import React, { useState, useEffect } from "react";

// AI-PRESERVE-COMPONENT-START: Navbar
// This component provides the navigation bar and should not be modified by AI
export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? "text-primary-600" : "text-white"}`}>TradePro</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#markets" className={`text-sm font-medium transition-colors ${isScrolled ? "text-secondary-700 hover:text-primary-600" : "text-white/90 hover:text-white"}`}>
              市场
            </a>
            <a href="#features" className={`text-sm font-medium transition-colors ${isScrolled ? "text-secondary-700 hover:text-primary-600" : "text-white/90 hover:text-white"}`}>
              交易平台
            </a>
            <a
              href="#testimonials"
              className={`text-sm font-medium transition-colors ${isScrolled ? "text-secondary-700 hover:text-primary-600" : "text-white/90 hover:text-white"}`}
            >
              关于我们
            </a>
            <a href="#pricing" className={`text-sm font-medium transition-colors ${isScrolled ? "text-secondary-700 hover:text-primary-600" : "text-white/90 hover:text-white"}`}>
              投资学习
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${isScrolled ? "text-primary-600 hover:text-primary-700" : "text-white hover:text-white/90"}`}
            >
              登录
            </a>
            <a href="#" className="text-sm font-medium px-4 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 transition-colors shadow-sm hover:shadow">
              立即开户
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled ? "text-secondary-500 hover:bg-secondary-100" : "text-white hover:bg-white/10"
              } focus:outline-none focus:ring-2 focus:ring-primary-500`}
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">打开菜单</span>
              {/* Icon when menu is closed */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#markets" className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50">
              市场
            </a>
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50">
              交易平台
            </a>
            <a href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50">
              关于我们
            </a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-secondary-700 hover:text-primary-600 hover:bg-secondary-50">
              投资学习
            </a>
          </div>
          <div className="pt-4 pb-3 border-t border-secondary-200">
            <div className="flex items-center px-4 py-2">
              <a href="#" className="block w-full px-4 py-2 text-center font-medium text-primary-600 border border-primary-600 rounded-md mr-2">
                登录
              </a>
              <a href="#" className="block w-full px-4 py-2 text-center font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow">
                立即开户
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
// AI-PRESERVE-COMPONENT-END
