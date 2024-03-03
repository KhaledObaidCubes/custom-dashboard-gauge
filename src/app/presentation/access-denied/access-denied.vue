<template>
  <app-page-content boxed hideBreadcrumb>
    <v-empty key="error" :title="tGlobal.accessDenied" :subtitle="tGlobal.noPermission" figure="error" figure-width="620px" />
  </app-page-content>
</template>

<script lang="ts" setup>
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { Ref } from 'vue'
import { TGlobalTranslation } from '../../../i18n/index'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  tGlobal = appContext!.translation.global as Ref<TGlobalTranslation>
</script>
