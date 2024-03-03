import { PropType } from 'vue'
import type { THashMap } from 'cubes'

const props = {
  strategy: Object as PropType<THashMap>,
  value: String,
  primaryColor: { type: String, default: '#dd5c65' },
  secondaryColor: { type: String, default: '#f7e1e3' },
  height: Number
}

export { props }

type TStrategyGaugeProps = typeof props
export type { TStrategyGaugeProps }
