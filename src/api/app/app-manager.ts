import App from '@/api/app/app'
import { DynamicAppInfo } from '@/api/app/dynamic-app-info'
import { IAppInStorage } from '@/api/interface/app.interface'
import { IDynamicAppInfo } from '@/api/interface/dynamic-app-info.interface'
import Store from '@/api/store/store'

export default class AppManager {
  private readonly apps: { [id: string]: DynamicAppInfo }

  constructor(
    private readonly store: Store,
  ) {
    this.apps = {}
    this.initAppsFromStorage()
  }

  private initAppsFromStorage(): void {
    const apps = this.store.getApps()

    Object.values(apps).forEach((app: IAppInStorage) => {
      this.apps[app.id] = new DynamicAppInfo({ id: app.id })
    })
  }

  addApp(app: App): void {
    const { id } = app
    if (this.hasApp(id)) { // TODO 이미 존재하는 앱
      return
    }

    this.apps[id] = new DynamicAppInfo({ id: app.id })
    this.store.createApp(app.renderForStorage())
  }

  getApps(): (IAppInStorage & IDynamicAppInfo)[] {
    const appsInStorage = this.store.getApps()
    return Object.entries(this.apps).map(([id, dynamicAppInfo]) => {
      return { ...dynamicAppInfo, ...appsInStorage[id] }
    })
  }

  hasApp(id: string): boolean {
    return !!this.apps[id]
  }

  deleteApps(): void {
    for (const id in this.apps) {
      delete this.apps[id]
      this.store.deleteApp({ id })
    }
  }
}
