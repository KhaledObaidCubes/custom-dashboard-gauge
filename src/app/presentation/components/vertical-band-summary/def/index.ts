import { IProjectBandCount, IPiCompletedBandCount } from 'cubes-dashboard'
import { PropType } from 'vue'

const props = {
  total: Number,
  title: String,
  subtitle: String,
  counters: Object as PropType<IPiCompletedBandCount & IProjectBandCount>,
  project: Boolean
}

type TBandsSummaryProps = typeof props
export { props }
export type { TBandsSummaryProps }
