import { IDynamicApp } from '@/api/interface/dynamic-app.interface'
import { IHealthCheck } from '@/api/interface/health-check.interface'

export interface IApp {
  dir: string
  name: string
  id: string
  start_cmd: string
  auto_start: boolean
  hc: IHealthCheck
}

export interface IAppInStorage {
  id: string
  name: string
  dir: string
  start_cmd: string
  auto_start: boolean
  hc: IHealthCheck
}

export interface IAppInClient extends IAppInStorage, IDynamicApp {
}
