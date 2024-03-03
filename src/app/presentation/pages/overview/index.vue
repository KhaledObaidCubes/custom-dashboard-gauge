<template>
  <app-layout-base :promise="promise" :url-info="{ query: 'period' }" tag="div" @change="onRouteChanged">
    <template #top-right>
      <d-date-view :query="routeInfo.query"></d-date-view>
    </template>
    <template #ready="{ result: { data } }">
      <v-card body-class="p-0" header-class="py-4">
        <template #header>
          <div class="d-flex justify-content-between mt-2">
            <h4 class="w-75 text-muted">{{ unit[0]?.name ? tUintOverview.unitOverview(unit[0]?.name[appState.ui.culture.lang]) : '' }}</h4>
            <v-async :promise="getPIAsync">
              <template #busy>
                <v-spinner size="sm" />
              </template>
              <template v-slot:ready="{ result: { success } }">
                <div v-if="success" class="d-flex justify-content-between align-items-center">
                  <h1 class="text-muted">{{ calculatePerformancePercentage(success.data) }}</h1>
                  <h6 class="ml-3 text-muted">{{ tUintOverview.performancePercentage }}</h6>
                </div>
              </template>
            </v-async>
          </div>
        </template>
        <v-row>
          <v-col :xs="9">
            <v-row>
              <v-col :xs="3" class="border-right p-4">
                <d-pie :units="priorityPie.units" :total="priorityPie.total" icon-string="cubes-priority" :title="tUintOverview.totalPriority" :radius="['70%', '75%']" />
              </v-col>
              <v-col :xs="3" class="border-right p-4">
                <d-pie :units="objectivesPie.units" :total="objectivesPie.total" icon-string="cubes-objectives-large" :title="tUintOverview.totalObjectives" :radius="['70%', '75%']" />
              </v-col>
              <v-col :xs="3" class="border-right p-4">
                <d-pie :units="kpIPie.units" :total="kpIPie.total" icon-string="cubes-kpis-large" :title="tUintOverview.totalKpis" :radius="['70%', '75%']" />
              </v-col>
              <v-col :xs="3" class="border-right p-4">
                <d-pie :units="projectPie.units" :total="projectPie.total" icon-string="cubes-initiatives-large" :title="tUintOverview.totalProjects" :radius="['70%', '75%']" />
              </v-col>
            </v-row>
          </v-col>
          <v-col :xs="3" class="p-4">
            <bar :units="spendingBarChart" :title="tUintOverview.spending" icon-string="cubes-spending-large" />
          </v-col>
        </v-row>
      </v-card>
      <v-card body-class="p-0" header-class="bg-secondary  p-0" class="h-100">
        <template #header>
          <v-animated
            is="a"
            v-fake-link
            :hover="{ backgroundColor: getColor(), color: 'white' }"
            :transition="{ easing: 'ease-in', duration: 0.5 }"
            :exit="{ backgroundColor: null, color: getColor() }"
            class="d-flex justify-content-between align-items-center w-100 py-4 px-3 text-decoration-none"
            @click="() => router.push({ name: 'strategic-plan', params: { id: router.currentRoute.value.params.id }, query: router.currentRoute.value.query })"
          >
            <h4 class="text-left m-0">{{ tGlobal.strategicPlan }}</h4>
            <v-icon name="arrow-right" class="h4 m-0"
          /></v-animated>
        </template>
        <v-row :xs="{ cols: 1 }" :md="{ cols: 2 }" :lg="{ cols: 4 }" class="h-100">
          <v-col class="p-4 border-right">
            <vertical-band-summary :total="data[0].mainObjectiveCount" :counters="data[0].mainObjectiveCounters" :subtitle="tGlobal.strategicPlan" :title="tGlobal.strategicPriority" />
          </v-col>
          <v-col class="p-4 border-right">
            <vertical-band-summary :total="data[0].objectivesCount" :counters="data[0].objectivesCounters" :subtitle="tGlobal.strategicPlan" :title="tGlobal.strategicObjectives" />
          </v-col>
          <v-col class="p-4 border-right">
            <vertical-band-summary :total="data[0].kpIsCount" :counters="data[0].kpIsCounters" :subtitle="tGlobal.strategicPlan" :title="tGlobal.keyPerformanceIndicators" />
          </v-col>
          <v-col class="p-4">
            <vertical-band-summary :total="data[0].projectsCount" :counters="data[0].projectsCounters" :subtitle="tGlobal.strategicPlan" :title="tGlobal.projects" project />
          </v-col>
        </v-row>
      </v-card>
      <v-row>
        <v-col :xs="9">
          <v-card body-class="p-0" header-class="bg-secondary  p-0" class="h-100">
            <template #header>
              <v-animated
                is="a"
                v-fake-link
                :hover="{ backgroundColor: getColor(), color: 'white' }"
                :transition="{ easing: 'ease-in', duration: 0.5 }"
                :exit="{ backgroundColor: null, color: getColor() }"
                class="d-flex justify-content-between align-items-center w-100 py-4 px-3 text-decoration-none"
                @click="() => router.push({ name: 'executive-plan', params: { id: router.currentRoute.value.params.id }, query: router.currentRoute.value.query })"
              >
                <h4 class="text-left m-0">{{ tGlobal.executivePlan }}</h4>
                <v-icon name="arrow-right" class="h4 m-0" />
              </v-animated>
            </template>
            <v-row :xs="{ cols: 1 }" :lg="{ cols: 3 }" class="h-100">
              <v-col class="p-4 border-right">
                <vertical-band-summary :total="data[1].mainObjectiveCount" :counters="data[1].mainObjectiveCounters" :subtitle="tGlobal.executivePlan" :title="tGlobal.executiveObjectives" />
              </v-col>
              <v-col class="p-4 border-right">
                <vertical-band-summary :total="data[1].kpIsCount" :counters="data[1].kpIsCounters" :subtitle="tGlobal.executivePlan" :title="tGlobal.keyPerformanceIndicators" />
              </v-col>
              <v-col class="p-4">
                <vertical-band-summary :total="data[1].projectsCount" :counters="data[1].projectsCounters" :subtitle="tGlobal.executivePlan" :title="tGlobal.projects" project />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col :xs="3">
          <v-card body-class="p-0" header-class="bg-secondary  p-0" class="h-100">
            <template #header>
              <v-animated
                is="a"
                v-fake-link
                :hover="{ backgroundColor: getColor(), color: 'white' }"
                :transition="{ easing: 'ease-in', duration: 0.5 }"
                :exit="{ backgroundColor: null, color: getColor() }"
                class="d-flex justify-content-between align-items-center w-100 py-4 px-3 text-decoration-none"
                @click="() => router.push({ name: 'government-common-kpis', params: { id: router.currentRoute.value.params.id }, query: router.currentRoute.value.query })"
              >
                <h4 class="text-left m-0">{{ tGlobal.governmentKpis }}</h4>
                <v-icon name="arrow-right" class="h4 m-0" />
              </v-animated>
            </template>
            <vertical-band-summary :total="data[2].kpIsCount" :counters="data[2].kpIsCounters" :subtitle="tGlobal.govCommonKpi" :title="tGlobal.keyPerformanceIndicators" class="p-4" />
          </v-card>
        </v-col>
      </v-row>
    </template>
  </app-layout-base>
</template>

<script setup lang="ts">
import { Ref, computed, defineAsyncComponent, inject, ref } from 'vue'
import { IoC } from 'cubes'
import { IAppContext } from '../../../domain/meta/i-app'
import { serviceMap } from '../../../../service'
import { ICustomDashboardService, IPlanCounters, BandLevelEnum, ProjectBandLevelEnum, possibleMetaDataIds, calculatePerformancePercentage } from 'cubes-dashboard'
import { useRouter } from 'vue-router'
import { AppContexts } from '@/adafsa-custom-control'
import { IUnitLayoutContext } from '@/app/domain/meta/i-unit-layout-context'
import { TUnitOverviewTranslation } from '@/i18n/index'
import { IHistoricalPIService } from '../../../service/meta/i-historica-pi.service'
import type { TRouteInfo } from 'cubes-dashboard'
import type { IDashboardAppService } from '@/app/service/meta/i-app-service'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IDashboardAppService,
  appState = appContext!.services[serviceMap.AppService.key]?.application.state,
  unitLayoutContext = inject<any>(AppContexts.unitLayout) as IUnitLayoutContext,
  tGlobal = appContext.translation.global,
  tUintOverview = unitLayoutContext.translation.tUintOverview as Ref<TUnitOverviewTranslation>,
  customDashboardService = appContext.services[serviceMap.CustomDashboardService.key] as ICustomDashboardService,
  historicalPIService = appContext.services[serviceMap.HistoricalPIService.key] as IHistoricalPIService,
  planCounters = ref() as Ref<IPlanCounters[]>,
  getPlanOverviewCounters = ref() as Ref<IPlanCounters>,
  router = useRouter(),
  unit = ref(unitLayoutContext.props.selectedOrgUnit),
  routeInfo = ref()

const onRouteChanged = (v: TRouteInfo) => {
  routeInfo.value = v
}

//computed
const spendingBarChart = computed(() => {
  return [
    {
      name: tUintOverview.value.totalBudget,
      value: getPlanOverviewCounters.value?.projectsCounters.totalBadget,
      percentOfProgress: getPlanOverviewCounters.value?.projectsCounters.totalBadget,
      color: 'darkBlue'
    },
    {
      name: tUintOverview.value.totalSpending,
      value: getPlanOverviewCounters.value?.projectsCounters.totalSpending,
      percentOfProgress: getPlanOverviewCounters.value?.projectsCounters.totalSpending,
      color: 'lightBlue'
    }
  ]
})

const priorityPie = computed(() => ({
  total: getPlanOverviewCounters.value?.mainObjectiveCount,
  units: [
    [
      {
        count: getPlanOverviewCounters.value?.mainObjectiveCounters.onTargetTotal,
        color: getColor('success'),
        title: tGlobal.value.enum.band[BandLevelEnum.OnTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.mainObjectiveCounters.slightlyOffTargetTotal,
        color: getColor('warning'),
        title: tGlobal.value.enum.band[BandLevelEnum.SlightlyOffTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.mainObjectiveCounters.offTargetTotal,
        color: getColor('danger'),
        title: tGlobal.value.enum.band[BandLevelEnum.OffTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.mainObjectiveCounters.noDataTotal,
        color: getColor('dark'),
        title: tGlobal.value.enum.band[BandLevelEnum.Undefined]
      }
    ]
  ]
}))

const objectivesPie = computed(() => ({
  total: getPlanOverviewCounters.value?.objectivesCount,
  units: [
    [
      {
        count: getPlanOverviewCounters.value?.objectivesCounters.onTargetTotal,
        color: getColor('success'),
        title: tGlobal.value.enum.band[BandLevelEnum.OnTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.objectivesCounters.slightlyOffTargetTotal,
        color: getColor('warning'),
        title: tGlobal.value.enum.band[BandLevelEnum.SlightlyOffTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.objectivesCounters.offTargetTotal,
        color: getColor('danger'),
        title: tGlobal.value.enum.band[BandLevelEnum.OffTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.objectivesCounters.noDataTotal,
        color: getColor('dark'),
        title: tGlobal.value.enum.band[BandLevelEnum.Undefined]
      }
    ]
  ]
}))

const kpIPie = computed(() => ({
  total: getPlanOverviewCounters.value?.kpIsCount,
  units: [
    [
      {
        count: getPlanOverviewCounters.value?.kpIsCounters.onTargetTotal,
        color: getColor('success'),
        title: tGlobal.value.enum.band[BandLevelEnum.OnTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.kpIsCounters.slightlyOffTargetTotal,
        color: getColor('warning'),
        title: tGlobal.value.enum.band[BandLevelEnum.SlightlyOffTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.kpIsCounters.offTargetTotal,
        color: getColor('danger'),
        title: tGlobal.value.enum.band[BandLevelEnum.OffTarget]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.kpIsCounters.noDataTotal,
        color: getColor('dark'),
        title: tGlobal.value.enum.band[BandLevelEnum.Undefined]
      }
    ]
  ]
}))

const projectPie = computed(() => ({
  total: getPlanOverviewCounters.value?.projectsCount,
  units: [
    [
      {
        count: getPlanOverviewCounters.value?.projectsCounters.onPlan,
        color: getColor('success'),
        title: tGlobal.value.enum.plan[ProjectBandLevelEnum.OnPlan]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.projectsCounters.delayed,
        color: getColor('danger'),
        title: tGlobal.value.enum.plan[ProjectBandLevelEnum.Delayed]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.projectsCounters.notStarted,
        color: getColor('gray'),
        title: tGlobal.value.enum.plan[ProjectBandLevelEnum.NotStarted]
      }
    ],
    [
      {
        count: getPlanOverviewCounters.value?.projectsCounters.notReported,
        color: getColor('dark'),
        title: tGlobal.value.enum.plan[ProjectBandLevelEnum.NotReported]
      }
    ]
  ]
}))

const getPlanOverviewCounter = async () =>
  new Promise(async (r, x) => {
    try {
      const result = await customDashboardService.getPlanOverviewCounters({
        unitID: router.currentRoute.value.params.id as string,
        projectStatusMetaDataID: possibleMetaDataIds['status'] as number,
        projectBudgetMetaDataID: possibleMetaDataIds['budget'] as number,
        projectSpendingMetaDataID: possibleMetaDataIds['spending'] as number
      })
      getPlanOverviewCounters.value = result.data as IPlanCounters
      r(result)
    } catch (error) {
      x(error)
    }
  })

const promise = async () =>
  new Promise(async (r, x) => {
    try {
      const result = await customDashboardService.listPlanCounter({
        unitID: router.currentRoute.value.params.id as string,
        projectStatusMetaDataID: possibleMetaDataIds['status'] as number,
        projectBudgetMetaDataID: possibleMetaDataIds['budget'] as number,
        projectSpendingMetaDataID: possibleMetaDataIds['spending'] as number
      })
      planCounters.value = result.data as IPlanCounters[]
      await getPlanOverviewCounter()
      r(result)
    } catch (error) {
      x(error)
    }
  })

const getPIAsync = () => () =>
  new Promise(async (r, x) => {
    try {
      const result = await historicalPIService.getUnitPi(router.currentRoute.value.params.id as string)

      r(result)
    } catch (error) {
      x(error)
    }
  })

const getColor = (colorClass = 'primary') => getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`)

const Bar = defineAsyncComponent(() => import('../../components/bar/index.vue'))
const VerticalBandSummary = defineAsyncComponent(() => import('../../components/vertical-band-summary/index.vue'))
</script>
