import { buildQueryString, toLaravelParams } from '@/services/api'
import type { DataTableQuery, LaravelPaginator } from '@/services/api'
import { cellInRange, compareCellValues, DAY_MS } from '@/utils/cell'

export type UserRole = 'admin' | 'editor' | 'viewer'
export type UserStatus = 'active' | 'invited' | 'suspended'

export const USER_ROLES: readonly UserRole[] = ['admin', 'editor', 'viewer']
export const USER_STATUSES: readonly UserStatus[] = ['active', 'invited', 'suspended']

/**
 * A "Users" resource record. Declared as a type alias (not an interface) so
 * arrays of users remain assignable to the DataTable's
 * `Record<string, unknown>` row type.
 */
export type User = {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  company: string
  /** ISO timestamp of the last sign-in; null when the user never logged in. */
  lastLoginAt: string | null
  /** ISO timestamp of when the user was created. */
  createdAt: string
}

export type UserInput = {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  company: string
  lastLoginAt: string | null
}

/*
 * Mock Laravel "Users" resource.
 *
 * `fetchUsers` implements the same contract a real `GET /api/users` endpoint
 * would: it receives a `DataTableQuery`, serializes it with the shared
 * Laravel parameter helpers, then filters, sorts and paginates like
 * Eloquent's `paginate()` — and answers with Laravel's native paginator
 * envelope. Swap this module for an HTTP client without touching
 * `DzDataTable` or `useDataTable`.
 */

/** Fixed anchor keeps the generated timestamps stable across reloads. */
const NOW = Date.UTC(2026, 10, 11, 9, 0, 0)

const FIRST_NAMES = [
  'Ava', 'Miles', 'Clara', 'Noah', 'Priya', 'Liam', 'Zoe', 'Owen',
  'Maya', 'Ethan', 'Nora', 'Felix', 'Iris', 'Jonas', 'Lena', 'Theo',
  'Ruby', 'Silas', 'Tess', 'Victor', 'Wren', 'Xavi', 'Yara', 'Zeke',
]

const LAST_NAMES = [
  'Nakamura', 'Okafor', 'Silva', 'Kovacs', 'Bennett', 'Marchetti', 'Hayes', 'Novak',
]

const COMPANIES = [
  'Northwind Traders', 'Aperture Labs', 'Globex Corp', 'Initech',
  'Umbrella Films', 'Stark Industries', 'Acme Freight', 'Wonka Candy',
  'Wayne Enterprises', 'Tyrell Corp', 'Cyberdyne Systems', 'Soylent Foods',
]

function buildUsers(): User[] {
  return Array.from({ length: 57 }, (_, index) => {
    const first = FIRST_NAMES[index % FIRST_NAMES.length]
    const last = LAST_NAMES[Math.floor(index / 8) % LAST_NAMES.length]
    const role: UserRole = index % 9 === 0 ? 'admin' : index % 4 === 1 ? 'editor' : 'viewer'
    const status: UserStatus =
      index % 11 === 7 ? 'invited' : index % 17 === 5 ? 'suspended' : 'active'
    const loginDaysAgo = (index * 29 + 11) % 120
    const createdDaysAgo = 365 + ((index * 53) % 730)
    return {
      id: index + 1,
      name: `${first} ${last}`,
      email: `${first}.${last}@example.com`.toLowerCase(),
      role,
      status,
      company: COMPANIES[(index * 5 + 2) % COMPANIES.length],
      lastLoginAt:
        status === 'invited'
          ? null
          : new Date(NOW - loginDaysAgo * DAY_MS - (index % 6) * 3_600_000).toISOString(),
      createdAt: new Date(NOW - createdDaysAgo * DAY_MS).toISOString(),
    }
  })
}

const users = buildUsers()
let nextUserId = users.length + 1

const LIST_LATENCY_MS = 260
const WRITE_LATENCY_MS = 340

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function delay<T>(value: T, ms: number): Promise<T> {
  return sleep(ms).then(() => value)
}

/** Read a column by key; unknown columns read as undefined, like an API. */
function fieldOf(user: User, key: string): unknown {
  return (user as Record<string, unknown>)[key]
}

/** Parameters a Laravel endpoint reserves for pagination and ordering. */
const RESERVED_PARAMS = new Set(['page', 'per_page', 'search', 'sort_by', 'sort_direction'])

interface ParsedFilter {
  equals?: string
  from?: string
  to?: string
  /** Membership list parsed from repeated `key[]` parameters. */
  in?: string[]
}

/** Users list endpoint: Laravel paginator envelope driven by the query. */
export async function fetchUsers(query: DataTableQuery): Promise<LaravelPaginator<User>> {
  // Round-trip the query through the Laravel parameter contract so the mock
  // behaves exactly like a backend consuming ?page=&per_page=&search=...
  const params = new URLSearchParams(buildQueryString(toLaravelParams(query)))

  const page = Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1)
  const perPage = Math.min(100, Math.max(1, Number.parseInt(params.get('per_page') ?? '10', 10) || 10))
  const search = (params.get('search') ?? '').trim().toLowerCase()

  // Mock-only affordance: searching for "fail" simulates a 500 response so
  // the table's error state and retry path can be demonstrated end to end.
  // Like a real 500, it arrives after the simulated network latency, so a
  // retry first shows the loading state before the error returns.
  if (search === 'fail') {
    await sleep(LIST_LATENCY_MS)
    throw new Error('Simulated server error — search for something else or clear the search.')
  }
  const sortBy = params.get('sort_by')
  const sortDirection = params.get('sort_direction') === 'desc' ? -1 : 1

  const parsedFilters: Record<string, ParsedFilter> = {}
  for (const [key, rawValue] of params.entries()) {
    if (RESERVED_PARAMS.has(key)) continue
    const value = rawValue.trim()
    if (!value) continue
    if (key.endsWith('[]')) {
      const filter = (parsedFilters[key.slice(0, -2)] ??= {})
      filter.in = [...(filter.in ?? []), value]
    } else if (key.endsWith('_from')) {
      const column = key.slice(0, -5)
      const filter = (parsedFilters[column] ??= {})
      filter.from = value
    } else if (key.endsWith('_to')) {
      const column = key.slice(0, -3)
      const filter = (parsedFilters[column] ??= {})
      filter.to = value
    } else {
      const filter = (parsedFilters[key] ??= {})
      filter.equals = value
    }
  }

  const matching = users.filter((user) => {
    if (search) {
      const haystack = `${user.name} ${user.email} ${user.company}`.toLowerCase()
      if (!haystack.includes(search)) return false
    }
    for (const [column, filter] of Object.entries(parsedFilters)) {
      const cell = fieldOf(user, column)
      if (
        filter.equals !== undefined &&
        String(cell ?? '').toLowerCase() !== filter.equals.toLowerCase()
      ) {
        return false
      }
      if (
        filter.in !== undefined &&
        !filter.in.includes(String(cell ?? '').toLowerCase())
      ) {
        return false
      }
      if (filter.from !== undefined || filter.to !== undefined) {
        if (!cellInRange(cell, filter.from, filter.to)) return false
      }
    }
    return true
  })

  if (sortBy) {
    matching.sort((a, b) => compareCellValues(fieldOf(a, sortBy), fieldOf(b, sortBy)) * sortDirection)
  }

  const total = matching.length
  const lastPage = Math.max(1, Math.ceil(total / perPage))
  const currentPage = Math.min(page, lastPage)
  const start = (currentPage - 1) * perPage
  const data = matching.slice(start, start + perPage)
  const path = '/api/users'

  return delay(
    {
      current_page: currentPage,
      data,
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
    },
    LIST_LATENCY_MS,
  )
}

/** Single record endpoint: `GET /api/users/:id`. */
export async function fetchUser(id: number): Promise<User> {
  await sleep(LIST_LATENCY_MS)
  const user = users.find((item) => item.id === id)
  if (!user) throw new Error(`User #${id} was not found.`)
  return user
}

export async function createUser(input: UserInput): Promise<User> {
  await sleep(WRITE_LATENCY_MS)
  assertEmailAvailable(input.email)
  const user: User = { id: nextUserId++, ...input, createdAt: new Date().toISOString() }
  users.unshift(user)
  return user
}

export async function updateUser(id: number, input: UserInput): Promise<User> {
  await sleep(WRITE_LATENCY_MS)
  const user = users.find((item) => item.id === id)
  if (!user) throw new Error(`User #${id} was not found.`)
  assertEmailAvailable(input.email, id)
  Object.assign(user, input)
  return user
}

/** Bulk delete; returns how many records were actually removed. */
export async function deleteUsers(ids: number[]): Promise<number> {
  await sleep(WRITE_LATENCY_MS)
  const targets = new Set(ids)
  const before = users.length
  for (let index = users.length - 1; index >= 0; index -= 1) {
    if (targets.has(users[index].id)) users.splice(index, 1)
  }
  return before - users.length
}

function assertEmailAvailable(email: string, exceptId?: number): void {
  const normalized = email.trim().toLowerCase()
  if (users.some((user) => user.email.toLowerCase() === normalized && user.id !== exceptId)) {
    throw new Error('The email has already been taken.')
  }
}
