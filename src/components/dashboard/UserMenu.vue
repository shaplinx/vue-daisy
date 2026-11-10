<script setup>
import { LogOut, Palette, Settings, UserRound } from '@lucide/vue'
import DzDropdown from '@/components/ui/actions/DzDropdown.vue'
import DzAvatar from '@/components/ui/data-display/DzAvatar.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

function signOut() {
  toast.info('This is a demo — sign out is not connected to an auth backend.')
}
</script>

<template>
  <DzDropdown placement="end" content-class="w-64 p-2">
    <template #trigger="{ toggle, open }">
      <button
        type="button"
        class="btn btn-ghost h-auto gap-2 px-2 py-1.5"
        :aria-expanded="open"
        aria-label="Open user menu"
        @click="toggle"
      >
        <DzAvatar
          size="sm"
          alt="Alex Morgan"
          placeholder="AM"
          ring="primary"
          status="online"
        />
        <span class="hidden text-start sm:block">
          <span class="block text-xs font-semibold leading-tight">Alex Morgan</span>
          <span class="block text-[10px] leading-tight opacity-50">Administrator</span>
        </span>
      </button>
    </template>

    <div class="flex items-center gap-3 rounded-box bg-base-200 p-3">
      <DzAvatar size="md" alt="Alex Morgan" placeholder="AM" ring="primary" />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold">Alex Morgan</p>
        <p class="truncate text-xs opacity-60">alex@vuedaisy.dev</p>
      </div>
    </div>

    <ul class="menu mt-1 w-full">
      <li>
        <RouterLink to="/settings">
          <UserRound class="size-4" aria-hidden="true" />
          Profile
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/settings">
          <Settings class="size-4" aria-hidden="true" />
          Settings
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/themes">
          <Palette class="size-4" aria-hidden="true" />
          Theme settings
        </RouterLink>
      </li>
    </ul>

    <div class="my-1 h-px bg-base-300" />

    <DzButton variant="ghost" size="sm" block class="justify-start" @click="signOut">
      <LogOut class="size-4" aria-hidden="true" />
      Sign out
    </DzButton>
  </DzDropdown>
</template>
