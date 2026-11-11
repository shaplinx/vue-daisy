<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/Topbar.vue'
import FooterBar from '@/components/dashboard/FooterBar.vue'

const route = useRoute()
const STORAGE_KEY = 'vue-daisy:sidebar-collapsed'

const collapsed = ref(false)
const mobileOpen = ref(false)

try {
  collapsed.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'false')
} catch {
  collapsed.value = false
}

watch(collapsed, (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Ignore storage failures.
  }
})

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)

const shellClass = computed(() => (collapsed.value ? 'lg:ms-20' : 'lg:ms-64'))
const sidebarClass = computed(() => (collapsed.value ? 'lg:w-20 sidebar-collapsed' : 'lg:w-64'))

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') mobileOpen.value = false
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px] lg:hidden"
      aria-hidden="true"
      @click="mobileOpen = false"
    />

    <aside
      :class="[
        'fixed inset-y-0 start-0 z-40 flex w-64 flex-col border-e border-base-300 bg-base-100 transition-all duration-200',
        sidebarClass,
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
      aria-label="Sidebar"
    >
      <Sidebar :collapsed="collapsed" @toggle="collapsed = !collapsed" @navigate="mobileOpen = false" />
    </aside>

    <div class="flex min-h-screen flex-col transition-[margin] duration-200" :class="shellClass">
      <Topbar
        :collapsed="collapsed"
        @toggle-sidebar="mobileOpen = !mobileOpen"
        @toggle-collapse="collapsed = !collapsed"
      />
      <main class="flex-1 px-4 py-5 lg:px-6 lg:py-6">
        <RouterView />
      </main>
      <FooterBar />
    </div>
  </div>
</template>

<style scoped>
:global(.sidebar-collapsed) .menu-label-text,
:global(.sidebar-collapsed) .menu-chevron,
:global(.sidebar-collapsed) .sidebar-hide-collapsed {
  display: none;
}

:global(.sidebar-collapsed) .menu details ul {
  display: none;
}

:global(.sidebar-collapsed) .menu details summary {
  justify-content: center;
}

:global(.sidebar-collapsed) .menu li > a,
:global(.sidebar-collapsed) .menu li > button,
:global(.sidebar-collapsed) .menu li > details > summary {
  justify-content: center;
  padding-inline: 0.75rem;
}

:global(.sidebar-collapsed) .menu .badge {
  display: none;
}
</style>
