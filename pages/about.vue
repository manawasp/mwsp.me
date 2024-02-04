<template>
  <div class="main-w m-auto">
    <h1>Clovis Kyndt</h1>
    <p>
      Hey there! I'm Clovis Kyndt, a software engineer with a passion for crafting and a love for sharing knowledge.
    </p>
    <p>
      Over the past decade, I've been working in a growthing team and met different challenges, technical, products and
      organization one.
      <br>
      I started this blog to share insight, idea and essay.
    </p>
    <p>
      Beyond the tech, I enjoy cooking asian dish, baking and traveling.
    </p>
    <br>
    <p>
      <ul>
        <li>
          <NuxtLink to="/">
            -> Articles
          </NuxtLink>
        </li>
        <li class="pt-.5rem">
          <NuxtLink to="https://cloviskyndt.com" target="_blank">
            -> Curriculum Vitae
          </NuxtLink>
        </li>
      </ul>
    </p>
  </div>
</template>

<style scoped>
h1 {
  color: var(--fg-deeper);
  opacity: .9;
}

p {
  margin-top: 1.25em;
  margin-bottom: 1.25em;
}

a {
  color: var(--fg-deeper);
  text-decoration: none;
  border-bottom: 1px solid rgba(125, 125, 125, .3);
  transition: border .3s ease-in-out;
}

a:hover {
  border-bottom: 1px solid rgba(125, 125, 125, 1);
}
</style>
