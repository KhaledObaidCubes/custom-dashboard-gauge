<template>
  <app-layout-base :promise="NOOP" tag="div" :url-info="urlInfo" hide-back-button @change="onRouteChanged">
    <template #top-right>
      <d-date-view :query="routeInfo.query"></d-date-view>
    </template>
    <template #ready>
      <h4 class="my-3">{{ unit[0]?.name ? tExecutivePlan.unitExecutive(unit[0]?.name[appState.ui.culture.lang]) : '' }}</h4>
      <v-card v-if="selectedUnit" body-class="p-0">
        <pi-table :unit-id="selectedUnit" :plan-id="PlanIdEnum.executive" />
      </v-card>
    </template>
  </app-layout-base>
</template>
<script lang="ts" setup>
import { i18nMap, Ti18n } from '../../../../i18n'
import { serviceMap } from '../../../../service'
import { IoC, NOOP } from 'cubes'
import { useTranslation } from 'cubes-ui'
import { computed, defineAsyncComponent, inject, ref, toRefs } from 'vue'
import { TExecutivePlanTranslation } from '../../../../i18n/index'
import { AppContexts } from '../../../../adafsa-custom-control'
import { IUnitLayoutContext } from '../../../domain/meta/i-unit-layout-context'
import type { IAppContext } from '../../../domain/meta/i-app'
import { PlanIdEnum, type TRouteInfo } from 'cubes-dashboard'
import type { IDashboardAppService } from '@/app/service/meta/i-app-service'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IDashboardAppService,
  appState = appContext!.services[serviceMap.AppService.key]?.application.state,
  unitLayoutContext = inject<any>(AppContexts.unitLayout) as IUnitLayoutContext,
  { 'tExecutive-plan': tExecutivePlan } = toRefs(useTranslation<Ti18n>(appService, [i18nMap['executive-plan']])) as unknown as { 'tExecutive-plan': TExecutivePlanTranslation },
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
