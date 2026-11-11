import type { Component } from 'vue'

const modules = import.meta.glob<{ default: Component }>('./demos/*.vue', { eager: true })

/**
 * Maps the registry's `demo` string (e.g. "ButtonDemo") to its SFC.
 */
export const demoMap: Record<string, Component> = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [
    path.split('/').pop()?.replace('.vue', '') ?? path,
    module.default,
  ]),
)

export function getDemo(name: string): Component | null {
  return demoMap[name] || null
}
