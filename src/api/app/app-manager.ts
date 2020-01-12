import App from '@/api/app/app'
import { DynamicApp } from '@/api/app/dynamic-app'
import { IAppInStorage } from '@/api/interface/app.interface'
import { IDynamicApp } from '@/api/interface/dynamic-app.interface'
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

  addApp(app: App): void {
    const { id } = app
    if (this.hasApp(id)) { // TODO 이미 존재하는 앱
      return
    }

    this.apps[id] = new DynamicApp({ id: app.id })
    this.storageManager.createApp(app.renderForStorage())
  }

  getApps(): (IAppInStorage & IDynamicApp)[] {
    const appsInStorage = this.storageManager.getApps()
    return Object.entries(this.apps).map(([id, dynamicAppInfo]) => {
      return { ...dynamicAppInfo.renderForClient(), ...appsInStorage[id] }
    })
  }

  hasApp(id: string): boolean {
    return !!this.apps[id]
  }

  startApp(id: string): void {
    const app = this.storageManager.getApp({ id })
    const dynamicApp = this.apps[id]

    dynamicApp.registerNotificationFn(() => this.windowManager.sendMessage(IPC_EVENT.APPS, this.getApps()))
    dynamicApp.start({
      start_cmd: app.start_cmd,
      dir: app.dir,
    })
  }

  stopApp(id: string): void {
    const dynamicApp = this.apps[id]
    dynamicApp.unregisterNotificationFn()
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
}
