<script setup lang="ts">
import { computed, ref } from 'vue'
import { Bell, CheckCheck, Info, Trash2 } from '@lucide/vue'
import DzDropdown from '@/components/ui/actions/DzDropdown.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import DzBadge from '@/components/ui/data-display/DzBadge.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()
const notifications = ref([
  { id: 1, title: 'Component library ready', message: '69 DaisyUI components are now available.', time: 'Just now', read: false },
  { id: 2, title: 'Theme updated', message: 'Your theme preference is saved locally.', time: '12 min ago', read: false },
  { id: 3, title: 'Milestone 1', message: 'Dashboard shell and showcase are complete.', time: '1 hr ago', read: true },
])

const unread = computed(() => notifications.value.filter((item) => !item.read).length)

function markAllRead() {
  notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
}

function clearAll() {
  notifications.value = []
  toast.info('Notifications cleared')
}
</script>

<template>
  <DzDropdown placement="end" content-class="w-80 p-0">
    <template #trigger="{ toggle, open }">
      <DzButton
        variant="ghost"
        circle
        :aria-label="`Notifications${unread ? `, ${unread} unread` : ''}`"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="indicator">
          <span
            v-if="unread"
            class="indicator-item badge badge-primary badge-xs"
          >{{ unread }}</span>
          <Bell class="size-5" aria-hidden="true" />
        </span>
      </DzButton>
    </template>

    <div class="flex items-center justify-between border-b border-base-300 px-4 py-3">
      <div>
        <p class="text-sm font-semibold">Notifications</p>
        <p class="text-xs opacity-60">{{ unread }} unread</p>
      </div>
      <div class="flex gap-1">
        <button
          type="button"
          class="btn btn-ghost btn-xs btn-circle"
          aria-label="Mark all as read"
          :disabled="!unread"
          @click="markAllRead"
        >
          <CheckCheck class="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="btn btn-ghost btn-xs btn-circle"
          aria-label="Clear notifications"
          :disabled="!notifications.length"
          @click="clearAll"
        >
          <Trash2 class="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <ul class="max-h-80 overflow-y-auto p-1.5">
      <li v-for="item in notifications" :key="item.id">
        <button
          type="button"
          class="flex w-full gap-3 rounded-box p-2.5 text-start hover:bg-base-200"
          @click="item.read = true"
        >
          <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-base-200">
            <Info class="size-4" aria-hidden="true" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-2">
              <span class="truncate text-sm font-medium">{{ item.title }}</span>
              <span v-if="!item.read" class="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
            </span>
            <span class="block text-xs opacity-60">{{ item.message }}</span>
            <span class="mt-1 block text-[10px] opacity-40">{{ item.time }}</span>
          </span>
        </button>
      </li>
      <li v-if="!notifications.length" class="px-3 py-8 text-center text-sm opacity-60">
        You're all caught up.
      </li>
    </ul>
  </DzDropdown>
</template>
