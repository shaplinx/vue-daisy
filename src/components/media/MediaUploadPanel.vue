<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus, UploadCloud } from '@lucide/vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import DzProgress from '@/components/ui/feedback/DzProgress.vue'

const props = defineProps({
  uploading: { type: Boolean, default: false },
  progress: { type: Number, default: 0 },
})

const emit = defineEmits<{
  upload: [files: File[]]
  reject: [messages: string[]]
}>()

const MAX_BYTES = 10 * 1024 * 1024
const input = ref<HTMLInputElement | null>(null)
const dragActive = ref(false)

function openPicker(): void {
  if (props.uploading) return
  input.value?.click()
}

function onInputChange(event: Event): void {
  const target = event.target as HTMLInputElement
  handleFiles(Array.from(target.files ?? []))
  target.value = ''
}

function onDrop(event: DragEvent): void {
  dragActive.value = false
  if (props.uploading) return
  handleFiles(Array.from(event.dataTransfer?.files ?? []))
}

function handleFiles(files: File[]): void {
  if (!files.length) return
  const accepted: File[] = []
  const rejected: string[] = []

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      rejected.push(`${file.name} is not an image`)
    } else if (file.size > MAX_BYTES) {
      rejected.push(`${file.name} is larger than 10 MB`)
    } else {
      accepted.push(file)
    }
  }

  if (rejected.length) emit('reject', rejected)
  if (accepted.length) emit('upload', accepted)
}
</script>

<template>
  <div class="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4 sm:p-6">
    <div class="w-full max-w-2xl">
      <div
        class="flex min-h-72 flex-col items-center justify-center gap-4 rounded-box border-2 border-dashed px-6 py-10 text-center transition"
        :class="[
          dragActive ? 'border-primary bg-primary/10' : 'border-base-300 bg-base-200/40',
          uploading ? 'opacity-80' : '',
        ]"
        role="button"
        tabindex="0"
        aria-label="Upload media files"
        @click="openPicker"
        @keydown.enter.prevent="openPicker"
        @keydown.space.prevent="openPicker"
        @dragenter.prevent="dragActive = true"
        @dragover.prevent="dragActive = true"
        @dragleave.prevent="dragActive = false"
        @drop.prevent="onDrop"
      >
        <span
          class="flex size-16 items-center justify-center rounded-full"
          :class="dragActive ? 'bg-primary/20 text-primary' : 'bg-base-100 text-base-content/60'"
        >
          <UploadCloud class="size-8" aria-hidden="true" />
        </span>

        <div class="space-y-1">
          <h3 class="text-lg font-semibold">
            {{ uploading ? 'Uploading your files…' : dragActive ? 'Drop files to upload' : 'Drop files here to upload' }}
          </h3>
          <p class="text-sm text-base-content/60">
            {{
              uploading
                ? 'Keep this window open while the files are processed.'
                : 'Drag and drop images, or choose them from your device.'
            }}
          </p>
        </div>

        <DzButton
          v-if="!uploading"
          color="primary"
          @click.stop="openPicker"
        >
          <template #icon>
            <ImagePlus class="size-4" aria-hidden="true" />
          </template>
          Select files
        </DzButton>

        <DzProgress
          v-else
          :value="progress"
          color="primary"
          label="Upload progress"
          show-value
          class="max-w-sm"
        />

        <p class="text-xs text-base-content/50">
          SVG, PNG, JPG, GIF or WebP · up to 10 MB per file
        </p>

        <input
          ref="input"
          type="file"
          class="hidden"
          accept="image/*"
          multiple
          aria-label="Choose image files"
          @change="onInputChange"
        />
      </div>
    </div>
  </div>
</template>
