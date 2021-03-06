import App from '@/api/app/app'
import { DynamicApp } from '@/api/app/dynamic-app'
import { IAppInClient, IAppInStorage, IUpdateApp } from '@/api/interface/app.interface'
import StorageManager from '@/api/store/storage-manager'
import WindowManager from '@/api/window/window-mananger'
import { IPC_EVENT } from '@/shared/enum'
import { MESSAGE, MESSAGE_EVENT } from '@/shared/enum/message'
import fs from 'fs'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
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

    this.apps[id] = new DynamicApp({ id })
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
      theme: app.theme,
    })
  }

  updateAppsOrder(sortedAppIdList: string[]): void {
    sortedAppIdList.forEach((id, order) => {
      this.storageManager.updateAppOrder({ id, order })
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
      .sort((a, b) => a.order - b.order)
  }

  hasApp(id: string): boolean {
    return !!this.apps[id]
  }

  startApp(id: string): void {
    const app = this.storageManager.getApp({ id })
    const dynamicApp = this.apps[id]

    dynamicApp.registerSyncAppsFn(() => this.windowManager.sendMessage(IPC_EVENT.SYNC_APPS))
    dynamicApp.registerNotificationFn((event: MESSAGE_EVENT, data: MESSAGE) => this.windowManager.sendMessage(event, data))
    dynamicApp.registerOutputFn((data: Buffer) => this.windowManager.sendOutput({ id, data }))
    dynamicApp.start({
      start_cmd: app.start_cmd,
      dir: app.dir,
    })
  }

  startApps(appIds?: string[] | undefined): void {
    const targetAppIds = appIds?.length ? appIds : Object.keys(this.apps)

    for (const appId of targetAppIds) {
      this.startApp(appId)
    }
  }

  stopApp(id: string): void {
    const dynamicApp = this.apps[id]
    dynamicApp.stop()
    dynamicApp.unregisterSyncAppsFn()
    dynamicApp.unregisterNotificationFn()
    dynamicApp.unregisterOutputFn()
  }

  stopApps(appIds?: string[] | undefined): void {
    const targetAppIds = appIds?.length ? appIds : Object.keys(this.apps)

    for (const appId of targetAppIds) {
      this.stopApp(appId)
    }
  }

  deleteApp(id: string): void {
    const dynamicApp = this.apps[id]
    if (dynamicApp?.active) {
      this.stopApp(id)
    }
    delete this.apps[id]
    this.storageManager.deleteApp({ id })
  }

  deleteApps(appIds?: string[] | undefined): void {
    const targetAppIds = appIds?.length ? appIds : Object.keys(this.apps)

    for (const appId of targetAppIds) {
      this.deleteApp(appId)
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
