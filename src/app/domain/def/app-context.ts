import { Ti18n } from '@/i18n'
import { Singleton, THashMap } from 'cubes'
import { CubesServiceBase } from 'cubes-ui'
import type { IAppContext, TServiceNames } from '../meta/i-app'

@Singleton
export class AppContext implements IAppContext {
  services: Partial<{ [k in keyof TServiceNames]: CubesServiceBase }>
  translation: THashMap<Ti18n>

  constructor(_services: Partial<{ [k in keyof TServiceNames]: CubesServiceBase }> = {}, translation: THashMap<any> = {}) {
    this.services = _services
    this.translation = translation
  }
}
