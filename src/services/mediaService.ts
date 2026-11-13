import type { LaravelPaginator } from '@/services/api'
import { filenameToTitle } from '@/utils/media'

/**
 * Media Library service contract.
 *
 * The media library UI never performs requests itself. It receives data and
 * raises intent events; a page or container wires those events to this module
 * (or to a real HTTP client with the same signatures). Keep all transport
 * concerns — base URLs, auth headers, upload progress, response mapping — here
 * or in a replacement module.
 */

export type MediaItem = {
  id: number
  /** Original file name, e.g. `aurora-ridge.svg`. */
  filename: string
  title: string
  alt: string
  caption: string
  description: string
  /** Full-size preview URL (object URL for uploads, data URI for seed data). */
  url: string
  /** Grid thumbnail URL. Kept separate so an API can serve resized images. */
  thumbnailUrl: string
  mimeType: string
  /** File size in bytes. */
  size: number
  width: number
  height: number
  /** ISO timestamp. */
  uploadedAt: string
}

export type MediaMetadataInput = Pick<MediaItem, 'title' | 'alt' | 'caption' | 'description'>

export interface MediaQuery {
  page: number
  perPage: number
  search: string
}

export interface MediaUploadOptions {
  /** Called with 0–100 as each file finishes uploading. */
  onProgress?: (percent: number) => void
}

export interface MediaDeleteResult {
  deleted: number
}

/*
 * Mock Laravel "Media" resource.
 *
 * `fetchMedia` behaves like `GET /api/media?page=&per_page=&search=` and
 * answers with Laravel's native paginator envelope. Replace the exported
 * functions with an HTTP client and every call site keeps working:
 *
 *   const response = await http.get('/api/media', { params })
 *   return response.data // already a LaravelPaginator<MediaItem>
 */

/** Stable anchor keeps generated demo timestamps identical across reloads. */
const NOW = Date.UTC(2026, 10, 12, 15, 30, 0)

const LIST_LATENCY_MS = 420
const WRITE_LATENCY_MS = 280
const UPLOAD_LATENCY_MS = 320

interface SeedSubject {
  title: string
  slug: string
  from: string
  to: string
  width: number
  height: number
}

const SUBJECTS: SeedSubject[] = [
  { title: 'Aurora ridge', slug: 'aurora-ridge', from: '#6366f1', to: '#ec4899', width: 1600, height: 900 },
  { title: 'Sunset harbor', slug: 'sunset-harbor', from: '#f97316', to: '#db2777', width: 1600, height: 900 },
  { title: 'Ocean drift', slug: 'ocean-drift', from: '#0ea5e9', to: '#22c55e', width: 1600, height: 1000 },
  { title: 'Citrus grove', slug: 'citrus-grove', from: '#eab308', to: '#84cc16', width: 1200, height: 1500 },
  { title: 'Berry fields', slug: 'berry-fields', from: '#8b5cf6', to: '#06b6d4', width: 1600, height: 900 },
  { title: 'Ember trail', slug: 'ember-trail', from: '#ef4444', to: '#f59e0b', width: 1600, height: 1067 },
  { title: 'Midnight dunes', slug: 'midnight-dunes', from: '#1e293b', to: '#7c3aed', width: 1600, height: 900 },
  { title: 'Forest canopy', slug: 'forest-canopy', from: '#14532d', to: '#4ade80', width: 1200, height: 1500 },
  { title: 'Coral reef', slug: 'coral-reef', from: '#fb7185', to: '#fbbf24', width: 1600, height: 900 },
  { title: 'Lavender fields', slug: 'lavender-fields', from: '#a78bfa', to: '#f0abfc', width: 1600, height: 1000 },
  { title: 'Glacier lake', slug: 'glacier-lake', from: '#bae6fd', to: '#1d4ed8', width: 1600, height: 900 },
  { title: 'Desert bloom', slug: 'desert-bloom', from: '#fbbf24', to: '#fb7185', width: 1200, height: 1500 },
  { title: 'Copper canyon', slug: 'copper-canyon', from: '#9a3412', to: '#fbbf24', width: 1600, height: 900 },
  { title: 'Neon alley', slug: 'neon-alley', from: '#22d3ee', to: '#e11d48', width: 1600, height: 1000 },
  { title: 'Pastel coast', slug: 'pastel-coast', from: '#fbcfe8', to: '#bae6fd', width: 1600, height: 900 },
  { title: 'Storm front', slug: 'storm-front', from: '#334155', to: '#94a3b8', width: 1600, height: 900 },
  { title: 'Golden hour', slug: 'golden-hour', from: '#f59e0b', to: '#dc2626', width: 1600, height: 1067 },
  { title: 'Alpine meadow', slug: 'alpine-meadow', from: '#4ade80', to: '#38bdf8', width: 1200, height: 1500 },
  { title: 'Urban geometry', slug: 'urban-geometry', from: '#475569', to: '#0ea5e9', width: 1600, height: 900 },
  { title: 'Cherry blossom', slug: 'cherry-blossom', from: '#f9a8d4', to: '#fef3c7', width: 1600, height: 1000 },
  { title: 'Pine valley', slug: 'pine-valley', from: '#065f46', to: '#a3e635', width: 1600, height: 900 },
  { title: 'River delta', slug: 'river-delta', from: '#0e7490', to: '#a7f3d0', width: 1600, height: 900 },
  { title: 'Sandstone arch', slug: 'sandstone-arch', from: '#b45309', to: '#fde68a', width: 1200, height: 1500 },
  { title: 'Winter pines', slug: 'winter-pines', from: '#e2e8f0', to: '#1e40af', width: 1600, height: 900 },
  { title: 'Tropical leaf', slug: 'tropical-leaf', from: '#15803d', to: '#bef264', width: 1600, height: 1000 },
  { title: 'Marble texture', slug: 'marble-texture', from: '#e2e8f0', to: '#64748b', width: 1600, height: 900 },
  { title: 'Studio portrait', slug: 'studio-portrait', from: '#7c2d12', to: '#fda4af', width: 1200, height: 1500 },
  { title: 'Product still', slug: 'product-still', from: '#0f172a', to: '#f8fafc', width: 1600, height: 900 },
  { title: 'Workshop bench', slug: 'workshop-bench', from: '#78350f', to: '#d97706', width: 1600, height: 1000 },
  { title: 'City skyline', slug: 'city-skyline', from: '#1e3a8a', to: '#f472b6', width: 1600, height: 900 },
  { title: 'Night market', slug: 'night-market', from: '#111827', to: '#f59e0b', width: 1600, height: 900 },
  { title: 'Mountain lake', slug: 'mountain-lake', from: '#0f766e', to: '#67e8f9', width: 1600, height: 1067 },
  { title: 'Wildflower field', slug: 'wildflower-field', from: '#a3e635', to: '#c026d3', width: 1200, height: 1500 },
  { title: 'Abstract waves', slug: 'abstract-waves', from: '#2563eb', to: '#f0abfc', width: 1600, height: 900 },
  { title: 'Paper collage', slug: 'paper-collage', from: '#fde68a', to: '#fb923c', width: 1600, height: 1000 },
  { title: 'Ceramic vase', slug: 'ceramic-vase', from: '#f5f5f4', to: '#78716c', width: 1200, height: 1500 },
]

function gradientSvg(subject: SeedSubject): string {
  const { title, from, to, width, height } = subject
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}" />
      <stop offset="100%" stop-color="${to}" />
    </linearGradient>
    <radialGradient id="r" cx="70%" cy="22%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.34)" />
      <stop offset="100%" stop-color="rgba(255,255,255,0)" />
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#g)" />
  <rect width="${width}" height="${height}" fill="url(#r)" />
  <circle cx="${width * 0.82}" cy="${height * 0.2}" r="${height * 0.18}" fill="rgba(255,255,255,0.14)" />
  <circle cx="${width * 0.16}" cy="${height * 0.86}" r="${height * 0.28}" fill="rgba(0,0,0,0.1)" />
  <path d="M0 ${height * 0.72} Q ${width * 0.25} ${height * 0.52} ${width * 0.5} ${height * 0.74} T ${width} ${height * 0.68} V ${height} H 0 Z" fill="rgba(0,0,0,0.16)" />
  <text x="50%" y="51%" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="${height * 0.075}" font-weight="700" fill="rgba(255,255,255,0.92)">${title}</text>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function buildMedia(): MediaItem[] {
  return SUBJECTS.map((subject, index) => {
    const url = gradientSvg(subject)
    return {
      id: index + 1,
      filename: `${subject.slug}.svg`,
      title: subject.title,
      alt: `${subject.title} — abstract gradient artwork`,
      caption:
        index % 4 === 0 ? 'Placeholder artwork used by the Vue Daisy media library demo.' : '',
      description:
        index % 3 === 0
          ? 'A generated gradient illustration. Replace the mock service with a real media API to manage uploaded assets.'
          : '',
      url,
      thumbnailUrl: url,
      mimeType: 'image/svg+xml',
      size: Math.round((180 + ((index * 613) % 1800)) * 1024 + (index * 37) % 1024),
      width: subject.width,
      height: subject.height,
      uploadedAt: new Date(NOW - index * 7.5 * 3_600_000).toISOString(),
    }
  })
}

const media = buildMedia()
let nextMediaId = media.length + 1

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function delay<T>(value: T, ms: number): Promise<T> {
  return sleep(ms).then(() => value)
}

function clampPage(page: number, lastPage: number): number {
  return Math.min(Math.max(1, page), Math.max(1, lastPage))
}

function buildPaginator(
  data: MediaItem[],
  page: number,
  perPage: number,
  total: number,
): LaravelPaginator<MediaItem> {
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const currentPage = clampPage(page, lastPage)
  const start = (currentPage - 1) * perPage
  const path = '/api/media'

  return {
    current_page: currentPage,
    data: data.slice(start, start + perPage),
    first_page_url: `${path}?page=1`,
    from: data.length ? start + 1 : null,
    last_page: lastPage,
    last_page_url: `${path}?page=${lastPage}`,
    links: [
      {
        url: currentPage > 1 ? `${path}?page=${currentPage - 1}` : null,
        label: 'Previous',
        active: false,
      },
      { url: `${path}?page=${currentPage}`, label: String(currentPage), active: true },
      {
        url: currentPage < lastPage ? `${path}?page=${currentPage + 1}` : null,
        label: 'Next',
        active: false,
      },
    ],
    next_page_url: currentPage < lastPage ? `${path}?page=${currentPage + 1}` : null,
    path,
    per_page: perPage,
    prev_page_url: currentPage > 1 ? `${path}?page=${currentPage - 1}` : null,
    to: data.length ? start + data.length : null,
    total,
  }
}

/**
 * List endpoint: `GET /api/media?page=1&per_page=12&search=aurora`.
 *
 * Search matches file name, title, alt text, caption and description. Searching
 * for `fail` simulates a server error so the UI error state can be exercised.
 */
export async function fetchMedia(query: MediaQuery): Promise<LaravelPaginator<MediaItem>> {
  // Round-trip through URLSearchParams so the mock consumes exactly the
  // parameter names a Laravel endpoint would receive.
  const params = new URLSearchParams({
    page: String(query.page),
    per_page: String(query.perPage),
    search: query.search,
  })

  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1)
  const perPage = Math.min(100, Math.max(1, Number.parseInt(params.get('per_page') ?? '12', 10) || 12))
  const search = (params.get('search') ?? '').trim().toLowerCase()

  await sleep(LIST_LATENCY_MS)

  if (search === 'fail') {
    throw new Error('Simulated media server error — clear the search or try again.')
  }

  const matching = media
    .filter((item) => {
      if (!search) return true
      return `${item.filename} ${item.title} ${item.alt} ${item.caption} ${item.description}`
        .toLowerCase()
        .includes(search)
    })
    .sort((a, b) => Date.parse(b.uploadedAt) - Date.parse(a.uploadedAt))

  return buildPaginator(matching, page, perPage, matching.length)
}

/** Update metadata: `PATCH /api/media/:id`. */
export async function updateMedia(
  id: number,
  input: MediaMetadataInput,
): Promise<MediaItem> {
  await sleep(WRITE_LATENCY_MS)
  const item = media.find((record) => record.id === id)
  if (!item) throw new Error(`Media #${id} was not found.`)

  item.title = input.title.trim() || filenameToTitle(item.filename)
  item.alt = input.alt
  item.caption = input.caption
  item.description = input.description
  return { ...item }
}

/** Delete endpoint: `DELETE /api/media` with `{ ids: [...] }`. */
export async function deleteMedia(ids: number[]): Promise<MediaDeleteResult> {
  await sleep(WRITE_LATENCY_MS)
  const targets = new Set(ids)
  const before = media.length
  for (let index = media.length - 1; index >= 0; index -= 1) {
    if (targets.has(media[index].id)) media.splice(index, 1)
  }
  return { deleted: before - media.length }
}

function readImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve({ width: 0, height: 0 })
      return
    }
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => resolve({ width: 0, height: 0 })
    image.src = url
  })
}

/**
 * Upload endpoint: `POST /api/media` (multipart/form-data).
 *
 * Uploads are processed one file at a time so progress can be reported. Each
 * accepted image becomes a media record with a browser object URL; a real
 * backend would return its own storage URLs instead.
 */
export async function uploadMedia(
  files: File[],
  options: MediaUploadOptions = {},
): Promise<MediaItem[]> {
  const images = files.filter((file) => file.type.startsWith('image/'))
  if (!images.length) throw new Error('Only image files can be uploaded.')

  const uploaded: MediaItem[] = []
  for (const [index, file] of images.entries()) {
    await sleep(UPLOAD_LATENCY_MS)
    const url = URL.createObjectURL(file)
    const { width, height } = await readImageDimensions(url)
    const item: MediaItem = {
      id: nextMediaId++,
      filename: file.name,
      title: filenameToTitle(file.name),
      alt: '',
      caption: '',
      description: '',
      url,
      thumbnailUrl: url,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      width,
      height,
      uploadedAt: new Date().toISOString(),
    }
    media.unshift(item)
    uploaded.push(item)
    options.onProgress?.(Math.round(((index + 1) / images.length) * 100))
  }

  return uploaded
}
