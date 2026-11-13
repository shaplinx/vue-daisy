# Media Library (Phase 6)

A WordPress-style media library and uploader built from the project's DaisyUI
components. It supports two modes, infinite scrolling, bulk selection,
editable attachment metadata, uploads, bulk downloads and Laravel-friendly
pagination — without putting any API code in the modal.

## Files

| File | Responsibility |
| --- | --- |
| `src/components/media/DzMediaLibrary.vue` | Modal shell, tabs, media grid, infinite-scroll sentinel and mode-aware footer. Presentational only. |
| `src/components/media/MediaGridItem.vue` | One selectable thumbnail tile with a checkmark badge. |
| `src/components/media/MediaDetailsPanel.vue` | Sticky/mobile attachment details and metadata form. |
| `src/components/media/MediaUploadPanel.vue` | Drag-and-drop upload tab. |
| `src/composables/useMediaLibrary.ts` | Pagination, search, selection, upload progress, saving and deletion state. |
| `src/services/mediaService.ts` | Mock Laravel-style API (`fetchMedia`, `updateMedia`, `deleteMedia`, `uploadMedia`). |
| `src/utils/download.ts` | Browser-side bulk download helper. |
| `src/utils/media.ts` | File-size, dimension, date and filename formatters. |
| `src/pages/MediaLibraryPage.vue` | Live demo, snapshot and API documentation. |

## Why the API lives outside the component

`DzMediaLibrary.vue` never imports the service and never performs a request.
It renders the `items` prop and emits intent events:

| Event | Payload | Meaning |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Open/close request. |
| `update:search` | `string` | Search text changed. Debounced by the composable. |
| `update:selected` | `number[]` | Selection changed. |
| `load-more` | — | Intersection Observer reached the sentinel. |
| `retry` | — | First-page request failed and the user clicked Retry. |
| `save` | `{ id, metadata }` | Metadata form submitted. |
| `delete` | `number[]` | Single or bulk delete requested (confirmation is page-owned). |
| `upload` | `File[]` | Valid image files dropped/selected in the upload tab. |
| `reject` | `string[]` | Files rejected before upload (non-image or over 10 MB). |
| `download` | `MediaItem[]` | Management mode bulk download requested. |
| `insert` | `MediaItem[]` | Selector mode confirmed an insertion. |
| `open` / `close` | — | Modal lifecycle notifications. |

A page/container wires those events into `useMediaLibrary`. This keeps the
component reusable in any app context and makes a real backend a
service-level swap.

## Two modes

```vue
<DzMediaLibrary v-model="open" mode="management" ... />
<DzMediaLibrary v-model="open" mode="selector" ... />
```

- **`management`** — full CRUD: upload, edit title/alt/caption/description,
  delete one or many, bulk download, and a dynamic footer showing
  `Download (n)` and `Delete selected (n)`.
- **`selector`** — editor picker: clicking a tile toggles selection, the
  attachment details can still be edited, destructive actions are hidden and
  the footer ends with `Insert Media (n)`.

## Composable

```ts
const {
  items, loading, loadingMore, error, loadMoreError,
  search, selected, total, hasMore,
  savingId, deleting, uploading, uploadProgress,
  loadFirstPage, loadMore, refresh,
  save, remove, upload,
  setSelection, toggleSelect, clearSelection, reset,
} = useMediaLibrary({
  pageSize: 12,
  searchDebounceMs: 300,
  // Optional dependency injection for tests or a real API:
  fetcher: fetchMedia,
  updater: updateMedia,
  deleter: deleteMedia,
  uploader: uploadMedia,
})
```

The composable:

- keeps one page of records in `items` and appends on `loadMore()`;
- invalidates stale responses with a request token;
- debounces search and clears selection when the result set changes;
- exposes `hasMore = items.length < total`;
- reports upload progress through `uploadProgress`;
- removes deleted records from both `items` and `selected`, then re-fetches
  the page window already in memory so offset pagination stays aligned;
- can be used with `immediate: false` and loaded when the modal opens.

## API contract

The mock service mirrors these endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/media?page=1&per_page=12&search=aurora` | Paginated list |
| `PATCH` | `/api/media/{id}` | Update metadata |
| `DELETE` | `/api/media` with `{ ids }` | Bulk delete |
| `POST` | `/api/media` (multipart) | Upload one or more images |

### Laravel pagination envelope

List responses use Laravel's native paginator and are consumed without
transformation:

```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "filename": "aurora-ridge.svg",
      "title": "Aurora ridge",
      "alt": "Aurora ridge — abstract gradient artwork",
      "caption": "",
      "description": "",
      "url": "https://cdn.example.com/media/aurora-ridge.svg",
      "thumbnailUrl": "https://cdn.example.com/media/aurora-ridge-thumb.svg",
      "mimeType": "image/svg+xml",
      "size": 284672,
      "width": 1600,
      "height": 900,
      "uploadedAt": "2026-11-12T15:30:00.000Z"
    }
  ],
  "first_page_url": "/api/media?page=1",
  "from": 1,
  "last_page": 3,
  "last_page_url": "/api/media?page=3",
  "links": [],
  "next_page_url": "/api/media?page=2",
  "path": "/api/media",
  "per_page": 12,
  "prev_page_url": null,
  "to": 12,
  "total": 36
}
```

The API may clamp a page past the end; the composable follows
`current_page` and `total` from the envelope.

### Replacing the mock with HTTP

Only `src/services/mediaService.ts` needs to change:

```ts
import { http } from '@/services/http'

export async function fetchMedia(query: MediaQuery) {
  const { data } = await http.get('/api/media', {
    params: { page: query.page, per_page: query.perPage, search: query.search },
  })
  return data
}

export async function updateMedia(id: number, input: MediaMetadataInput) {
  const { data } = await http.patch(`/api/media/${id}`, input)
  return data.data ?? data
}

export async function deleteMedia(ids: number[]) {
  const { data } = await http.delete('/api/media', { data: { ids } })
  return { deleted: data.deleted ?? ids.length }
}

export async function uploadMedia(files: File[], options: MediaUploadOptions = {}) {
  const form = new FormData()
  for (const file of files) form.append('files[]', file)
  const { data } = await http.post('/api/media', form, {
    onUploadProgress: (event) => {
      if (event.total) options.onProgress?.(Math.round((event.loaded / event.total) * 100))
    },
  })
  return data.data ?? data
}
```

## Infinite scroll

The library panel owns a fixed-height scroll container
(`overflow-y-auto`) and renders a one-pixel sentinel after the grid.
`IntersectionObserver` watches the sentinel with the scroll container as its
root and a `240px` bottom root margin. When it intersects and
`hasMore && !loading && !loadingMore`, the component emits `load-more`.
The composable requests the next page and appends the records.

The observer is re-created when the tab, item count, loading state or
`hasMore` changes, so it keeps working after switching between the Upload
and Media Library tabs. A failed `load-more` pauses the observer until the
user presses Retry, preventing an automatic retry loop. The same panel shows:

- skeleton tiles for the first page;
- `Loading more assets…` while appending;
- an error alert with retry for first-page and load-more failures;
- an end-of-library message when everything is loaded.

## Uploads

- Accepts images only (`image/*`) and rejects files over 10 MB before they
  reach the service.
- The upload tab supports drag-and-drop and a hidden file picker.
- The mock uploader reports progress per file and returns created records.
- After a successful upload the page refreshes the list and returns to the
  Media Library tab.
- The service uses browser object URLs for uploaded previews. A real backend
  should return permanent storage URLs instead.

## Selection and actions

- Tile checkbox selection and Select All share one `selected: number[]`
  prop (`v-model:selected`).
- Selected tiles get a primary border and a checkmark badge.
- Clicking a tile opens the details panel. In selector mode it also toggles
  selection.
- Delete requests are emitted to the page, which shows a confirmation modal
  before calling `remove(ids)`.
- Bulk download emits `download`; the page calls `downloadMedia(items)`.

## Accessibility notes

- The modal is a native `<dialog>` through `DzModal` (focus trap, Escape and
  backdrop close).
- Tiles are buttons with descriptive labels and `aria-pressed`.
- Selection checkboxes have per-item labels; Select All supports the
  indeterminate state.
- The upload dropzone is keyboard operable (`Enter` / `Space`).
- Upload progress uses `DzProgress` and status text.
- Details form fields use `DzLabel` with associated ids.

## Demo

Open `/media` (also available in the sidebar and global search):

1. **Open media manager** — upload, edit metadata, delete, download.
2. **Open image selector** — pick images and confirm `Insert Media (n)`.
3. Search for `fail` to exercise the list error and retry state.
