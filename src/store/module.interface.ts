import { IAppInClient } from '@/api/interface/app.interface'
import { IGroup } from '@/api/interface/group.interface'

export interface IAppState {
  apps: IAppInClient[]
}

export interface ISearchAppState {
  keyword: string
}

export interface ISearchGroupState {
  keyword: string
}

export interface IGroupState {
  id: string
  groups: IGroup[]
}

export interface IRootState {
  group: IGroupState
  app: IAppState
  searchApp: ISearchAppState
  searchGroup: ISearchGroupState
}
