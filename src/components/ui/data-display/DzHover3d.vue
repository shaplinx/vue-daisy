<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: { type: String, default: 'div' },
  label: { type: String, default: '' },
})

const tag = computed(() => props.as)
</script>

<template>
  <component :is="tag" class="hover-3d" :aria-label="label || undefined">
    <slot />
    <div v-for="index in 8" :key="index" aria-hidden="true" />
  </component>
</template>
