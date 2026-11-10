<script setup>
import { Blocks } from '@lucide/vue'
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const columns = [
  {
    title: 'Product',
    links: ['Overview', 'Components', 'Roadmap', 'Changelog'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Examples', 'Themes', 'Support'],
  },
  {
    title: 'Company',
    links: ['About', 'Blog', 'Careers', 'Contact'],
  },
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-6">
    <DzFooter class="rounded-box border border-base-300 p-6">
      <aside class="max-w-xs">
        <div class="flex items-center gap-2 text-base font-semibold">
          <Blocks class="size-5 text-primary" aria-hidden="true" />
          Vue Daisy
        </div>
        <p class="mt-2 text-sm text-base-content/60">
          Accessible Vue 3 components styled with Tailwind CSS and DaisyUI.
        </p>
      </aside>
      <nav v-for="column in columns" :key="column.title">
        <h6 class="footer-title">{{ column.title }}</h6>
        <a v-for="link in column.links" :key="link" class="link link-hover" href="#">{{ link }}</a>
      </nav>
    </DzFooter>
    <p class="text-xs text-base-content/60">
      Footer sections automatically wrap into columns on wider screens.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Default (vertical)</p>
      <DzFooter class="rounded-box border border-base-300 p-6">
        <aside>
          <p class="font-semibold">Vue Daisy</p>
          <p class="text-xs opacity-60">© 2026 Vue Daisy</p>
        </aside>
        <nav>
          <h6 class="footer-title">Legal</h6>
          <a class="link link-hover" href="#">Privacy</a>
          <a class="link link-hover" href="#">Terms</a>
        </nav>
      </DzFooter>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Horizontal</p>
      <DzFooter horizontal class="rounded-box border border-base-300 p-6">
        <aside>
          <p class="text-sm">© 2026 Vue Daisy · Built with Vue and DaisyUI</p>
        </aside>
        <nav>
          <a class="link link-hover" href="#">Privacy</a>
          <a class="link link-hover" href="#">Terms</a>
          <a class="link link-hover" href="#">Status</a>
        </nav>
      </DzFooter>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Centered</p>
      <DzFooter center class="rounded-box border border-base-300 p-6">
        <aside class="text-center">
          <p class="font-semibold">Vue Daisy</p>
          <p class="text-xs opacity-60">A component library for admin interfaces.</p>
        </aside>
        <nav class="justify-center">
          <a class="link link-hover" href="#">Docs</a>
          <a class="link link-hover" href="#">GitHub</a>
          <a class="link link-hover" href="#">Discord</a>
        </nav>
      </DzFooter>
    </div>
  </div>
</template>
