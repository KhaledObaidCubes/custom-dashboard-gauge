<template>
  <div>
    <div class="d-flex mb-3">
      <h1 class="mb-0 mr-5">{{ total }}</h1>
      <div class="mt-1">
        <span class="text-muted">{{ subtitle }}</span>
        <h5 class="mb-0">{{ title }}</h5>
      </div>
    </div>
    <d-metric
      :title="tGlobal.enum[project ? 'plan' : 'band'][project ? ProjectBandLevelEnum.OnPlan : BandLevelEnum.OnTarget]"
      :value="project ? counters!.onPlan : counters!.onTargetTotal"
      :progress="((project ? counters!.onPlan : counters!.onTargetTotal) / (total ?? 1)) * 100"
      :color="getColor('success')"
      class="mb-3"
    />
    <d-metric
      :title="tGlobal.enum[project ? 'plan' : 'band'][project ? ProjectBandLevelEnum.Delayed : BandLevelEnum.SlightlyOffTarget]"
      :value="project ? counters!.delayed : counters!.slightlyOffTargetTotal"
      :progress="((project ? counters!.delayed : counters!.slightlyOffTargetTotal) / (total ?? 1)) * 100"
      :color="getColor(project ? 'danger' : 'warning')"
      class="my-3"
    />
    <d-metric
      :title="tGlobal.enum[project ? 'plan' : 'band'][project ? ProjectBandLevelEnum.NotStarted : BandLevelEnum.OffTarget]"
      :value="project ? counters!.notStarted :counters!.offTargetTotal"
      :progress="((project ? counters!.notStarted :counters!.offTargetTotal)/ (total ?? 1)) * 100"
      :color="getColor(project ? 'gray' : 'danger')"
      class="my-3"
    />
    <d-metric
      :title="tGlobal.enum[project ? 'plan' : 'band'][project ? ProjectBandLevelEnum.NotReported : BandLevelEnum.Undefined]"
      :value="project ? counters!.notReported :counters!.noDataTotal"
      :progress="((project ? counters!.notReported :counters!.noDataTotal) / (total ?? 1)) * 100"
      :color="getColor('dark')"
      class="mt-3"
    />
  </div>
</template>
<script lang="ts" setup>
import { IoC } from 'cubes'
import { IAppContext } from '../../../domain/meta/i-app'
import { props as verticalBandSummaryProps } from './def/index'
import { BandLevelEnum, ProjectBandLevelEnum } from 'cubes-dashboard'

defineProps(verticalBandSummaryProps)
const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  tGlobal = appContext.translation.global

const getColor = (colorClass = 'primary') => getComputedStyle(document.documentElement).getPropertyValue(`--${colorClass}`)
</script>
