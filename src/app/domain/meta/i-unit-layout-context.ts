import { THashMap } from 'cubes'
import { TTranslation } from 'cubes-ui'
import { Ref } from 'vue'

interface IUnitLayoutContext {
  translation: THashMap<Ref<TTranslation>>
  props: THashMap<any>
}

export type { IUnitLayoutContext }
