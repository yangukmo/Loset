import { IAppInClient } from '@/api/interface/app.interface'
import { IPC_EVENT } from '@/shared/enum'
import { IAppState, IRootState } from '@/store/module.interface'
import { ipcRenderer } from 'electron'
import { ActionContext } from 'vuex'

const state: IAppState = {
  apps: [],
}

const getters = {
  apps(state: IAppState): IAppInClient[] {
    return state.apps
  },
  hasActive(state: IAppState): boolean {
    return state.apps.some((app) => app.active)
  },
  isEmpty(state: IAppState): boolean {
    return !state.apps.length
  },
}

const mutations = {
  updateApps(state: IAppState, apps: IAppInClient[]): void {
    state.apps = apps
  },
}

const actions = {
  getApps(context: ActionContext<IAppState, IRootState>): void {
    ipcRenderer.send(IPC_EVENT.GET_APPS, { group_id: context.rootState.group.id })
    ipcRenderer.once(IPC_EVENT.GET_APPS, (event, data) => {
      context.commit('updateApps', data)
    })
  },
  setApps(context: ActionContext<IAppState, IRootState>, apps: IAppInClient[]): void {
    context.commit('updateApps', apps)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}



