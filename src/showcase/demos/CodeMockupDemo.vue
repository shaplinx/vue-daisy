<script setup>
import { useDemoMode } from '@/showcase/useDemoMode'

const mode = useDemoMode()

const installLines = [
  { text: 'npm create vite@latest my-app -- --template vue', prefix: '$' },
  { text: 'cd my-app', prefix: '$' },
  { text: 'npm install', prefix: '$' },
  { text: 'npm install daisyui @tailwindcss/vite', prefix: '$', class: 'text-warning' },
  { text: 'npm run dev', prefix: '$' },
]

const configLines = [
  { text: "import { defineConfig } from 'vite'", prefix: '1' },
  { text: "import vue from '@vitejs/plugin-vue'", prefix: '2' },
  { text: "import tailwindcss from '@tailwindcss/vite'", prefix: '3' },
  { text: '', prefix: '4' },
  { text: 'export default defineConfig({', prefix: '5' },
  { text: '  plugins: [vue(), tailwindcss()],', prefix: '6', class: 'text-success' },
  { text: '})', prefix: '7' },
]

const gitLines = [
  'git checkout -b feature/showcase',
  'git add .',
  'git commit -m "feat: add mockups"',
  'git push origin HEAD',
]
</script>

<template>
  <div v-if="mode !== 'variants'" class="space-y-3">
    <DzCodeMockup :lines="installLines" />
    <p class="text-xs text-base-content/60">
      Each line can be a string or an object with a custom <code>prefix</code> and highlight <code>class</code>.
    </p>
  </div>

  <div v-else class="space-y-6">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Line numbers</p>
      <DzCodeMockup :lines="configLines" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Simple strings</p>
      <DzCodeMockup :lines="gitLines" />
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-widest opacity-50">Custom content slot</p>
      <DzCodeMockup>
        <pre data-prefix="~"><code class="text-info">curl https://api.example.com/health</code></pre>
        <pre data-prefix="→" class="text-success"><code>{ "status": "ok" }</code></pre>
      </DzCodeMockup>
    </div>
  </div>
</template>
