<template>
  <d-page-kpi-details :crumbs="crumbs" @item-changed="setItem" />
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { Ref, computed, ref } from 'vue'
import { IoC, THashMap, mockPromise_200, uid } from 'cubes'
import { IHistoricalPI, PlanIdEnum } from 'cubes-dashboard'
import { IHistoricalPIService } from '@/app/service/meta/i-historica-pi.service'
import { serviceMap } from '@/service'

const router = useRouter()
const kpiName = ref({ ar: '-', en: '-' }) as Ref<THashMap>
const historicalPIService = IoC.DI().resolve<IHistoricalPIService>(serviceMap.HistoricalPIService.key)
const impactedPIs = ref([]) as Ref<any[]>

const crumbs = computed((): any[] => {
  const { name, params, query } = router.currentRoute.value
  const arr = [
    {
      name: 'overview',
      meta: {
        id: uid(),
        promise: () => () => Promise.resolve({ en: 'Dashboard Overview', ar: 'نظرة عامة على واجهة قياس الأداء' }),
        params: {},
        query: { ...(query.period && { period: query.period }) }
      }
    }
  ]
  const unitId = <string>query.unitId || ''
  if (query.plan && +query.plan === PlanIdEnum.executive) {
    arr.push({
      name: 'executive-plan',
      meta: { id: uid(), params: { id: unitId }, query: { ...(query.period && { period: query.period }) }, promise: () => () => Promise.resolve({ en: 'Executive Plan', ar: 'الخطة التنفيذية' }) }
    } as any)
  } else if (query.plan && +query.plan === PlanIdEnum.strategic) {
    arr.push({
      name: 'strategic-plan',
      meta: { id: uid(), params: { id: unitId }, query: { ...(query.period && { period: query.period }) }, promise: () => () => Promise.resolve({ en: 'Strategic Plan', ar: 'الخطة الإستراتيجية' }) }
    } as any)
  } else {
    arr.push({
      name: 'government-common-kpis',
      meta: {
        id: uid(),
        params: { id: unitId },
        query: { ...(query.period && { period: query.period }) },
        promise: () => () => Promise.resolve({ en: 'Government Common KPIs', ar: 'مؤشرات قياس الأداء الحكومية الموحدة' })
      }
    } as any)
  }
  query.pid &&
    arr.push({
      name: query.pid == query.objectiveId || !query.objectiveId ? 'objective-summary' : 'kpi-details',
      meta: {
        id: uid(),
        promise: () => async () => ((await historicalPIService.getPIAsync(query.pid as string)).data as IHistoricalPI).name,
        params: { id: query.pid },
        query: {
          unitId: unitId,
          ...(router.currentRoute.value.query.objectiveId && { objectiveId: router.currentRoute.value.query.objectiveId }),
          ...(router.currentRoute.value.query.period && { period: router.currentRoute.value.query.period }),
          plan: router.currentRoute.value.query.plan
        }
      }
    } as any)

  arr.push({
    name: name,
    params,
    query,
    meta: {
      id: uid(),
      ...(kpiName.value && { promise: () => () => mockPromise_200(200, kpiName.value) })
    }
  } as any)
  return arr
})

const setItem = (value: { name: THashMap; impactedPIs: [] }) => {
  kpiName.value = { ...value.name }
  impactedPIs.value = [...value.impactedPIs]
}
</script>
