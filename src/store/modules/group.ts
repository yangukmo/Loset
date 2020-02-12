import { IGroup } from '@/api/interface/group.interface'
import { IPC_EVENT } from '@/shared/enum'
import { IGroupState, IRootState } from '@/store/module.interface'
import { ipcRenderer } from 'electron'
import { ActionContext } from 'vuex'

const state: IGroupState = {
  id: '',
  groups: [],
}

const getters = {
  groupId(state: IGroupState): string {
    return state.id
  },
  groupName(state: IGroupState): string {
    return state.groups.find((group) => group.id === state.id)?.name || ''
  },
  groupColor(state: IGroupState): string {
    return state.groups.find((group) => group.id === state.id)?.theme?.color || '#009CE0'
  },
  groups(state: IGroupState): IGroup[] {
    return state.groups
  },
}

const mutations = {
  updateGroupId(state: IGroupState, id: string): void {
    state.id = id
  },
  updateGroups(state: IGroupState, groups: IGroup[]): void {
    state.groups = groups
  },
}

const actions = {
  getGroups(context: ActionContext<IGroupState, IRootState>): void {
    ipcRenderer.send(IPC_EVENT.GET_GROUPS)
    ipcRenderer.once(IPC_EVENT.GET_GROUPS, (event, data: IGroup[]) => {
      context.commit('updateGroups', data)

      const { id } = context.state
      const isDeletedId = !data.find((group) => group.id === id)
      if (isDeletedId) {
        context.commit('updateGroupId', '')
      }
    })
  },
  setGroupId(context: ActionContext<IGroupState, IRootState>, id: string): void {
    context.commit('updateGroupId', id)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}


