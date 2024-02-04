<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  blank: {
    type: Boolean,
    default: false,
  },
})

function isHttpUrl(value: string) {
  let url
  try {
    url = new URL(value)
  }
  catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

const isExternal = isHttpUrl(props.href)
const bindProps: Record<string, string> = {
  to: props.href,
}
if (isExternal || props.blank)
  bindProps.target = '_blank'
</script>

<template>
  <NuxtLink v-bind="bindProps">
    <slot />
  </NuxtLink>
</template>
