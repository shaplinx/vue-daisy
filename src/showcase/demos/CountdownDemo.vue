<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RotateCcw, Timer } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()
const seconds = ref(12)
const running = ref(true)
let timer

function reset() {
  seconds.value = 12
  running.value = true
}

onMounted(() => {
  timer = setInterval(() => {
    if (!running.value) return
    seconds.value = seconds.value > 0 ? seconds.value - 1 : 12
  }, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div v-if="mode !== 'variants'" class="flex flex-wrap items-center gap-6">
    <div class="rounded-box border border-base-300 bg-base-200/50 px-6 py-4 text-center">
      <DzCountdown :value="seconds" :min-digits="2" size="lg" color="primary" label="Countdown timer" />
      <p class="mt-2 text-xs opacity-60">Live countdown</p>
    </div>
    <div class="flex items-center gap-2">
      <DzButton size="sm" variant="outline" @click="running = !running">
        <template #icon><Timer class="size-4" aria-hidden="true" /></template>
        {{ running ? 'Pause' : 'Resume' }}
      </DzButton>
      <DzButton size="sm" variant="ghost" @click="reset">
        <template #icon><RotateCcw class="size-4" aria-hidden="true" /></template>
        Reset
      </DzButton>
    </div>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Values &amp; min digits</p>
      <div class="flex flex-wrap items-end gap-6">
        <DzCountdown :value="7" size="lg" />
        <DzCountdown :value="42" :min-digits="2" size="lg" color="secondary" />
        <DzCountdown :value="128" :min-digits="3" size="lg" color="accent" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Sizes</p>
      <div class="flex flex-wrap items-end gap-6">
        <DzCountdown v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" :value="9" :size="size" :label="`Size ${size}`" />
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Colors</p>
      <div class="flex flex-wrap items-end gap-6">
        <DzCountdown v-for="color in ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error']" :key="color" :value="5" :color="color" :label="color" />
      </div>
    </div>
  </div>
</template>
