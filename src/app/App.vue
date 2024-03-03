<template>
  <v-app-container :is-busy="isBusy" :is-ready="isReady">
    <app-main-layout no-side-menu>
      <router-view v-if="isReady" />
    </app-main-layout>
  </v-app-container>
</template>

<script lang="ts" setup>
import { Ref, toRef } from 'vue'
import { AppServiceEvent, cubesAppControlProps as props, useTranslation } from 'cubes-ui'
import { useAppContainer } from 'cubes-ui'
import { IoC, CubesEvent } from 'cubes'
import { IDashboardAppService } from './service/meta/i-app-service'
import { Ti18n } from '../i18n'
import { TGlobalTranslation } from '../i18n/index'
import { AppContext } from './domain/def/app-context'
import { serviceMap } from '../service'
import { ICustomDashboardService } from 'cubes-dashboard'
import { IHistoricalPIService } from './service/meta/i-historica-pi.service'

defineProps(props as any)

const { isBusy, isReady } = useAppContainer()
const appService = IoC.DI().resolve<IDashboardAppService>(serviceMap.AppService.key)
const customDashboardService = IoC.DI().resolve<ICustomDashboardService>(serviceMap.CustomDashboardService.key)
const historicalPIService = IoC.DI().resolve<IHistoricalPIService>(serviceMap.HistoricalPIService.key)

appService.addEventListener(new CubesEvent(AppServiceEvent.ready), () => {
  const global = toRef(useTranslation<Ti18n>(appService), 'tGlobal') as unknown as Ref<TGlobalTranslation>

  IoC.DI().register(AppContext, {
    default: {
      id: 'appContext',
      ctorArgs: [
        {
          [serviceMap.AppService.key]: appService,
          [serviceMap.CustomDashboardService.key]: customDashboardService,
          [serviceMap.HistoricalPIService.key]: historicalPIService
        },
        { global }
      ],
      domain: 0
    }
  })
})
</script>
