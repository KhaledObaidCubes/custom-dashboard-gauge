import {
  CubesBudget,
  CubesEndDate,
  CubesInitiativesLarge,
  CubesInitiativesSmall,
  CubesKpisLarge,
  CubesKpisSmall,
  CubesObjectivesLarge,
  CubesObjectivesSmall,
  CubesPercent,
  CubesPeriods,
  CubesSpendingLarge,
  CubesSpendingSmall,
  CubesStartDate,
  CubesTarget,
  cubesDashboardI18nFiles
} from 'cubes-dashboard'
import { THashMap, uid } from 'cubes'
import { TResult, modalMap as builtInModalMap } from 'cubes-ui'
import { serviceMap, services } from './service'

import { AppCoreBase } from 'cubes-app'
import Application from './app/App.vue'
import { App as TApp } from 'vue'
import { clientMaps } from './proxy'
import { services as cubesDashboardServices } from 'cubes-dashboard'
import { i18nFiles } from './i18n'
import { install } from 'cubes-dashboard'
import routes from './app/sitemap'
import { TConfig } from './app/domain/meta/i-application'

const modalMap = {
  ...builtInModalMap
}

export type TProxyResult<T> = Promise<TResult<T>>
export const AppContexts: THashMap = {
  appContext: `appContext`,
  unitLayout: `unitLayout-${uid()}`
  //reportContext: `reportContext-${uid()}`
} as any // TODO: remove any
type TModals = typeof modalMap
export type TModalMap = { [key in keyof TModals]: (typeof modalMap)[key]['props'] }

export enum IoCLevelsEnum {
  DEFAULT_0, // cubes level services..
  PROD_1, // first overrides
  DEV_2 // you can add up as much as you wish in the container
}

class App extends AppCoreBase {
  constructor(e: HTMLElement, c: TConfig) {
    //@ts-ignore
    super(e, c, Application, IoCLevelsEnum.DEV_2, __lib__)
    //@ts-ignore
    this.version = __version__
  }

  install(app: TApp<Element>) {
    install(app)
  }

  setupActiveControl() {
    return this
  }
  getCustomIcons() {
    return [
      CubesObjectivesLarge,
      CubesObjectivesSmall,
      CubesKpisLarge,
      CubesKpisSmall,
      CubesInitiativesLarge,
      CubesInitiativesSmall,
      CubesPeriods,
      CubesTarget,
      CubesPercent,
      CubesSpendingLarge,
      CubesSpendingSmall,
      CubesBudget,
      CubesStartDate,
      CubesEndDate,
      require('./app/icons/priority@icon').default.definition
    ]
  }
  getAppContext(): any {
    return AppContexts
  }
  getServiceMap() {
    return serviceMap
  }
  getServices() {
    return [cubesDashboardServices, services]
  }
  geti18n() {
    return [cubesDashboardI18nFiles, i18nFiles]
  }
  getSiteMapRoutes() {
    return routes
  }
  getModalConfig() {
    return modalMap
  }
  getNetworkClients() {
    return clientMaps
  }
}

export { App }
