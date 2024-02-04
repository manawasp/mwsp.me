<script setup lang="ts">
const visibleCode = ref(0)

function getTabs() {
  const slots = useSlots()

  const _slots = slots?.default?.() || []

  return _slots.filter(f => f.props && (f.props.code || f.props.language)).map((slot, index) => {
    return {
      label: slot!.props!.filename || slot!.props!.label || `${index}`,
    }
  })
}
</script>

<template>
  <div class="code-group" :class="`code-group-${visibleCode}`" :codegroup="visibleCode">
    <div class="tabs">
      <template v-for="(tab, idx) in getTabs()" :key="tab.label">
        <span class="tab" :class="{ active: visibleCode === idx }" @click="visibleCode = idx">
          {{ tab.label }}
        </span>
      </template>
    </div>
    <div class="code-container">
      <ContentSlot />
    </div>
  </div>
</template>

<style>
.code-group pre {
  display: none;
}

.code-group-0 .code-container pre:nth-child(1),
.code-group-1 .code-container pre:nth-child(2),
.code-group-2 .code-container pre:nth-child(3),
.code-group-3 .code-container pre:nth-child(4),
.code-group-4 .code-container pre:nth-child(5),
.code-group-5 .code-container pre:nth-child(6),
.code-group-6 .code-container pre:nth-child(7),
.code-group-7 .code-container pre:nth-child(8),
.code-group-8 .code-container pre:nth-child(9),
.code-group-9 .code-container pre:nth-child(10),
.code-group-10 .code-container pre:nth-child(11) {
  display: block;
}
</style>
