<template>
  <div ref="chart" :style="{ 'min-height': `${height}px` }"></div>
</template>

<script setup lang="ts">
import { ShallowRef, computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { IoC, NOOP } from 'cubes'
import { AppContexts } from '../../../../adafsa-custom-control'
import { GaugeChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { serviceMap } from '../../../../service'
import { ThemeMap } from 'cubes-ui'
import { props as gaugeProps } from './def/index'
import type { IAppContext } from '../../../../app/domain/meta/i-app'
import type { IDashboardAppService } from '../../../../app/service/meta/i-app-service'
import * as echarts from 'echarts/core'
import { GraphicComponent, ToolboxComponent, TitleComponent, LegendComponent, TooltipComponent, GridComponent, DatasetComponent } from 'echarts/components'

echarts.use([GaugeChart, GraphicComponent, TitleComponent, TooltipComponent, GridComponent, ToolboxComponent, LegendComponent, CanvasRenderer, DatasetComponent])

const appContext = IoC.DI().resolve<IAppContext>(AppContexts.appContext!),
  appService = appContext!.services[serviceMap.AppService.key] as IDashboardAppService,
  props = defineProps(gaugeProps),
  { strategy, value, primaryColor, secondaryColor, height } = props,
  chart = shallowRef(),
  instance = shallowRef(undefined) as ShallowRef<any>,
  doneLoading = ref(false),
  isDestroyed = ref(false)

let timeout = undefined as any

const isLtr = computed(() => appService?.application.state.ui.culture.dir == 'ltr'),
  theme = computed(() => appService?.application.state.ui.theme.name || ThemeMap[ThemeMap.light]),
  lang = computed(() => appService?.application.state.ui.culture.lang)

const draw = async (value: number = 0, title: string, dirLtr: boolean, primaryColor: string, secondaryColor: string) => {
  instance.value!.showLoading()
  await nextTick()
  const option = {
    series: [
      {
        clockwise: dirLtr ? true : false,
        pointer: {
          itemStyle: {
            color: '#666'
          }
        },
        startAngle: dirLtr ? 180 : 360,
        endAngle: dirLtr ? 0 : 180,
        type: 'gauge',
        progress: {
          itemStyle: {
            color: primaryColor
          },
          show: true,
          width: 30
        },
        axisLine: {
          lineStyle: {
            width: 30,
            color: [[1, secondaryColor]]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          distance: -40,
          color: '#999',
          fontSize: 10
        },
        anchor: {
          show: true,
          showAbove: true,
          size: 12,
          itemStyle: {
            borderWidth: 5,
            borderColor: '#666'
          }
        },
        title: {
          offsetCenter: ['0', '65%'],
          textStyle: {
            fontSize: 15
          }
        },
        detail: {
          valueAnimation: true,
          fontSize: 20,
          color: primaryColor,
          offsetCenter: [0, '35%'],
          formatter: function (value: string) {
            return value
          }
        },
        data: [
          {
            value: value,
            name: title
          }
        ]
      }
    ]
  }
  instance.value!.setOption(option, true, true)
  instance.value!.hideLoading()
}

const _$load = () => {
  !instance.value && (instance.value = echarts.init(chart.value as HTMLDivElement))
  draw(value, strategy![lang.value], isLtr.value, primaryColor, secondaryColor)
  instance.value.on('finished', () => {
    doneLoading.value = true
  })
}

//watch
watch(
  () => [chart.value, theme.value, isLtr.value],
  to => (!to[0] ? NOOP : _$load()),
  { deep: true }
)

onMounted(() => {
  timeout && clearTimeout(timeout)
  timeout = setTimeout(() => {
    _$load()
  }, 250)
})

onBeforeUnmount(() => {
  isDestroyed.value = true
  if (instance.value) {
    timeout && clearTimeout(timeout)
    instance.value.dispose()
  }
})
</script>
