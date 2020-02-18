import App from '@/api/app/app'
import AppManager from '@/api/app/app-manager'
import ConfigFile from '@/api/app/config-file'
import GroupManager from '@/api/group/group-manager'
import HealthCheck2 from '@/api/hc/hc'
import HealthCheckManager from '@/api/hc/hc-manager'
import { ITheme } from '@/api/interface/app.interface'
import { ISelectDirectory } from '@/api/interface/ipc-service.interface'
import { Util } from '@/api/util'
import WindowManager from '@/api/window-mananger'
import { IPC_EVENT } from '@/shared/enum'
import { MESSAGE, MESSAGE_EVENT } from '@/shared/enum/message'
import { dialog, IpcMainEvent, shell } from 'electron'
import 'reflect-metadata'
import path from "path"
import { Service } from 'typedi'

@Service()
export default class AppService {
  constructor(
    private readonly appManager: AppManager,
    private readonly groupManager: GroupManager,
    private readonly windowManager: WindowManager,
    private readonly hcManager: HealthCheckManager,
  ) {
  }

  getApp = (event: IpcMainEvent, id: string): void => {
    event.sender.send(IPC_EVENT.GET_APP, this.appManager.getApp(id))
  }

  getApps = (event: IpcMainEvent, params: { group_id: string }): void => {
    const group = this.groupManager.getGroup(params?.group_id)
    const apps = this.appManager.getApps()
    const filteredApps = group ? apps.filter((app) => group.apps.includes(app.id)) : apps

    event.sender.send(IPC_EVENT.GET_APPS, filteredApps)
  }

  createApp = (event: IpcMainEvent, app: ICreateApp): void => {
    const id = Util.createRandomId()
    const hasApp = this.appManager.hasApp(id)

    if (hasApp) {
      event.returnValue = false
      event.sender.send(MESSAGE_EVENT.ERROR, MESSAGE.ALREADY_REGISTERED_APP)
      return
    }

    this.appManager.addApp(new App({
      id,
      dir: app.dir,
      name: app.name,
      start_cmd: app.start_cmd,
      auto_start: app.auto_start,
      created_at: Date.now(),
      order: this.appManager.createNewOrder(),
      theme: app.theme,
      hc: app.hc,
    }))

    if (app.hc.active) {
      this.hcManager.addHealthCheck(new HealthCheck2({
        id,
        port: app.hc.port,
        path: app.hc.path,
        interval: app.hc.interval,
      }))
    }

    if (app.group_id) {
      this.groupManager.addApp({
        group_id: app.group_id,
        app_id: id,
      })
    }

    event.returnValue = true
  }

  updateApp = (event: IpcMainEvent, app: IUpdateApp): void => {
    this.appManager.updateApp({
      id: app.id,
      name: app.name,
      start_cmd: app.start_cmd,
      auto_start: app.auto_start,
      hc: app.hc,
      theme: app.theme,
    })
  }

  updateAppsOrder = (event: IpcMainEvent, sortedAppIdList: string[]): void => {
    this.appManager.updateAppsOrder(sortedAppIdList)
  }

  deleteApps = async (event: IpcMainEvent, groupId: string): Promise<void> => {
    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['Cancel', 'Delete'],
      message: MESSAGE.DELETE_ALL_APPS,
      type: 'warning',
    })

    if (response === 0) {
      return
    }

    const group = this.groupManager.getGroup(groupId)
    const apps = this.appManager.getApps()
    const targetApps = group ? apps.filter((app) => group.apps.includes(app.id)) : apps
    const targetAppIds = targetApps.map((app) => app.id)

    this.appManager.deleteApps(targetAppIds)

    if (group) {
      this.groupManager.deleteAppsInGroup(group.id)
    } else {
      this.groupManager.deleteAppsInAllGroups()
    }
    event.sender.send(IPC_EVENT.SYNC_APPS)
    event.sender.send(IPC_EVENT.SYNC_GROUPS)
  }

  startApp = (event: IpcMainEvent, id: string): void => {
    const hasApp = this.appManager.hasApp(id)

    if (!hasApp) {
      console.log('# Not found App')
      return
    }

    this.appManager.startApp(id)
    event.sender.send(IPC_EVENT.SYNC_APPS)
  }

  startApps = (event: IpcMainEvent, group_id: string): void => {
    const appIds = this.groupManager.getAppIds(group_id)

    this.appManager.startApps(appIds)
  }

  stopApp = (event: IpcMainEvent, id: string): void => {
    const hasApp = this.appManager.hasApp(id)

    if (!hasApp) {
      console.log('# Not found App')
      return
    }

    this.appManager.stopApp(id)
    event.sender.send(IPC_EVENT.SYNC_APPS)
  }

  stopApps = async (event: IpcMainEvent, group_id: string): Promise<void> => {
    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['No', 'Yes'],
      message: MESSAGE.STOP_APPS,
      type: 'warning',
    })

    if (response === 0) {
      return
    }

    const appIds = this.groupManager.getAppIds(group_id)

    this.appManager.stopApps(appIds)
  }

  deleteApp = async (event: IpcMainEvent, id: string): Promise<void> => {
    const hasApp = this.appManager.hasApp(id)

    if (!hasApp) {
      console.log('# Not found App')
      return
    }

    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['Cancel', 'Delete'],
      message: MESSAGE.DELETE_APP,
    })

    if (response === 0) {
      return
    }

    this.appManager.deleteApp(id)
    this.groupManager.deleteApp(id)
    event.sender.send(IPC_EVENT.SYNC_APPS)
    event.sender.send(IPC_EVENT.SYNC_GROUPS)
  }

  selectDirectory = (event: IpcMainEvent): void => {
    const dirs = dialog.showOpenDialogSync(this.windowManager.getWindow(), { properties: ['openDirectory'] })

    const response: ISelectDirectory = {
      valid: false,
      dir: '',
      config: {
        name: '',
        start_cmd: '',
        auto_start: false,
        hc: {
          active: false,
          port: 0,
          path: '',
          interval: 0,
        },
      },
    }

    const isSelectedDir = dirs && (dirs.length === 1)
    if (!isSelectedDir) {
      event.returnValue = response
      return
    }

    const [appDir] = dirs as string[]
    const config = ConfigFile.getConfig(appDir)

    response.dir = appDir
    response.valid = true
    response.config.name = config.name || path.basename(appDir)
    response.config.start_cmd = config.start_cmd
    response.config.auto_start = config.auto_start
    response.config.hc.active = config.hc.active
    response.config.hc.port = config.hc.port
    response.config.hc.path = config.hc.path
    response.config.hc.interval = config.hc.interval

    event.returnValue = response
  }

  openOutputWindow = (event: IpcMainEvent, id: string): void => {
    this.windowManager.openChildWindow(id)
  }

  getAllOutput = (event: IpcMainEvent, id: string): void => {
    event.sender.send(IPC_EVENT.GET_ALL_OUTPUT, this.appManager.getOutput(id))
  }

  deleteOutput = (event: IpcMainEvent, id: string): void => {
    this.appManager.deleteOutput(id)
  }

  openDirectory = (event: IpcMainEvent, id: string): void => {
    const app = this.appManager.getApp(id)
    shell.openItem(app.dir)
  }
}

interface ICreateApp {
  dir: string
  name: string
  start_cmd: string
  auto_start: boolean
  hc: {
    active: boolean
    port: number
    path: string
    interval: number
  }
  theme: ITheme
  group_id: string
}

interface IUpdateApp {
  id: string
  name: string
  start_cmd: string
  auto_start: boolean
  hc: {
    active: boolean
    port: number
    path: string
    interval: number
  }
  theme: {
    color: string
  }
}
