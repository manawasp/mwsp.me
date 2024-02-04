<script setup lang="ts">
import { computed, useRuntimeConfig } from '#imports'

const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && headings?.anchorLinks?.h2)
</script>

<template>
  <h2 :id="id">
    <slot />
    <a v-if="generate" class="header-anchor" :href="`#${id}`" aria-hidden="true">#</a>
  </h2>
</template>
