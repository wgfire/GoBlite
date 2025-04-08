import React from "react";

// AI-CUSTOMIZE-COMPONENT-START: TestimonialsSection
// This component can be customized by AI based on user requirements
export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      content: "我在多个交易平台上交易过，但TradePro的交易体验是最好的。界面简洁直观，执行速度快，价差低，客户服务也非常专业。",
      author: "张先生",
      role: "资深交易员 | 上海",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
    },
    {
      id: 2,
      content: "作为一名新手交易者，TradePro的教育资源和模拟账户对我帮助很大。我能够在没有风险的情况下学习和实践，现在我已经开始用真实账户盈利了。",
      author: "李女士",
      role: "零售投资者 | 北京",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
    },
    {
      id: 3,
      content: "TradePro的移动应用让我可以随时随地管理我的交易。图表工具和技术分析功能非常强大，帮助我做出更明智的交易决策。",
      author: "王先生",
      role: "兼职交易员 | 广州",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4,
    },
  ];

  // Awards data
  const awards = [
    {
      id: 1,
      title: "最佳移动交易应用",
      organization: "Forex Awards",
      year: "2023",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "最佳客户服务",
      organization: "International Business Magazine",
      year: "2023",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "最佳交易平台",
      organization: "Global Banking and Finance",
      year: "2022",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "增长最快的交易平台",
      organization: "FxDailyInfo",
      year: "2022",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust indicators */}
        <div className="mb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl mb-4">值得信赖的国际平台</h2>
            <p className="text-xl text-secondary-600">我们致力于为客户提供安全负责的交易环境</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">权威机构监管</h3>
              <p className="text-secondary-600 text-sm">行业权威监管及授权，赢得全球客户的信赖</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">保护资金安全</h3>
              <p className="text-secondary-600 text-sm">零售客户存款依照监管法规要求按需单独存放在信托账户</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">负数余额保护</h3>
              <p className="text-secondary-600 text-sm">为您提供账户负数余额保护，负数余额及时清零，让您的损失不超过入金额</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">5*24小时客服</h3>
              <p className="text-secondary-600 text-sm">真诚专业的客户服务团队，24小时在线支持，乐意解决您的任何问题</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl mb-4">用户真实评价</h2>
            <p className="text-xl text-secondary-600">来自全球交易者的真实反馈，了解他们如何使用我们的平台获得成功</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">{renderStars(testimonial.rating)}</div>
                <div className="mb-6">
                  <p className="text-secondary-700 italic">"{testimonial.content}"</p>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src={testimonial.avatar} alt={testimonial.author} />
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-secondary-900">{testimonial.author}</p>
                    <p className="text-sm text-secondary-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 sm:text-4xl mb-4">我们的成绩</h2>
            <p className="text-xl text-secondary-600">我们一向追求卓越，精益求精，致力为客户提供优质的交易服务</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {awards.map((award) => (
              <div
                key={award.id}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4">{award.icon}</div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-1">{award.title}</h3>
                <p className="text-primary-600 font-medium mb-1">{award.organization}</p>
                <p className="text-sm text-secondary-500">{award.year}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
// AI-CUSTOMIZE-COMPONENT-END
