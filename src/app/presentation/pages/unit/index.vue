<template>
  <app-layout-base :url-info="urlInfo" :crumbs="crumbs" @change="onRouteChange">
    <template #top-right>
      <d-date-view :query="routeInfo.query"></d-date-view>
    </template>
    <template #ready>
      <v-card>
        <v-row>
          <v-col v-if="isStrategic" :xs="12">
            <div class="flex-grow-1">
              <v-animated
                v-if="headerComponent.component"
                :key="headerComponent.name"
                :is="headerComponent.component"
                :initial="{ opacity: 0, y: 40 }"
                :animate="{ y: 0, opacity: 1 }"
                :transition="{ opacity: { easing: 'linear', duration: 1.3, transform: 'none' }, easing: spring(), delay: 0.1, duration: 1 }"
              /></div
          ></v-col>
          <v-col v-else :xs="8">
            <div class="flex-grow-1">
              <v-animated
                v-if="headerComponent.component"
                :key="headerComponent.name"
                :is="headerComponent.component"
                :initial="{ opacity: 0, y: 40 }"
                :animate="{ y: 0, opacity: 1 }"
                :transition="{ opacity: { easing: 'linear', duration: 1.3, transform: 'none' }, easing: spring(), delay: 0.1, duration: 1 }"
              /></div
          ></v-col>
          <v-col :xs="4">
            <div class="w-100">
              <org-unit-picker ref="orgUnitPickerRef" v-model="orgUnit" />
              <v-presence>
                <div class="d-flex justify-content-end align-items-center mt-3">
                  <a
                    v-if="orgUnit && orgUnit[0] && !isStrategic"
                    v-fake-link
                    @click="() => appManager.navigateExternal(`${appService.application.config.commonDashboardURL}${orgUnit[0].id}${$route.query?.period ? '?period=' + $route.query.period : ''}`)"
                  >
                    <span class="text-left m-0">{{ tUnit.openDashboard }}</span>
                    <v-icon name="arrow-right" class="ml-2" size="lg" />
                  </a>
                </div>
              </v-presence>
            </div>
          </v-col>
        </v-row>

        <v-async v-if="isStrategic && strategicCarousel" :promise="getStrategicPlanList">
          <template #busy>
            <v-spinner size="sm" />
          </template>
          <template v-slot:ready="{ result: { success } }">
            <v-carousel v-if="success" v-model="model">
              <v-carousel-item v-for="(item, indx) in [...success]" :id="item.id" :key="item.id" class="flex-shrink-0 text-danger w-25 m-0" :class="indx ? 'pl-4' : 'pl-0'">
                <strategy-gauge v-if="true" :value="item.history.last.formattedValue[lang]" :strategy="item.name" :primary-color="'#dd5c65'" :secondary-color="'#f7e1e3'" :height="200" class="mt-5" />
                <div v-else class="metric px-0">
                  <div class="d-flex align-items-baseline justify-content-between">
                    <div>
                      <v-literal :modelValue="item.name" :tag="'p'" class="metric-value text-dark mb-1" />
                    </div>
                    <div>
                      <h2 class="metric-label mb-2 ml-4">
                        <v-literal :modelValue="item.history.last.formattedValue" tag="small" :class="`card-title text-${item.history.last.band.badgeProps.accent}`" />
                      </h2>
                    </div>
                  </div>
                  <div class="progress progress-animated progress-sm">
                    <div class="progress-bar rounded" :class="`bg-${item.history.last.band.badgeProps.accent}`" role="progressbar" :style="`width:${item.history.last.value}%`"></div>
                  </div>
                </div>
              </v-carousel-item>
              <template #footer="props">
                <div class="text-center">
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                      <v-paginator
                        v-if="props.pages.length > 1"
                        v-model="paginatorModel"
                        v-bind="{
                          btnProps: { accent: 'primary', icon: true },
                          showCondensed: false,
                          hideBoundaries: true,
                          hideSides: true,
                          dots: true,
                          totalPages: +props.pages.length,
                          segmentSize: +props.pages.length
                        }"
                      />
                      <div v-if="props.pages.length > 1">
                        <v-button size="sm" accent="reset" :disabled="model.pageIndex == 0" icon @click="props.prev"><v-icon name="chevron-left" /></v-button>
                        <v-button size="sm" accent="reset" :disabled="model.pageIndex == props.pages.length - 1" icon @click="props.next"><v-icon name="chevron-right" /></v-button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </v-carousel>
          </template>
        </v-async>
      </v-card>
      <div v-if="orgUnitPickerRef?.uiState.isReady && orgUnitPickerRef?.uiState.error" class="loader-overlay">
        <div class="d-flex h-100">
          <v-empty key="nodata" figure="error" :subtitle="tGlobal.errors.requestError" class="m-auto" />
        </div>
      </div>
      <template v-else-if="orgUnitPickerRef?.uiState.isReady">
        <div v-if="!selectedOrgUnit" class="loader-overlay">
          <div class="d-flex h-100">
            <v-empty key="nodata" figure="nodata" figure-width="75%" class="m-auto" :title="tUnit.dashboardNotConfigured" :subtitle="tUnit.referToAdmin" />
          </div>
        </div>
        <router-view v-else :key="routeInfo.params.id" />
      </template>
    </template>
  </app-layout-base>
</template>
<script lang="ts" setup>
import { Ref, ref, toRefs, watch, computed, provide, defineAsyncComponent } from 'vue'
import { IoC, equals, uid, mockPromise_200 } from 'cubes'
import { useTranslation } from 'cubes-ui'
import { serviceMap } from '../../../../service'
import { useRouter } from 'vue-router'
import { spring } from 'motion'
import { AppContexts } from '@/adafsa-custom-control'
import { type IAppContext } from '../../../domain/meta/i-app'
import { type Ti18n, i18nMap } from '../../../../i18n'
import type { TUnitOverviewTranslation, TUnitTranslation } from '../../../../i18n/index'
import type { IOrgUnit } from 'cubes-app'
import type { IHistoricalPIService } from '@/app/service/meta/i-historica-pi.service'
import { PlanIdEnum, type TRouteInfo } from 'cubes-dashboard'
import type { IUnitLayoutContext } from '@/app/domain/meta/i-unit-layout-context'
import type { IAppManager } from 'cubes-ui'
import { getHeaderComponent } from './def'
import { IDashboardAppService } from '@/app/service/meta/i-app-service'
import { IGetUnitObjectives } from '@/app/service/meta/api-args'

const paginatorModel = ref(0)

const model = ref({ itemIndex: 0, pageIndex: 0, itemIndexInPage: 0 })
const appManager = IoC.DI().resolve<IAppManager>(serviceMap.AppManager.key)
const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IDashboardAppService,
  historicalPIService = appContext.services[serviceMap.HistoricalPIService.key] as IHistoricalPIService,
  tGlobal = appContext.translation.global,
  { 'tUnit-overview': tUintOverview, tUnit } = toRefs(
    useTranslation<Ti18n>(appService, [i18nMap['unit-overview'], i18nMap['unit']]) as unknown as { 'tUnit-overview': TUnitOverviewTranslation; tUnit: TUnitTranslation }
  ),
  router = useRouter(),
  unitId = ref(router.currentRoute.value.params.id),
  orgUnit = ref() as Ref<IOrgUnit[]>,
  selectedOrgUnit = ref() as Ref<IOrgUnit[]>,
  crumbs = ref([]) as Ref<any[]>,
  routeInfo = ref(),
  headerComponent = ref({}) as Ref<{ component: any; name: string }>,
  orgUnitPickerRef = ref(),
  strategicCarousel = appService.application.config.strategicCarousel

const urlInfo = computed(() => ({
  params: 'id',
  query: 'period'
}))

const showNavigationButton = computed(() => !orgUnitPickerRef.value?.uiState.isBusy && orgUnit.value && orgUnit.value[0]?.id && !equals(router.currentRoute.value.params.id, orgUnit.value[0].id))
const isStrategic = computed(() => router.currentRoute.value.name == 'strategic-plan'),
  lang = computed(() => appService.application.state.ui.culture.lang)

const fillRouteInfo = (info: TRouteInfo) => (routeInfo.value = info)

const onRouteChange = (e: TRouteInfo) => {
  fillRouteInfo(e)
  orgUnitPickerRef.value?.setOrgUnit()
}

const getStrategicPlanList = () => () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await historicalPIService.listObjectives({ Limit: 0, Offset: 0, planID: PlanIdEnum.strategic, unitID: unitId.value } as IGetUnitObjectives)
      resolve(result.data)
    } catch (error) {
      reject('No')
    }
  })

watch(
  () => [router.currentRoute.value, routeInfo.value],
  ([r, i]) => {
    const { name, path, meta } = r as any
    const { params, query } = i ?? { params: {}, query: {} }
    const arr = []
    if (name != headerComponent.value?.name || !headerComponent.value?.component) {
      headerComponent.value.name = name
      headerComponent.value.component = getHeaderComponent(name as string)
    }
    r.name == 'overview'
      ? arr.push({ path, name, meta: { id: uid(), promise: () => () => mockPromise_200(200, meta.title), params, query } })
      : arr.push(
          ...[
            { name: 'overview', meta: { id: uid(), promise: () => () => mockPromise_200(200, { en: 'Dashboard Overview', ar: 'نظرة عامة على واجهة قياس الأداء' }), params, query } },
            { path, name, meta: { id: uid(), promise: () => () => mockPromise_200(200, meta.title), params, query } }
          ]
        )
    crumbs.value = arr
  },
  { deep: true, immediate: true }
)

watch(
  () => [router.currentRoute.value.params.id, orgUnit.value],
  () => (!showNavigationButton.value || !selectedOrgUnit.value) && (selectedOrgUnit.value = orgUnit.value),
  { deep: true, immediate: true }
)
watch(
  () => orgUnit.value?.first,
  to => !!to && router.push({ name: router.currentRoute.value.name as string, params: { id: to?.id }, query: router.currentRoute.value.query })
)

watch(
  () => paginatorModel.value,
  to => (model.value.pageIndex = to - 1),
  { deep: true }
)
watch(
  () => model.value.pageIndex,
  to => (paginatorModel.value = to + 1),
  { deep: true }
)

const context = {
  translation: { tUintOverview },
  props: { selectedOrgUnit }
} as unknown as IUnitLayoutContext

provide(AppContexts.unitLayout, context)

const OrgUnitPicker = defineAsyncComponent(() => import('../../components/org-unit-picker/index.vue'))
const StrategyGauge = defineAsyncComponent(() => import('../../components/strategy-gauge/gauge.vue'))
</script>
