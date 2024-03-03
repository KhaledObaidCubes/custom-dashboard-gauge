import { IAppService, TModal, TOpenPromise } from 'cubes-ui'

import { TDashboardApplication } from '../../domain/meta/i-application'
import { TModalMap } from '../../../adafsa-custom-control'

export type TNoNext<T> = Omit<T, 'next'>

export type TModalManagerAction<T extends keyof TModalMap> = Promise<TNoNext<TOpenPromise<TModal<TModalMap, T>>>>
interface IDashboardAppService extends IAppService {
  application: TDashboardApplication
  //addCustomFieldsAsync(config?: Partial<TDefaultAddCustomFieldDelegateProps>): TModalManagerAction<'Dashboard@Settings@AddCustomFields'>
}
export type { IDashboardAppService }
