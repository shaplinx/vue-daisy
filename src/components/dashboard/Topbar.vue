<script setup lang="ts">
import { Menu } from '@lucide/vue'
import AppBreadcrumbs from './AppBreadcrumbs.vue'
import GlobalSearch from './GlobalSearch.vue'
import ThemeMenu from './ThemeMenu.vue'
import NotificationMenu from './NotificationMenu.vue'
import UserMenu from './UserMenu.vue'

const emit = defineEmits(['toggle-sidebar'])
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-base-300 bg-base-100/90 px-3 backdrop-blur lg:px-6"
  >
    <button
      type="button"
      class="btn btn-ghost btn-square lg:hidden"
      aria-label="Open navigation"
      @click="emit('toggle-sidebar')"
    >
      <Menu class="size-5" aria-hidden="true" />
    </button>

    <div class="hidden min-w-0 flex-1 md:block">
      <AppBreadcrumbs />
    </div>

    <div class="ms-auto flex items-center gap-0.5 sm:gap-1">
      <GlobalSearch />
      <ThemeMenu />
      <NotificationMenu />
      <div class="mx-1 hidden h-6 w-px bg-base-300 sm:block" aria-hidden="true" />
      <UserMenu />
    </div>
  </header>
</template>
