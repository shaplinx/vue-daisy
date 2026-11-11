<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useId } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import FooterBar from '@/components/dashboard/FooterBar.vue'

const route = useRoute()
const drawerId = useId()

/**
 * State of the daisyUI drawer checkbox. Below `lg` it toggles the overlay
 * drawer; at `lg` (`lg:drawer-open`) the sidebar is always visible. The
 * overlay drawer is transient: it starts closed and never persists.
 */
const sidebarOpen = ref(false)

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
      <Topbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="flex-1 px-4 py-5 lg:px-6 lg:py-6">
        <RouterView />
      </main>
      <FooterBar />
    </div>

    <div class="drawer-side z-40">
      <label :for="drawerId" class="drawer-overlay" aria-label="Close sidebar" />
      <aside class="flex min-h-full w-64 flex-col border-e border-base-300 bg-base-100" aria-label="Sidebar">
        <Sidebar @navigate="onSidebarNavigate" />
      </aside>
    </div>
  </div>
</template>
