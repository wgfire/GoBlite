<template>
  <div>
    <Navbar />
    
    <section class="bg-primary-700 text-white">
      <div class="container py-16 md:py-24">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center">关于我们</h1>
        <p class="text-xl mb-8 text-primary-100 text-center max-w-3xl mx-auto">
          我们是一家致力于为客户提供最佳数字体验的创新公司
        </p>
      </div>
    </section>
    
    <section class="section bg-white">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold mb-6">我们的故事</h2>
            <p class="text-gray-600 mb-4">
              Goblite 成立于2020年，由一群热爱技术和设计的专业人士创立。我们的使命是通过创新的数字解决方案帮助企业实现增长和转型。
            </p>
            <p class="text-gray-600 mb-4">
              在短短几年内，我们已经与数百家企业合作，帮助他们建立强大的在线形象，优化用户体验，并实现业务目标。
            </p>
            <p class="text-gray-600">
              我们相信，成功的数字产品不仅仅是技术上的卓越，更是对用户需求的深刻理解和对细节的不懈追求。
            </p>
          </div>
          <div class="flex justify-center">
            <img src="@/assets/images/about-image.svg" alt="关于我们" class="max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </section>
    
    <section class="section bg-gray-50">
      <div class="container">
        <h2 class="text-3xl font-bold mb-12 text-center">我们的核心价值观</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-4xl text-primary-500 mb-4">🔍</div>
            <h3 class="text-xl font-semibold mb-4">用户至上</h3>
            <p class="text-gray-600">
              我们始终将用户需求放在首位，通过深入研究和持续测试，确保我们的产品能够真正解决用户问题。
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-4xl text-primary-500 mb-4">💡</div>
            <h3 class="text-xl font-semibold mb-4">创新精神</h3>
            <p class="text-gray-600">
              我们不断探索新技术和方法，挑战现状，为客户带来创新的解决方案。
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md">
            <div class="text-4xl text-primary-500 mb-4">🤝</div>
            <h3 class="text-xl font-semibold mb-4">协作共赢</h3>
            <p class="text-gray-600">
              我们相信真正的成功来自于团队的紧密协作和与客户的深度合作。
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="section bg-white">
      <div class="container">
        <h2 class="text-3xl font-bold mb-12 text-center">我们的团队</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img src="@/assets/images/team-1.jpg" alt="团队成员" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-xl font-semibold">张伟</h3>
            <p class="text-gray-600">创始人 & CEO</p>
          </div>
          <div class="text-center">
            <div class="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img src="@/assets/images/team-2.jpg" alt="团队成员" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-xl font-semibold">王芳</h3>
            <p class="text-gray-600">设计总监</p>
          </div>
          <div class="text-center">
            <div class="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img src="@/assets/images/team-3.jpg" alt="团队成员" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-xl font-semibold">李明</h3>
            <p class="text-gray-600">技术负责人</p>
          </div>
          <div class="text-center">
            <div class="w-40 h-40 rounded-full bg-gray-300 mx-auto mb-4 overflow-hidden">
              <img src="@/assets/images/team-4.jpg" alt="团队成员" class="w-full h-full object-cover" />
            </div>
            <h3 class="text-xl font-semibold">赵娜</h3>
            <p class="text-gray-600">市场总监</p>
          </div>
        </div>
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>
