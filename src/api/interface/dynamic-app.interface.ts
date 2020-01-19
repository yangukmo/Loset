export interface IDynamicApp {
  id: string
  active: boolean
  pid: number
}

export interface IDynamicAppConstructor {
  id: string
}

export interface IStartDynamicApp {
  start_cmd: string
  dir: string
}
