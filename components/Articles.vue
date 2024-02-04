<script setup lang="ts">
import dayjs from 'dayjs'
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const props = defineProps<{
  value: ParsedContent[]
}>()

const currentYear = Number.parseInt(dayjs().format('YYYY'))

const articlesPerYear = computed(() => {
  return props.value.reduce((grouped: any, obj) => {
    const year = dayjs(obj.publishedAt).format('YYYY')
    grouped[year] = grouped[year] || []
    grouped[year].push(obj)
    return grouped
  }, {})
})
const years = computed(() => {
  const keys = Object.keys(articlesPerYear.value).map(v => Number.parseInt(v))

  return keys.sort().reverse()
})
</script>

<template>
  <div class="articles">
    <template v-for="year in years" :key="year">
      <p v-if="currentYear !== year" class="font-mono text-xl year pt-8">
        {{ year }}
      </p>
      <div v-for="article in articlesPerYear[year]" :key="article._path" class="item mb-13 mt-6">
        <NuxtLink :to="`/posts${article._path}`" class="title text-xl leading-1em">
          {{ article.title }}
        </NuxtLink>
        <!-- <p class="description mt-1 mb-2" v-if="article.description">
    {{ article.description }}
  </p> -->
        <div class="metadata font-mono">
          {{ article.duration }}
          &#183; {{ dayjs(article.publishedAt).format('MMM D') }}
          <span v-if="article.category">
            &#183; <span class="article-category">{{ article.category }}</span>
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
.item {
  color: var(--fg-deeper);
  transition: .2s all ease-out;
  text-decoration: none;
  border-bottom: none !important;
}

.item a:hover {
  color: #D81671;
  text-decoration: underline;
}

.item .title {
  color: #3e393d;
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 2.4rem;;
}

.articles div:nth-of-type(1) .title { color: #D81671;}
.articles div:nth-of-type(2) .title { color: #8B1274;}

.dark .articles div:nth-of-type(1) .title { color: #b93674;}
.dark .articles div:nth-of-type(2) .title { color: #cf91ae;}

.item .metadata {
  color: #a4adb7;
  font-size: .9rem;
  line-height: 24px;
}

.article-category {
  border-bottom: 1px dashed #aaa;
}

.year {
  color: #cac8d1;
  font-size: 2rem;
  padding-bottom: 12px;
  margin-bottom: 3rem;
  margin-top: 1rem;
}

.dark .item .title {
  color: rgb(211 217 223 / 90%);
}

.dark .item a:hover {
  color: #D81671;
  text-decoration: underline;
}

.dark .item .metadata {
  color: rgb(176 185 195 / 70%);
}

.dark .year {
  color: rgb(202 200 209 / 50%);
  border-bottom: 1px solid rgb(208 215 222 / 20%);
}
</style>
