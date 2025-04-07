import React from "react";

// AI-CUSTOMIZE-COMPONENT-START: HeroSection
// This component can be customized by AI based on user requirements
export const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-dark-800 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-900 to-dark-800/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/src/assets/hero-bg.jpg')] bg-cover bg-center opacity-30"></div>

        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-accent-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block mb-2">通过TradePro平台交易</span>
              <span className="block text-primary-400">外汇、商品、指数、股票</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl">
              您可以通过屑获大奖殖荣的TradePro交易平台，探索全球最热门的金融市场，体验一站式的交易服务！我们提供0佣金、极具优势的低价差及灵活的杠杆配置。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="#" className="btn btn-primary text-base px-8 py-4 rounded-lg">
                开通真实账户
              </a>
              <a href="#" className="btn btn-secondary text-base px-8 py-4 rounded-lg">
                尝试模拟账户
              </a>
            </div>
          </div>

          <div className="relative">
            {/* Trading platform mockup */}
            <div className="relative z-10 rounded-xl shadow-2xl overflow-hidden border border-dark-600 animate-float">
              <div className="bg-dark-700 p-2 flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="text-xs text-gray-400 ml-2">TradePro Platform</div>
              </div>
              <div className="bg-dark-800 aspect-[4/3] flex items-center justify-center p-4">
                {/* This would be replaced with an actual screenshot */}
                <div className="w-full h-full bg-dark-600 rounded-lg overflow-hidden relative">
                  {/* Chart mockup */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-full h-64" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0,150 L20,140 L40,145 L60,135 L80,150 L100,130 L120,125 L140,105 L160,120 L180,100 L200,80 L220,95 L240,75 L260,85 L280,65 L300,70 L320,50 L340,60 L360,40 L380,45 L400,25"
                        fill="none"
                        stroke="#009deb"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,180 L20,175 L40,178 L60,172 L80,180 L100,170 L120,168 L140,158 L160,165 L180,155 L200,145 L220,152 L240,142 L260,147 L280,137 L300,140 L320,130 L340,135 L360,125 L380,128 L400,118"
                        fill="none"
                        stroke="#2ca35f"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  {/* Trading interface elements */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between">
                    <div className="text-xs text-white bg-primary-600/80 px-2 py-1 rounded">外汇</div>
                    <div className="text-xs text-white bg-dark-500/80 px-2 py-1 rounded">EUR/USD</div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                    <div className="text-xs text-green-500">1.0876</div>
                    <div className="text-xs text-green-500">+0.15%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary-500/20 rounded-full filter blur-3xl z-0"></div>
          </div>
        </div>

        {/* Trusted by / Partners */}
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400 mb-6">值得信赖的国际平台</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-70">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-500/20 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
// AI-CUSTOMIZE-COMPONENT-END
