<template>
  <nav class="bg-white shadow-sm">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <img class="h-8 w-auto" src="@/assets/images/logo.svg" alt="Logo" />
            <span class="ml-2 text-xl font-bold text-primary-600">Goblite</span>
          </router-link>
          
          <!-- 导航链接 - 桌面版 -->
          <div class="hidden md:ml-6 md:flex md:space-x-8">
            <router-link 
              v-for="item in navItems" 
              :key="item.name" 
              :to="item.href" 
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              :class="[
                $route.path === item.href
                  ? 'border-primary-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
        
        <!-- 右侧按钮 -->
        <div class="flex items-center">
          <a href="#contact" class="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            联系我们
          </a>
          
          <!-- 移动端菜单按钮 -->
          <div class="flex items-center md:hidden">
            <button 
              @click="mobileMenuOpen = !mobileMenuOpen" 
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span class="sr-only">打开主菜单</span>
              <!-- 图标 -->
              <svg 
                v-if="!mobileMenuOpen" 
                class="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                v-else 
                class="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden"
    >
      <div class="pt-2 pb-3 space-y-1">
        <router-link 
          v-for="item in navItems" 
          :key="item.name" 
          :to="item.href" 
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          :class="[
            $route.path === item.href
              ? 'bg-primary-50 border-primary-500 text-primary-700'
              : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
          ]"
          @click="mobileMenuOpen = false"
        >
          {{ item.name }}
        </router-link>
        
        <a 
          href="#contact" 
          class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
          @click="mobileMenuOpen = false"
        >
          联系我们
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navItems = [
  { name: '首页', href: '/' },
  { name: '功能', href: '/features' },
  { name: '价格', href: '/pricing' },
  { name: '关于', href: '/about' }
]
</script>
