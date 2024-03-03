<template>
  <div class="d-flex flex-wrap justify-content-between w-100">
    <div>
      <v-animated v-if="planId == PlanIdEnum.strategic" :initial="{ x: 100, opacity: 0 }" :animate="{ x: 0, opacity: 1 }" :transition="{ duration: 1.5 }" :exit="{ x: -100, opacity: 0.5 }">
        <h4 class="mb-3">{{ tGlobal.strategicPlan }}</h4>
      </v-animated>
      <h4 v-else-if="planId == PlanIdEnum.executive" class="mb-3">{{ tGlobal.executivePlan }}</h4>
      <h4 v-else class="mb-3">{{ tGlobal.governmentKpis }}</h4>
    </div>
    <div class="d-flex">
      <div v-if="planId == PlanIdEnum.strategic" class="d-flex mr-3 align-items-center">
        <v-animated :initial="{ scale: 1, opacity: 0 }" :animate="{ opacity: 1 }" :hover="{ scale: toScale }" :transition="{ duration: 0.5 }" :exit="{ opacity: 0.5 }">
          <span v-if="uiState.isBusy"><v-spinner size="sm" /></span>
          <animated-counter v-else :start-from="0" :final-value="counters?.mainObjectiveCount" :duration="1.25"></animated-counter>
          <span class="ml-2">{{ tGlobal.strategicPriority }}</span>
        </v-animated>
      </div>

      <div v-if="planId != PlanIdEnum.kpi" class="d-flex mr-3 align-items-center">
        <v-animated :initial="{ scale: 1, opacity: 0 }" :animate="{ opacity: 1 }" :hover="{ scale: toScale }" :transition="{ duration: 0.5 }" :exit="{ opacity: 0.5 }">
          <span v-if="uiState.isBusy"><v-spinner size="sm" /></span>

          <animated-counter v-else :start-from="0" :final-value="planId == PlanIdEnum.executive ? counters?.mainObjectiveCount! : counters?.objectivesCount" :duration="1.25"></animated-counter>
          <span class="ml-2"> {{ planId == PlanIdEnum.strategic ? tGlobal.strategicObjectives : tGlobal.executiveObjectives }}</span>
        </v-animated>
      </div>
      <div class="d-flex mr-3 align-items-center">
        <v-animated :initial="{ scale: 1, opacity: 0 }" :animate="{ opacity: 1 }" :hover="{ scale: toScale }" :transition="{ duration: 0.5 }" :exit="{ opacity: 0.5 }">
          <span v-if="uiState.isBusy"><v-spinner size="sm" /></span>
          <animated-counter v-else :start-from="0" :final-value="counters?.kpIsCount" :duration="1.25"></animated-counter>
          <span class="ml-2"> {{ tGlobal.keyPerformanceIndicators }}</span>
        </v-animated>
      </div>
      <div v-if="planId != PlanIdEnum.kpi" class="d-flex mr-3 align-items-center">
        <v-animated :initial="{ scale: 1, opacity: 0 }" :animate="{ opacity: 1 }" :hover="{ scale: toScale }" :transition="{ duration: 0.5 }" :exit="{ opacity: 0.5 }">
          <span v-if="uiState.isBusy"><v-spinner size="sm" /></span>
          <animated-counter v-else :start-from="0" :final-value="counters?.projectsCount" :duration="1.25"></animated-counter>
          <span class="ml-2">{{ tGlobal.projects }}</span>
        </v-animated>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IoC } from 'cubes'
import { IAppContext } from '@/app/domain/meta/i-app'
import { serviceMap } from '@/service'
import { ICustomDashboardService, IPlanCounters, PlanIdEnum, possibleMetaDataIds } from 'cubes-dashboard'
import { useRouter } from 'vue-router'
import { Ref, ref, toRef, watch } from 'vue'
import { props as tableHeaderProps } from './def/index'
import AnimatedCounter from '../../components/animated-counter/animated-counter.vue'

const props = defineProps(tableHeaderProps)
const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  tGlobal = appContext.translation.global,
  customDashboardService = appContext.services[serviceMap.CustomDashboardService.key] as ICustomDashboardService,
  router = useRouter(),
  counters = ref() as Ref<IPlanCounters>,
  uiState = ref({ isBusy: true, error: false }),
  toScale = ref(1.1),
  planId = toRef(props, 'planId'),
  projects = ref(0),
  kpi = ref(0),
  strategicMainObjectives = ref(0),
  strategicObjectivesCount = ref(0),
  strategicPriorities = ref(0)

const getCounters = async (id: string) => {
  try {
    uiState.value.error = false
    uiState.value.isBusy = true
    const result = await customDashboardService.getPlanCounter({
      unitID: id,
      planID: planId.value!,
      projectStatusMetaDataID: possibleMetaDataIds['status'] as number,
      projectBudgetMetaDataID: possibleMetaDataIds['budget'] as number,
      projectSpendingMetaDataID: possibleMetaDataIds['spending'] as number
    })
    counters.value = result.data as IPlanCounters
  } catch (error) {
    uiState.value.error = true
  } finally {
    uiState.value.isBusy = false
  }
}

watch(
  () => router.currentRoute.value.params.id,
  to => to && getCounters(to as string),
  { immediate: true }
)
</script>
