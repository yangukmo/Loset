import { IAppInStorage } from '@/api/interface/app.interface'
import { IHealthCheck } from '@/api/interface/health-check.interface'
import { KEY } from '@/shared/enum/store'
import ElectronStore from 'electron-store'

export default class StorageManager {
  constructor(
    private readonly storage: ElectronStore,
  ) {
  }

  static getDefaults(): { apps: {}, config: {} } {
    return {
      [KEY.APPS]: {},
      [KEY.CONFIG]: {},
    }
  }

  getApp(params: { id: string }): IAppInStorage {
    return this.storage.get(`${KEY.APPS}.${params.id}`)
  }

  hasApp(params: { id: string }): boolean {
    return !!this.getApp(params)
  }

  getApps(): { [id: string]: IAppInStorage } {
    return this.storage.get(KEY.APPS)
  }

  getConfig(): any {
    return this.storage.get(KEY.CONFIG)
  }

  createApp(app: IAppInStorage): void {
    return this.storage.set(`${KEY.APPS}.${app.id}`, app)
  }

  deleteApp(params: { id: string }): void {
    this.storage.delete(`${KEY.APPS}.${params.id}`)
  }

  updateApp(params: { id: string, name: string, start_cmd: string, auto_start: boolean, hc: { active: boolean, port: number, path: string, interval: number }, theme: { color: string } }): void {
    const app = this.getApp(params)
    this.storage.set(`${KEY.APPS}.${params.id}`, { ...app, ...params, updated_at: Date.now() })
  }

  updateAppOrder(params: { id: string, order: number }): void {
    const app = this.getApp(params)
    this.storage.set(`${KEY.APPS}.${params.id}`, { ...app, order: params.order, updated_at: Date.now() })
  }

  createNewOrder(): number {
    const apps = this.getApps()

    return Object.values(apps).reduce((newOrder, app) => ((app.order > newOrder) ? app.order : newOrder), 0) + 1
  }

  clear(): void {
    this.storage.clear()
  }
}
