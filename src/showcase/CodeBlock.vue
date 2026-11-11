<script setup lang="ts">
import { computed } from 'vue'
import { Check, Copy } from '@lucide/vue'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: 'vue' },
  filename: { type: String, default: '' },
  showLineNumbers: { type: Boolean, default: true },
})

const { copied, copy } = useClipboard()
const lines = computed(() => props.code.split('\n'))
</script>

<template>
  <div class="overflow-hidden rounded-box border border-base-300 bg-neutral text-neutral-content">
    <div class="flex items-center justify-between border-b border-white/10 px-4 py-2">
      <span class="inline-flex items-center gap-2 text-xs opacity-70">
        <span class="flex gap-1" aria-hidden="true">
          <span class="size-2.5 rounded-full bg-error/70" />
          <span class="size-2.5 rounded-full bg-warning/70" />
          <span class="size-2.5 rounded-full bg-success/70" />
        </span>
        {{ filename || language }}
      </span>
      <button
        type="button"
        class="btn btn-ghost btn-xs gap-1.5 text-neutral-content"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy(code)"
      >
        <Check v-if="copied" class="size-3.5 text-success" aria-hidden="true" />
        <Copy v-else class="size-3.5" aria-hidden="true" />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>

    <div class="code-scroll">
      <pre class="p-4 text-[13px] leading-relaxed"><code><span
        v-for="(line, index) in lines"
        :key="index"
        class="flex"
      ><span
        v-if="showLineNumbers"
        class="w-8 shrink-0 select-none pe-4 text-end opacity-30"
        aria-hidden="true"
      >{{ index + 1 }}</span><span class="whitespace-pre">{{ line || ' ' }}</span></span></code></pre>
    </div>
  </div>
</template>
