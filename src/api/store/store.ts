import { IAppInStorage } from '@/api/interface/app.interface'
import { KEY } from '@/shared/enum/store'
import ElectronStore from 'electron-store'

export default class Store {
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

  updateApp(params: { id: string }): void {
    const app = this.getApp(params)
    this.storage.set(`${KEY.APPS}.${params.id}`, { ...app, ...params })
  }

  updateConfig(params: any): void {
    const config = this.getConfig()
    this.storage.set(KEY.CONFIG, { ...config, ...params })
  }

  clear(): void {
    this.storage.clear()
  }
}
