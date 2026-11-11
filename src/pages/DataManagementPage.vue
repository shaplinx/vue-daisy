<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Eye, Pencil, Server, Table2, Trash2, UserPlus, Users } from '@lucide/vue'
import DzDataTable from '@/components/datatable/DzDataTable.vue'
import type { DataTableColumn, DataTableRow } from '@/components/datatable/DzDataTable.vue'
import { useDataTable } from '@/composables/useDataTable'
import { useToast } from '@/composables/useToast'
import { createUser, deleteUsers, fetchUser, fetchUsers, updateUser } from '@/services/userService'
import type { User, UserInput, UserRole, UserStatus } from '@/services/userService'
import { USER_ROLES, USER_STATUSES } from '@/services/userService'

const toast = useToast()

// ---------------------------------------------------------------------------
// Users resource — server mode driven by events, fetched outside the table
// ---------------------------------------------------------------------------

const roleOptions = USER_ROLES.map((role) => ({ label: role[0].toUpperCase() + role.slice(1), value: role }))
const statusOptions = USER_STATUSES.map((status) => ({
  label: status[0].toUpperCase() + status.slice(1),
  value: status,
}))
// Slot filter selects lead with an explicit "no filter" option.
const roleFilterOptions = [{ label: 'All roles', value: '' }, ...roleOptions]
const statusFilterOptions = [{ label: 'All statuses', value: '' }, ...statusOptions]

const ROLE_BADGES: Record<UserRole, string> = {
  admin: 'badge-primary',
  editor: 'badge-secondary',
  viewer: 'badge-ghost',
}

const STATUS_BADGES: Record<UserStatus, string> = {
  active: 'badge-success',
  invited: 'badge-info',
  suspended: 'badge-error',
}

function roleBadgeClass(value: unknown): string {
  const role = USER_ROLES.find((item) => item === value)
  return role ? ROLE_BADGES[role] : 'badge-ghost'
}

function statusBadgeClass(value: unknown): string {
  const status = USER_STATUSES.find((item) => item === value)
  return status ? STATUS_BADGES[status] : 'badge-ghost'
}

function toUser(row: DataTableRow): User {
  return row as User
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

function formatLastLogin(value: unknown): string {
  const time = Date.parse(String(value ?? ''))
  if (Number.isNaN(time)) return 'Never'
  const days = Math.floor((Date.now() - time) / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  return new Date(time).toLocaleDateString()
}

function formatDate(value: unknown): string {
  const time = Date.parse(String(value ?? ''))
  return Number.isNaN(time) ? '—' : new Date(time).toLocaleDateString()
}

const userColumns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  // Hidden column: never rendered, but still covered by the global search.
  { key: 'email', label: 'Email', hidden: true },
  { key: 'role', label: 'Role', sortable: true, align: 'center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' },
  { key: 'company', label: 'Company', sortable: true },
  {
    key: 'lastLoginAt',
    label: 'Last login',
    sortable: true,
    align: 'end',
    formatter: formatLastLogin,
  },
]

const {
  query,
  rows,
  total,
  from,
  to,
  loading,
  error,
  refresh,
} = useDataTable<User>({
  fetcher: fetchUsers,
  initialQuery: { sort: { key: 'name', direction: 'asc' } },
})

const selectedIds = ref<Array<string | number>>([])
const selectedUsers = computed(() =>
  selectedIds.value
    .map((id) => rows.value.find((user) => user.id === id))
    .filter((user): user is User => user !== undefined),
)

// ---------------------------------------------------------------------------
// Create / edit dialog
// ---------------------------------------------------------------------------

interface UserForm {
  name: string
  email: string
  role: UserRole
  status: UserStatus
  company: string
  lastLoginAt: string
}

const editorOpen = ref(false)
const editorLoading = ref(false)
const editorSaving = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<UserForm>({
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
  company: '',
  lastLoginAt: '',
})
const formErrors = reactive({ name: '', email: '', company: '' })

/**
 * Write one of the editor form's text fields. Wired in the template as
 * `setField('name', $event)` — the inline-statement form must forward
 * `$event` explicitly, otherwise the emitted payload is discarded.
 */
function setField(key: 'name' | 'email' | 'company' | 'lastLoginAt', value: string | number): void {
  form[key] = String(value)
  if (key === 'name' || key === 'email' || key === 'company') formErrors[key] = ''
}

function onRoleChange(value: string | number | Array<string | number>): void {
  const role = String(Array.isArray(value) ? (value[0] ?? '') : value)
  form.role = USER_ROLES.find((item) => item === role) ?? 'viewer'
}

function onStatusChange(value: string | number | Array<string | number>): void {
  const status = String(Array.isArray(value) ? (value[0] ?? '') : value)
  form.status = USER_STATUSES.find((item) => item === status) ?? 'active'
}

function resetForm(): void {
  form.name = ''
  form.email = ''
  form.role = 'viewer'
  form.status = 'active'
  form.company = ''
  form.lastLoginAt = ''
  formErrors.name = ''
  formErrors.email = ''
  formErrors.company = ''
}

function openCreate(): void {
  editingId.value = null
  resetForm()
  editorOpen.value = true
}

function openEdit(user: User): void {
  editingId.value = user.id
  resetForm()
  editorOpen.value = true
  editorLoading.value = true
  fetchUser(user.id)
    .then((record) => {
      form.name = record.name
      form.email = record.email
      form.role = record.role
      form.status = record.status
      form.company = record.company
      form.lastLoginAt = record.lastLoginAt ? record.lastLoginAt.slice(0, 10) : ''
    })
    .catch((cause: unknown) => {
      editorOpen.value = false
      toast.error(cause instanceof Error ? cause.message : 'Failed to load the user')
    })
    .finally(() => {
      editorLoading.value = false
    })
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(): boolean {
  formErrors.name = form.name.trim() ? '' : 'Name is required'
  if (!form.email.trim()) formErrors.email = 'Email is required'
  else formErrors.email = EMAIL_PATTERN.test(form.email.trim()) ? '' : 'Enter a valid email address'
  formErrors.company = form.company.trim() ? '' : 'Company is required'
  return !formErrors.name && !formErrors.email && !formErrors.company
}

function saveUser(): void {
  if (editorSaving.value || !validateForm()) return
  editorSaving.value = true
  const id = editingId.value
  const creating = id === null
  const input: UserInput = {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    role: form.role,
    status: form.status,
    company: form.company.trim(),
    lastLoginAt: form.lastLoginAt ? new Date(`${form.lastLoginAt}T12:00:00Z`).toISOString() : null,
  }
  const request = creating ? createUser(input) : updateUser(id, input)
  request
    .then((saved) => {
      editorOpen.value = false
      toast.success(creating ? `User "${saved.name}" created` : `User "${saved.name}" updated`)
      refresh()
    })
    .catch((cause: unknown) => {
      toast.error(cause instanceof Error ? cause.message : 'Something went wrong')
    })
    .finally(() => {
      editorSaving.value = false
    })
}

// ---------------------------------------------------------------------------
// View dialog
// ---------------------------------------------------------------------------

const viewerOpen = ref(false)
const viewerLoading = ref(false)
const viewedUser = ref<User | null>(null)

function openView(user: User): void {
  viewerOpen.value = true
  viewerLoading.value = true
  viewedUser.value = null
  fetchUser(user.id)
    .then((record) => {
      viewedUser.value = record
    })
    .catch((cause: unknown) => {
      viewerOpen.value = false
      toast.error(cause instanceof Error ? cause.message : 'Failed to load the user')
    })
    .finally(() => {
      viewerLoading.value = false
    })
}

function editViewedUser(): void {
  const user = viewedUser.value
  viewerOpen.value = false
  if (user) openEdit(user)
}

// ---------------------------------------------------------------------------
// Delete confirmation (single and bulk)
// ---------------------------------------------------------------------------

const deleteOpen = ref(false)
const deleteSaving = ref(false)
const deleteTargets = ref<User[]>([])

function askDelete(targets: User[]): void {
  if (!targets.length) return
  deleteTargets.value = targets
  deleteOpen.value = true
}

function askDeleteSelected(): void {
  askDelete(selectedUsers.value)
}

function confirmDelete(): void {
  if (deleteSaving.value) return
  deleteSaving.value = true
  deleteUsers(deleteTargets.value.map((user) => user.id))
    .then((deleted) => {
      deleteOpen.value = false
      selectedIds.value = []
      toast.success(deleted === 1 ? 'User deleted' : `${deleted} users deleted`)
      refresh()
    })
    .catch((cause: unknown) => {
      toast.error(cause instanceof Error ? cause.message : 'Failed to delete users')
    })
    .finally(() => {
      deleteSaving.value = false
    })
}

// ---------------------------------------------------------------------------
// Client-side demo — local dataset, no fetch involved
// ---------------------------------------------------------------------------

type InvoiceStatus = 'paid' | 'pending' | 'overdue'

type Invoice = {
  id: number
  number: string
  client: string
  amount: number
  status: InvoiceStatus
  issuedAt: string
}

const INVOICE_STATUSES: readonly InvoiceStatus[] = ['paid', 'pending', 'overdue']

const INVOICE_STATUS_BADGES: Record<InvoiceStatus, string> = {
  paid: 'badge-success',
  pending: 'badge-warning',
  overdue: 'badge-error',
}

function invoiceStatusBadgeClass(value: unknown): string {
  const status = INVOICE_STATUSES.find((item) => item === value)
  return status ? INVOICE_STATUS_BADGES[status] : 'badge-ghost'
}

const invoiceStatusOptions = INVOICE_STATUSES.map((status) => ({
  label: status[0].toUpperCase() + status.slice(1),
  value: status,
}))
// Slot filter select with an explicit "no filter" option.
const invoiceFilterOptions = [{ label: 'All statuses', value: '' }, ...invoiceStatusOptions]

function formatCurrency(value: unknown): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

const invoices: Invoice[] = [
  { id: 1, number: 'INV-2026-1041', client: 'Northwind Traders', amount: 12480, status: 'paid', issuedAt: '2026-10-02' },
  { id: 2, number: 'INV-2026-1042', client: 'Aperture Labs', amount: 4310, status: 'pending', issuedAt: '2026-10-05' },
  { id: 3, number: 'INV-2026-1043', client: 'Globex Corp', amount: 18750, status: 'overdue', issuedAt: '2026-09-18' },
  { id: 4, number: 'INV-2026-1044', client: 'Initech', amount: 980, status: 'paid', issuedAt: '2026-10-08' },
  { id: 5, number: 'INV-2026-1045', client: 'Umbrella Films', amount: 26700, status: 'pending', issuedAt: '2026-10-12' },
  { id: 6, number: 'INV-2026-1046', client: 'Stark Industries', amount: 51200, status: 'paid', issuedAt: '2026-10-15' },
  { id: 7, number: 'INV-2026-1047', client: 'Acme Freight', amount: 3400, status: 'overdue', issuedAt: '2026-08-30' },
  { id: 8, number: 'INV-2026-1048', client: 'Wonka Candy', amount: 1250, status: 'paid', issuedAt: '2026-10-21' },
  { id: 9, number: 'INV-2026-1049', client: 'Wayne Enterprises', amount: 8900, status: 'pending', issuedAt: '2026-10-25' },
  { id: 10, number: 'INV-2026-1050', client: 'Tyrell Corp', amount: 15300, status: 'overdue', issuedAt: '2026-09-02' },
  { id: 11, number: 'INV-2026-1051', client: 'Cyberdyne Systems', amount: 6650, status: 'paid', issuedAt: '2026-10-29' },
  { id: 12, number: 'INV-2026-1052', client: 'Soylent Foods', amount: 2310, status: 'pending', issuedAt: '2026-11-01' },
  { id: 13, number: 'INV-2026-1053', client: 'Northwind Traders', amount: 7120, status: 'paid', issuedAt: '2026-11-04' },
  { id: 14, number: 'INV-2026-1054', client: 'Aperture Labs', amount: 1980, status: 'overdue', issuedAt: '2026-09-11' },
]

const showClientColumn = ref(true)

function onClientColumnToggle(value: boolean | Array<string | number | boolean>): void {
  showClientColumn.value = Array.isArray(value) ? value.length > 0 : Boolean(value)
}

// Column definitions are fully dynamic — toggling rebuilds them with the
// Client column hidden, demonstrating hidden/visible column management.
const invoiceColumns = computed<DataTableColumn[]>(() => [
  { key: 'number', label: 'Invoice', sortable: true },
  { key: 'client', label: 'Client', sortable: true, hidden: !showClientColumn.value },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end', formatter: formatCurrency },
  { key: 'status', label: 'Status', sortable: true, align: 'center' },
  { key: 'issuedAt', label: 'Issued', sortable: true, align: 'end', formatter: formatDate },
])
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-1">
      <div class="flex flex-wrap items-center gap-2">
        <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">Data Management</h1>
        <span class="badge badge-success badge-soft">Phase 3</span>
      </div>
      <p class="max-w-3xl text-sm text-base-content/70">
        The reusable DataTable in action. The users table below never touches an API: every search,
        filter, sort and page change leaves the table as one joined
        <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">update:query</code> event, the
        page routes it through
        <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">useDataTable</code> into the
        mock Laravel service, and rows return as props inside Laravel's native pagination envelope.
        The filter panel is a plain slot — each input is bound with
        <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">v-model="filters.&lt;key&gt;"</code>.
      </p>
    </header>

    <!-- Server mode: Users CRUD -->
    <div class="rounded-box border border-base-300 bg-base-100 p-4 sm:p-6">
      <header class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div class="space-y-1">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <span class="flex size-8 items-center justify-center rounded-box bg-primary/15 text-primary">
              <Server class="size-4" aria-hidden="true" />
            </span>
            Users
            <span class="badge badge-ghost badge-sm">{{ total }} records</span>
          </h2>
          <p class="max-w-2xl text-sm text-base-content/70">
            Server-driven CRUD against a mock Laravel resource — pagination, filtering and sorting
            all resolved by the API, with row selection, bulk delete and loading skeletons. Search
            for <code class="rounded bg-base-200 px-1 py-0.5 text-[0.85em]">fail</code> to preview
            the error state.
          </p>
        </div>
      </header>

      <DzDataTable
        mode="server"
        v-model:query="query"
        :columns="userColumns"
        :rows="rows"
        selectable
        zebra
        :total="total"
        :from="from"
        :to="to"
        :loading="loading"
        :error="error ?? ''"
        v-model:selected="selectedIds"
        search-placeholder="Search users…"
        empty-text="No users match your search or filters"
        aria-label="Users"
        @retry="refresh"
      >
        <!-- Filter panel: plain slot inputs, each bound with v-model -->
        <template #filters="{ filters }">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-base-content/70">Role</span>
            <DzSelect
              v-model="filters.role"
              :options="roleFilterOptions"
              size="sm"
              aria-label="Filter by Role"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-base-content/70">Status</span>
            <DzSelect
              v-model="filters.status"
              :options="statusFilterOptions"
              size="sm"
              aria-label="Filter by Status"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-base-content/70">Last login</span>
            <div class="grid grid-cols-2 gap-2">
              <DzInput
                v-model="filters.lastLoginAt_from"
                type="date"
                size="sm"
                aria-label="Last login from"
              />
              <DzInput
                v-model="filters.lastLoginAt_to"
                type="date"
                size="sm"
                aria-label="Last login to"
              />
            </div>
          </div>
        </template>
        <template #toolbar>
          <DzButton color="primary" size="sm" @click="openCreate">
            <template #icon>
              <UserPlus class="size-4" aria-hidden="true" />
            </template>
            New user
          </DzButton>
        </template>

        <template #bulk-actions="{ count }">
          <span class="font-medium">{{ count }} selected</span>
          <span class="grow"></span>
          <DzButton size="sm" variant="outline" color="error" @click="askDeleteSelected">
            <template #icon>
              <Trash2 class="size-4" aria-hidden="true" />
            </template>
            Delete selected
          </DzButton>
        </template>

        <template #cell-name="{ row }">
          <div class="flex items-center gap-3">
            <span
              class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary"
            >
              {{ initials(String(row.name)) }}
            </span>
            <div class="min-w-0">
              <p class="truncate font-medium">{{ row.name }}</p>
              <p class="truncate text-xs text-base-content/60">{{ row.email }}</p>
            </div>
          </div>
        </template>

        <template #cell-role="{ value }">
          <span class="badge badge-sm capitalize" :class="roleBadgeClass(value)">{{ value }}</span>
        </template>

        <template #cell-status="{ value }">
          <span class="badge badge-sm capitalize" :class="statusBadgeClass(value)">{{ value }}</span>
        </template>

        <template #actions="{ row }">
          <DzButton size="xs" variant="ghost" circle aria-label="View user" @click="openView(toUser(row))">
            <Eye class="size-4" aria-hidden="true" />
          </DzButton>
          <DzButton size="xs" variant="ghost" circle aria-label="Edit user" @click="openEdit(toUser(row))">
            <Pencil class="size-4" aria-hidden="true" />
          </DzButton>
          <DzButton
            size="xs"
            variant="ghost"
            circle
            color="error"
            aria-label="Delete user"
            @click="askDelete([toUser(row)])"
          >
            <Trash2 class="size-4" aria-hidden="true" />
          </DzButton>
        </template>
      </DzDataTable>
    </div>

    <!-- Client mode: local dataset -->
    <div class="rounded-box border border-base-300 bg-base-100 p-4 sm:p-6">
      <header class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div class="space-y-1">
          <h2 class="flex items-center gap-2 text-lg font-semibold">
            <span class="flex size-8 items-center justify-center rounded-box bg-secondary/15 text-secondary">
              <Users class="size-4" aria-hidden="true" />
            </span>
            Recent invoices
            <span class="badge badge-ghost badge-sm">client mode</span>
          </h2>
          <p class="max-w-2xl text-sm text-base-content/70">
            The same component with no server at all — search, filters, sorting and pagination run
            in the browser over this local dataset. Toggle the checkbox to rebuild the column
            definitions with the Client column hidden.
          </p>
        </div>
        <DzCheckbox
          :model-value="showClientColumn"
          label="Client column"
          @update:model-value="onClientColumnToggle"
        />
      </header>

      <DzDataTable
        :columns="invoiceColumns"
        :rows="invoices"
        search-placeholder="Search invoices…"
        empty-text="No invoices match your search or filters"
        aria-label="Invoices"
      >
        <template #filters="{ filters }">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-base-content/70">Status</span>
            <DzSelect
              v-model="filters.status"
              :options="invoiceFilterOptions"
              size="sm"
              aria-label="Filter by Status"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-base-content/70">Amount</span>
            <div class="grid grid-cols-2 gap-2">
              <DzInput
                v-model="filters.amount_from"
                type="number"
                min="0"
                size="sm"
                placeholder="From"
                aria-label="Amount from"
              />
              <DzInput
                v-model="filters.amount_to"
                type="number"
                min="0"
                size="sm"
                placeholder="To"
                aria-label="Amount to"
              />
            </div>
          </div>
        </template>

        <template #cell-status="{ value }">
          <span class="badge badge-sm capitalize" :class="invoiceStatusBadgeClass(value)">
            {{ value }}
          </span>
        </template>
      </DzDataTable>
    </div>

    <!-- Create / edit dialog -->
    <DzModal
      v-model="editorOpen"
      size="lg"
      :title="editingId === null ? 'New user' : 'Edit user'"
      :description="editingId === null ? 'Add a user to the mock Laravel resource.' : `Editing user #${editingId}.`"
    >
      <div v-if="editorLoading" class="space-y-3">
        <DzSkeleton class="h-10 w-full" />
        <DzSkeleton class="h-10 w-full" />
        <DzSkeleton class="h-10 w-full" />
        <DzSkeleton class="h-10 w-1/2" />
      </div>
      <form v-else class="grid gap-4 sm:grid-cols-2" @submit.prevent="saveUser">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Name</span>
          <DzInput
            :model-value="form.name"
            :invalid="Boolean(formErrors.name)"
            placeholder="e.g. Ada Lovelace"
            @update:model-value="setField('name', $event)"
          />
          <p v-if="formErrors.name" class="text-xs text-error">{{ formErrors.name }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Email</span>
          <DzInput
            :model-value="form.email"
            :invalid="Boolean(formErrors.email)"
            placeholder="name@example.com"
            @update:model-value="setField('email', $event)"
          />
          <p v-if="formErrors.email" class="text-xs text-error">{{ formErrors.email }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Role</span>
          <DzSelect :model-value="form.role" :options="roleOptions" @update:model-value="onRoleChange" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Status</span>
          <DzSelect :model-value="form.status" :options="statusOptions" @update:model-value="onStatusChange" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">Company</span>
          <DzInput
            :model-value="form.company"
            :invalid="Boolean(formErrors.company)"
            placeholder="e.g. Northwind Traders"
            @update:model-value="setField('company', $event)"
          />
          <p v-if="formErrors.company" class="text-xs text-error">{{ formErrors.company }}</p>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-sm font-medium">
            Last login <span class="font-normal text-base-content/50">(optional)</span>
          </span>
          <DzInput type="date" :model-value="form.lastLoginAt" @update:model-value="setField('lastLoginAt', $event)" />
        </div>
        <button type="submit" class="hidden" aria-hidden="true" tabindex="-1"></button>
      </form>
      <template #footer>
        <DzButton variant="ghost" :disabled="editorSaving" @click="editorOpen = false">Cancel</DzButton>
        <DzButton color="primary" :loading="editorSaving" @click="saveUser">
          {{ editingId === null ? 'Create user' : 'Save changes' }}
        </DzButton>
      </template>
    </DzModal>

    <!-- View dialog -->
    <DzModal v-model="viewerOpen" size="md" title="User details">
      <div v-if="viewerLoading || !viewedUser" class="space-y-3">
        <DzSkeleton class="h-5 w-1/3" />
        <DzSkeleton class="h-5 w-2/3" />
        <DzSkeleton class="h-5 w-1/2" />
        <DzSkeleton class="h-5 w-3/4" />
      </div>
      <dl v-else class="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Name</dt>
          <dd class="mt-0.5 font-medium">{{ viewedUser.name }}</dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Email</dt>
          <dd class="mt-0.5 break-all">{{ viewedUser.email }}</dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Role</dt>
          <dd class="mt-0.5">
            <span class="badge badge-sm capitalize" :class="roleBadgeClass(viewedUser.role)">
              {{ viewedUser.role }}
            </span>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Status</dt>
          <dd class="mt-0.5">
            <span class="badge badge-sm capitalize" :class="statusBadgeClass(viewedUser.status)">
              {{ viewedUser.status }}
            </span>
          </dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Company</dt>
          <dd class="mt-0.5">{{ viewedUser.company }}</dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Last login</dt>
          <dd class="mt-0.5">{{ formatLastLogin(viewedUser.lastLoginAt) }}</dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">Created</dt>
          <dd class="mt-0.5">{{ formatDate(viewedUser.createdAt) }}</dd>
        </div>
        <div class="flex flex-col">
          <dt class="text-xs font-medium uppercase tracking-wide text-base-content/50">User ID</dt>
          <dd class="mt-0.5">#{{ viewedUser.id }}</dd>
        </div>
      </dl>
      <template #footer>
        <DzButton variant="ghost" @click="viewerOpen = false">Close</DzButton>
        <DzButton variant="outline" color="primary" @click="editViewedUser">
          <template #icon>
            <Pencil class="size-4" aria-hidden="true" />
          </template>
          Edit user
        </DzButton>
      </template>
    </DzModal>

    <!-- Delete confirmation -->
    <DzModal v-model="deleteOpen" size="sm" title="Delete users?">
      <p class="text-sm text-base-content/80">
        <template v-if="deleteTargets.length === 1">
          Delete <span class="font-semibold">{{ deleteTargets[0]?.name }}</span>? This action cannot
          be undone.
        </template>
        <template v-else>
          Delete these <span class="font-semibold">{{ deleteTargets.length }} users</span>? This
          action cannot be undone.
        </template>
      </p>
      <ul v-if="deleteTargets.length > 1" class="mt-3 max-h-36 space-y-1 overflow-y-auto text-sm">
        <li v-for="user in deleteTargets.slice(0, 6)" :key="user.id" class="flex items-center gap-2">
          <span class="text-xs text-base-content/50">#{{ user.id }}</span>
          <span>{{ user.name }}</span>
        </li>
        <li v-if="deleteTargets.length > 6" class="text-xs text-base-content/50">
          and {{ deleteTargets.length - 6 }} more…
        </li>
      </ul>
      <template #footer>
        <DzButton variant="ghost" :disabled="deleteSaving" @click="deleteOpen = false">Cancel</DzButton>
        <DzButton color="error" :loading="deleteSaving" @click="confirmDelete">Delete</DzButton>
      </template>
    </DzModal>
  </section>
</template>
