import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { getUniqueIdList, setUniqueIdList } from '@/utils/cookies'
import store from '@/store'

export interface IOrderState {
  uniqueIdList: any
}

@Module({ dynamic: true, store, name: 'Order' })
class Order extends VuexModule implements IOrderState {
  public uniqueIdList =  getUniqueIdList() || ''

  @Mutation
  private SET_UNIQUE_ID_LIST(uniqueIdList: string) {
    this.uniqueIdList = uniqueIdList
  }

  @Action
  public async SET_UNIQUEIDLIST(uniqueIdList:any) {
    this.SET_UNIQUE_ID_LIST(uniqueIdList)
    setUniqueIdList(JSON.stringify(uniqueIdList))
  }
}

export const OrderModule = getModule(Order)
