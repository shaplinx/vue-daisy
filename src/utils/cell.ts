/** Shared helpers for comparing and range-matching table cell values. */

export const DAY_MS = 86_400_000

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/

/**
 * Timestamp of a cell value, or null when it is empty, unparseable or not
 * date-like. Only `Date` instances and ISO date-like strings (`YYYY-MM-DD…`)
 * count as dates — plain numbers are never dates, so `Date.parse` quirks
 * like `Date.parse('12480')` (year 12480) cannot hijack numeric cells.
 */
export function cellTime(value: unknown): number | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.getTime()
  if (typeof value !== 'string' || !ISO_DATE_PREFIX.test(value)) return null
  const time = Date.parse(value)
  return Number.isNaN(time) ? null : time
}

function isIsoDateLike(value: unknown): boolean {
  return typeof value === 'string' && ISO_DATE_PREFIX.test(value)
}

/**
 * Generic cell comparison: null and undefined sort last, numbers compare
 * numerically, ISO date-like strings compare by time, everything else uses
 * a natural, case-insensitive string comparison.
 */
export function compareCellValues(a: unknown, b: unknown): number {
  if (a === null || a === undefined) return b === null || b === undefined ? 0 : 1
  if (b === null || b === undefined) return -1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (isIsoDateLike(a) && isIsoDateLike(b)) {
    const ta = cellTime(a)
    const tb = cellTime(b)
    if (ta !== null && tb !== null) return ta - tb
  }
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/**
 * True when a cell lies within an optional `[from, to]` range. Date-like
 * cells compare by time, with an inclusive end-of-day upper bound; numeric
 * cells compare numerically; other cells fall back to a string comparison.
 * Empty cells never match a bounded range.
 */
export function cellInRange(cell: unknown, from?: string, to?: string): boolean {
  const time = cellTime(cell)
  if (time !== null) {
    const fromTime = from === undefined || from === '' ? null : cellTime(from)
    const toTime = to === undefined || to === '' ? null : cellTime(to)
    if (fromTime !== null && time < fromTime) return false
    if (toTime !== null && time > toTime + DAY_MS - 1) return false
    return true
  }
  if (typeof cell === 'number') {
    const fromNumber = from === undefined || from === '' ? null : Number(from)
    const toNumber = to === undefined || to === '' ? null : Number(to)
    if (fromNumber !== null && Number.isFinite(fromNumber) && cell < fromNumber) return false
    if (toNumber !== null && Number.isFinite(toNumber) && cell > toNumber) return false
    return true
  }
  const text = cell === null || cell === undefined ? '' : String(cell)
  const afterFrom = from === undefined || from === '' || text >= from
  const beforeTo = to === undefined || to === '' || text <= to
  return afterFrom && beforeTo
}
