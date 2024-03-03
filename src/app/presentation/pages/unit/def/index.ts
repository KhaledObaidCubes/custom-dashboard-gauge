import { PlanIdEnum } from 'cubes-dashboard'
import { defineAsyncComponent, h } from 'vue'

const getHeaderComponent = (name: string) => {
  if (name == 'overview') {
    return h(greeting)
  } else if (name == 'strategic-plan') {
    return h(TableHeader, { planId: PlanIdEnum.strategic })
  } else if (name == 'executive-plan') {
    return h(TableHeader, { planId: PlanIdEnum.executive })
  } else if (name == 'government-common-kpis') {
    return h(TableHeader, { planId: PlanIdEnum.kpi })
  }
  return null
}

const greeting = defineAsyncComponent(() => import('../../../components/greeting-dashboard/index.vue'))
const TableHeader = defineAsyncComponent(() => import('../../../components/table-header/index.vue'))
export { getHeaderComponent }
