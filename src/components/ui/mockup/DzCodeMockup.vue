<script setup>
import { computed } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps({
  lines: { type: Array, default: () => [] },
  prefix: { type: String, default: '$' },
  showLineNumbers: { type: Boolean, default: false },
  contentClass: { type: [String, Array, Object], default: '' },
})

const normalized = computed(() =>
  props.lines.map((line) =>
    typeof line === 'string' ? { text: line } : { prefix: props.prefix, ...line },
  ),
)
</script>

<template>
  <div :class="cn('mockup-code w-full', contentClass)">
    <pre
      v-for="(line, index) in normalized"
      :key="index"
      :data-prefix="line.prefix ?? prefix"
      :class="line.class"
    ><code>{{ line.text }}</code></pre>
    <slot />
  </div>
</template>
