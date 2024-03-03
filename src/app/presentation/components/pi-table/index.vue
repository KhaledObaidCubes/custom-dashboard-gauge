<template>
  <v-async ref="collapse" v-model="fetchModel" :promise="listObjectiveAsync" tag="div" class="table-responsive table-sticky h-100">
    <template #busy>
      <div style="height: 150px">
        <div class="d-flex h-100 w-100">
          <div class="m-auto">
            <v-spinner size="sm" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:ready="{ result: { success, fail } }">
      <template v-if="success">
        <table v-if="success?.length" class="table table-borderless mb-0" style="min-width: 700px">
          <thead class="thead">
            <tr class="border-bottom">
              <th width="47%" class="p-4">{{ tGlobal.name }}</th>
              <th class="p-4">{{ tGlobal.value }}</th>
              <th v-if="!isCommon" class="p-4">{{ tGlobal.target }}</th>
              <th v-if="!isCommon" class="p-4">{{ tGlobal.period }}</th>
              <th class="p-4">{{ tGlobal.status }}</th>
              <th class="align-middle text-center p-4" style="max-width: auto; width: 45px">{{ tGlobal.action }}</th>
            </tr>
          </thead>
          <v-collapse v-for="(item, idx) in success" v-show="showState[item.key] || item.isFirst" v-model="collapseModel[item.key]" model="open" :key="`${item.key}`" tag="tbody" body-tag="tr">
            <template #head="{ collapsed, collapsing }">
              <tr :class="`${collapsed && idx != success.length - 1 ? 'border-bottom' : ''}`">
                <td class="align-middle px-4">
                  <span class="d-flex align-items-center pr-2 text-reset" :style="`padding-${isRtl ? 'right' : 'left'}:${(item.key.split('-')[0].split('.').length - 1) * ROW_GAP}px`">
                    <v-collapse-toggle
                      :indicator="false"
                      tag="span"
                      class="d-inline has-pointer"
                      :style="{ 'pointer-events': collapsing || (planId == PlanIdEnum.kpi && item.sourceType == SourceTypeEnum.DirectInput) ? 'none' : '' }"
                      @click.prevent.stop="collapsing ? NOOP : expandPi(item.key, collapsed)"
                    >
                      <span class="collapse-indicator flip-right">
                        <v-icon
                          v-if="planId != PlanIdEnum.kpi || (planId == PlanIdEnum.kpi && (item.objectType == ObjectTypeEnum.Objective || item.sourceType == SourceTypeEnum.Formula))"
                          name="chevron-right"
                          class="mr-2"
                        />
                      </span>
                    </v-collapse-toggle>
                    <v-literal
                      v-fake-link
                      :modelValue="item.name"
                      :tag="planId != PlanIdEnum.kpi || (planId == PlanIdEnum.kpi && item.sourceType == SourceTypeEnum.Formula) ? 'span' : 'a'"
                      :style="{ 'pointer-events': planId == PlanIdEnum.kpi && item.objectType != ObjectTypeEnum.Objective && item.sourceType != SourceTypeEnum.Formula ? '' : 'none' }"
                      @click.stop="goToPIPage(item.id, item.objectType, item.parentId, item?.objectiveId)"
                    />
                  </span>
                </td>
                <td class="align-middle px-4">
                  {{ getValueWithDecimals(appService, item, item.history.last, true) }}
                </td>
                <td v-if="!isCommon" class="align-middle px-4">
                  {{ getValueWithDecimals(appService, item, item.history.last?.target, true) }}
                </td>
                <td v-if="!isCommon" class="align-middle px-4">
                  <v-date v-if="item.history.last && item.history.last?.date" :date="item.history.last?.date" :frequency="item.frequency" format="P" />
                  <span v-else>-</span>
                </td>
                <td class="align-middle px-4">
                  <v-badge v-if="item.history.last" pill subtle :accent="getBandLevel(item.history.last.band.level).accent">
                    {{ tGlobal.enum.band[groupPiStatus(item.history.last.band.level)] }}
                  </v-badge>
                  <span v-else>-</span>
                </td>
                <td class="align-middle text-nowrap text-center px-4" style="max-width: auto; width: 45px">
                  <a
                    v-if="planId != PlanIdEnum.kpi || (planId == PlanIdEnum.kpi && (item.objectType == ObjectTypeEnum.Objective || item.sourceType == SourceTypeEnum.Formula))"
                    v-fake-link
                    class="btn btn-outline-secondary btn-sm btn-icon tip tip-topright"
                    :aria-label="tGlobal.viewDetails"
                    @click.stop="goToPIPage(item.id, item.objectType, item.parentId, item?.objectiveId)"
                  >
                    <v-icon name="eye" />
                  </a>
                </td>
              </tr>
            </template>
            <v-async
              v-model="asyncModel[item.key]"
              :immediate="false"
              :promise="expandObjectiveAsync(item.id, idx, item.key, item?.objectiveId)"
              tag="td"
              class="align-middle p-0 border-0"
              colspan="6"
            >
              <template #busy>
                <div style="height: 150px">
                  <div class="d-flex h-100 w-100">
                    <div class="m-auto">
                      <v-spinner size="sm" />
                    </div>
                  </div>
                </div>
              </template>
              <template v-slot:ready="{ result: { success } }">
                <template v-if="success">
                  <template v-if="success.data">
                    <v-empty v-if="!success.data" key="empty" :title="'empty'" figure="empty" figure-width="200px" />
                    <v-row
                      v-else
                      :xs="{ cols: 1 }"
                      :lg="{ cols: isCommon ? 1 : 2 }"
                      class="mr-3"
                      :class="{ 'ml-3': !item.hasParent }"
                      :style="`margin-${isRtl ? 'right' : 'left'}:${(item.key.split('-')[0].split('.').length - 1) * ROW_TABLE_GAP}px`"
                    >
                      <v-col>
                        <v-card class="bg-secondary" :body-class="isCommon ? 'p-0' : ''">
                          <d-table
                            :title="tableConfig.kpisConfig.title"
                            :no-header="isCommon"
                            :source="success.data.pIs.map((p:any) => ({ ...p, parentId: item.id }))"
                            :col-config="tableConfig.kpisConfig.colConfig"
                          >
                            <template #empty>
                              <v-empty key="nodata" figure="nodata" figure-width="35%" :subtitle="tableConfig.kpisConfig.emptyState.value" />
                            </template>
                          </d-table>
                        </v-card>
                      </v-col>
                      <v-col v-if="!isCommon">
                        <v-card class="bg-secondary">
                          <d-table
                            :title="tableConfig.projectsConfig.title"
                            :source="success.data.projects.map((p:any) => ({ ...p, parentId: item.id }))"
                            :col-config="tableConfig.projectsConfig.colConfig"
                          >
                            <template #empty>
                              <v-empty key="nodata" figure="nodata" figure-width="35%" :subtitle="tableConfig.projectsConfig.emptyState.value" />
                            </template>
                          </d-table>
                        </v-card>
                      </v-col>
                    </v-row>
                  </template>
                  <v-empty v-else key="empty" :title="'empty'" figure="empty" figure-width="200px" />
                </template>
              </template>
            </v-async>
          </v-collapse>
        </table>
        <div v-else class="d-flex justify-content-center">
          <v-empty key="nodata" figure="nodata" figure-width="70%" :subtitle="tGlobal.emptyPiTable[planId]" />
        </div>
      </template>
      <v-empty v-else-if="fail" key="nodata" figure="error" :subtitle="tGlobal.errors.requestError" class="m-auto" />
    </template>
  </v-async>
</template>
<script lang="ts" setup>
import { IoC, NOOP } from 'cubes'
import { VNode, computed, h, ref, resolveComponent, toRef, watch } from 'vue'
import { TResult, IAppService } from 'cubes-ui'
import { serviceMap } from '../../../../service'
import {
  type ICustomDashboardService,
  type IHistoricalPI,
  type IHistoricalInitiative,
  PIProjectsList,
  getProjectBandAccent,
  ProjectBandLevelEnum,
  HistoricalPI,
  PlanIdEnum,
  getBandLevel,
  possibleMetaDataIds,
  getValueWithDecimals,
  groupPiStatus,
  IPIProjectsList,
  BandLevelEnum,
  SourceTypeEnum
} from 'cubes-dashboard'
import { ObjectTypeEnum } from 'cubes-app'
import { IAppContext } from '@/app/domain/meta/i-app'
import { IHistoricalPIService } from '@/app/service/meta/i-historica-pi.service'
import { IGetUnitObjectives } from '@/app/service/meta/api-args'
import { props as tableProps } from './def'
import { useRouter } from 'vue-router'

const props = defineProps(tableProps)
const unitId = toRef(props, 'unitId')
const planId = toRef(props, 'planId')

const router = useRouter()
const collapse = ref()
const fetchModel = ref(false)
const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IAppService,
  tGlobal = appContext.translation.global,
  customDashboardService = appContext.services[serviceMap.CustomDashboardService.key] as ICustomDashboardService,
  historicalPIService = appContext.services[serviceMap.HistoricalPIService.key] as IHistoricalPIService,
  showState = ref({}),
  ROW_GAP = 15,
  ROW_TABLE_GAP = 20,
  expandedPis = ref<{ [key: string]: string[] }>({}),
  collapseModel = ref({}),
  asyncModel = ref({}),
  lang = appService.application.state.ui.culture.lang

const isCommon = computed(() => !!planId.value && planId.value == PlanIdEnum.kpi)
const isRtl = computed(() => appService.application.state.ui.culture.dir == 'rtl')

const tableConfig = {
  kpisConfig: {
    objectType: ObjectTypeEnum.KPI,
    title: computed(() => `${tGlobal.value.kpis}`),
    emptyState: computed(() => tGlobal.value!.noKpis),
    colConfig: [
      {
        title: computed(() => tGlobal.value.kpi),
        sorted: isCommon.value ? undefined : () => ({ sortKey: 'name', position: 'Start', path: 'name' }),
        cellFactory: (item: IHistoricalPI): VNode =>
          h(
            resolveComponent('DObjectiveNameCell'),
            {
              onClick: () =>
                router.push({
                  name: 'kpi-details',
                  params: { id: item.id },
                  query: {
                    ...router.currentRoute.value.query,
                    unitId: router.currentRoute.value.params.id,

                    ...(item['parentId'] && { pid: item['parentId'] }),
                    ...(item['objectiveId'] && { objectiveId: item['objectiveId'] }),
                    plan: planId.value
                  }
                }),
              name: item.name[lang],
              tag: 'a',
              noBand: true
            },
            () => []
          ),
        attrs: { style: { width: '65%' } }
      },
      {
        title: computed(() => tGlobal.value.value),
        sorted: isCommon.value ? undefined : () => ({ sortKey: 'value', position: 'Start', path: 'history.last.value', altPath: `history.last.formattedValue.${lang}` }),
        cellFactory: (item: IHistoricalPI): VNode => h('span', null, getValueWithDecimals(appService, item, item.history.last, true)),
        attrs: { style: { width: '20%' } }
      },
      {
        title: computed(() => tGlobal.value.status),
        sorted: isCommon.value ? undefined : () => ({ sortKey: 'status', position: 'Start', path: 'history.last.band.level' }),
        cellFactory: (item: IHistoricalPI): VNode =>
          h(
            resolveComponent('VBadge'),
            {
              pill: true,
              subtle: true,
              accent: item.history.last ? getBandLevel(item.history.last.band.level).accent : undefined
            },
            () => (item.history.last ? `${tGlobal.value.enum.band[groupPiStatus(item.history.last.band.level)]}` : '-')
          ),
        attrs: { style: { width: '15%' } }
      }
    ]
  },
  projectsConfig: {
    objectType: ObjectTypeEnum.Project,
    title: computed(() => tGlobal.value.projects),
    emptyState: computed(() => tGlobal.value!.noProjects),
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
                  query: { ...router.currentRoute.value.query, plan: planId.value, unitId: router.currentRoute.value.params.id, ...(item['parentId'] && { pid: item['parentId'] }) }
                }),
              name: item.name[lang],
              tag: 'a',
              noBand: true
            },
            () => []
          ),
        attrs: { style: { width: '65%' } }
      },
      {
        title: computed(() => tGlobal.value.lastReportedValue),
        sorted: () => ({ sortKey: 'value', position: 'Start', path: 'history.last.value', altPath: `history.last.formattedValue.${lang}` }),
        cellFactory: (item: IHistoricalInitiative): VNode => h('span', null, item.history?.last?.value ? `${item.history.last.value} %` : tGlobal.value.notEntered),
        attrs: { style: { width: '20%' } }
      },
      {
        title: computed(() => tGlobal.value.status),
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
        },
        attrs: { style: { width: '15%' } }
      }
    ]
  }
}

const goToPIPage = (id: string, objectType: ObjectTypeEnum, parentId?: string, objectiveId?: string) => {
  router.push({
    name: planId.value != PlanIdEnum.kpi || objectType == ObjectTypeEnum.Objective ? 'objective-summary' : 'kpi-details',
    params: { id },
    query: {
      ...router.currentRoute.value.query,
      unitId: router.currentRoute.value.params.id,
      ...(parentId && { pid: parentId }),
      ...(objectiveId && planId.value == PlanIdEnum.kpi && objectType == ObjectTypeEnum.KPI && { objectiveId }),
      plan: planId.value
    }
  })
}

const dataMapper = (data: IHistoricalPI[], expanded?: boolean, parentKey?: string, parentId?: string, objectiveId?: string) => {
  const t = [] as ({ key: string; isFirst?: boolean; count?: number; hasParent?: boolean; parentId?: string; objectiveId?: string } & IHistoricalPI)[]
  data.forEach((d: IHistoricalPI, piIdx) => {
    d.history.forEach((_h: any, idx: number) => {
      const parentKeyLevel = parentKey?.split('-')[0]
      t.push({
        isFirst: expanded ? false : idx == 0,
        count: d.history.length,
        key: expanded ? `${parentKeyLevel}.${piIdx}-${d.id}` : `${piIdx}-${d.id}`,
        hasParent: !!expanded && !idx,
        parentId: parentId,
        objectiveId: d.objectType == ObjectTypeEnum.Objective ? d.id : objectiveId,
        ...(new HistoricalPI({ ...d }) as IHistoricalPI)
      })
    })
    collapseModel.value[expanded ? `${parentKey?.split('-')[0]}.${piIdx}-${d.id}` : `${piIdx}-${d.id}`] = ''
    asyncModel.value[expanded ? `${parentKey?.split('-')[0]}.${piIdx}-${d.id}` : `${piIdx}-${d.id}`] = false
  })
  return t
}

const expandObjectiveAsync = (id: string, idx: number, key: string, objectiveId?: string) => {
  return () => () => {
    return new Promise<TResult<any> | boolean>(async (resolve, reject) => {
      try {
        const result = await customDashboardService.expandObjective(id)
        const data = result.data as PIProjectsList
        let objectives = []
        if (planId.value == PlanIdEnum.kpi || data.pIs.some(pi => pi.objectType == ObjectTypeEnum.Objective)) {
          objectives.push(
            ...dataMapper(
              (result.data as PIProjectsList).pIs.filter(pi => (planId.value == PlanIdEnum.kpi ? ObjectTypeEnum.KPI : pi.objectType == ObjectTypeEnum.Objective)),
              true,
              key,
              id,
              objectiveId
            )
          )
          expandedPis.value[key] = objectives.map((obj: any) => obj.key)
          collapse.value.success.splice(idx + 1, 0, ...objectives)
          objectives.forEach(d => (showState.value[d.key] = 'open'))
        } else (result.data as IPIProjectsList).pIs = (result.data as IPIProjectsList).pIs.map(p => ({ ...p, objectiveId: id }))

        resolve(planId.value == PlanIdEnum.kpi || objectives.length ? false : result)
      } catch (error) {
        reject('No')
      }
    })
  }
}

const listObjectiveAsync = () => () => {
  return new Promise<any[]>(async (resolve, reject) => {
    try {
      const result = await historicalPIService.listObjectives({ Limit: 0, Offset: 0, planID: planId.value, unitID: unitId!.value } as IGetUnitObjectives)
      const data = dataMapper(result.data as IHistoricalPI[])
      resolve(data)
    } catch (error) {
      reject('No')
    }
  })
}

const expandPi = async (key: string, collapsed: boolean) => {
  collapseModel.value[key] = collapsed ? 'open' : ''
  if (expandedPis.value[key] && expandedPis.value[key].length) {
    asyncModel.value[key] = false
    if (collapsed) expandedPis.value[key].forEach(itemKey => (showState.value[itemKey] = true))
    else closeExpands(key)
  } else {
    asyncModel.value[key] = collapsed
  }
}

const closeExpands = (key: string) => {
  expandedPis.value[key].forEach(itemKey => {
    if (expandedPis.value[itemKey] && expandedPis.value[itemKey].length && collapseModel.value[itemKey]) closeExpands(itemKey)
    collapseModel.value[itemKey] = ''
    showState.value[itemKey] = false
  })
}

watch(
  () => unitId!.value,
  () => (fetchModel.value = true)
)
</script>
