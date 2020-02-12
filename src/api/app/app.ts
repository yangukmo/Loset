import { IApp, IAppInStorage, ITheme } from '@/api/interface/app.interface'
import { IHealthCheck } from '@/api/interface/health-check.interface'
import { Util } from '@/api/util'
import crypto from 'crypto'

export default class App implements IApp {
  dir: string
  name: string
  id: string
  start_cmd: string
  auto_start: boolean
  created_at: number
  order: number
  hc: IHealthCheck
  theme: ITheme

  constructor(props: IApp) {
    this.dir = props.dir
    this.name = props.name
    this.id = props.id || Util.createRandomId()
    this.start_cmd = props.start_cmd
    this.auto_start = props.auto_start
    this.hc = props.hc
    this.created_at = props.created_at || Date.now()
    this.order = props.order
    this.theme = props.theme
  }

  renderForStorage(): IAppInStorage {
    return {
      id: this.id,
      name: this.name,
      dir: this.dir,
      start_cmd: this.start_cmd,
      auto_start: this.auto_start,
      hc: this.hc,
      created_at: this.created_at,
      order: this.order,
      theme: this.theme,
    }
  }
}
