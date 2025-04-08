import React from "react";

// AI-CUSTOMIZE-COMPONENT-START: CTASection
// This component can be customized by AI based on user requirements
export const CTASection: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: "注册",
      description: "填写信息并提交您的申请",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "入金",
      description: "通过多种方式可快速存入资金",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "开始交易",
      description: "发掘交易机会及快速下单",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="cta" className="py-20 bg-gradient-to-r from-primary-700 to-primary-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-2 border-white/20 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">开设账户简单便捷</h2>
            <p className="text-xl text-primary-100">简单三步，数分钟内即可开通账户</p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step) => (
              <div
                key={step.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors duration-300"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white mx-auto mb-4 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.id}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-primary-100">{step.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#"
              className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg px-8 py-4 rounded-lg font-medium"
            >
              开通真实账户
            </a>
            <a
              href="#"
              className="btn bg-primary-600 text-white hover:bg-primary-700 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-lg px-8 py-4 rounded-lg font-medium"
            >
              尝试模拟账户
            </a>
          </div>

          {/* Payment methods */}
          <div className="mt-16 text-center">
            <p className="text-primary-100 mb-6">出入金便捷，多种支付方式</p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="h-10 w-16 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">Visa</span>
              </div>
              <div className="h-10 w-16 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">Mastercard</span>
              </div>
              <div className="h-10 w-16 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">PayPal</span>
              </div>
              <div className="h-10 w-16 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">银联</span>
              </div>
              <div className="h-10 w-16 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">支付宝</span>
              </div>
              <div className="h-10 w-16 bg-white/20 rounded-md flex items-center justify-center">
                <span className="text-white text-xs">微信支付</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
// AI-CUSTOMIZE-COMPONENT-END
