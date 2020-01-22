import App from '@/api/app/app'
import AppManager from '@/api/app/app-manager'
import ConfigFile from '@/api/app/config-file'
import HealthCheckManager from '@/api/hc/hc-manager'
import HealthCheck2 from '@/api/hc/hc2'
import { ISelectDirectory } from '@/api/interface/ipc-service.interface'
import WindowManager from '@/api/window-mananger'
import { IPC_EVENT } from '@/shared/enum'
import { dialog, IpcMainEvent, shell } from 'electron'
import path from 'path'

export default class IpcService {
  constructor(
    private readonly appManager: AppManager,
    private readonly hcManager: HealthCheckManager,
    private readonly windowManager: WindowManager,
  ) {
  }

  getApp = (event: IpcMainEvent, id: string): void => {
    event.sender.send(IPC_EVENT.APP, this.appManager.getApp(id))
  }

  getApps = (event: IpcMainEvent): void => {
    event.sender.send(IPC_EVENT.APPS, this.appManager.getApps())
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
    const hasApp = this.appManager.hasApp(App.generateId(appDir))
    const config = ConfigFile.getConfig(appDir)

    if (hasApp) {
      event.returnValue = response
      dialog.showErrorBox('Error', '이미 존재하는 앱 입니다.')
      return
    }

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

  createApp = (event: IpcMainEvent, app: ICreateApp): void => {
    const id = App.generateId(app.dir)
    const hasApp = this.appManager.hasApp(id)

    if (hasApp) {
      event.returnValue = false
      dialog.showErrorBox('Error', '이미 존재하는 앱 입니다.')
      return
    }

    this.appManager.addApp(new App({
      id,
      dir: app.dir,
      name: app.name,
      start_cmd: app.start_cmd,
      auto_start: app.auto_start,
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

    event.returnValue = true
  }

  updateApp = (event: IpcMainEvent, app: IUpdateApp): void => {
    this.appManager.updateApp({
      id: app.id,
      name: app.name,
      start_cmd: app.start_cmd,
      auto_start: app.auto_start,
      hc: app.hc,
    })
  }

  deleteApps = async (event: IpcMainEvent): Promise<void> => {
    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['Delete', 'Cancel'],
      message: 'Do you want to delete all apps?',
    })

    if (response === 1) {
      return
    }

    this.appManager.deleteApps()
    event.sender.send(IPC_EVENT.APPS, this.appManager.getApps())
  }

  startApp = (event: IpcMainEvent, id: string): void => {
    const hasApp = this.appManager.hasApp(id)

    if (!hasApp) {
      console.log('# Not found App')
      return
    }

    this.appManager.startApp(id)
    event.sender.send(IPC_EVENT.APPS, this.appManager.getApps())
  }

  startApps = (): void => {
    this.appManager.startApps()
  }

  stopApp = (event: IpcMainEvent, id: string): void => {
    const hasApp = this.appManager.hasApp(id)

    if (!hasApp) {
      console.log('# Not found App')
      return
    }

    this.appManager.stopApp(id)
    event.sender.send(IPC_EVENT.APPS, this.appManager.getApps())
  }

  stopApps = (): void => {
    this.appManager.stopApps()
  }

  deleteApp = async (event: IpcMainEvent, id: string): Promise<void> => {
    const hasApp = this.appManager.hasApp(id)

    if (!hasApp) {
      console.log('# Not found App')
      return
    }

    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['Delete', 'Cancel'],
      message: 'Do you want to delete this app?',
    })

    if (response === 1) {
      return
    }

    this.appManager.deleteApp(id)
    event.sender.send(IPC_EVENT.APPS, this.appManager.getApps())
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
}
