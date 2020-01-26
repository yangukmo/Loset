import App from '@/api/app/app'
import { DynamicApp } from '@/api/app/dynamic-app'
import { IAppInClient, IAppInStorage } from '@/api/interface/app.interface'
import StorageManager from '@/api/store/storage-manager'
import WindowManager from '@/api/window-mananger'
import { IPC_EVENT } from '@/shared/enum'
import fs from 'fs'

export default class AppManager {
  private readonly apps: { [id: string]: DynamicApp }

  constructor(
    private readonly storageManager: StorageManager,
    private readonly windowManager: WindowManager,
  ) {
    this.apps = {}
    this.initAppsFromStorage()
    this.autoStartApps()
  }

  private initAppsFromStorage(): void {
    const apps = this.storageManager.getApps()

    Object.values(apps).forEach((app: IAppInStorage) => {
      const { id, dir } = app

      if (dir && fs.existsSync(dir)) {
        this.apps[id] = new DynamicApp({ id })
      } else {
        this.storageManager.deleteApp({ id })
      }
    })
  }

  private autoStartApps(): void {
    Object.values(this.apps).forEach(({ id }) => {
      const app = this.getApp(id)
      if (app.auto_start) {
        this.startApp(id)
      }
    })
  }

  addApp(app: App): void {
    const { id } = app

    if (this.hasApp(id)) { // TODO 이미 존재하는 앱
      return
    }

    this.apps[id] = new DynamicApp({ id: app.id })
    this.storageManager.createApp(app.renderForStorage())
  }

  updateApp(app: IUpdateApp): void {
    const { id } = app

    if (!this.hasApp(id)) {
      return
    }

    this.storageManager.updateApp({
      id,
      name: app.name,
      start_cmd: app.start_cmd,
      auto_start: app.auto_start,
      hc: app.hc,
    })
  }

  getApp(id: string): IAppInClient {
    const appInStorage = this.storageManager.getApp({ id })
    const dynamicApp = this.apps[id]

    return {
      ...dynamicApp.renderForClient(),
      ...appInStorage,
    }
  }

  getApps(): IAppInClient[] {
    return Object.keys(this.apps)
      .map((id) => this.getApp(id))
      .sort((a, b) => b.order - a.order)
  }

  hasApp(id: string): boolean {
    return !!this.apps[id]
  }

  startApp(id: string): void {
    const app = this.storageManager.getApp({ id })
    const dynamicApp = this.apps[id]

    dynamicApp.registerNotificationFn(() => this.windowManager.sendMessage(IPC_EVENT.APPS, this.getApps()))
    dynamicApp.registerOutputFn((data: Buffer) => this.windowManager.sendOutput({ id, data }))
    dynamicApp.start({
      start_cmd: app.start_cmd,
      dir: app.dir,
    })
  }

  startApps(): void {
    for (const id of Object.keys(this.apps)) {
      this.startApp(id)
    }
  }

  stopApp(id: string): void {
    const dynamicApp = this.apps[id]
    dynamicApp.unregisterNotificationFn()
    dynamicApp.unregisterOutputFn()
    dynamicApp.stop()
  }

  stopApps(): void {
    for (const app of Object.values(this.apps)) {
      app.stop()
    }
  }

  deleteApp(id: string): void {
    const dynamicApp = this.apps[id]
    if (dynamicApp.active) {
      this.stopApp(id)
    }
    delete this.apps[id]
    this.storageManager.deleteApp({ id })
  }

  deleteApps(): void {
    for (const id in this.apps) {
      this.deleteApp(id)
    }
  }

  getOutput(id: string): Buffer[] {
    return this.apps[id].output_log
  }

  deleteOutput(id: string): void {
    this.apps[id].output_log.length = 0
  }

  getActiveAppCount(): number {
    return Object.values(this.apps).filter((app) => app.active).length
  }

  createNewOrder(): number {
    return this.storageManager.createNewOrder()
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
