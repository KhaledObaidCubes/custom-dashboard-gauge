<template>
  <d-page-project-details :crumbs="crumbs" @item-changed="setItem">
    <template #status="data">
      <div :class="getClass(data.data)">
        <b>
          <v-icon name="circle" />
          &nbsp;
          <v-literal
            v-if="data.data.history.last.metadata.find((m: any) => m.id == possibleMetaDataIds['status'])"
            :modelValue="data.data.history.last.metadata.find((m: any) => m.id == possibleMetaDataIds['status']).values[0].value"
          />
          <span v-else>{{ tGlobal.enum.band[BandLevelEnum.Undefined] }}</span>
        </b>
      </div>
    </template>
  </d-page-project-details>
</template>
<script lang="ts" setup>
import { IAppContext } from '@/app/domain/meta/i-app'
import { IHistoricalPIService } from '@/app/service/meta/i-historica-pi.service'
import { serviceMap } from '@/service'
import { IoC, THashMap, mockPromise_200, uid } from 'cubes'
import { getProjectBandAccent, PlanIdEnum, ProjectBandLevelEnum, possibleMetaDataIds, BandLevelEnum, IHistoricalPI } from 'cubes-dashboard'
import { Ref, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  historicalPIService = IoC.DI().resolve<IHistoricalPIService>(serviceMap.HistoricalPIService.key),
  tGlobal = appContext.translation.global,
  projectName = ref({}) as Ref<THashMap>,
  objectiveName = ref({}) as Ref<THashMap>,
  router = useRouter()

const getClass = (data: any) => {
  return `mb-3 text-${
    getProjectBandAccent[
      data.history.last.metadata.find((m: any) => m.id == possibleMetaDataIds['status'])
        ? data.history.last.metadata.find((m: any) => m.id == possibleMetaDataIds['status'])!.values[0].id
        : ProjectBandLevelEnum.NotReported
    ]
  }`
}

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
      name: 'objective-summary',
      meta: {
        id: uid(),
        ...(objectiveName.value && {
          promise: () => async () => ((await historicalPIService.getPIAsync(query.pid as string)).data as IHistoricalPI).name,
          params: { id: query.pid },
          query: { unitId, plan: router.currentRoute.value.query.plan, ...(router.currentRoute.value.query.period && { period: router.currentRoute.value.query.period }) }
        })
      }
    } as any)

  arr.push({
    name: name,
    params,
    query,
    meta: { id: uid(), ...(projectName.value && { promise: () => () => mockPromise_200(200, projectName.value) }) }
  } as any)
  return arr
})

const setItem = (value: any) => {
  projectName.value = { ...value.name }
  objectiveName.value = { ...value.objective.name }
}
</script>
