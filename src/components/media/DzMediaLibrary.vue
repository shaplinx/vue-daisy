<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PropType } from 'vue'
import {
  Download,
  Image as ImageIcon,
  ImageOff,
  Images,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  X,
} from '@lucide/vue'
import DzAlert from '@/components/ui/feedback/DzAlert.vue'
import DzBadge from '@/components/ui/data-display/DzBadge.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import DzCheckbox from '@/components/ui/data-input/DzCheckbox.vue'
import DzInput from '@/components/ui/data-input/DzInput.vue'
import DzLoading from '@/components/ui/feedback/DzLoading.vue'
import DzModal from '@/components/ui/actions/DzModal.vue'
import DzSkeleton from '@/components/ui/feedback/DzSkeleton.vue'
import DzTabs from '@/components/ui/navigation/DzTabs.vue'
import type { TabId, TabItem } from '@/components/ui/navigation/DzTabs.vue'
import MediaDetailsPanel from './MediaDetailsPanel.vue'
import MediaGridItem from './MediaGridItem.vue'
import MediaUploadPanel from './MediaUploadPanel.vue'
import type { MediaItem, MediaMetadataInput } from '@/services/mediaService'

type MediaLibraryMode = 'management' | 'selector'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /**
   * `management` exposes full CRUD and bulk download.
   * `selector` is the editor picker and ends with "Insert Media (n)".
   */
  mode: { type: String as PropType<MediaLibraryMode>, default: 'management' },
  items: { type: Array as PropType<MediaItem[]>, default: () => [] },
  loading: { type: Boolean, default: false },
  loadingMore: { type: Boolean, default: false },
  hasMore: { type: Boolean, default: false },
  error: { type: String, default: '' },
  loadMoreError: { type: String, default: '' },
  search: { type: String, default: '' },
  selected: { type: Array as PropType<number[]>, default: () => [] },
  total: { type: Number, default: 0 },
  savingId: { type: Number as PropType<number | null>, default: null },
  deleting: { type: Boolean, default: false },
  uploading: { type: Boolean, default: false },
  uploadProgress: { type: Number, default: 0 },
  title: { type: String, default: 'Media Library' },
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'update:search': [value: string]
  'update:selected': [value: number[]]
  'load-more': []
  retry: []
  save: [payload: { id: number; metadata: MediaMetadataInput }]
  delete: [ids: number[]]
  upload: [files: File[]]
  reject: [messages: string[]]
  download: [items: MediaItem[]]
  insert: [items: MediaItem[]]
  open: []
  close: []
}>()

const activeTab = ref<TabId>('library')
const activeId = ref<number | null>(null)
const scrollContainer = ref<HTMLElement | null>(null)
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const open = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const tabs = computed<TabItem[]>(() => [
  {
    id: 'library',
    label: 'Media Library',
    icon: Images,
    badge: props.total || undefined,
  },
  { id: 'upload', label: 'Upload Files', icon: Upload },
])

const activeItem = computed(
  () => props.items.find((item) => item.id === activeId.value) ?? null,
)
const selectedItems = computed(() =>
  props.items.filter((item) => props.selected.includes(item.id)),
)
const selectedCount = computed(() => selectedItems.value.length)
const visibleIds = computed(() => props.items.map((item) => item.id))
const allVisibleSelected = computed(
  () => visibleIds.value.length > 0 && visibleIds.value.every((id) => props.selected.includes(id)),
)
const someVisibleSelected = computed(
  () => !allVisibleSelected.value && visibleIds.value.some((id) => props.selected.includes(id)),
)

const modeDescription = computed(() =>
  props.mode === 'selector'
    ? 'Choose one or more images, edit their details, then insert them into your content.'
    : 'Upload, organise and edit the files used across your site.',
)

function close(): void {
  open.value = false
}

function toggleSelected(id: number): void {
  const next = props.selected.includes(id)
    ? props.selected.filter((item) => item !== id)
    : [...props.selected, id]
  emit('update:selected', next)
}

function toggleSelectAll(value: boolean | Array<string | number | boolean>): void {
  const checked = Array.isArray(value) ? value.length > 0 : value
  const next = new Set(props.selected)
  for (const id of visibleIds.value) {
    if (checked) next.add(id)
    else next.delete(id)
  }
  emit('update:selected', Array.from(next))
}

function onItemOpen(item: MediaItem): void {
  activeId.value = item.id
  // In selector mode a click is the primary selection gesture; management
  // mode keeps selection explicit through the checkbox.
  if (props.mode === 'selector') toggleSelected(item.id)
}

function onSave(payload: { id: number; metadata: MediaMetadataInput }): void {
  emit('save', payload)
}

function requestDelete(ids: number[]): void {
  if (ids.length) emit('delete', ids)
}

function downloadSelected(): void {
  if (selectedItems.value.length) emit('download', selectedItems.value)
}

function insertMedia(): void {
  if (!selectedItems.value.length) return
  emit('insert', selectedItems.value)
  close()
}

function teardownObserver(): void {
  observer?.disconnect()
  observer = null
}

function setupObserver(): void {
  teardownObserver()
  if (
    !props.modelValue ||
    activeTab.value !== 'library' ||
    !scrollContainer.value ||
    !sentinel.value ||
    typeof IntersectionObserver === 'undefined'
  ) {
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      // A failed load-more must not retry in a loop: the sentinel is still
      // visible, so wait for the user to press Retry.
      if (props.loading || props.loadingMore || props.loadMoreError || !props.hasMore) return
      emit('load-more')
    },
    {
      root: scrollContainer.value,
      rootMargin: '240px 0px',
    },
  )
  observer.observe(sentinel.value)
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      activeTab.value = 'library'
      emit('open')
    } else {
      activeId.value = null
      emit('close')
    }
    await nextTick()
    setupObserver()
  },
)

watch(
  () => [activeTab.value, props.items.length, props.loadingMore, props.hasMore],
  async () => {
    await nextTick()
    setupObserver()
  },
)

onMounted(() => {
  if (props.modelValue) void nextTick(setupObserver)
})

onBeforeUnmount(teardownObserver)

defineExpose({
  showLibrary: () => {
    activeTab.value = 'library'
  },
  showUpload: () => {
    activeTab.value = 'upload'
  },
  closeDetails: () => {
    activeId.value = null
  },
})
</script>

<template>
  <DzModal
    v-model="open"
    size="full"
    hide-header
    :title="title"
    content-class="flex h-[min(82vh,720px)] flex-col overflow-hidden p-0"
  >
    <header class="flex items-center gap-3 border-b border-base-300 px-4 py-3">
      <span class="flex size-9 shrink-0 items-center justify-center rounded-box bg-primary/15 text-primary">
        <ImageIcon class="size-5" aria-hidden="true" />
      </span>
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <h2 class="truncate text-base font-semibold">{{ title }}</h2>
          <DzBadge variant="soft" color="primary" size="sm">
            {{ mode === 'selector' ? 'Selector' : 'Management' }}
          </DzBadge>
        </div>
        <p class="truncate text-xs text-base-content/60">{{ modeDescription }}</p>
      </div>
      <div class="ms-auto flex items-center gap-2">
        <DzBadge variant="ghost" size="sm">{{ total }} assets</DzBadge>
        <DzButton size="sm" variant="ghost" circle aria-label="Close media library" @click="close">
          <X class="size-4" aria-hidden="true" />
        </DzButton>
      </div>
    </header>

    <DzTabs
      v-model="activeTab"
      :tabs="tabs"
      aria-label="Media library sections"
      class="flex min-h-0 flex-1 flex-col [&>div:first-child]:px-4 [&>div:first-child]:pt-2"
      panel-class="flex min-h-0 flex-1 flex-col"
    >
      <template #panel-upload>
        <MediaUploadPanel
          :uploading="uploading"
          :progress="uploadProgress"
          @upload="emit('upload', $event)"
          @reject="emit('reject', $event)"
        />
      </template>

      <template #panel-library>
        <div class="relative flex min-h-0 flex-1">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col border-e border-base-300">
            <div class="flex flex-wrap items-center gap-2 border-b border-base-300 px-3 py-2">
              <DzInput
                :model-value="search"
                placeholder="Search media…"
                size="sm"
                clearable
                class="min-w-40 flex-1"
                aria-label="Search media by file name or title"
                @update:model-value="emit('update:search', String($event))"
              >
                <template #prefix>
                  <span class="text-base-content/50">
                    <Search class="size-4" aria-hidden="true" />
                  </span>
                </template>
              </DzInput>

              <DzCheckbox
                :model-value="allVisibleSelected"
                :indeterminate="someVisibleSelected"
                label="Select all"
                size="sm"
                @update:model-value="toggleSelectAll"
              />

              <DzButton
                size="xs"
                variant="ghost"
                aria-label="Upload more media"
                @click="activeTab = 'upload'"
              >
                <template #icon>
                  <Upload class="size-3.5" aria-hidden="true" />
                </template>
                Upload
              </DzButton>

              <span class="ms-auto text-xs text-base-content/60">
                {{ items.length }} of {{ total }}
              </span>
            </div>

            <div ref="scrollContainer" class="min-h-0 flex-1 overflow-y-auto p-3">
              <!-- Initial loading skeleton -->
              <div
                v-if="loading && !items.length"
                class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4"
                aria-label="Loading media"
              >
                <DzSkeleton v-for="index in 8" :key="index" class="aspect-square w-full" />
              </div>

              <!-- Hard error replaces the grid; items loaded later are preserved -->
              <DzAlert
                v-else-if="error"
                color="error"
                variant="soft"
                title="Couldn't load the media library"
                :description="error"
              >
                <template #actions>
                  <DzButton size="sm" variant="outline" color="error" @click="emit('retry')">
                    <template #icon>
                      <RefreshCw class="size-4" aria-hidden="true" />
                    </template>
                    Retry
                  </DzButton>
                </template>
              </DzAlert>

              <!-- Empty state -->
              <div
                v-else-if="!items.length"
                class="flex h-full min-h-64 flex-col items-center justify-center gap-3 p-6 text-center"
              >
                <span class="flex size-16 items-center justify-center rounded-full bg-base-200 text-base-content/40">
                  <ImageOff class="size-8" aria-hidden="true" />
                </span>
                <div class="space-y-1">
                  <p class="font-medium">No media found</p>
                  <p class="text-sm text-base-content/60">
                    {{
                      search
                        ? 'No assets match your search. Try a different file name or title.'
                        : 'Upload your first image to get started.'
                    }}
                  </p>
                </div>
                <DzButton v-if="!search" size="sm" color="primary" @click="activeTab = 'upload'">
                  <template #icon>
                    <Upload class="size-4" aria-hidden="true" />
                  </template>
                  Upload files
                </DzButton>
              </div>

              <!-- Media grid -->
              <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                <MediaGridItem
                  v-for="item in items"
                  :key="item.id"
                  :item="item"
                  :selected="selected.includes(item.id)"
                  :active="activeId === item.id"
                  @open="onItemOpen"
                  @toggle="toggleSelected"
                />
              </div>

              <!-- Infinite scroll sentinel -->
              <div v-if="items.length && hasMore" ref="sentinel" class="h-1" aria-hidden="true" />

              <div
                v-if="loadingMore"
                class="flex items-center justify-center gap-2 py-5 text-sm text-base-content/60"
              >
                <DzLoading type="dots" size="sm" aria-hidden="true" />
                Loading more assets…
              </div>

              <DzAlert
                v-if="loadMoreError"
                color="error"
                variant="soft"
                class="mt-3"
                :description="loadMoreError"
              >
                <template #actions>
                  <DzButton size="xs" variant="outline" color="error" @click="emit('load-more')">
                    Retry
                  </DzButton>
                </template>
              </DzAlert>

              <p
                v-if="items.length && !hasMore && !loadingMore"
                class="py-4 text-center text-xs text-base-content/50"
              >
                You've reached the end of the library.
              </p>
            </div>
          </div>

          <!-- Desktop sticky details panel -->
          <aside class="hidden w-80 shrink-0 overflow-hidden lg:block">
            <MediaDetailsPanel
              :item="activeItem"
              :saving="savingId === activeItem?.id"
              :deleting="deleting"
              editable
              :allow-delete="mode === 'management'"
              @save="onSave"
              @delete="requestDelete([$event.id])"
              @close="activeId = null"
            />
          </aside>

          <!-- Mobile details overlay -->
          <div
            v-if="activeItem"
            class="absolute inset-0 z-20 flex flex-col bg-base-100 lg:hidden"
          >
            <MediaDetailsPanel
              :item="activeItem"
              :saving="savingId === activeItem.id"
              :deleting="deleting"
              editable
              :allow-delete="mode === 'management'"
              @save="onSave"
              @delete="requestDelete([$event.id])"
              @close="activeId = null"
            />
          </div>
        </div>
      </template>
    </DzTabs>

    <footer class="flex flex-wrap items-center gap-2 border-t border-base-300 px-4 py-3">
      <div class="me-auto min-w-0 text-xs">
        <p class="font-medium">
          {{ selectedCount ? `${selectedCount} selected` : `${total} assets in library` }}
        </p>
        <p class="truncate text-base-content/50">
          {{
            mode === 'selector'
              ? 'Click an image to select it and edit its details, then insert your selection.'
              : 'Manage metadata in the details panel or delete assets in bulk.'
          }}
        </p>
      </div>

      <template v-if="mode === 'management'">
        <DzButton
          size="sm"
          variant="outline"
          :disabled="!selectedCount"
          @click="downloadSelected"
        >
          <template #icon>
            <Download class="size-4" aria-hidden="true" />
          </template>
          Download ({{ selectedCount }})
        </DzButton>
        <DzButton
          size="sm"
          variant="outline"
          color="error"
          :disabled="!selectedCount"
          :loading="deleting"
          @click="requestDelete(selected)"
        >
          <template #icon>
            <Trash2 class="size-4" aria-hidden="true" />
          </template>
          Delete selected ({{ selectedCount }})
        </DzButton>
        <DzButton size="sm" variant="ghost" @click="close">Close</DzButton>
      </template>

      <template v-else>
        <DzButton size="sm" variant="ghost" @click="close">Cancel</DzButton>
        <DzButton size="sm" color="primary" :disabled="!selectedCount" @click="insertMedia">
          Insert Media ({{ selectedCount }})
        </DzButton>
      </template>
    </footer>
  </DzModal>
</template>
