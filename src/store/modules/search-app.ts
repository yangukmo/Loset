const state = {
  keyword: '',
}

const getters = {
  getKeyword(state: any): string {
    return state.keyword
  },
}

const mutations = {
  updateKeyword(state: any, keyword: string): void {
    state.keyword = keyword
  },
}

const actions = {
  setKeyword(context: any, keyword: InputEvent): void {
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
