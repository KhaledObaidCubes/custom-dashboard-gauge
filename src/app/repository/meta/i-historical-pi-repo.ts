import { TProxyResult } from '@/adafsa-custom-control'
import { THashMap } from 'cubes'
import type { IHistoricalPI, IHistoricalPIRepository as A } from 'cubes-dashboard'

interface IHistoricalPIRepository<T extends THashMap<Function>> extends A<T> {
  listObjectives(query: any): TProxyResult<IHistoricalPI>

  getUnitPi(id: string): TProxyResult<IHistoricalPI>
}
export type { IHistoricalPIRepository }
