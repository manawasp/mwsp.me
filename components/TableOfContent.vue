<script setup lang="ts">
import type { Toc, TocLink } from '@nuxt/content/dist/runtime/types'
import { throttleAndDebounce } from '~/support/utils'

type TocLinkWithPos = TocLink & { pos: undefined | number }

const props = defineProps<{
  value: Toc
}>()

const menuOpened = ref(true)
const localToc = ref<Array<any>>([])
const localTocFlat = ref<Array<{ id: string, pos: number | undefined, h2Id: string }>>([])
const container = ref()
const scrollPos = ref(0)

function setActivity() {
  scrollPos.value = document.documentElement.scrollTop
}

const onScroll = throttleAndDebounce(setActivity, 100)

const currentActiveLink = computed<{ id: string, pos: number | undefined, h2Id: string } | null>(() => {
  const passedElement = scrollPos.value + (window.screen.height / 4 + 50)

  for (let i = 0; localTocFlat.value.length; i++) {
    if (!localTocFlat.value[i].pos)
      continue

    if (localTocFlat.value[i].pos! < passedElement)
      continue
    else if (i > 0)
      return localTocFlat.value[i - 1]
  }
  return null
})

onMounted(() => {
  localToc.value = props.value.links.map((h2) => {
    const newH2: TocLinkWithPos = { ...h2, pos: undefined }
    const el = document.getElementById(h2.id)
    newH2.pos = el?.getBoundingClientRect().top

    // Feed flat
    localTocFlat.value.push({ id: newH2.id, pos: newH2.pos, h2Id: newH2.id })

    if (h2.children) {
      newH2.children = h2.children.map((h3) => {
        const newH3: TocLinkWithPos = { ...h3, pos: undefined }
        const el = document.getElementById(h3.id)
        newH3.pos = el?.getBoundingClientRect().top

        // Feed flat
        localTocFlat.value.push({ id: newH3.id, pos: newH3.pos, h2Id: newH2.id })

        if (h3.children) {
          newH3.children = h3.children.map((h4) => {
            const newH4: TocLinkWithPos = { ...h4, pos: undefined }
            const el = document.getElementById(h4.id)
            newH4.pos = el?.getBoundingClientRect().top

            // Feed flat
            localTocFlat.value.push({ id: newH4.id, pos: newH4.pos, h2Id: newH2.id })

            return newH4
          })
        }

        return newH3
      })
    }

    return newH2
  })

  window.addEventListener('scroll', onScroll)
  scrollPos.value = document.documentElement.scrollTop
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div ref="container" class="table-of-contents">
    <span class="text-left cursor-pointer toc-menu" :class="{ closed: !menuOpened }" @click="menuOpened = !menuOpened">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M8 4H21V6H8V4ZM4.5 6.5C3.67157 6.5 3 5.82843 3 5C3 4.17157 3.67157 3.5 4.5 3.5C5.32843 3.5 6 4.17157 6 5C6 5.82843 5.32843 6.5 4.5 6.5ZM4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12C6 12.8284 5.32843 13.5 4.5 13.5ZM4.5 20.4C3.67157 20.4 3 19.7284 3 18.9C3 18.0716 3.67157 17.4 4.5 17.4C5.32843 17.4 6 18.0716 6 18.9C6 19.7284 5.32843 20.4 4.5 20.4ZM8 11H21V13H8V11ZM8 18H21V20H8V18Z"
        />
      </svg>
    </span>
    <ul v-show="menuOpened">
      <span v-for="h2 in localToc" :key="h2.id" :class="{ 'current-section': currentActiveLink && h2.id === currentActiveLink.h2Id }">
        <li>
          <a :href="`#${h2.id}`" class="font-size-.9rem" :class="{ read: currentActiveLink && h2.id === currentActiveLink.id }">{{ h2.text }}</a>
        </li>
        <li v-if="h2.children">
          <ul>
            <template v-for="h3 in h2.children" :key="h3.id">
              <li>
                <a :href="`#${h3.id}`" class="font-size-.9rem" :class="{ read: currentActiveLink && h3.id === currentActiveLink.id }">{{ h3.text }}</a>
              </li>
              <li v-if="h3.children">
                <ul>
                  <li v-for="h4 in h3.children" :key="h4.id">
                    <a :href="`#${h4.id}`" class="font-size-.9rem" :class="{ read: currentActiveLink && h4.id === currentActiveLink.id }">{{ h4.text }}</a>
                  </li>
                </ul>
              </li>
            </template>
          </ul>
        </li>
      </span>
    </ul>
  </div>
</template>

<style>
.toc-menu {
  border-radius: 5px;
  padding: 4px 4px 4px 4px;
  width: max-content;
  display: inline-block;
  border: 1px solid #eee;
  margin-left: 0.8rem;
  opacity: .8;
  transition: all .2s ease;
}

.toc-menu:hover {
  opacity: 1;
}

.toc-menu.closed {
  background: #333;
  color: white;
  opacity: 1;
}

.dark .toc-menu {
  border-color: rgb(211 202 202 / 12%);
}

.dark .toc-menu.closed {
  background: rgb(211 202 202 / 12%);
  border-color: transparent;
}

.toc-menu>svg {
  width: 24px;
  height: 24px;
}

.table-of-contents {
  position: fixed;
  top: 80px;
  bottom: 0;
  font-size: .8em;
  width: 350px;
  left: .5em;
  z-index: 200;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  --c-bg: rgba(0, 0, 0, 0);
  --c-scrollbar: rgba(0, 0, 0, 0);
  --c-scrollbar-hover: #aaa;
}

.table-of-contents:hover {
  --c-scrollbar: rgba(66, 66, 66, .1);
}

.table-of-contents>ul {
  text-overflow: ellipsis;
  height: 100%;
  overflow-y: auto;
  margin-top: 1rem;
  padding-bottom: 6rem;
}

.table-of-contents>ul:after {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0px;
  height: 6rem;
  content: " ";
  background: linear-gradient(180deg, rgba(196, 196, 196, 0) -9.57%, rgba(254, 254, 254, .989583) 68.04%, #ffffff 90.43%);
  pointer-events: none;
}

.dark .table-of-contents>ul:after {
  background: linear-gradient(180deg, rgba(196, 196, 196, 0) -9.57%, rgba(34, 39, 46, .989583) 68.04%, #22272E 90.43%);
}

.table-of-contents ul>li,
.table-of-contents ul>span>li {
  padding-left: 0.8rem;
  line-height: 2.5em;
}

.table-of-contents li>a {
  transition: all .2s;
  display: block;
  color: #8b8995;
}

.table-of-contents li>a.read {
  opacity: .9;
  color: var(--fg-deeper);
}

.table-of-contents li>a:hover {
  color: var(--fg-deeper);
}

.current-section {
  display: inline-block;
  position: relative;
}

.current-section::after {
  position: absolute;
  content: ' ';
  left: -1px;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(-180deg, #A445B2 -100%, #D41872 52%, #FF0066 +200%);
}

@media screen and (max-width: 1129px) {
  .table-of-contents {
    display: none !important;
  }
}
</style>
