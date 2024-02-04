<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'font-sans text-gray-500 dark:text-gray-200',
  },
})
</script>

<template>
  <NavBar />
  <div class="px-7 pb-10">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
