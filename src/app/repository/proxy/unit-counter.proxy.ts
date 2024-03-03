import { Pagination, clientFactory } from 'cubes-ui'

import { UnitCounter } from 'cubes-dashboard'

const { baseURL, api } = window['configure']().network['shared']
const config = { baseURL: `${baseURL}${api}` }

const unitCounter = () =>
  clientFactory(
    true,
    UnitCounter,
    config,
    {
      get: { verb: 'get', template: '/CustomDashboards/PlanCounters/' },
      list: { verb: 'get', template: 'StandardDashboard/UnitCounters/{1}/ListSubUnits' }
    },
    undefined,
    { dataResolver: (json: any) => json.records ?? json, paginationResolver: (_headers, json) => new Pagination({ totalCount: json.totalCount }) },
    false
  )

const clientMap = { unitCounter }
type TUnitCounterClient = typeof clientMap

export { unitCounter }
export type { TUnitCounterClient }
