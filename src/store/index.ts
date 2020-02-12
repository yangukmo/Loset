import modules from '@/store/modules'
import Vue from 'vue'
import Vuex from 'vuex'
import { createPersistedState } from 'vuex-electron'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: (process.env.NODE_ENV !== 'production'),
  plugins: [createPersistedState()],
})

export default store
