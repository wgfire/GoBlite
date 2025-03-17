<template>
  <div class="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
    <div class="flex justify-center mb-4">
      <svg class="h-12 w-12 text-primary-400" fill="currentColor" viewBox="0 0 32 32">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
    </div>
    <p class="text-gray-600 italic mb-6">{{ quote }}</p>
    <div class="flex items-center">
      <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
        {{ author.charAt(0) }}
      </div>
      <div class="ml-3">
        <p class="text-gray-900 font-medium">{{ author }}</p>
        <p class="text-gray-500 text-sm">{{ position }}，{{ company }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  quote: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  }
})
</script>
