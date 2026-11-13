import type { AxiosInstance } from 'axios'
import type { AuthConfig } from './auth.types'
import type { AuthDriverInterface } from './drivers/AuthDriver'
import { NoAuthDriver } from './drivers/NoAuthDriver'
import { SanctumSpaDriver } from './drivers/SanctumSpaDriver'
import { SanctumTokenDriver } from './drivers/SanctumTokenDriver'

/**
 * Create the driver selected by the resolved configuration.
 *
 * The factory is the only place that knows concrete driver classes; the rest
 * of the application depends on `AuthDriverInterface`.
 */
export function createAuthDriver(
  config: AuthConfig,
  http: AxiosInstance,
): AuthDriverInterface {
  switch (config.driver) {
    case 'sanctum-spa':
      return new SanctumSpaDriver(config, http)
    case 'sanctum-token':
      return new SanctumTokenDriver(config, http)
    case 'none':
      return new NoAuthDriver()
    default: {
      const unknown: never = config.driver
      throw new Error(`[auth] Unsupported authentication driver: ${String(unknown)}`)
    }
  }
}
