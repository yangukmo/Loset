import { IAppInStorage } from '@/api/interface/app.interface'
import { IGroup, IUpdateGroup } from '@/api/interface/group.interface'
import { IDefaults } from '@/api/interface/storage.interface'
import { KEY } from '@/shared/enum/store'
import ElectronStore from 'electron-store'

export default class StorageManager {
  constructor(
    private readonly storage: ElectronStore,
  ) {
  }

  static getDefaults(): IDefaults {
    return {
      [KEY.APPS]: {},
      [KEY.GROUPS]: {},
      [KEY.CONFIG]: {},
    }
  }

  getApp(params: { id: string }): IAppInStorage {
    return this.storage.get(`${KEY.APPS}.${params.id}`)
  }

  getApps(): { [id: string]: IAppInStorage } {
    return this.storage.get(KEY.APPS)
  }

  getGroup(params: { id: string }): IGroup {
    return this.storage.get(`${KEY.GROUPS}.${params.id}`)
  }

  getGroups(): { [id: string]: IGroup } {
    return this.storage.get(KEY.GROUPS)
  }

  createGroup(group: IGroup): void {
    return this.storage.set(`${KEY.GROUPS}.${group.id}`, group)
  }

  updateGroup(params: IUpdateGroup): void {
    const group = this.getGroup(params)
    this.storage.set(`${KEY.GROUPS}.${params.id}`, { ...group, ...params, updated_at: Date.now() })
  }

  deleteGroup(params: { id: string }): void {
    this.storage.delete(`${KEY.GROUPS}.${params.id}`)
  }

  deleteGroups(): void {
    this.storage.set(`${KEY.GROUPS}`, {})
  }

  deleteAppInGroup(params: { group_id: string, app_id: string }): void {
    const { group_id, app_id } = params

    const group = this.getGroup({ id: group_id })
    const apps = group.apps.filter((app) => app !== app_id)

    this.storage.set(`${KEY.GROUPS}.${group.id}.apps`, apps)
  }

  addAppInGroup(params: { group_id: string, app_id: string }): void {
    const { group_id, app_id } = params

    const group = this.getGroup({ id: group_id })
    const apps = [...group.apps, app_id]

    this.storage.set(`${KEY.GROUPS}.${group.id}.apps`, apps)
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
