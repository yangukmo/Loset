import { IRootState, ISearchAppState } from '@/store/module.interface'
import { ActionContext } from 'vuex'

const state: ISearchAppState = {
  keyword: '',
}

const getters = {
  getKeyword(state: ISearchAppState): string {
    return state.keyword
  },
}

const mutations = {
  updateKeyword(state: ISearchAppState, keyword: string): void {
    state.keyword = keyword
  },
}

const actions = {
  setKeyword(context: ActionContext<ISearchAppState, IRootState>, keyword: InputEvent): void {
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
