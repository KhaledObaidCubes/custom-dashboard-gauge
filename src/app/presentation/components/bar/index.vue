<template>
  <template v-if="!units?.length">
    <v-empty :subtitle="tGlobal.emptyChart" figure="empty" figure-width="160px" class="h-100" />
  </template>
  <template v-else>
    <div class="d-flex">
      <v-tile size="lg" :circle="false" tag="div" class="bg-grey text-muted mr-3 flex-shrink-0" no-color>
        <v-icon :name="iconString" size="xl" />
      </v-tile>
      <h6 class="text-muted mb-0 ml-2 align-self-center">{{ title }}</h6>
    </div>
    <v-chart
      :data-zoom="[
        { show: false, id: 'dataZoomX', type: 'slider', xAxisIndex: [0], filterMode: 'filter' },
        { type: 'inside', xAxisIndex: 0 }
      ]"
      barMaxWidth="35%"
      :grid="{
        left: isRtl ? 'auto' : 100,
        right: isRtl ? 100 : 'auto'
      }"
      :x-axis="[
        {
          type: 'category',
          data: dataFormatter,
          axisLabel: {
            interval: 0,
            width: 110,
            overflow: 'breakAll'
          },
          show: true
        }
      ]"
      :y-axis="[
        {
          type: 'category',
          show: false
        }
      ]"
      :chart-data="chartData"
      :default-chart="availableCharts.barX"
      :center="['50%', '50%']"
      :tooltip-formatter="tooltipFormatter"
    />
  </template>
</template>
<script lang="ts" setup>
import { computed, Ref, toRef } from 'vue'
import { availableCharts, IAppContext, TChartDataComponent } from 'cubes-ui'
import { IoC, trimText } from 'cubes'
import { TSeriesPer } from 'cubes-ui/dist/types/lib/meta/chart'
import { props as barProps } from './def'
import { serviceMap } from '../../../../service'
import { TGlobalTranslation } from '../../../../i18n/index'

const props = defineProps(barProps),
  appContext = IoC.DI().resolve<IAppContext>('appContext'),
  tGlobal = appContext.translation.global as unknown as Ref<TGlobalTranslation>,
  units = toRef(props, 'units'),
  appState = appContext!.services[serviceMap.AppService.key]?.application.state,
  appConfig = appContext!.services[serviceMap.AppService.key]?.application.config,
  sample = [{}]

//methods
const getUnits = () => units.value!.map(o => ({ count: o.percentOfProgress, title: o.name, color: o.color }))

const tooltipFormatter = (_percent: boolean, _data: { data: TChartDataComponent; seriesPer: TSeriesPer } | null, p: any) =>
  `${p.data.name + '\n' + p.data.value.toLocaleString() + ' ' + appConfig.currencySymbol[appState.ui.culture.lang]}`

//computed
const chartData = computed(() => {
  const result: any = { title: '', meta: { color: 'blue' }, barWidth: 14, data: { count: 0, percent: 0 }, components: [] }
  sample.map(({}) => {
    const sComponents = getUnits().map((o: any) => ({
      title: o.title,
      data: { count: o.count, percent: o.percent ? o.percent : 0 },
      meta: { color: o.color, label: { show: false }, labelLine: { show: false, smooth: true } },
      components: []
    }))
    for (let i = 0; i < units.value!.length; i++) result.components.push(sComponents[i])
  })
  return result
})

const isRtl = computed(() => appState.ui.culture.dir == 'rtl')

const dataFormatter = computed(() => units.value!.map(o => trimText(o.name, 20)))
</script>
