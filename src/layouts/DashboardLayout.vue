<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useId } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import FooterBar from '@/components/dashboard/FooterBar.vue'

const route = useRoute()
const STORAGE_KEY = 'vue-daisy:sidebar-open'

const drawerId = useId()

/**
 * Single source of truth for the daisyUI drawer checkbox.
 * - Below `lg`: checked = overlay drawer visible, unchecked = hidden.
 * - At `lg` (`lg:drawer-open`): the sidebar is always visible; checked =
 *   expanded (`is-drawer-open:w-64`), unchecked = icon-only rail
 *   (`is-drawer-close:w-14` with tooltips).
 */
const sidebarOpen = ref(true)

try {
  sidebarOpen.value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'true')
} catch {
  sidebarOpen.value = true
}

watch(sidebarOpen, (value) => {
  // Only persist the desktop expanded/collapsed preference; the mobile
  // overlay drawer is transient and always starts closed.
  if (!isDesktop()) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Ignore storage failures.
  }
})

function isDesktop(): boolean {
  return window.matchMedia('(min-width: 1024px)').matches
}

// Close the overlay drawer (small screens only) whenever the route changes.
watch(
  () => route.fullPath,
  () => {
    if (!isDesktop()) sidebarOpen.value = false
  },
)

function onSidebarNavigate(): void {
  if (!isDesktop()) sidebarOpen.value = false
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && !isDesktop()) sidebarOpen.value = false
}

onMounted(() => {
  // Never restore an opened overlay drawer on small screens.
  if (!isDesktop()) sidebarOpen.value = false
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input
      :id="drawerId"
      v-model="sidebarOpen"
      type="checkbox"
      class="drawer-toggle"
      aria-label="Toggle sidebar"
    />

    <div class="drawer-content flex min-h-screen flex-col bg-base-200 text-base-content">
      <Topbar
        :collapsed="!sidebarOpen"
        @toggle-sidebar="sidebarOpen = !sidebarOpen"
        @toggle-collapse="sidebarOpen = !sidebarOpen"
      />
      <main class="flex-1 px-4 py-5 lg:px-6 lg:py-6">
        <RouterView />
      </main>
      <FooterBar />
    </div>

    <div class="drawer-side z-40 is-drawer-close:overflow-visible">
      <label :for="drawerId" class="drawer-overlay" aria-label="Close sidebar" />
      <aside
        class="flex min-h-full flex-col border-e border-base-300 bg-base-100 is-drawer-close:w-14 is-drawer-open:w-64"
        aria-label="Sidebar"
      >
        <Sidebar :collapsed="!sidebarOpen" @toggle="sidebarOpen = !sidebarOpen" @navigate="onSidebarNavigate" />
      </aside>
    </div>
  </div>
</template>
