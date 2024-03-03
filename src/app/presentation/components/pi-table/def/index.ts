import { PlanIdEnum } from 'cubes-dashboard'

const props = {
  unitId: { type: String, required: true },
  planId: { type: Number, default: () => PlanIdEnum.strategic, required: true }
}
export { props }
type TExecutiveTableComponentProps = typeof props
export type { TExecutiveTableComponentProps }
