import { computed, reactive, readonly, watch } from 'vue'

export const THEMES = [
  { name: 'light', label: 'Light', colorScheme: 'light' },
  { name: 'dark', label: 'Dark', colorScheme: 'dark' },
  { name: 'corporate', label: 'Corporate', colorScheme: 'light' },
  { name: 'business', label: 'Business', colorScheme: 'dark' },
  { name: 'cupcake', label: 'Cupcake', colorScheme: 'light' },
  { name: 'dracula', label: 'Dracula', colorScheme: 'dark' },
]

const STORAGE_KEY = 'vue-daisy:theme'
const DEFAULT_THEME = 'light'

function readStoredTheme() {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return THEMES.some((theme) => theme.name === stored) ? stored : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

const state = reactive({
  theme: readStoredTheme(),
})

const themeNames = THEMES.map((theme) => theme.name)

function setTheme(theme) {
  state.theme = themeNames.includes(theme) ? theme : DEFAULT_THEME
}

function toggleTheme() {
  setTheme(state.theme === 'dark' ? 'light' : 'dark')
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', theme)
  const meta = THEMES.find((item) => item.name === theme)
  document.documentElement.style.colorScheme = meta?.colorScheme || 'light'
}

watch(
  () => state.theme,
  (theme) => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme))
    } catch {
      // Storage may be unavailable (private mode); the in-memory theme still works.
    }
  },
  { immediate: true },
)

// Keep multiple tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      const next = JSON.parse(event.newValue)
      if (themeNames.includes(next) && next !== state.theme) state.theme = next
    } catch {
      // Ignore malformed values written by other scripts.
    }
  })
}

const currentTheme = computed(() => THEMES.find((theme) => theme.name === state.theme))
const isDark = computed(() => currentTheme.value?.colorScheme === 'dark')

export function useTheme() {
  return {
    themes: THEMES,
    theme: computed(() => state.theme),
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
