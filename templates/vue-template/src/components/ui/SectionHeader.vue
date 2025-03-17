<template>
  <div class="text-center">
    <h2 :class="[light ? 'text-white' : 'text-gray-900', 'text-3xl font-extrabold sm:text-4xl']">
      {{ title }}
    </h2>
    <p :class="[light ? 'text-primary-100' : 'text-gray-500', 'mt-4 max-w-2xl mx-auto text-xl']">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  light: {
    type: Boolean,
    default: false
  }
})
</script>
