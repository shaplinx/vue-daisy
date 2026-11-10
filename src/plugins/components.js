const modules = import.meta.glob('../components/ui/**/*.vue', { eager: true })

export const uiComponents = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const name = path.split('/').pop().replace('.vue', '')
    return [name, module.default]
  }),
)

export function registerUiComponents(app) {
  for (const [name, component] of Object.entries(uiComponents)) {
    app.component(name, component)
  }
}
