import { Pagination, clientFactory } from 'cubes-ui'

import { HistoricalPI } from 'cubes-dashboard'

const { baseURL, api } = window['configure']().network['shared']
const config = { baseURL: `${baseURL}${api}` }

const historicalPI = () =>
  clientFactory(
    true,
    HistoricalPI,
    config,
    {
      get: { verb: 'get', template: '/StandardDashboard/PI/{1}/' },
      list: { verb: 'get', template: '/CustomDashboards/PlanCounters/' },
      listObjective: { verb: 'get', template: '/CustomDashboards/StrategicObjective/List/' },
      getUnitPi: { verb: 'get', template: '/CustomDashboards/UnitPI/{1}/' }
    },
    undefined,
    { dataResolver: (json: any) => json.records ?? json, paginationResolver: (_headers, json) => new Pagination({ totalCount: json.totalCount }) },
    false
  )

const clientMap = { historicalPI }
type THistoricalPIClient = typeof clientMap

export { historicalPI }
export type { THistoricalPIClient }
