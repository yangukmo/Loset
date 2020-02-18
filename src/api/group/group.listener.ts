import GroupService from '@/api/group/group.service'
import { IIPCEvent } from '@/api/interface/listener.interface'
import { IPC_EVENT } from '@/shared/enum'
import { ipcMain } from 'electron'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class GroupListener {
  private readonly eventList: IIPCEvent[]

  constructor(
    private readonly groupService: GroupService,
  ) {
    this.eventList = [
      { event: IPC_EVENT.GET_GROUP, func: this.groupService.getGroup },
      { event: IPC_EVENT.GET_GROUPS, func: this.groupService.getGroups },
      { event: IPC_EVENT.CREATE_GROUP, func: this.groupService.createGroup },
      { event: IPC_EVENT.UPDATE_GROUP, func: this.groupService.updateGroup },
      { event: IPC_EVENT.DELETE_GROUP, func: this.groupService.deleteGroup },
      { event: IPC_EVENT.UPDATE_GROUPS_ORDER, func: this.groupService.updateGroupsOrder },
    ]

    this.listenEvents()
  }

  private listenEvents(): void {
    this.eventList.forEach((ipcEvent) => ipcMain.on(ipcEvent.event, ipcEvent.func))

    // ipcMain.on(IPC_EVENT.GET_GROUP, this.groupService.getGroup)
    //   .on(IPC_EVENT.GET_GROUPS, this.groupService.getGroups)
    //   .on(IPC_EVENT.CREATE_GROUP, this.groupService.createGroup)
    //   .on(IPC_EVENT.UPDATE_GROUP, this.groupService.updateGroup)
    //   .on(IPC_EVENT.DELETE_GROUP, this.groupService.deleteGroup)
    //   .on(IPC_EVENT.UPDATE_GROUPS_ORDER, this.groupService.updateGroupsOrder)
  }

  removeEvents(): void {
    this.eventList.forEach((ipcEvent) => ipcMain.removeAllListeners(ipcEvent.event))
    // ipcMain.removeAllListeners(IPC_EVENT.GET_GROUP)
    // ipcMain.removeAllListeners(IPC_EVENT.GET_GROUPS)
    // ipcMain.removeAllListeners(IPC_EVENT.CREATE_GROUP)
    // ipcMain.removeAllListeners(IPC_EVENT.UPDATE_GROUP)
    // ipcMain.removeAllListeners(IPC_EVENT.DELETE_GROUP)
    // ipcMain.removeAllListeners(IPC_EVENT.UPDATE_GROUPS_ORDER)
  }
}
