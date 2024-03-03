import { IHistoricalPI, IHistoricalPIService as A } from 'cubes-dashboard'
import { IGetUnitObjectives } from './api-args'
import { TProxyResult } from '@/adafsa-custom-control'

interface IHistoricalPIService extends A {
  listObjectives(query: IGetUnitObjectives): TProxyResult<IHistoricalPI>

  getUnitPi(id: string): TProxyResult<IHistoricalPI>
}
export type { IHistoricalPIService }
