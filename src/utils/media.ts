/** Formatting helpers shared by the media service and media library UI. */

/** Human-readable file size, e.g. `1.4 MB`. */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)))
  const value = bytes / 1024 ** exponent
  const digits = value >= 10 || exponent === 0 ? 0 : 1
  return `${value.toFixed(digits)} ${units[exponent]}`
}

/** Pixel dimensions, e.g. `1600 × 900`. */
export function formatDimensions(width: number, height: number): string {
  if (!width || !height) return '—'
  return `${width} × ${height}`
}

/** Localised upload date with a stable, readable format. */
export function formatMediaDate(iso: string): string {
  const time = Date.parse(iso)
  if (Number.isNaN(time)) return '—'
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(time)
}

/** Turn `my-holiday_photo.svg` into `My holiday photo`. */
export function filenameToTitle(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  if (!base) return 'Untitled'
  return base.charAt(0).toUpperCase() + base.slice(1)
}

/** File extension without the dot, lowercase. */
export function fileExtension(filename: string): string {
  const match = /\.([^.]+)$/.exec(filename)
  return match ? match[1].toLowerCase() : ''
}
