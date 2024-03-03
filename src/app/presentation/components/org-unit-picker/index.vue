<template>
  <app-select-picker
    v-if="!isStrategicPlanPage"
    v-model="orgUnit"
    :tag-props="{ label: tUnit.orgUnitLabel, placeholder: tUnit.orgUnitPlaceholder, noInput: true }"
    :list-props="{ fetchOptions: getOrgUnitsAsync, preventDeselect: true, searchProps: { placeholder: tUnit.orgUnitSearch }, maxHeight: '200', initialOffset: 1 }"
    :dropdown-props="{ size: 'lg', placement: 'bottom', teleport: true, fullWidth: true }"
    :key-mapper="{ uniqueId: 'id', searchableKey: `name.${appService?.application.state.ui.culture.lang}` }"
    single
  />
</template>

<script lang="ts" setup>
import { IAppContext } from '@/app/domain/meta/i-app'
import { Ti18n, i18nMap } from '@/i18n'
import { TUnitTranslation } from '@/i18n/index'
import { serviceMap } from '@/service'
import { IoC } from 'cubes'
import { IOrgUnit, OrgUnit } from 'cubes-app'
import { ICustomDashboardService } from 'cubes-dashboard'
import { IAppService, TResult, useTranslation } from 'cubes-ui'
import { Ref, computed, ref, toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { props as orgUnitPickerProps } from './def'

const props = defineProps(orgUnitPickerProps)
const emit = defineEmits(['update:modelValue'])
const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IAppService,
  tGlobal = appContext.translation.global,
  tUnit = toRef(useTranslation<Ti18n>(appService, [i18nMap['unit']]), 'tUnit') as unknown as TUnitTranslation,
  customDashboardService = appContext.services[serviceMap.CustomDashboardService.key] as ICustomDashboardService,
  router = useRouter(),
  orgUnit = ref(props.modelValue) as Ref<IOrgUnit[]>,
  uiState = ref({ isReady: false, isBusy: false, error: false })

const isStrategicPlanPage = computed(() => router.currentRoute.value.name == 'strategic-plan')

const getOrgUnitsAsync = (params: { limit: number; offset: number; query?: string }): Promise<TResult<IOrgUnit[]>> =>
  new Promise(async (r, x) => {
    try {
      uiState.value.error = false
      uiState.value.isBusy = true
      const result = await customDashboardService.listOrgUnits({ Limit: params.limit, Offset: params.offset, ...(params.query && { name: params.query }) })
      r(result)
    } catch (e) {
      uiState.value.error = true
      appService?.error(tGlobal.value.errors.requestError as any, undefined, 'OrgUnitPicker@Index::getOrgUnitsAsync')
      x(e)
    } finally {
      uiState.value.isBusy = false
      uiState.value.isReady = true
    }
  })

const setOrgUnit = async () => {
  try {
    const routeId = router.currentRoute.value.params.id
    const result = await getOrgUnitsAsync({ offset: 0, limit: 0 })
    const data = result.data as IOrgUnit[]
    if (data.length) {
      if (!routeId) {
        const userUnit = data.find(u => u.id == appService.application.state.session.ui.userProfile?.orgUnitId)
        orgUnit.value = userUnit ? [new OrgUnit(userUnit)] : [new OrgUnit(data[0])]
        const { name, query } = router.currentRoute.value
        router.replace({ name: name as string, query, params: { id: orgUnit.value[0].id } })
      } else {
        const unitByRouteId = data.find(u => u.id == routeId)
        unitByRouteId && (orgUnit.value = [new OrgUnit(unitByRouteId)])
      }
    }
  } catch (error) {
    appService?.error(tGlobal.value.errors.requestError as any, undefined, 'OrgUnitPicker@Index::setDefault')
  }
}

watch(
  () => orgUnit.value,
  to => to?.length && emit('update:modelValue', orgUnit.value),
  { deep: true, immediate: true }
)

setOrgUnit()

defineExpose({ uiState, setOrgUnit })
</script>
