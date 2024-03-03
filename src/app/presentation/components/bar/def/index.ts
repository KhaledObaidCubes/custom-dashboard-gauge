import { PropType } from 'vue'
import { TBarUnit } from '../meta'

const props = {
  units: Array as PropType<TBarUnit[]>,
  iconString: String,
  title: String
}
export { props }
type TBarComponentProps = typeof props
export type { TBarComponentProps }
