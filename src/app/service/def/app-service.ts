import { AppServiceBase, IModalManager } from 'cubes-ui'
import { Inject, Service, Singleton } from 'cubes'
import { IoCLevelsEnum, TModalMap } from '../../../adafsa-custom-control'

import { DashboardApplication } from '../../../app/domain/def/application'
import { IDashboardAppService } from '../meta/i-app-service'
import { TApplicationConfig } from 'cubes-ui/dist/types/lib/module'
import { TDashboardApplication } from '../../domain/meta/i-application'
import { serviceMap } from '../../../service'

@Service(IoCLevelsEnum.PROD_1, serviceMap.AppService.key)
@Singleton
class DashboardAppService extends AppServiceBase implements IDashboardAppService {
  public readonly id: string = serviceMap.AppService.key
  application!: TDashboardApplication // = new DashboardApplication({})
  @Inject() ModalManager!: IModalManager<TModalMap>
  protected createApp(config: Partial<TApplicationConfig>, state?: TDashboardApplication['state']) {
    this.application = new DashboardApplication({ config, state } as Partial<TDashboardApplication>)
  }
  // public addCustomFieldsAsync(config: Partial<TDefaultAddCustomFieldDelegateProps> = {}): TModalManagerAction<'Dashboard@Settings@AddCustomFields'> {
  //   return new Promise(async r => {
  //     const { next, ...result } = await this.ModalManager.open({ type: 'Dashboard@Settings@AddCustomFields', ...config })
  //     next()
  //     r(result as any)
  //   })
  // }
}

export default DashboardAppService
