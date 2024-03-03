import { IOrgUnit } from 'cubes-app'
import { PropType } from 'vue'

const props = {
  modelValue: { type: Array as PropType<IOrgUnit[]>, default: [], required: true }
}

export { props }
type TOrgUnitPickerComponentProps = typeof props
export type { TOrgUnitPickerComponentProps }
