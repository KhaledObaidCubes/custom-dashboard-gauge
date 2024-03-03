import { Service } from 'cubes'
import { IHistoricalPIService } from '../meta/i-historica-pi.service'
import { HistoricalPIServiceBase as A, IHistoricalPI } from 'cubes-dashboard'
import { serviceMap } from '@/service'
import { IoCLevelsEnum } from '@/adafsa-custom-control'
import { TResult } from 'cubes-ui'
import { IGetUnitObjectives } from '../meta/api-args'
import { IHistoricalPIRepository } from '@/app/repository/meta/i-historical-pi-repo'
import { TClients } from '@/proxy'

@Service(IoCLevelsEnum.DEV_2, serviceMap.HistoricalPIService.key)
class HistoricalPIService extends A<IHistoricalPIRepository<TClients>> implements IHistoricalPIService {
  listObjectives(query: IGetUnitObjectives): Promise<TResult<IHistoricalPI>> {
    return this.HistoricalPIRepository.listObjectives(query)
  }

  getUnitPi(id: string): Promise<TResult<IHistoricalPI>> {
    return this.HistoricalPIRepository.getUnitPi(id)
  }
}

export default HistoricalPIService
