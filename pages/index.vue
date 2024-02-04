<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'

const query: QueryBuilderParams = { sort: [{ publishedAt: -1 }] }
</script>

<template>
  <div class="main-w m-auto">
    <ContentList v-slot="{ list }" :query="query">
      <Articles :value="list" />
    </ContentList>
  </div>
</template>
