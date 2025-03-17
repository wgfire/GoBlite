<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div class="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
      <div>
        <label for="firstName" class="block text-sm font-medium text-white">姓名</label>
        <div class="mt-1">
          <input 
            type="text" 
            name="firstName" 
            id="firstName" 
            v-model="form.firstName"
            class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.firstName }"
          >
          <p v-if="errors.firstName" class="mt-2 text-sm text-red-300">{{ errors.firstName }}</p>
        </div>
      </div>
      
      <div>
        <label for="lastName" class="block text-sm font-medium text-white">姓氏</label>
        <div class="mt-1">
          <input 
            type="text" 
            name="lastName" 
            id="lastName" 
            v-model="form.lastName"
            class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.lastName }"
          >
          <p v-if="errors.lastName" class="mt-2 text-sm text-red-300">{{ errors.lastName }}</p>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <label for="email" class="block text-sm font-medium text-white">邮箱</label>
        <div class="mt-1">
          <input 
            id="email" 
            name="email" 
            type="email" 
            v-model="form.email"
            class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.email }"
          >
          <p v-if="errors.email" class="mt-2 text-sm text-red-300">{{ errors.email }}</p>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <label for="phone" class="block text-sm font-medium text-white">电话</label>
        <div class="mt-1">
          <input 
            type="text" 
            name="phone" 
            id="phone" 
            v-model="form.phone"
            class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.phone }"
          >
          <p v-if="errors.phone" class="mt-2 text-sm text-red-300">{{ errors.phone }}</p>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <label for="subject" class="block text-sm font-medium text-white">主题</label>
        <div class="mt-1">
          <input 
            type="text" 
            name="subject" 
            id="subject" 
            v-model="form.subject"
            class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.subject }"
          >
          <p v-if="errors.subject" class="mt-2 text-sm text-red-300">{{ errors.subject }}</p>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <label for="message" class="block text-sm font-medium text-white">消息</label>
        <div class="mt-1">
          <textarea 
            id="message" 
            name="message" 
            rows="4" 
            v-model="form.message"
            class="py-3 px-4 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 border-gray-300 rounded-md"
            :class="{ 'border-red-500': errors.message }"
          ></textarea>
          <p v-if="errors.message" class="mt-2 text-sm text-red-300">{{ errors.message }}</p>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <input 
              id="privacy" 
              name="privacy" 
              type="checkbox" 
              v-model="form.privacy"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              :class="{ 'border-red-500': errors.privacy }"
            >
          </div>
          <div class="ml-3">
            <p class="text-base text-white">
              我同意您的
              <a href="#" class="font-medium text-primary-300 underline">隐私政策</a>
              和
              <a href="#" class="font-medium text-primary-300 underline">服务条款</a>。
            </p>
            <p v-if="errors.privacy" class="mt-2 text-sm text-red-300">{{ errors.privacy }}</p>
          </div>
        </div>
      </div>
      
      <div class="sm:col-span-2">
        <button 
          type="submit" 
          class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            提交中...
          </span>
          <span v-else>提交</span>
        </button>
      </div>
    </div>
    
    <div v-if="submitSuccess" class="sm:col-span-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">成功!</strong>
      <span class="block sm:inline">您的消息已成功提交，我们会尽快与您联系。</span>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacy: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  privacy: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const validateForm = () => {
  let valid = true
  
  // 重置错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  if (!form.firstName.trim()) {
    errors.firstName = '请输入您的姓名'
    valid = false
  }
  
  if (!form.lastName.trim()) {
    errors.lastName = '请输入您的姓氏'
    valid = false
  }
  
  if (!form.email.trim()) {
    errors.email = '请输入您的邮箱'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    valid = false
  }
  
  if (!form.subject.trim()) {
    errors.subject = '请输入主题'
    valid = false
  }
  
  if (!form.message.trim()) {
    errors.message = '请输入您的消息'
    valid = false
  }
  
  if (!form.privacy) {
    errors.privacy = '您必须同意我们的隐私政策和服务条款'
    valid = false
  }
  
  return valid
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 重置表单
    Object.keys(form).forEach(key => {
      if (key === 'privacy') {
        form[key as keyof typeof form] = false
      } else {
        form[key as keyof typeof form] = ''
      }
    })
    
    submitSuccess.value = true
    
    // 3秒后隐藏成功消息
    setTimeout(() => {
      submitSuccess.value = false
    }, 3000)
  } catch (error) {
    console.error('提交表单时出错:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
