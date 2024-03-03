import { type TApplication as TApp } from 'cubes-ui'
import { type TConfig as TDashboardConfig } from 'cubes-dashboard'

interface TWindowsConfig {
  commonDashboardURL: string
  strategicCarousel: boolean
}
type TConfig = TDashboardConfig & TWindowsConfig

type TDashboardApplication = TApp<TConfig> //Omit<TApp, 'config'> & { config: TConfig & TApp['config'] }

export type { TDashboardApplication, TConfig }
