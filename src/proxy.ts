import { clientMaps as cubesAppClientMaps } from 'cubes-app'
import { clientMaps as cubesDashboardClientMaps } from 'cubes-dashboard'
import { unitCounter } from './app/repository/proxy/unit-counter.proxy'
import { pIProjectsList } from './app/repository/proxy/pi-projects-list.proxy'
import { historicalPI } from './app/repository/proxy/historical-pis.proxy'
const clientMaps = {
  ...cubesAppClientMaps,
  ...cubesDashboardClientMaps,
  unitCounter,
  pIProjectsList,
  historicalPI
}
export { clientMaps }
export type TClients = typeof clientMaps
