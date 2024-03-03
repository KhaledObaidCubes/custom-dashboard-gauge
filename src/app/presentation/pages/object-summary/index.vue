<template>
  <d-page-objective-summary :crumbs="crumbs" @name-changed="setName">
    <template #header-content="{ objective }">
      <span class="mb-4">
        <b>{{ tObjectSummary.organizationUnit }}:</b> {{ objective.data.unit.name[appService.application.state.ui.culture.lang] }}
      </span>
    </template>
    <template #pi-table="{ listData }">
      <d-table :title="linkedKPIsTableConfig.title" :source="listData.data.pIs" :col-config="linkedKPIsTableConfig.colConfig">
        <template #empty>
          <v-empty key="nodata" figure="nodata" figure-width="35%" :subtitle="tGlobal.noKpis" />
        </template>
      </d-table>
    </template>
    <template #project-table="{ listData }">
      <d-table :title="linkedProjectsTableConfig.title" :source="listData.data.projects" :col-config="linkedProjectsTableConfig.colConfig">
        <template #empty>
          <v-empty key="nodata" figure="nodata" figure-width="35%" :subtitle="tGlobal.noProjects" />
        </template>
      </d-table>
    </template>
  </d-page-objective-summary>
</template>
<script lang="ts" setup>
import { HistoricalPI, getValueWithDecimals, getProjectBandAccent, ProjectBandLevelEnum, PlanIdEnum, possibleMetaDataIds, groupPiStatus, BandLevelEnum } from 'cubes-dashboard'
import { IHistoricalInitiative } from 'cubes-dashboard'
import { computed, h, ref, resolveComponent, toRefs, VNode } from 'vue'
import { useRouter } from 'vue-router'
import type { TTableColumnConfig } from 'cubes-dashboard'
import { IAppContext, IAppService, useTranslation } from 'cubes-ui'
import { IoC, mockPromise_200, uid } from 'cubes'
import { serviceMap } from '../../../../service'
import { Ti18n, i18nMap } from '../../../../i18n'
import { TObjectSummaryTranslation } from '../../../../i18n/index'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IAppService,
  tGlobal = appContext.translation.global,
  { 'tObject-summary': tObjectSummary } = toRefs(useTranslation<Ti18n>(appService, [i18nMap['object-summary']]) as unknown as { 'tObject-summary': TObjectSummaryTranslation }),
  router = useRouter()
const piName = ref({ ar: '-', en: '-' }),
  lang = appService.application.state.ui.culture.lang

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
    },
    {
      name: name,
      params,
      query,
      meta: { id: uid(), ...(piName.value && { promise: () => () => mockPromise_200(200, piName.value) }) }
    }
  ]
  const unitId = <string>query.unitId || ''
  if (query.plan && +query.plan === PlanIdEnum.executive) {
    arr.splice(arr.length - 1, 0, {
      name: 'executive-plan',
      meta: {
        id: uid(),
        params: { id: unitId },
        query: {
          ...(query.period && { period: query.period })
        },
        promise: () => () => Promise.resolve({ en: 'Executive Plan', ar: 'الخطة التنفيذية' })
      } as any
    })
  } else if (query.plan && +query.plan === PlanIdEnum.strategic) {
    arr.splice(arr.length - 1, 0, {
      name: 'strategic-plan',
      meta: {
        id: uid(),
        params: { id: unitId },
        query: { ...(query.period && { period: query.period }) },
        promise: () => () => Promise.resolve({ en: 'Strategic Plan', ar: 'الخطة الإستراتيجية' })
      } as any
    })
  } else {
    arr.splice(arr.length - 1, 0, {
      name: 'government-common-kpis',
      meta: {
        id: uid(),
        params: { id: unitId },
        query: { ...(query.period && { period: query.period }) },
        promise: () => () => Promise.resolve({ en: 'Government Common KPIs', ar: 'مؤشرات قياس الأداء الحكومية الموحدة' })
      } as any
    })
  }
  return arr
})

const linkedKPIsTableConfig = {
  title: computed(() => tObjectSummary.value.linkedPIs),
  colConfig: [
    {
      title: computed(() => tObjectSummary.value.pI),
      sorted: () => ({ sortKey: 'name', position: 'Start', path: 'name' }),
      cellFactory: (item: HistoricalPI): VNode =>
        h(
          resolveComponent('DObjectiveNameCell'),
          {
            onClick: () =>
              router.push({
                name: 'kpi-details',
                params: { id: item.id },
                query: {
                  ...router.currentRoute.value.query,
                  unitId: router.currentRoute.value.query.unitId,
                  pid: router.currentRoute.value.params.id,
                  objectiveId: router.currentRoute.value.params.id,
                  plan: router.currentRoute.value.query.plan,
                  ...(router.currentRoute.value.query.period && { period: router.currentRoute.value.query.period })
                }
              }),
            name: item.name[lang],
            accent: item.history[0].band.badgeProps.accent,
            tag: 'a',
            noBand: true
          },
          () => []
        )
    },
    {
      title: computed(() => tGlobal.value.weight),
      sorted: () => ({ sortKey: 'weight', position: 'Start', path: 'history.last.target.value', altPath: `history.last.target.formattedValue.${lang}` }),
      cellFactory: (item: HistoricalPI): VNode => h('span', null, getValueWithDecimals(appService, item, item.history.last?.target, true))
    },
    {
      title: computed(() => tGlobal.value.value),
      sorted: () => ({ sortKey: 'value', position: 'Start', path: 'history.last.value', altPath: `history.last.formattedValue.${lang}` }),
      cellFactory: (item: HistoricalPI): VNode => h('span', null, getValueWithDecimals(appService, item, item.history.last, true))
    },
    {
      title: computed(() => tObjectSummary.value.status),
      sorted: () => ({ sortKey: 'status', position: 'Start', path: 'history.last.band.level' }),
      cellFactory: (item: HistoricalPI): VNode =>
        h(
          resolveComponent('VBadge'),
          {
            accent: item.history[0].band.badgeProps.accent,
            pill: true,
            subtle: true
          },
          () => [tGlobal.value.enum.band[groupPiStatus(item.history[0].band.level)]]
        )
    }
  ] as unknown as TTableColumnConfig<HistoricalPI>[]
}

const linkedProjectsTableConfig = {
  title: computed(() => tObjectSummary.value.linkedProjects),
  colConfig: [
    {
      title: computed(() => tGlobal.value.project),
      sorted: () => ({ sortKey: 'name', position: 'Start', path: 'name' }),
      cellFactory: (item: IHistoricalInitiative): VNode =>
        h(
          resolveComponent('DObjectiveNameCell'),
          {
            onClick: () =>
              router.push({
                name: 'project-details',
                params: { id: item.id },
                query: {
                  ...router.currentRoute.value.query,
                  unitId: router.currentRoute.value.query.unitId,
                  pid: router.currentRoute.value.params.id,
                  plan: router.currentRoute.value.query.plan,
                  ...(router.currentRoute.value.query.period && { period: router.currentRoute.value.query.period })
                }
              }),
            name: item.name[lang],
            tag: 'a',
            noBand: true
          },
          () => []
        )
    },
    {
      title: computed(() => tObjectSummary.value.lastReportedValue),
      sorted: () => ({ sortKey: 'value', position: 'Start', path: 'history.last.value', altPath: `history.last.formattedValue.${lang}` }),
      cellFactory: (item: IHistoricalInitiative): VNode => h('span', null, item.history?.last?.value ? `${item.history.last.value} %` : tGlobal.value.notEntered)
    },
    {
      title: computed(() => tObjectSummary.value.status),
      sorted: () => ({ sortKey: 'status', position: 'Start', path: 'history.last.metadata.0.values.0.id', altPath: tGlobal.value.noValue }),
      cellFactory: (item: IHistoricalInitiative): VNode => {
        const statusMetaData = item.history[0].metadata.find(m => m.id == possibleMetaDataIds['status'])
        return h(
          resolveComponent('VBadge'),
          {
            accent: getProjectBandAccent[statusMetaData ? statusMetaData!.values[0].id : ProjectBandLevelEnum.NotReported],
            pill: true,
            subtle: true
          },
          () => [
            h(
              statusMetaData ? resolveComponent('VLiteral') : 'span',
              statusMetaData ? { modelValue: statusMetaData?.values[0].value } : {},
              statusMetaData ? () => [] : tGlobal.value.enum.band[BandLevelEnum.Undefined]
            )
          ]
        )
      }
    }
  ] as unknown as TTableColumnConfig<IHistoricalInitiative>[]
}

const setName = (name: any) => (piName.value = { ...name })
</script>
