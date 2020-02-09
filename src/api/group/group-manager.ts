import { IGroup } from '@/api/interface/group.interface'
import StorageManager from '@/api/store/storage-manager'
import { Util } from '@/api/util'

export default class GroupManager {
  constructor(
    private readonly storageManager: StorageManager,
  ) {
  }

  getGroup(id: string): IGroup {
    return this.storageManager.getGroup({ id })
  }

  getGroups(): IGroup[] {
    const groups = this.storageManager.getGroups()

    return Object.values(groups).sort((a, b) => a.order - b.order)
  }

  createGroup(group: { name: string, theme: { color: string } }): void {
    const { name, theme } = group

    this.storageManager.createGroup({
      id: Util.createRandomId(),
      name,
      theme,
      apps: [],
      order: 0, // TODO 그룹내의 order 가져오기
      created_at: Date.now(),
    })
  }

  updateGroup(group: { id: string, name: string, theme: { color: string } }): void {
    const { id, name, theme } = group

    this.storageManager.updateGroup({
      id,
      name,
      theme,
    })
  }

  deleteGroup(id: string): void {
    this.storageManager.deleteGroup({ id })
  }

  deleteGroups(): void {
    this.storageManager.deleteGroups()
  }

  deleteApp(id: string): void {
    const groups = this.storageManager.getGroups()
    const targetGroup = Object.values(groups).find((group) => {
      return group.apps.find((app) => app === id)
    })

    if (targetGroup) {
      this.storageManager.deleteAppInGroup({
        group_id: targetGroup.id,
        app_id: id,
      })
    }
  }

  addApp(params: { group_id: string, app_id: string }): void {
    this.storageManager.addAppInGroup(params)
  }
}