import React from "react";

// AI-CUSTOMIZE-COMPONENT-START: HeroSection
// This component can be customized by AI based on user requirements
export const HeroSection: React.FC = () => {
  // Trading symbols for the ticker
  const tradingSymbols = [
    { name: "EUR/USD", buy: "1.0876", sell: "1.0878", change: "+0.15%", trend: "up" },
    { name: "GBP/USD", buy: "1.2534", sell: "1.2537", change: "-0.08%", trend: "down" },
    { name: "USD/JPY", buy: "151.43", sell: "151.46", change: "+0.21%", trend: "up" },
    { name: "BTC/USD", buy: "68432", sell: "68450", change: "+1.25%", trend: "up" },
    { name: "Gold", buy: "2324.5", sell: "2325.2", change: "+0.32%", trend: "up" },
    { name: "Oil", buy: "82.45", sell: "82.52", change: "-0.18%", trend: "down" },
    { name: "NASDAQ", buy: "16245", sell: "16248", change: "+0.75%", trend: "up" },
    { name: "S&P 500", buy: "5021", sell: "5023", change: "+0.42%", trend: "up" },
    { name: "TSLA", buy: "172.63", sell: "172.68", change: "-1.24%", trend: "down" },
    { name: "AAPL", buy: "169.58", sell: "169.62", change: "+0.35%", trend: "up" },
    { name: "MSFT", buy: "402.75", sell: "402.85", change: "+0.62%", trend: "up" },
    { name: "AMZN", buy: "178.35", sell: "178.42", change: "+0.48%", trend: "up" },
  ];

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center bg-dark-800 overflow-hidden">
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
              <span className="block text-primary-400">外汇、商品、指数、股票、ETF</span>
              <span className="block text-primary-400">和更多热门金融产品</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl">
              您可以通过屡获大奖殊荣的TradePro交易平台，探索全球最热门的金融市场，体验一站式的交易服务！我们提供0佣金、极具优势的低价差及灵活的杠杆配置。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="btn btn-primary text-base px-8 py-4 rounded-lg shadow-glow transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                开通真实账户
              </a>
              <a
                href="#"
                className="btn btn-secondary text-base px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
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
                {/* Trading platform interface */}
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
                      {/* Candlestick patterns */}
                      <g>
                        {[...Array(20)].map((_, i) => {
                          const x = i * 20;
                          const isUp = Math.random() > 0.5;
                          const height = Math.random() * 15 + 5;
                          const wickHeight = Math.random() * 10 + 5;
                          const y = 100 - (i % 3) * 10;

                          return (
                            <g key={i} transform={`translate(${x}, ${y})`}>
                              {/* Candle body */}
                              <rect x="-3" y={isUp ? -height : 0} width="6" height={height} fill={isUp ? "#2ca35f" : "#e53e3e"} />
                              {/* Wick */}
                              <line
                                x1="0"
                                y1={isUp ? -height - wickHeight : height + wickHeight}
                                x2="0"
                                y2={isUp ? -height : height}
                                stroke={isUp ? "#2ca35f" : "#e53e3e"}
                                strokeWidth="1"
                              />
                            </g>
                          );
                        })}
                      </g>
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
                  {/* Trading controls */}
                  <div className="absolute bottom-10 left-2 right-2 flex justify-between">
                    <button className="text-xs text-white bg-green-600 px-3 py-1 rounded">买入</button>
                    <button className="text-xs text-white bg-red-600 px-3 py-1 rounded">卖出</button>
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
            <div className="h-8 w-24 bg-gray-500/20 rounded-md flex items-center justify-center text-white text-xs">FSC监管</div>
            <div className="h-8 w-24 bg-gray-500/20 rounded-md flex items-center justify-center text-white text-xs">ASIC监管</div>
            <div className="h-8 w-24 bg-gray-500/20 rounded-md flex items-center justify-center text-white text-xs">资金隔离</div>
            <div className="h-8 w-24 bg-gray-500/20 rounded-md flex items-center justify-center text-white text-xs">负余额保护</div>
            <div className="h-8 w-24 bg-gray-500/20 rounded-md flex items-center justify-center text-white text-xs">SSL加密</div>
          </div>
        </div>
      </div>

      {/* Ticker tape */}
      <div className="w-full bg-dark-700/80 backdrop-blur-sm py-3 mt-auto overflow-hidden">
        <div className="flex space-x-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {tradingSymbols.concat(tradingSymbols).map((symbol, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-white font-medium">{symbol.name}</span>
              <span className="text-gray-400">买入: {symbol.buy}</span>
              <span className="text-gray-400">卖出: {symbol.sell}</span>
              <span className={`${symbol.trend === "up" ? "text-green-500" : "text-red-500"}`}>{symbol.change}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
// AI-CUSTOMIZE-COMPONENT-END
