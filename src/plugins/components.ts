import type { App, Component } from 'vue'

const modules = import.meta.glob<{ default: Component }>('../components/ui/**/*.vue', {
  eager: true,
})

/** Globally registered UI components, keyed by file name (e.g. `DzButton`). */
export const uiComponents: Record<string, Component> = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const name = path.split('/').pop()?.replace('.vue', '')
    return [name ?? path, module.default]
  }),
)

export function registerUiComponents(app: App): void {
  for (const [name, component] of Object.entries(uiComponents)) {
    app.component(name, component)
  }
}
