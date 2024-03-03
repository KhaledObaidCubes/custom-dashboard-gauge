<template>
  <v-card header-class="bg-secondary d-flex justify-content-between align-items-center" body-class="p-0">
    <template #header>
      <h5 class="mb-0 text-muted my-2">{{ tConfiguration.configCard.title[containerId!] }}</h5>
      <v-button v-if="data.length" modifier="subtle" accent="primary" class="mr-1 tip tip-left" :aria-label="tConfiguration.add" @click="openFolderBrowser"><v-icon name="plus" /> </v-button>
    </template>
    <v-async v-model="asyncModel" :promise="fetchOptions">
      <template #ready="{ result: { success } }">
        <template v-if="success">
          <div v-if="!data.length">
            <v-empty key="nodata" figure="nodata" figure-width="35%" :title="tConfiguration.configCard.emptyContainer[containerId!]">
              <template #figure>
                <v-tile
                  :icon="{ name: containerId == PlanIdEnum.strategic ? 'cubes-priority' : containerId == PlanIdEnum.executive ? 'cubes-objectives-large' : 'cubes-initiatives-large' }"
                  size="xl"
                  :circle="true"
                  tag="div"
                  class="bg-grey text-muted"
                  no-color
                >
                  <slot name="icon">
                    <v-icon :name="containerId == PlanIdEnum.strategic ? 'cubes-priority' : containerId == PlanIdEnum.executive ? 'cubes-objectives-large' : 'cubes-initiatives-large'" size="xl" />
                  </slot>
                </v-tile>
              </template>
              <template #action>
                <v-button @click="openFolderBrowser" modifier="outline">{{ tConfiguration.configCard.addContainer[containerId!] }}</v-button>
              </template>
            </v-empty>
          </div>
          <div v-else>
            <div class="d-flex justify-content-between align-items-center py-2">
              <div class="d-flex align-items-center mx-3 my-2">
                <b class="text-muted">{{ tConfiguration.configCard.subTitle[containerId!] }}</b>
                <v-badge class="ml-2 p-2 bg-muted text-muted">{{ data.length }}</v-badge>
              </div>
              <v-spinner v-if="isBusy" class="d-flex align-items-center text-primary mx-3 my-2 font-weight-bold" size="sm" />
              <a v-else v-fake-link class="d-flex align-items-center text-primary mx-3 my-2 font-weight-bold" @click="deleteAllDashboardsItems">
                <span>{{ tConfiguration.deleteAll }}</span>
                <v-icon class="ml-2" name="xmark" size="lg" />
              </a>
            </div>
            <div class="mx-3 my-2">
              <v-input v-model="searchModel" :placeholder="tConfiguration.search" :pre="[{ type: 'text', props: { icon: 'search', type: 'icon' } }]" unified label-sizeless />
            </div>
            <div class="overflow-auto" style="max-height: 50vh">
              <div v-for="(item, i) in dataList" :key="item.object.id" class="d-flex align-items-center justify-content-between mx-3 my-2" :class="{ 'border-bottom': i != dataList.length - 1 }">
                <v-literal :modelValue="item.object.name" class="w-75" :dir="appState.ui.culture.dir" />
                <app-button-confirm class="d-flex justify-content-end in-slide-button flex-grow-1" v-model="buttonsState[i]" :duration-ms="250" :slide-classes="'d-flex flex-fill'">
                  <template v-slot:b0>
                    <div class="ml-auto mr-n1 d-flex align-items-center">
                      <v-button icon accent="reset" class="ml-auto" key="delete?" size="sm" :class="{ active: buttonsState[i] == 0 }" @click="buttonsState[i] = 1">
                        <v-icon :name="['far', 'trash-can']" />
                      </v-button>
                    </div>
                  </template>
                  <template v-slot:b1 class="in-slide-button d-flex justify-content-end">
                    <div class="ml-auto mr-n1 d-flex align-items-center justify-content-end">
                      <app-async-button
                        accent="reset"
                        size="sm"
                        key="yes"
                        :class="{ active: buttonsState[i] == 1 }"
                        @click="deleteDashboardItemAsync(item.object)"
                        class="ml-auto text-danger px-2 mr-2"
                      >
                        <v-icon :name="['far', 'trash-can']" />
                      </app-async-button>
                      <v-button accent="reset" modifier="none" size="sm" key="no" :class="{ active: buttonsState[i] == 1 }" @click="buttonsState[i] = 0" class="px-2 text-muted">
                        <v-icon name="fas fa-times" />
                      </v-button>
                    </div>
                  </template>
                </app-button-confirm>
              </div>
            </div>
          </div>
        </template>
        <v-empty v-else key="error" figure="error" :subtitle="tGlobal.errors.requestError" class="m-auto" figure-width="70%" />
      </template>
      <template #busy>
        <div class="d-flex h-100 my-4">
          <div class="m-auto">
            <v-spinner size="sm" />
          </div>
        </div>
      </template>
    </v-async>
  </v-card>
</template>

<script setup lang="ts">
import { IoC, merge } from 'cubes'
import { defaultConfirmDelegateProps, useDebouncedRef, useTranslation } from 'cubes-ui'
import { Ref, ref, toRef, watch } from 'vue'
import { props as dashboardConfiguration } from './def'
import { serviceMap } from '@/service'
import { i18nMap } from '@/i18n'
import { PlanIdEnum } from 'cubes-dashboard'
import type { IBasicObject } from 'cubes-app'
import type { ICustomDashboardService, IListCustomDashboardArgs, ICustomDashboard } from 'cubes-dashboard'
import type { IAppContext, IAppService, IModalManager, TModal, TModalMap } from 'cubes-ui'
import type { Ti18n } from '@/i18n'
import type { TConfigurationEnMapTranslation } from '@/i18n/index'

const emit = defineEmits(['openFolderBrowser'])
const props = defineProps(dashboardConfiguration)
const appContext = IoC.DI().resolve<IAppContext>(`appContext`),
  appService = appContext.services[serviceMap.AppService.key] as IAppService,
  appState = appContext!.services[serviceMap.AppService.key]?.application.state,
  modalManager = IoC.DI().resolve<IModalManager<TModalMap>>(serviceMap.ModalManager.key),
  tConfiguration = toRef(useTranslation<Ti18n>(appService, [i18nMap['configuration']]), 'tConfiguration') as unknown as Ref<TConfigurationEnMapTranslation>,
  customDashboardService = IoC.DI().resolve<ICustomDashboardService>(serviceMap.CustomDashboardService.key),
  tGlobal = appContext.translation.global,
  buttonsState = ref([]) as Ref<number[]>,
  containerId = ref(props.containerId),
  asyncModel = ref(false),
  data = ref([]) as Ref<ICustomDashboard[]>,
  dataList = ref([]) as Ref<ICustomDashboard[]>,
  searchModel = useDebouncedRef('', 1000),
  isBusy = ref(false)

const fetchOptions = () => () =>
  new Promise(async (r, x) => {
    try {
      const result = await customDashboardService.listCustomDashboard({ Limit: 0, Offset: 0, containerID: containerId.value } as IListCustomDashboardArgs)
      data.value = result.data as ICustomDashboard[]
      dataList.value = [...data.value]
      buttonsState.value = dataList.value.map(() => 0)
      r(result)
    } catch (error) {
      appService.error(tGlobal.value.errors.requestError as any, undefined, 'dashboard-configuration@index::fetchOptions')
      x(error)
    }
  })

const deleteDashboardItemAsync = (dashboard: IBasicObject, multi?: boolean) => () =>
  new Promise<void>(async (r, x) => {
    try {
      await customDashboardService.deleteCustomDashboard(containerId.value!.toString(), dashboard)
      if (!multi) {
        appService.success(tConfiguration.value.notifications.deletedDashboardItem[containerId.value!] as any, undefined, 'dashboard-configuration@index::deleteDashboardAsync')
        asyncModel.value = true
      }
      r()
    } catch (error) {
      !multi && appService.error(tGlobal.value.errors.requestError as any, undefined, 'dashboard-configuration@index::deleteDashboardAsync')
      x(error)
    }
  })

const deleteAllDashboardsItems = async () => {
  if (await confirmDeleteAll()) {
    try {
      isBusy.value = true
      await Promise.all(data.value.map(async d => await deleteDashboardItemAsync(d.object, true)()))
      isBusy.value = false
      asyncModel.value = true
      appService.success(tConfiguration.value.notifications.deleteAllDashboardItems[containerId.value!] as any, undefined, 'dashboard-configuration@index::deleteAllDashboardsItems')
    } catch (error) {
      appService.error(tGlobal.value.errors.requestError as any, undefined, 'dashboard-configuration@index::deleteAllDashboardsItems')
    }
  }
}

const updateDashboardAsync = (items: IBasicObject[]) =>
  new Promise<void>(async (r, x) => {
    try {
      await customDashboardService.updateCustomDashboard(containerId.value!.toString(), items)
      asyncModel.value = true
      r()
    } catch (error) {
      appService.error(tGlobal.value.errors.requestError as any, undefined, 'dashboard-configuration@index::updateDashboardAsync')
      x(error)
    }
  })

const confirmDeleteAll = () => {
  const config = merge(true, defaultConfirmDelegateProps(), {
    isStatic: true,
    noCloseButton: true,
    yesButton: { modifier: 'outline', accent: 'primary', title: tConfiguration.value.deleteAll },
    noButton: { accent: 'primary', title: tGlobal.value.cancel },
    cancelButton: undefined,
    i18n: {
      title: tGlobal.value.deleteAll,
      body: tConfiguration.value.deleteAllBody + ' ' + tConfiguration.value.configCard.title[containerId.value!]
    }
  }) as TModal<TModalMap, 'confirm'>
  return new Promise(res => {
    modalManager
      .open(config)
      .then(e => {
        e.next()
        res(e.type == 'yes')
      })
      .catch(e => {
        e.next()
        res(false)
      })
  })
}

const search = () => {
  dataList.value = data.value.filter(d => d.object.name[appState.ui.culture.lang].toLowerCase().includes(searchModel.value.toLowerCase()))
  buttonsState.value = dataList.value.map(() => 0)
}

const openFolderBrowser = () => emit('openFolderBrowser', { updatePromise: updateDashboardAsync, objects: data.value, containerId: containerId.value })

watch(() => searchModel.value, search)
</script>
