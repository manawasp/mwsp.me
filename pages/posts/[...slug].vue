<script setup lang="ts">
import dayjs from 'dayjs'
</script>

<template>
  <main>
    <ContentDoc :path="$route.path.replace('/posts/', '/')">
      <template #default="{ doc }">
        <TableOfContent v-if="doc.body && doc.body.toc && doc.toc" :value="doc.body.toc" />
        <div class="post">
          <h1>{{ doc.title }}</h1>
          <div class="metadata">
            {{ dayjs(doc.publishedAt).format('MMMM D, YYYY') }}
            &#183; {{ doc.duration }}
            &#183; <span class="article-category">{{ doc.category }}</span>
          </div>
          <ContentRenderer :value="doc" class="mt-14" />
          <div class="mt-12 mb-12">
            <NuxtLink to="/">
              &#8592; Blog
            </NuxtLink>
          </div>
        </div>
      </template>
      <template #not-found>
        Post missing or not found..
      </template>
    </ContentDoc>
  </main>
</template>

<style>
.metadata {
  color: #57606a;
  font-size: 1rem;
  line-height: 24px;
}
</style>
