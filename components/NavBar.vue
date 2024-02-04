<script setup lang="ts">
const colorMode = useColorMode()
const { y: scroll } = useWindowScroll()

function toTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="logo font-limelight font-bold absolute px-1.3em py-1em">
    <NuxtLink to="/" class="fixed home-link">
      MWSP
    </NuxtLink>
  </div>
  <button
    title="Scroll to top" fixed right-5 bottom-5 w-16 h-16 hover:op100 rounded-full bg-hex-aaa2 hover-bg-hex-8883 transition
    duration-300 z-100 print:hidden :class="scroll > 300 ? 'op70' : 'op0! pointer-events-none'" @click="toTop()"
  >
    <div i-ri-arrow-up-line w-7 h-7 />
  </button>
  <nav class="nav">
    <div />
    <div class="links">
      <NuxtLink to="/about">
        About
      </NuxtLink>
      <a href="https://github.com/manawasp" target="_blank">
        <div i-ri-github-line />
      </a>
      <a class="select-none" title="Toggle Color Scheme" @click="toggleDark">
        <div v-if="$colorMode.preference !== 'dark'" i-ri-sun-line />
        <div v-else i-ri-moon-line />
      </a>
    </div>
  </nav>
</template>

<style>
.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav .links {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity .2s ease;
  opacity: .6;
  outline: none;
}

.dark .nav a {
  color: var(--fg-deeper);
}

.nav a:hover {
  opacity: 1;
}

a.home-link {
  font-size: 1.6rem;
  text-decoration: none;
  opacity: 1;
  transition: all .3s;
  background-image: linear-gradient(-180deg, #A445B2 0%, #D41872 52%, #FF0066 100%);
  background-clip: text;
  color: transparent;
  width: 90px;
}

a.home-link:hover {
  opacity: .8;
}

.logo a {
  display: inline-block;
  width: 90px;
}

@media screen and (max-width: 1129px) {
  .logo a {
    position: relative !important;
  }
}
</style>
