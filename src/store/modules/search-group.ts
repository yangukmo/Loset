import { ActionContext } from 'vuex'
import { IRootState, ISearchGroupState } from '../module.interface'

const state: ISearchGroupState = {
  keyword: '',
}

const getters = {
  getKeyword(state: ISearchGroupState): string {
    return state.keyword
  },
}

const mutations = {
  updateKeyword(state: ISearchGroupState, keyword: string): void {
    state.keyword = keyword
  },
}

const actions = {
  setKeyword(context: ActionContext<ISearchGroupState, IRootState>, keyword: InputEvent): void {
    context.commit('updateKeyword', keyword)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
