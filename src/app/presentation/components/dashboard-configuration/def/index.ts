import { PlanIdEnum } from 'cubes-dashboard'
import { PropType } from 'vue'

const props = {
  containerId: Number as PropType<PlanIdEnum>
}

export { props }
type TDashboardConfigurationComponentProps = typeof props
export type { TDashboardConfigurationComponentProps }
