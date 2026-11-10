<script setup>
import { computed, ref } from 'vue'
import { FileUp, X } from '@lucide/vue'
import { cn } from '@/utils/cn'
import { modifier, COLORS, SIZES } from '@/utils/daisy'

const props = defineProps({
  accept: { type: String, default: '' },
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  size: { type: String, default: 'md' },
  color: { type: String, default: 'default' },
  bordered: { type: Boolean, default: true },
  label: { type: String, default: 'Choose file' },
})

const emit = defineEmits(['change', 'clear'])

const input = ref(null)
const files = ref([])

const classes = computed(() =>
  cn(
    'file-input',
    modifier('file-input', props.size, SIZES),
    modifier('file-input', props.color, COLORS),
    { 'file-input-bordered': props.bordered },
  ),
)

function onChange(event) {
  files.value = Array.from(event.target.files || [])
  emit('change', { files: files.value, event })
}

function clear() {
  files.value = []
  if (input.value) input.value.value = ''
  emit('clear')
}

defineExpose({ clear, input })
</script>

<template>
  <div class="w-full">
    <input
      ref="input"
      type="file"
      :class="classes"
      :accept="accept || undefined"
      :multiple="multiple"
      :disabled="disabled"
      :aria-label="label"
      @change="onChange"
    />
    <ul v-if="files.length" class="mt-2 flex flex-col gap-1">
      <li
        v-for="file in files"
        :key="file.name"
        class="flex items-center justify-between rounded-box bg-base-200 px-3 py-1.5 text-xs"
      >
        <span class="truncate">{{ file.name }}</span>
        <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Remove file" @click="clear">
          <X class="size-3" aria-hidden="true" />
        </button>
      </li>
    </ul>
  </div>
</template>
