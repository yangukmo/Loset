import AppManager from '@/api/app/app-manager'
import GroupManager from '@/api/group/group-manager'
import { ITheme } from '@/api/interface/app.interface'
import WindowManager from '@/api/window-mananger'
import { IPC_EVENT } from '@/shared/enum'
import { MESSAGE } from '@/shared/enum/message'
import { dialog, IpcMainEvent } from 'electron'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class GroupService {
  constructor(
    private readonly groupManager: GroupManager,
    private readonly windowManager: WindowManager,
    private readonly appManager: AppManager,
  ) {
  }

  getGroup = (event: IpcMainEvent, id: string): void => {
    const group = this.groupManager.getGroup(id)
    event.sender.send(IPC_EVENT.GET_GROUP, group)
  }

  getGroups = (event: IpcMainEvent): void => {
    const groups = this.groupManager.getGroups()
    event.sender.send(IPC_EVENT.GET_GROUPS, groups)
  }

  createGroup = (event: IpcMainEvent, group: ICreateGroup): void => {
    this.groupManager.createGroup(group)
    event.returnValue = true
  }

  updateGroup = (event: IpcMainEvent, group: IUpdateGroup): void => {
    this.groupManager.updateGroup({
      id: group.id,
      name: group.name,
      theme: group.theme,
    })
  }

  deleteGroup = async (event: IpcMainEvent, id: string): Promise<void> => {
    const group = this.groupManager.getGroup(id)

    if (!group) {
      return
    }

    const appCount = group.apps.length

    const message = appCount ? MESSAGE.DELETE_APPS_IN_GROUP.replace('{appCount}', appCount.toString()) : MESSAGE.DELETE_GROUP

    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['Cancel', 'Delete'],
      message,
      type: 'warning',
    })

    if (response === 0) {
      return
    }

    group.apps.forEach((appId) => this.appManager.deleteApp(appId))
    this.groupManager.deleteGroup(id)

    event.sender.send(IPC_EVENT.SYNC_GROUPS)
  }

  updateGroupsOrder = (event: IpcMainEvent, sortedGroupIdList: string[]): void => {
    this.groupManager.updateGroupsOrder(sortedGroupIdList)
  }
}

interface ICreateGroup {
  name: string
  theme: ITheme
}

interface IUpdateGroup {
  id: string
  name: string
  theme: {
    color: string
  }
}
