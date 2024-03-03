<template>
  <app-layout-base :promise="NOOP" tag="div" :url-info="urlInfo" hide-back-button @change="onRouteChanged">
    <template #top-right>
      <d-date-view :query="routeInfo.query"></d-date-view>
    </template>
    <template #ready>
      <h4 class="my-3">{{ unit[0]?.name ? tStrategicPlan.unitStrategic(unit[0]?.name[appState.ui.culture.lang]) : '' }}</h4>
      <v-card v-if="selectedUnit" body-class="p-0">
        <pi-table :unit-id="selectedUnit" :plan-id="PlanIdEnum.strategic" />
      </v-card>
    </template>
  </app-layout-base>
</template>
<script lang="ts" setup>
import { i18nMap, Ti18n } from '../../../../i18n'
import { useTranslation } from 'cubes-ui'
import { inject, toRefs } from 'vue'
import { TStrategicPlanTranslation } from '../../../../i18n/index'
import { AppContexts } from '@/adafsa-custom-control'
import { IUnitLayoutContext } from '@/app/domain/meta/i-unit-layout-context'
import { serviceMap } from '@/service'
import { IoC, NOOP } from 'cubes'
import { computed, defineAsyncComponent, ref } from 'vue'
import { PlanIdEnum, type TRouteInfo } from 'cubes-dashboard'
import type { IAppContext } from '@/app/domain/meta/i-app'
import type { IDashboardAppService } from '@/app/service/meta/i-app-service'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IDashboardAppService,
  appState = appContext!.services[serviceMap.AppService.key]?.application.state,
  unitLayoutContext = inject<any>(AppContexts.unitLayout) as IUnitLayoutContext,
  { 'tStrategic-plan': tStrategicPlan } = toRefs(useTranslation<Ti18n>(appService, [i18nMap['strategic-plan']])) as unknown as { 'tStrategic-plan': TStrategicPlanTranslation },
  unit = ref(unitLayoutContext.props.selectedOrgUnit)
const selectedUnit = ref(''),
  routeInfo = ref()

const urlInfo = computed(() => ({
  params: 'id',
  defaultParams: { id: appService.application.state.session.ui.userProfile?.orgUnitId },
  query: 'period'
}))

const onRouteChanged = (v: TRouteInfo) => {
  routeInfo.value = v
  selectedUnit.value = <string>v.params.id
}
const PiTable = defineAsyncComponent(() => import('../../components/pi-table/index.vue'))
</script>
