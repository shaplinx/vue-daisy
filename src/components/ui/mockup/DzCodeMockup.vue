<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { ClassValue } from '@/utils/cn'
import { cn } from '@/utils/cn'

const props = defineProps({
  lines: { type: Array as PropType<Array<string | Record<string, string>>>, default: () => [] },
  prefix: { type: String, default: '$' },
  showLineNumbers: { type: Boolean, default: false },
  contentClass: { type: [String, Array, Object] as PropType<ClassValue>, default: '' },
})

interface CodeMockupLine {
  text?: string
  prefix?: string
  class?: string
}

const normalized = computed<CodeMockupLine[]>(() =>
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
