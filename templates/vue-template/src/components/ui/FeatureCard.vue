<template>
  <div class="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-600">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>
