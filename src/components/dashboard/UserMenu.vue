<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { LogIn, LogOut, Palette, Settings, ShieldCheck, ShieldOff, UserRound } from '@lucide/vue'
import DzDropdown from '@/components/ui/actions/DzDropdown.vue'
import DzAvatar from '@/components/ui/data-display/DzAvatar.vue'
import DzButton from '@/components/ui/actions/DzButton.vue'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'

const { user, enabled, isAuthenticated, isLoading, driver, logout } = useAuth()
const router = useRouter()
const toast = useToast()

const displayName = computed(() => {
  if (user.value) return user.value.name
  return enabled.value ? 'Guest' : 'Authentication disabled'
})

const displayDetail = computed(() => {
  if (user.value) return user.value.email
  if (!enabled.value) return 'No user profile'
  return 'Not signed in'
})

const initials = computed(() => {
  if (!user.value) return enabled.value ? '?' : '–'
  return user.value.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const driverLabel = computed(
  () =>
    ({
      'sanctum-spa': 'Sanctum SPA session',
      'sanctum-token': 'Sanctum Bearer token',
      none: 'No authentication',
    })[driver.value] ?? driver.value,
)

async function signOut(): Promise<void> {
  await logout()
  toast.success('Signed out')
  if (enabled.value) await router.push('/login')
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
          :alt="displayName"
          :placeholder="initials"
          :ring="user ? 'primary' : undefined"
          :status="user ? 'online' : undefined"
        />
        <span class="hidden text-start lg:block">
          <span class="block max-w-36 truncate text-xs font-semibold leading-tight">
            {{ displayName }}
          </span>
          <span class="block max-w-36 truncate text-[10px] leading-tight opacity-50">
            {{ displayDetail }}
          </span>
        </span>
      </button>
    </template>

    <div v-if="user" class="flex items-center gap-3 rounded-box bg-base-200 p-3">
      <DzAvatar size="md" :alt="user.name" :placeholder="initials" ring="primary" />
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold">{{ user.name }}</p>
        <p class="truncate text-xs opacity-60">{{ user.email }}</p>
      </div>
    </div>

    <div v-else class="rounded-box bg-base-200 p-3">
      <p class="flex items-center gap-1.5 text-xs font-semibold">
        <ShieldOff v-if="!enabled" class="size-3.5" aria-hidden="true" />
        <ShieldCheck v-else class="size-3.5" aria-hidden="true" />
        {{ displayName }}
      </p>
      <p class="mt-1 text-[11px] leading-snug opacity-60">
        {{ enabled ? 'Sign in to load your profile.' : driverLabel + ' — no user profile exists.' }}
      </p>
    </div>

    <ul class="menu mt-1 w-full">
      <li v-if="user">
        <RouterLink to="/settings">
          <UserRound class="size-4" aria-hidden="true" />
          Profile
        </RouterLink>
      </li>
      <li v-else-if="enabled">
        <RouterLink to="/login">
          <LogIn class="size-4" aria-hidden="true" />
          Sign in
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
      <li>
        <RouterLink to="/backend-integration">
          <ShieldCheck class="size-4" aria-hidden="true" />
          Backend integration
        </RouterLink>
      </li>
    </ul>

    <template v-if="enabled">
      <div class="my-1 h-px bg-base-300" />
      <DzButton
        variant="ghost"
        size="sm"
        block
        class="justify-start"
        :loading="isLoading && isAuthenticated"
        @click="signOut"
      >
        <LogOut class="size-4" aria-hidden="true" />
        Sign out
      </DzButton>
    </template>
  </DzDropdown>
</template>
