import { IApp, IAppInStorage } from '@/api/interface/app.interface'
import { IHealthCheck } from '@/api/interface/health-check.interface'
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

  constructor(props: IApp) {
    this.dir = props.dir
    this.name = props.name
    this.id = props.id || App.generateId(this.dir)
    this.start_cmd = props.start_cmd
    this.auto_start = props.auto_start
    this.hc = props.hc
    this.created_at = props.created_at || Date.now()
    this.order = props.order
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
    }
  }

  static generateId(dir: string): string {
    return crypto.createHash('sha256').update(dir).digest('hex')
  }
}
