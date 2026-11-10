<script setup>
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const toast = useToast()
const code = ref('')
const shortCode = ref('')
const joinedCode = ref('')

function verify(value) {
  toast.success(`Code ${value} submitted`)
}
</script>

<template>
  <div v-if="mode !== 'variants'" class="max-w-md space-y-5">
    <div class="form-control">
      <span class="label-text mb-1">Verification code</span>
      <DzOtp v-model="code" :length="6" @complete="verify" />
      <p class="mt-2 text-xs text-base-content/60">
        Paste a code to fill every box at once. The complete event fires when all six digits are present.
      </p>
    </div>
    <p class="text-xs text-base-content/60">
      Current value: <span class="badge badge-ghost badge-sm">{{ code || '—' }}</span>
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Lengths</p>
      <div class="space-y-4">
        <DzOtp v-model="shortCode" :length="4" />
        <DzOtp :model-value="'12345678'" :length="8" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes &amp; colors</p>
      <div class="space-y-4">
        <DzOtp :model-value="'246810'" size="sm" color="primary" />
        <DzOtp :model-value="'135790'" size="lg" color="secondary" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Joined &amp; states</p>
      <div class="space-y-4">
        <DzOtp v-model="joinedCode" joined :length="6" />
        <DzOtp :model-value="'1234'" :length="4" disabled />
      </div>
    </div>
  </div>
</template>
