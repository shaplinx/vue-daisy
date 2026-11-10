<script setup>
import { computed, provide } from 'vue'
import { DEMO_MODE_KEY } from '@/showcase/useDemoMode'

const props = defineProps({
  mode: { type: String, default: 'preview' },
})

const mode = computed(() => props.mode)
provide(DEMO_MODE_KEY, mode)
</script>

<template>
  <div
    class="demo-surface rounded-box border border-base-300 bg-base-100 p-4 sm:p-6"
    :data-demo-mode="mode"
  >
    <slot :mode="mode" />
  </div>
</template>

<style scoped>
.demo-surface {
  background-image: radial-gradient(
    color-mix(in oklab, var(--color-base-content) 7%, transparent) 1px,
    transparent 1px
  );
  background-size: 16px 16px;
}
</style>
