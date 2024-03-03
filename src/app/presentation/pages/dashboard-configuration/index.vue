<template>
  <app-page-content>
    <h3>{{ tConfiguration.dashboardConfiguration }}</h3>
    <p>{{ tConfiguration.dashboardConfigurationDescription }}</p>
    <v-row :xs="{ cols: 1 }" :md="{ cols: 3 }" class="mt-4">
      <v-col>
        <dashboard-configuration :container-id="PlanIdEnum.strategic" @open-folder-browser="onOpenFolderBrowser" />
      </v-col>
      <v-col>
        <dashboard-configuration :container-id="PlanIdEnum.executive" @open-folder-browser="onOpenFolderBrowser" />
      </v-col>
      <v-col>
        <dashboard-configuration :container-id="PlanIdEnum.kpi" @open-folder-browser="onOpenFolderBrowser" />
      </v-col>
    </v-row>
  </app-page-content>

  <v-modal v-model="formModal" size="lg" fill centered static body-classes="p-0" header-classes="bg-primary text-white p-2">
    <template #header>
      <h6 v-if="dashboard" class="my-auto">{{ tConfiguration.folderBrowser.title[dashboard.containerId] }}</h6>
    </template>
    <template #close-btn>
      <v-button modifier="subtle" @click="formModal = false">
        <v-icon name="times" fixed-width class="text-white" />
      </v-button>
    </template>

    <template #body>
      <transition name="fade" mode="out-in" appear>
        <folder-browser v-if="formModal" v-model="objectsToLink" :modify-roots="modifyRoots" />
      </transition>
    </template>
    <template #footer>
      <v-button accent="default" @click="closeFolderBrowser">{{ tConfiguration.cancel }}</v-button>
      <app-async-button :disabled="isDirty" @click="addObjects">{{ tConfiguration.save }}</app-async-button>
    </template>
  </v-modal>
</template>

<script lang="ts" setup>
import { PlanIdEnum } from 'cubes-dashboard'
import { Ref, ref, toRef, defineAsyncComponent, computed, watch } from 'vue'
import { UserTypeEnum, useTranslation } from 'cubes-ui'
import { serviceMap } from '@/service'
import { IoC, equals } from 'cubes'
import { ObjectTypeEnum, FolderBrowser } from 'cubes-app'
import { i18nMap } from '@/i18n'
import type { ICustomDashboard } from 'cubes-dashboard'
import type { TConfigurationEnMapTranslation } from '@/i18n/index'
import type { IAppContext, IAppService } from 'cubes-ui'
import type { TProxyResult } from '@/adafsa-custom-control'
import type { Ti18n } from '@/i18n'
import type { IBasicObject, IFoldersBrowser } from 'cubes-app'
import { useRouter } from 'vue-router'

const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IAppService,
  tConfiguration = toRef(useTranslation<Ti18n>(appService, [i18nMap['configuration']]), 'tConfiguration') as unknown as Ref<TConfigurationEnMapTranslation>,
  tGlobal = appContext.translation.global,
  formModal = ref(false),
  objectsToLink = ref([]) as Ref<IBasicObject[]>,
  tempObjectsToLink = ref([]) as Ref<IBasicObject[]>,
  currentContainerItemsCount = ref(0),
  router = useRouter(),
  dashboard = ref() as Ref<{ updatePromise: (args: IBasicObject[]) => Promise<TProxyResult<ICustomDashboard[]>>; objects: ICustomDashboard[]; containerId: PlanIdEnum } | null>

const roots = [
  {
    id: ObjectTypeEnum.Objective,
    name: { en: 'Objectives', ar: 'الأهداف' },
    subObjectsType: ObjectTypeEnum.Objective
  }
]

const customRoots = ref([])
const modifyRoots = (allRoots: IFoldersBrowser[]) => {
  const toBeTReturned = allRoots.filter(x => roots.find(y => y.id == x.subObjectsType)).map((x, i) => ({ ...x, name: roots[i].name }))

  return [...toBeTReturned, ...customRoots.value]
}

const isDirty = computed(() => {
  const obj = objectsToLink.value.map(o => ({ ...o, description: {} }))
  const temp = tempObjectsToLink.value.map(o => ({ ...o, description: {} }))
  return equals(obj, temp)
})

const onOpenFolderBrowser = (e: { updatePromise: (args: IBasicObject[]) => Promise<TProxyResult<ICustomDashboard[]>>; objects: ICustomDashboard[]; containerId: PlanIdEnum }) => {
  dashboard.value = { updatePromise: e.updatePromise, objects: e.objects, containerId: e.containerId }
  objectsToLink.value = dashboard.value.objects.map(o => o.object)
  tempObjectsToLink.value = dashboard.value.objects.map(o => o.object)
  currentContainerItemsCount.value = objectsToLink.value.length
  formModal.value = true
}

const closeFolderBrowser = () => {
  formModal.value = false
  dashboard.value = null
  objectsToLink.value = []
  currentContainerItemsCount.value = 0
}

const addObjects = () => () =>
  new Promise<void>(async (r, x) => {
    try {
      await dashboard.value!.updatePromise(objectsToLink.value)
      const addedItemsCount = objectsToLink.value.length - currentContainerItemsCount.value
      if (addedItemsCount >= 1)
        appService.success(tConfiguration.value.notifications.addDashboardItem[dashboard.value?.containerId!](addedItemsCount) as any, undefined, 'dashboard-configuration@index::addObjects')
      else appService.success(tConfiguration.value.notifications.updateDashboard[dashboard.value?.containerId!] as any, undefined, 'dashboard-configuration@index::addObjects')
      closeFolderBrowser()
      r()
    } catch (error) {
      appService.error(tGlobal.value.errors.requestError as any, undefined, 'dashboard-configuration@index::addObjects')
      x(error)
    }
  })

watch(
  () => appService.application.state.session?.ui?.userProfile,
  to => {
    if (!appService.application.state.session?.ui?.userProfile || appContext.services[serviceMap.AppService.key].application.state.session.ui.userProfile?.superAdmin) return
    if (to?.userType != UserTypeEnum.admin) router.push({ name: 'access-denied', query: router.currentRoute.value.query })
  },
  { immediate: true }
)

const DashboardConfiguration = defineAsyncComponent(() => import('../../components/dashboard-configuration/index.vue'))
</script>
