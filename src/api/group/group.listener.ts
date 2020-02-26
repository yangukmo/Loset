import GroupService from '@/api/group/group.service'
import { IIpcEvent } from '@/api/interface/listener.interface'
import { IPC_EVENT } from '@/shared/enum'
import { ipcMain } from 'electron'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class GroupListener {
  private readonly eventList: IIpcEvent[]

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
  }

  removeEvents(): void {
    this.eventList.forEach((ipcEvent) => ipcMain.removeAllListeners(ipcEvent.event))
  }
}
