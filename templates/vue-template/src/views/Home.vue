<template>
  <div>
    <!-- 导航栏 -->
    <Navbar />
    
    <!-- 英雄区域 -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div class="container py-16 md:py-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl md:text-5xl font-bold mb-4">现代化的产品落地页</h1>
            <p class="text-xl mb-8 text-primary-100">使用 Vue 3 和 Tailwind CSS 构建的响应式落地页模板，帮助您快速展示产品和服务。</p>
            <div class="flex flex-wrap gap-4">
              <a href="#features" class="btn btn-primary">了解功能</a>
              <a href="#pricing" class="btn bg-white text-primary-800 hover:bg-primary-50">查看价格</a>
            </div>
          </div>
          <div class="flex justify-center">
            <img src="@/assets/images/hero-image.svg" alt="产品展示" class="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
    
    <!-- 特性区域 -->
    <section id="features" class="section bg-white">
      <div class="container">
        <SectionHeader 
          title="强大的功能" 
          subtitle="我们提供一系列强大的功能，帮助您的业务蓬勃发展" 
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard 
            icon="🚀" 
            title="快速部署" 
            description="只需几分钟即可完成设置和部署，无需复杂的配置过程。" 
          />
          <FeatureCard 
            icon="🔒" 
            title="安全可靠" 
            description="采用最新的安全技术，确保您的数据始终受到保护。" 
          />
          <FeatureCard 
            icon="📱" 
            title="响应式设计" 
            description="在任何设备上都能提供出色的用户体验，从手机到桌面。" 
          />
          <FeatureCard 
            icon="⚡" 
            title="高性能" 
            description="优化的代码和资源加载，确保您的网站快速响应。" 
          />
          <FeatureCard 
            icon="🔄" 
            title="自动更新" 
            description="定期更新，确保您始终使用最新的功能和安全补丁。" 
          />
          <FeatureCard 
            icon="💬" 
            title="24/7 支持" 
            description="我们的支持团队随时准备帮助您解决任何问题。" 
          />
        </div>
      </div>
    </section>
    
    <!-- 价格区域 -->
    <section id="pricing" class="section bg-gray-50">
      <div class="container">
        <SectionHeader 
          title="灵活的价格方案" 
          subtitle="选择最适合您需求的价格方案，无隐藏费用" 
        />
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <PricingCard 
            title="基础版" 
            price="99" 
            period="月" 
            description="适合个人和小型团队的入门方案" 
            :features="['最多 5 个项目', '基本分析', '社区支持', '1GB 存储空间']" 
            buttonText="开始免费试用" 
          />
          <PricingCard 
            title="专业版" 
            price="199" 
            period="月" 
            description="适合成长中的企业的高级方案" 
            :features="['无限项目', '高级分析', '优先支持', '10GB 存储空间', 'API 访问']" 
            buttonText="立即购买" 
            featured 
          />
          <PricingCard 
            title="企业版" 
            price="399" 
            period="月" 
            description="适合大型企业的全功能方案" 
            :features="['无限项目', '高级分析', '24/7 专属支持', '100GB 存储空间', 'API 访问', '自定义集成']" 
            buttonText="联系销售" 
          />
        </div>
      </div>
    </section>
    
    <!-- 客户评价 -->
    <section class="section bg-white">
      <div class="container">
        <SectionHeader 
          title="客户评价" 
          subtitle="看看我们的客户怎么说" 
        />
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <TestimonialCard 
            quote="这个产品彻底改变了我们的工作方式，提高了我们的效率。" 
            author="张明" 
            position="技术总监" 
            company="科技有限公司" 
          />
          <TestimonialCard 
            quote="客户支持团队非常出色，他们总是能够快速解决我们的问题。" 
            author="李华" 
            position="产品经理" 
            company="创新科技" 
          />
          <TestimonialCard 
            quote="界面直观，功能强大，是我们团队的得力助手。" 
            author="王芳" 
            position="设计主管" 
            company="设计工作室" 
          />
        </div>
      </div>
    </section>
    
    <!-- 联系我们 -->
    <section id="contact" class="section bg-primary-900 text-white">
      <div class="container">
        <SectionHeader 
          title="联系我们" 
          subtitle="有任何问题？我们很乐意听取您的意见" 
          light 
        />
        
        <div class="max-w-2xl mx-auto mt-12">
          <ContactForm />
        </div>
      </div>
    </section>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import FeatureCard from '@/components/ui/FeatureCard.vue'
import PricingCard from '@/components/ui/PricingCard.vue'
import TestimonialCard from '@/components/ui/TestimonialCard.vue'
import ContactForm from '@/components/forms/ContactForm.vue'
</script>
