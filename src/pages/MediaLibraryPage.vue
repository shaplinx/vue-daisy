<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Images,
  Infinity as InfinityIcon,
  MousePointerClick,
  PencilLine,
  RefreshCw,
  Trash2,
} from '@lucide/vue'
import CodeBlock from '@/showcase/CodeBlock.vue'
import DzAlert from '@/components/ui/feedback/DzAlert.vue'
import DzBadge from '@/components/ui/data-display/DzBadge.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import DzCard from '@/components/ui/data-display/DzCard.vue'
import DzModal from '@/components/ui/actions/DzModal.vue'
import DzSkeleton from '@/components/ui/feedback/DzSkeleton.vue'
import DzMediaLibrary from '@/components/media/DzMediaLibrary.vue'
import { useMediaLibrary } from '@/composables/useMediaLibrary'
import { useToast } from '@/composables/useToast'
import type { MediaItem, MediaMetadataInput } from '@/services/mediaService'
import { downloadMedia } from '@/utils/download'

type LibraryMode = 'management' | 'selector'

const toast = useToast()

const {
  items,
  loading,
  loadingMore,
  error,
  loadMoreError,
  search,
  selected,
  total,
  hasMore,
  savingId,
  deleting,
  uploading,
  uploadProgress,
  loadFirstPage,
  loadMore,
  refresh,
  save,
  remove,
  upload,
  clearSelection,
} = useMediaLibrary({ immediate: false, pageSize: 12 })

const libraryOpen = ref(false)
const libraryMode = ref<LibraryMode>('management')
const libraryRef = ref<InstanceType<typeof DzMediaLibrary> | null>(null)

const deleteOpen = ref(false)
const pendingDeleteIds = ref<number[]>([])
const pendingDeleteItems = computed(() =>
  items.value.filter((item) => pendingDeleteIds.value.includes(item.id)),
)

onMounted(() => {
  void loadFirstPage()
})

function openLibrary(mode: LibraryMode): void {
  libraryMode.value = mode
  clearSelection()
  libraryOpen.value = true
  if (!items.value.length && !loading.value) void loadFirstPage()
}

function onModalOpen(): void {
  // The modal is reusable; a page can refresh here if records may have
  // changed since it was last opened.
  if (!items.value.length && !loading.value) void loadFirstPage()
}

async function onUpload(files: File[]): Promise<void> {
  try {
    const uploaded = await upload(files)
    await refresh()
    libraryRef.value?.showLibrary()
    toast.success(
      uploaded.length === 1 ? '1 file uploaded' : `${uploaded.length} files uploaded`,
      { title: 'Media uploaded' },
    )
  } catch (cause) {
    toast.error(cause instanceof Error ? cause.message : 'Upload failed')
  }
}

function onReject(messages: string[]): void {
  toast.warning(messages.slice(0, 3).join(' · '), {
    title: 'Some files were skipped',
    duration: 6000,
  })
}

async function onSave(payload: { id: number; metadata: MediaMetadataInput }): Promise<void> {
  try {
    const updated = await save(payload.id, payload.metadata)
    toast.success(`Saved details for “${updated.title}”`)
  } catch (cause) {
    toast.error(cause instanceof Error ? cause.message : 'Could not save metadata')
  }
}

function onDelete(ids: number[]): void {
  if (!ids.length) return
  pendingDeleteIds.value = ids
  deleteOpen.value = true
}

async function confirmDelete(): Promise<void> {
  if (!pendingDeleteIds.value.length) return
  try {
    const deleted = await remove([...pendingDeleteIds.value])
    deleteOpen.value = false
    pendingDeleteIds.value = []
    if (deleted) {
      toast.success(deleted === 1 ? 'Media deleted' : `${deleted} assets deleted`)
    }
  } catch (cause) {
    toast.error(cause instanceof Error ? cause.message : 'Could not delete media')
  }
}

async function onDownload(assets: MediaItem[]): Promise<void> {
  if (!assets.length) return
  await downloadMedia(assets)
  toast.success(
    assets.length === 1 ? 'Download started' : `${assets.length} downloads started`,
    { title: 'Bulk download' },
  )
}

function onInsert(assets: MediaItem[]): void {
  const label = assets.length === 1 ? assets[0].title : `${assets.length} assets`
  toast.success(`${label} inserted into the editor.`, { title: 'Insert media' })
}

const componentUsage = `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DzMediaLibrary from '@/components/media/DzMediaLibrary.vue'
import { useMediaLibrary } from '@/composables/useMediaLibrary'
import type { MediaMetadataInput } from '@/services/mediaService'

const {
  items, loading, loadingMore, error, search, selected, total, hasMore,
  savingId, deleting, uploading, uploadProgress,
  loadFirstPage, loadMore, refresh, save, remove, upload,
} = useMediaLibrary({ pageSize: 12, immediate: false })

const open = ref(false)
const mode = ref<'management' | 'selector'>('management')

onMounted(() => loadFirstPage())

// The modal emits a single payload; the composable takes two arguments.
const onSave = (payload: { id: number; metadata: MediaMetadataInput }) =>
  save(payload.id, payload.metadata)
<\/script>

<template>
  <DzMediaLibrary
    v-model="open"
    :mode="mode"
    :items="items"
    :loading="loading"
    :loading-more="loadingMore"
    :has-more="hasMore"
    :error="error || ''"
    :search="search"
    :selected="selected"
    :total="total"
    :saving-id="savingId"
    :deleting="deleting"
    :uploading="uploading"
    :upload-progress="uploadProgress"
    @update:search="search = $event"
    @update:selected="selected = $event"
    @load-more="loadMore"
    @retry="loadFirstPage"
    @save="onSave"
    @delete="remove"
    @upload="upload"
    @insert="(assets) => insertIntoEditor(assets)"
  />
</template>`

const serviceUsage = `// src/services/mediaService.ts — swap the mock for a real HTTP client
import { http } from '@/services/http'
import type { LaravelPaginator } from '@/services/api'
import type {
  MediaDeleteResult, MediaItem, MediaMetadataInput, MediaQuery, MediaUploadOptions,
} from '@/services/mediaService'

export async function fetchMedia(query: MediaQuery): Promise<LaravelPaginator<MediaItem>> {
  const { data } = await http.get('/api/media', {
    params: { page: query.page, per_page: query.perPage, search: query.search },
  })
  return data // use the Laravel paginator envelope as-is
}

export async function updateMedia(id: number, input: MediaMetadataInput): Promise<MediaItem> {
  const { data } = await http.patch(\`/api/media/\${id}\`, input)
  return data.data ?? data
}

export async function deleteMedia(ids: number[]): Promise<MediaDeleteResult> {
  const { data } = await http.delete('/api/media', { data: { ids } })
  return { deleted: data.deleted ?? ids.length }
}

export async function uploadMedia(
  files: File[],
  options: MediaUploadOptions = {},
): Promise<MediaItem[]> {
  const form = new FormData()
  files.forEach((file) => form.append('files[]', file))
  const { data } = await http.post('/api/media', form, {
    onUploadProgress: (event) => {
      if (event.total) options.onProgress?.(Math.round((event.loaded / event.total) * 100))
    },
  })
  return data.data ?? data
}`

const endpoints = [
  { method: 'GET', path: '/api/media', purpose: 'Paginated list with page, per_page and search' },
  { method: 'PATCH', path: '/api/media/{id}', purpose: 'Update title, alt text, caption and description' },
  { method: 'DELETE', path: '/api/media', purpose: 'Bulk delete with { ids: number[] }' },
  { method: 'POST', path: '/api/media', purpose: 'Multipart upload; returns the created assets' },
]
</script>

<template>
  <section class="space-y-6">
    <header class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Media Library</h1>
          <DzBadge color="primary" variant="soft" size="sm">Phase 6</DzBadge>
          <DzBadge variant="ghost" size="sm">{{ total }} assets</DzBadge>
        </div>
        <p class="max-w-3xl text-sm text-base-content/70">
          A WordPress-style media library and uploader with infinite scroll, bulk selection,
          editable attachment metadata and two prop-driven modes. The modal is presentational:
          data access lives in <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">useMediaLibrary</code>
          and the mock Laravel service, so you can connect a real backend without editing the UI.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <DzButton variant="outline" @click="openLibrary('management')">
          <template #icon>
            <Images class="size-4" aria-hidden="true" />
          </template>
          Open media manager
        </DzButton>
        <DzButton color="primary" @click="openLibrary('selector')">
          <template #icon>
            <MousePointerClick class="size-4" aria-hidden="true" />
          </template>
          Open image selector
        </DzButton>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DzCard title="Management mode" bordered>
        <template #title>
          <span class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-box bg-primary/15 text-primary">
              <Images class="size-4" aria-hidden="true" />
            </span>
            Management mode
          </span>
        </template>
        <p class="text-sm text-base-content/70">
          Upload, edit metadata, delete single or selected assets and bulk-download files.
        </p>
        <template #actions>
          <DzButton size="sm" variant="ghost" @click="openLibrary('management')">Open</DzButton>
        </template>
      </DzCard>

      <DzCard title="Selector mode" bordered>
        <template #title>
          <span class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-box bg-secondary/15 text-secondary">
              <MousePointerClick class="size-4" aria-hidden="true" />
            </span>
            Selector mode
          </span>
        </template>
        <p class="text-sm text-base-content/70">
          Choose images from an editor, edit their details and insert them with a live “Insert Media (n)” footer action.
        </p>
        <template #actions>
          <DzButton size="sm" variant="ghost" @click="openLibrary('selector')">Open</DzButton>
        </template>
      </DzCard>

      <DzCard title="Infinite scroll" bordered>
        <template #title>
          <span class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-box bg-accent/15 text-accent">
              <InfinityIcon class="size-4" aria-hidden="true" />
            </span>
            Infinite scroll
          </span>
        </template>
        <p class="text-sm text-base-content/70">
          The grid loads 12 assets per request and observes a sentinel at the bottom of the
          scroll area as you move through the library.
        </p>
      </DzCard>

      <DzCard title="Attachment details" bordered>
        <template #title>
          <span class="flex items-center gap-2">
            <span class="flex size-8 items-center justify-center rounded-box bg-info/15 text-info">
              <PencilLine class="size-4" aria-hidden="true" />
            </span>
            Attachment details
          </span>
        </template>
        <p class="text-sm text-base-content/70">
          A sticky details panel with preview, dimensions, size, upload date and editable title,
          alt text, caption and description.
        </p>
      </DzCard>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-4 sm:p-6">
      <header class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">Library snapshot</h2>
          <p class="max-w-2xl text-sm text-base-content/70">
            The first eight assets from the same paginated endpoint. Changes made in the modal are
            reflected here after a refresh.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <DzBadge variant="ghost">{{ items.length }} loaded · {{ total }} total</DzBadge>
          <DzButton size="sm" variant="outline" :loading="loading" @click="refresh">
            <template #icon>
              <RefreshCw class="size-3.5" aria-hidden="true" />
            </template>
            Refresh
          </DzButton>
        </div>
      </header>

      <div
        v-if="loading && !items.length"
        class="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-label="Loading media snapshot"
      >
        <DzSkeleton v-for="index in 8" :key="index" class="aspect-[4/3] w-full" />
      </div>

      <DzAlert
        v-else-if="error"
        color="error"
        variant="soft"
        title="Couldn't load the media library"
        :description="error"
      >
        <template #actions>
          <DzButton size="sm" variant="outline" color="error" @click="loadFirstPage">Retry</DzButton>
        </template>
      </DzAlert>

      <div v-else-if="!items.length" class="py-10 text-center text-sm text-base-content/60">
        No media yet. Open the media manager and upload an image.
      </div>

      <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button
          v-for="item in items.slice(0, 8)"
          :key="item.id"
          type="button"
          class="group relative aspect-[4/3] overflow-hidden rounded-box border border-base-300 bg-base-200 text-start"
          :aria-label="`Open media manager for ${item.title}`"
          @click="openLibrary('management')"
        >
          <img
            :src="item.thumbnailUrl"
            :alt="item.alt || item.title"
            loading="lazy"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
          <span
            class="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/75 to-transparent px-2 pb-1.5 pt-6 text-xs font-medium text-white"
          >
            {{ item.title }}
          </span>
        </button>
      </div>
    </div>

    <div class="rounded-box border border-base-300 bg-base-100 p-4 sm:p-6">
      <header class="mb-4 space-y-1">
        <h2 class="text-lg font-semibold">API integration</h2>
        <p class="max-w-3xl text-sm text-base-content/70">
          No request code lives in <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">DzMediaLibrary.vue</code>.
          The modal receives data through props and emits intent events. A page wires those events
          to a service through <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">useMediaLibrary</code>.
        </p>
      </header>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="space-y-4">
          <div class="overflow-x-auto rounded-box border border-base-300">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Endpoint</th>
                  <th scope="col">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="endpoint in endpoints" :key="`${endpoint.method}-${endpoint.path}`">
                  <td>
                    <DzBadge
                      size="sm"
                      :color="endpoint.method === 'DELETE' ? 'error' : endpoint.method === 'POST' ? 'success' : 'info'"
                      variant="soft"
                    >
                      {{ endpoint.method }}
                    </DzBadge>
                  </td>
                  <td class="font-mono text-xs">{{ endpoint.path }}</td>
                  <td class="text-xs text-base-content/70">{{ endpoint.purpose }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="space-y-2 text-sm text-base-content/70">
            <p class="font-medium text-base-content">How the data flow works</p>
            <ul class="list-disc space-y-1 ps-5">
              <li>The modal emits <code>load-more</code>, <code>save</code>, <code>delete</code>, <code>upload</code>, <code>download</code> and <code>insert</code>.</li>
              <li>The page routes those events into <code>useMediaLibrary</code>, which owns pagination, search, selection, saving and upload progress.</li>
              <li>The composable calls <code>src/services/mediaService.ts</code>; replace those four functions with HTTP calls and nothing in the modal changes.</li>
              <li>Every list response uses Laravel’s native paginator envelope, including <code>current_page</code>, <code>last_page</code>, <code>per_page</code> and <code>total</code>.</li>
            </ul>
          </div>

          <div class="rounded-box bg-base-200/60 p-3 text-xs text-base-content/70">
            <p class="font-medium text-base-content">Query contract</p>
            <p class="mt-1 font-mono">
              GET /api/media?page=1&amp;per_page=12&amp;search=aurora
            </p>
            <p class="mt-2">
              The mock also throws a server error when searching for
              <code class="rounded bg-base-100 px-1 py-0.5">fail</code>, so the retry and error
              states can be exercised.
            </p>
          </div>

          <p class="text-xs text-base-content/50">
            Full reference: <code>docs/media-library.md</code> · service: <code>src/services/mediaService.ts</code>
            · controller: <code>src/composables/useMediaLibrary.ts</code>
          </p>
        </div>

        <div class="space-y-4">
          <CodeBlock :code="componentUsage" filename="MediaLibraryExample.vue" />
          <CodeBlock :code="serviceUsage" language="ts" filename="src/services/mediaService.ts" />
        </div>
      </div>
    </div>

    <DzMediaLibrary
      ref="libraryRef"
      v-model="libraryOpen"
      :mode="libraryMode"
      :items="items"
      :loading="loading"
      :loading-more="loadingMore"
      :has-more="hasMore"
      :error="error ?? ''"
      :load-more-error="loadMoreError ?? ''"
      :search="search"
      :selected="selected"
      :total="total"
      :saving-id="savingId"
      :deleting="deleting"
      :uploading="uploading"
      :upload-progress="uploadProgress"
      @open="onModalOpen"
      @update:search="search = $event"
      @update:selected="selected = $event"
      @load-more="loadMore"
      @retry="loadFirstPage"
      @save="onSave"
      @delete="onDelete"
      @upload="onUpload"
      @reject="onReject"
      @download="onDownload"
      @insert="onInsert"
    />

    <DzModal v-model="deleteOpen" size="sm" title="Delete media?">
      <p class="text-sm text-base-content/80">
        <template v-if="pendingDeleteItems.length === 1">
          Delete <span class="font-semibold">{{ pendingDeleteItems[0]?.title }}</span>? This action
          cannot be undone.
        </template>
        <template v-else>
          Delete <span class="font-semibold">{{ pendingDeleteItems.length }} assets</span>? This
          action cannot be undone.
        </template>
      </p>
      <ul v-if="pendingDeleteItems.length > 1" class="mt-3 max-h-36 space-y-1 overflow-y-auto text-sm">
        <li
          v-for="item in pendingDeleteItems.slice(0, 6)"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <span class="text-xs text-base-content/50">#{{ item.id }}</span>
          <span class="truncate">{{ item.title }}</span>
        </li>
        <li v-if="pendingDeleteItems.length > 6" class="text-xs text-base-content/50">
          and {{ pendingDeleteItems.length - 6 }} more…
        </li>
      </ul>
      <template #footer>
        <DzButton variant="ghost" :disabled="deleting" @click="deleteOpen = false">Cancel</DzButton>
        <DzButton color="error" :loading="deleting" @click="confirmDelete">
          <template #icon>
            <Trash2 class="size-4" aria-hidden="true" />
          </template>
          Delete
        </DzButton>
      </template>
    </DzModal>
  </section>
</template>
