import type { TConfig, TDashboardApplication } from '../meta/i-application'

import { Application as App } from 'cubes-ui'

class DashboardApplication extends App<TConfig> implements TDashboardApplication {
  public deserialize(props: Partial<TDashboardApplication> = {}): void {
    super.deserialize(props)
    
  }
}
const sym_chain = Symbol('cubes-use-chain-context')
export { DashboardApplication, sym_chain }
