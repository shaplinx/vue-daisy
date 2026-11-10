<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  duration: { type: Number, default: 10000 },
  center: { type: Boolean, default: false },
})

const style = computed(() => ({ '--duration': `${props.duration}ms` }))
</script>

<template>
  <span class="text-rotate" :style="style">
    <span :class="{ 'justify-items-center': center }">
      <slot>
        <span v-for="(item, index) in items.slice(0, 6)" :key="index">{{ item }}</span>
      </slot>
    </span>
  </span>
</template>
