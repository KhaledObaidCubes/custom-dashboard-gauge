<template>
  <h3>{{ tGreeting.greetingDashboard }}</h3>
  <h6 class="text-muted">{{ tGreeting.greetingMessage }}</h6>
</template>
<script lang="ts" setup>
import type { TGreetingTranslation } from '../../../../i18n/index'
import { i18nMap, Ti18n } from '../../../../i18n'
import { serviceMap } from '../../../../service'
import { IoC } from 'cubes'
import { IAppContext, IAppService, useTranslation } from 'cubes-ui'
import { toRefs } from 'vue'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IAppService,
  { tGreeting } = toRefs(useTranslation<Ti18n>(appService, [i18nMap.greeting])) as unknown as { tGreeting: TGreetingTranslation }
</script>
