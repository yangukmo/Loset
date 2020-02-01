import { IDynamicApp } from '@/api/interface/dynamic-app.interface'
import { IHealthCheck } from '@/api/interface/health-check.interface'

export interface IApp {
  dir: string
  name: string
  id: string
  start_cmd: string
  auto_start: boolean
  created_at: number
  order: number
  hc: IHealthCheck
  theme: ITheme
}

export interface IAppInStorage {
  id: string
  name: string
  dir: string
  start_cmd: string
  auto_start: boolean
  created_at: number
  order: number
  hc: IHealthCheck
  theme: ITheme
}

export interface ITheme {
  color: string
}

export interface IAppInClient extends IAppInStorage, IDynamicApp {
}

export interface IUpdateApp {
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
  theme: {
    color: string
  }
}
