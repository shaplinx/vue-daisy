<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'
import type { PropType } from 'vue'
import { Check, Copy, ImageOff, Save, Trash2, X } from '@lucide/vue'
import DzBadge from '@/components/ui/data-display/DzBadge.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import DzInput from '@/components/ui/data-input/DzInput.vue'
import DzLabel from '@/components/ui/data-input/DzLabel.vue'
import DzTextarea from '@/components/ui/data-input/DzTextarea.vue'
import { useClipboard } from '@/composables/useClipboard'
import type { MediaItem, MediaMetadataInput } from '@/services/mediaService'
import {
  fileExtension,
  formatDimensions,
  formatFileSize,
  formatMediaDate,
} from '@/utils/media'

const props = defineProps({
  item: { type: Object as PropType<MediaItem | null>, default: null },
  saving: { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
  /** Set to `false` to force read-only details; both library modes edit by default. */
  editable: { type: Boolean, default: true },
  allowDelete: { type: Boolean, default: true },
})

const emit = defineEmits<{
  save: [payload: { id: number; metadata: MediaMetadataInput }]
  delete: [item: MediaItem]
  close: []
}>()

const uid = useId()
const { copied, copy } = useClipboard()

const draft = ref<MediaMetadataInput>({
  title: '',
  alt: '',
  caption: '',
  description: '',
})

function syncDraft(item: MediaItem | null): void {
  draft.value = {
    title: item?.title ?? '',
    alt: item?.alt ?? '',
    caption: item?.caption ?? '',
    description: item?.description ?? '',
  }
}

watch(() => props.item, syncDraft, { immediate: true, deep: true })

const dirty = computed(() => {
  const item = props.item
  if (!item) return false
  return (
    draft.value.title !== item.title ||
    draft.value.alt !== item.alt ||
    draft.value.caption !== item.caption ||
    draft.value.description !== item.description
  )
})

const titleError = computed(() => dirty.value && !draft.value.title.trim())
const canSave = computed(() => Boolean(props.item) && dirty.value && !titleError.value && !props.saving)

function setField(key: keyof MediaMetadataInput, value: string | number): void {
  draft.value[key] = String(value)
}

function save(): void {
  if (!props.item || !canSave.value) return
  emit('save', {
    id: props.item.id,
    metadata: {
      ...draft.value,
      title: draft.value.title.trim(),
    },
  })
}

async function copyUrl(): Promise<void> {
  if (props.item) await copy(props.item.url)
}
</script>

<template>
  <section class="flex h-full min-h-0 flex-col" aria-label="Attachment details">
    <header class="flex items-center justify-between gap-2 border-b border-base-300 px-4 py-3">
      <div>
        <h2 class="text-sm font-semibold">Attachment details</h2>
        <p class="text-xs text-base-content/60">Edit metadata for the selected asset.</p>
      </div>
      <DzButton size="xs" variant="ghost" circle aria-label="Close attachment details" @click="emit('close')">
        <X class="size-4" aria-hidden="true" />
      </DzButton>
    </header>

    <div v-if="!item" class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <span class="flex size-14 items-center justify-center rounded-full bg-base-200 text-base-content/40">
        <ImageOff class="size-7" aria-hidden="true" />
      </span>
      <div class="space-y-1">
        <p class="text-sm font-medium">No attachment selected</p>
        <p class="text-xs text-base-content/60">
          Select a media item to preview it and edit its title, alt text, caption and description.
        </p>
      </div>
    </div>

    <div v-else class="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div class="space-y-4 p-4">
        <div class="overflow-hidden rounded-box border border-base-300 bg-base-200">
          <img
            :src="item.url"
            :alt="item.alt || item.title || item.filename"
            class="max-h-64 w-full object-contain"
          />
        </div>

        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold" :title="item.filename">{{ item.filename }}</p>
            <p class="mt-0.5 text-xs text-base-content/60">
              {{ formatDimensions(item.width, item.height) }} · {{ formatFileSize(item.size) }}
            </p>
          </div>
          <DzBadge variant="soft" color="info" size="sm" class="uppercase">
            {{ fileExtension(item.filename) || 'file' }}
          </DzBadge>
        </div>

        <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt class="text-base-content/50">Dimensions</dt>
            <dd class="font-medium">{{ formatDimensions(item.width, item.height) }}</dd>
          </div>
          <div>
            <dt class="text-base-content/50">File size</dt>
            <dd class="font-medium">{{ formatFileSize(item.size) }}</dd>
          </div>
          <div>
            <dt class="text-base-content/50">Type</dt>
            <dd class="truncate font-medium" :title="item.mimeType">{{ item.mimeType }}</dd>
          </div>
          <div>
            <dt class="text-base-content/50">Uploaded</dt>
            <dd class="font-medium">{{ formatMediaDate(item.uploadedAt) }}</dd>
          </div>
        </dl>

        <div class="flex items-center gap-2">
          <DzButton size="xs" variant="outline" @click="copyUrl">
            <template #icon>
              <Check v-if="copied" class="size-3.5" aria-hidden="true" />
              <Copy v-else class="size-3.5" aria-hidden="true" />
            </template>
            {{ copied ? 'URL copied' : 'Copy URL' }}
          </DzButton>
          <span class="text-[11px] text-base-content/50">ID #{{ item.id }}</span>
        </div>
      </div>

      <p
        v-if="!editable"
        class="border-t border-base-300 px-4 py-3 text-xs text-base-content/60"
      >
        Metadata editing is disabled for this media library.
      </p>

      <form v-if="editable" class="space-y-4 border-t border-base-300 p-4" @submit.prevent="save">
        <div class="space-y-1">
          <DzLabel :text="'Title'" :html-for="`${uid}-title`" required />
          <DzInput
            :id="`${uid}-title`"
            :model-value="draft.title"
            :invalid="titleError"
            placeholder="Attachment title"
            @update:model-value="setField('title', $event)"
          />
          <p v-if="titleError" class="text-xs text-error">A title is required.</p>
        </div>

        <div class="space-y-1">
          <DzLabel :text="'Alt text'" :html-for="`${uid}-alt`" />
          <DzInput
            :id="`${uid}-alt`"
            :model-value="draft.alt"
            placeholder="Describe the image for screen readers"
            @update:model-value="setField('alt', $event)"
          />
        </div>

        <div class="space-y-1">
          <DzLabel :text="'Caption'" :html-for="`${uid}-caption`" />
          <DzTextarea
            :id="`${uid}-caption`"
            :model-value="draft.caption"
            :rows="2"
            resize="none"
            placeholder="Short caption shown with the asset"
            @update:model-value="setField('caption', $event)"
          />
        </div>

        <div class="space-y-1">
          <DzLabel :text="'Description'" :html-for="`${uid}-description`" />
          <DzTextarea
            :id="`${uid}-description`"
            :model-value="draft.description"
            :rows="3"
            resize="none"
            placeholder="Longer description for this attachment"
            @update:model-value="setField('description', $event)"
          />
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
          <DzButton
            v-if="allowDelete"
            size="sm"
            variant="outline"
            color="error"
            :loading="deleting"
            @click="emit('delete', item)"
          >
            <template #icon>
              <Trash2 class="size-4" aria-hidden="true" />
            </template>
            Delete
          </DzButton>
          <span v-else></span>
          <DzButton size="sm" color="primary" :disabled="!canSave" :loading="saving" @click="save">
            <template #icon>
              <Save class="size-4" aria-hidden="true" />
            </template>
            Save details
          </DzButton>
        </div>
      </form>
    </div>
  </section>
</template>
