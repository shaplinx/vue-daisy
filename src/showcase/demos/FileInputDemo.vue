<script setup>
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const files = ref([])

function onChange({ files: next }) {
  files.value = next
  toast.info(`${next.length} file${next.length === 1 ? '' : 's'} selected`)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-xl space-y-4">
    <DzFileInput accept="image/*" multiple label="Upload images" @change="onChange" />
    <p class="text-xs text-base-content/60">
      Selected: {{ files.length ? files.map((file) => file.name).join(', ') : 'no files' }}
    </p>
    <DzFileInput accept=".pdf,.doc,.docx" label="Upload a document" />
    <DzFileInput disabled label="Disabled file input" />
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="space-y-3">
        <DzFileInput v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']" :key="color" :color="color" :label="`${color} file input`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="space-y-3">
        <DzFileInput v-for="size in ['xs', 'sm', 'md', 'lg']" :key="size" :size="size" :label="`Size ${size}`" />
      </div>
    </div>
  </div>
</template>
