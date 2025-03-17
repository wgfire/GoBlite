<template>
  <div 
    class="rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg"
    :class="[featured ? 'border-2 border-primary-500 transform -translate-y-2' : 'border border-gray-200']"
  >
    <div 
      class="px-6 py-8"
      :class="[featured ? 'bg-primary-50' : 'bg-white']"
    >
      <h3 class="text-2xl font-semibold text-gray-900">{{ title }}</h3>
      <div class="mt-4 flex items-baseline">
        <span class="text-5xl font-extrabold tracking-tight text-gray-900">¥{{ price }}</span>
        <span class="ml-1 text-xl font-semibold text-gray-500">/{{ period }}</span>
      </div>
      <p class="mt-5 text-lg text-gray-500">{{ description }}</p>
    </div>
    <div class="px-6 pt-6 pb-8 bg-white">
      <ul class="space-y-4">
        <li 
          v-for="(feature, index) in features" 
          :key="index"
          class="flex items-start"
        >
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p class="ml-3 text-base text-gray-700">{{ feature }}</p>
        </li>
      </ul>
      <div class="mt-8">
        <button 
          type="button" 
          class="w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="[
            featured 
              ? 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500' 
              : 'text-primary-700 bg-primary-50 hover:bg-primary-100 focus:ring-primary-500'
          ]"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: Array as () => string[],
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
})
</script>
