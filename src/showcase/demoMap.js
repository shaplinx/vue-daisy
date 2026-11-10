const modules = import.meta.glob('./demos/*.vue', { eager: true })

/**
 * Maps the registry's `demo` string (e.g. "ButtonDemo") to its SFC.
 */
export const demoMap = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [
    path.split('/').pop().replace('.vue', ''),
    module.default,
  ]),
)

export function getDemo(name) {
  return demoMap[name] || null
}
