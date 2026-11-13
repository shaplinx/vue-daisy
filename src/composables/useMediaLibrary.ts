import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import type { LaravelPaginator } from '@/services/api'
import {
  deleteMedia,
  fetchMedia,
  updateMedia,
  uploadMedia,
} from '@/services/mediaService'
import type {
  MediaDeleteResult,
  MediaItem,
  MediaMetadataInput,
  MediaQuery,
  MediaUploadOptions,
} from '@/services/mediaService'

export interface UseMediaLibraryOptions {
  /** List endpoint. Replace to target a real API. */
  fetcher?: (query: MediaQuery) => Promise<LaravelPaginator<MediaItem>>
  /** Metadata endpoint. */
  updater?: (id: number, input: MediaMetadataInput) => Promise<MediaItem>
  /** Bulk delete endpoint. */
  deleter?: (ids: number[]) => Promise<MediaDeleteResult>
  /** Upload endpoint; reports 0–100 progress. */
  uploader?: (files: File[], options?: MediaUploadOptions) => Promise<MediaItem[]>
  /** Number of assets requested per page (default 12). */
  pageSize?: number
  /** Debounce applied to search changes, in ms (default 300). */
  searchDebounceMs?: number
  initialSearch?: string
  /** Fetch the first page immediately (default true). */
  immediate?: boolean
}

/**
 * Media library controller.
 *
 * Owns all data access and pagination state for `DzMediaLibrary`, which is a
 * purely presentational modal: it renders `items` and emits intent events like
 * `load-more`, `save`, `delete` and `upload`. Swap the default mock service
 * functions through the options to connect a real Laravel API without touching
 * the component.
 */
export function useMediaLibrary(options: UseMediaLibraryOptions = {}) {
  const fetcher = options.fetcher ?? fetchMedia
  const updater = options.updater ?? updateMedia
  const deleter = options.deleter ?? deleteMedia
  const uploader = options.uploader ?? uploadMedia

  const items = shallowRef<MediaItem[]>([])
  const loading = ref(false)
  const loadingMore = ref(false)
  const error = ref<string | null>(null)
  const loadMoreError = ref<string | null>(null)
  const search = ref(options.initialSearch ?? '')
  const page = ref(1)
  const perPage = ref(options.pageSize ?? 12)
  const total = ref(0)
  const selected = ref<number[]>([])
  const savingId = ref<number | null>(null)
  const deleting = ref(false)
  const uploading = ref(false)
  const uploadProgress = ref(0)

  const hasMore = computed(() => items.value.length < total.value)
  const selectedItems = computed(() =>
    items.value.filter((item) => selected.value.includes(item.id)),
  )

  let listToken = 0
  let searchTimer: ReturnType<typeof setTimeout> | null = null

  function clearSearchTimer(): void {
    if (!searchTimer) return
    clearTimeout(searchTimer)
    searchTimer = null
  }

  async function loadFirstPage({ keepSelection = false }: { keepSelection?: boolean } = {}): Promise<void> {
    const request = ++listToken
    loading.value = true
    loadingMore.value = false
    error.value = null
    loadMoreError.value = null
    try {
      const response = await fetcher({
        page: 1,
        perPage: perPage.value,
        search: search.value,
      })
      if (request !== listToken) return
      items.value = response.data
      page.value = Math.max(1, response.current_page)
      total.value = response.total
      if (!keepSelection) selected.value = []
      else {
        const loaded = new Set(response.data.map((item) => item.id))
        selected.value = selected.value.filter((id) => loaded.has(id))
      }
    } catch (cause) {
      if (request !== listToken) return
      items.value = []
      total.value = 0
      error.value = cause instanceof Error ? cause.message : 'Failed to load media'
    } finally {
      if (request === listToken) loading.value = false
    }
  }

  async function loadMore(): Promise<void> {
    if (loading.value || loadingMore.value || !hasMore.value) return
    const request = ++listToken
    loadingMore.value = true
    loadMoreError.value = null
    try {
      const response = await fetcher({
        page: page.value + 1,
        perPage: perPage.value,
        search: search.value,
      })
      if (request !== listToken) return
      items.value = [...items.value, ...response.data]
      page.value = Math.max(page.value + 1, response.current_page)
      total.value = response.total
    } catch (cause) {
      if (request !== listToken) return
      loadMoreError.value =
        cause instanceof Error ? cause.message : 'Failed to load more media'
    } finally {
      if (request === listToken) loadingMore.value = false
    }
  }

  /** Reload the first page, keeping the current search and selection. */
  async function refresh(): Promise<void> {
    await loadFirstPage({ keepSelection: true })
  }

  /**
   * Re-fetch every page currently held in memory after a delete.
   *
   * Offset pagination shifts when a record is removed, so appending the next
   * page locally can skip assets. Reloading the loaded page window (rather than
   * only page 1) keeps the grid, total and scroll position aligned.
   */
  async function reloadLoadedPages(): Promise<void> {
    const loadedPages = Math.max(1, page.value)
    const request = ++listToken
    try {
      const responses = await Promise.all(
        Array.from({ length: loadedPages }, (_, index) =>
          fetcher({
            page: index + 1,
            perPage: perPage.value,
            search: search.value,
          }),
        ),
      )
      if (request !== listToken) return

      const merged: MediaItem[] = []
      const seen = new Set<number>()
      for (const response of responses) {
        for (const item of response.data) {
          if (seen.has(item.id)) continue
          seen.add(item.id)
          merged.push(item)
        }
      }

      items.value = merged
      total.value = responses[0]?.total ?? merged.length
      page.value = Math.max(1, Math.ceil(merged.length / perPage.value))
      const loaded = new Set(merged.map((item) => item.id))
      selected.value = selected.value.filter((id) => loaded.has(id))
    } catch {
      // The optimistic removal above is still valid if the reload fails.
    }
  }

  /** Update one asset's metadata and merge the server response into the list. */
  async function save(id: number, input: MediaMetadataInput): Promise<MediaItem> {
    savingId.value = id
    try {
      const updated = await updater(id, input)
      items.value = items.value.map((item) => (item.id === id ? updated : item))
      return updated
    } finally {
      savingId.value = null
    }
  }

  /** Delete one or more assets and keep pagination metadata in sync. */
  async function remove(ids: number[]): Promise<number> {
    if (!ids.length || deleting.value) return 0
    deleting.value = true
    try {
      const result = await deleter(ids)
      if (result.deleted > 0) {
        const removed = new Set(ids)
        items.value = items.value.filter((item) => !removed.has(item.id))
        selected.value = selected.value.filter((id) => !removed.has(id))
        total.value = Math.max(0, total.value - result.deleted)
        // Offset pagination shifts after a removal, so re-sync the pages that
        // are already on screen instead of appending a page that may skip one.
        await reloadLoadedPages()
      }
      return result.deleted
    } finally {
      deleting.value = false
    }
  }

  /** Upload files; progress is reported through `uploadProgress`. */
  async function upload(files: File[]): Promise<MediaItem[]> {
    if (!files.length) return []
    uploading.value = true
    uploadProgress.value = 0
    try {
      const uploaded = await uploader(files, {
        onProgress: (percent) => {
          uploadProgress.value = percent
        },
      })
      uploadProgress.value = 100
      return uploaded
    } finally {
      uploading.value = false
    }
  }

  function setSelection(ids: number[]): void {
    selected.value = ids
  }

  function toggleSelect(id: number): void {
    selected.value = selected.value.includes(id)
      ? selected.value.filter((item) => item !== id)
      : [...selected.value, id]
  }

  function clearSelection(): void {
    selected.value = []
  }

  function reset(): void {
    clearSearchTimer()
    listToken += 1
    items.value = []
    loading.value = false
    loadingMore.value = false
    error.value = null
    loadMoreError.value = null
    search.value = ''
    page.value = 1
    total.value = 0
    selected.value = []
  }

  watch(search, (value, previous) => {
    if (value === previous) return
    clearSearchTimer()
    searchTimer = setTimeout(() => {
      searchTimer = null
      void loadFirstPage()
    }, options.searchDebounceMs ?? 300)
  })

  if (options.immediate !== false) void loadFirstPage()

  onBeforeUnmount(() => {
    listToken += 1
    clearSearchTimer()
  })

  return {
    // state
    items,
    loading,
    loadingMore,
    error,
    loadMoreError,
    search,
    page,
    perPage,
    total,
    selected,
    selectedItems,
    hasMore,
    savingId,
    deleting,
    uploading,
    uploadProgress,
    // actions
    loadFirstPage,
    loadMore,
    refresh,
    save,
    remove,
    upload,
    setSelection,
    toggleSelect,
    clearSelection,
    reset,
  }
}
