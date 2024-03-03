//@ts-nocheck

import { Ti18n as TCubesAppI18n, i18nMap as cubesAppI18nMap } from 'cubes-app'
import { Ti18n as TCubesUII18n, i18nMap as cubesUiI18nMap } from 'cubes-ui'

import { i18nMap as cubesDashboardI18nMap } from 'cubes-dashboard'

const i18nFiles = require.context('.', true, /\.i18n.ts$/)
export { i18nFiles }

//
const i18nMapApp = {
  unit: 'unit',
  'unit-overview': 'unit-overview',
  'object-summary': 'object-summary',
  greeting: 'greeting',
  'executive-plan': 'executive-plan',
  'strategic-plan': 'strategic-plan',
  'government-common-kpis': 'government-common-kpis',
  configuration: 'configuration'
}
export const i18nMap = {
  ...cubesUiI18nMap,
  ...cubesAppI18nMap,
  ...cubesDashboardI18nMap,
  ...i18nMapApp
}

export type Ti18n = typeof i18nMapApp & TCubesAppI18n & TCubesUII18n
