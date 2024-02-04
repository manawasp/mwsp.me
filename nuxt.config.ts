// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/content',
    '@unocss/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/main.css',
    '~/assets/blog.css',
    '~/assets/code-group.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  content: {
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai',
      },
      preload: [
        'diff',
        'json',
        'js',
        'ts',
        'css',
        'shell',
        'html',
        'md',
        'yaml',
        'rust',
        'go',
        'ruby',
        'python',
      ],
    },
    markdown: {
      toc: { depth: 3, searchDepth: 300 },
    },
  },
})
