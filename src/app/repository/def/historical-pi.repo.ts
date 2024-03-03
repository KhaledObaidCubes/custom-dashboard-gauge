import { Service } from 'cubes'

import { HistoricalPIRepositoryBase, type IHistoricalPI } from 'cubes-dashboard'
import { repositoryMap } from '@/service'
import type { IHistoricalPIRepository } from '../meta/i-historical-pi-repo'
import type { THistoricalPIClient } from '../proxy/historical-pis.proxy'
import { IoCLevelsEnum, TProxyResult } from '@/adafsa-custom-control'

import { TClients } from '@/proxy'

@Service(IoCLevelsEnum.DEV_2, repositoryMap.HistoricalPIRepository.key)
class HistoricalPIRepository extends HistoricalPIRepositoryBase<TClients> implements IHistoricalPIRepository<TClients> {
 
  get clientMapsKey(): 'historicalPI' {
    return 'historicalPI'
  }

  listObjectives(query: any): TProxyResult<IHistoricalPI> {
    return (this.networkManager.clients[this.clientMapsKey] as ReturnType<THistoricalPIClient['historicalPI']>).api.listObjective({ query: { ...query, ...this.UrlQueryService.getDateQuery() } })
  }

  getUnitPi(id: string): TProxyResult<IHistoricalPI> {
    return (this.networkManager.clients[this.clientMapsKey] as ReturnType<THistoricalPIClient['historicalPI']>).api.getUnitPi({ id  })
  }
}
export { HistoricalPIRepository }
