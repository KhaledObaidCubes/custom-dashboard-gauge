import { Pagination, clientFactory } from 'cubes-ui'

import { PIProjectsList } from 'cubes-dashboard'

const { baseURL, api } = window['configure']().network['shared']
const config = { baseURL: `${baseURL}${api}` }

const pIProjectsList = () =>
  clientFactory(
    true,
    PIProjectsList,
    config,
    {
      expand: { verb: 'get', template: '/CustomDashboards/StrategicObjective/Expand/' }
    },
    undefined,
    { dataResolver: (json: any) => json.records ?? json, paginationResolver: (_headers, json) => new Pagination({ totalCount: json.totalCount }) },
    false
  )

const clientMap = { pIProjectsList }
type TpIProjectsListClient = typeof clientMap

export { pIProjectsList }
export type { TpIProjectsListClient }
