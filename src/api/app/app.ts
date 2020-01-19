import HealthCheck from '@/api/hc/hc'
import { IApp, IAppInClient, IAppInStorage } from '@/api/interface/app.interface'
import { IHealthCheck, IHealthCheck2 } from '@/api/interface/health-check.interface'
import crypto from 'crypto'
import fs from 'fs'

export default class App implements IApp {
  dir: string
  name: string
  id: string
  start_cmd: string
  auto_start: boolean
  hc: IHealthCheck

  constructor(props: IApp) {
    this.dir = props.dir
    this.name = props.name
    this.id = props.id || App.generateId(this.dir)
    this.start_cmd = props.start_cmd
    this.auto_start = props.auto_start
    this.hc = props.hc
  }

  hasDir(): boolean {
    return !!this.dir && fs.existsSync(this.dir)
  }

  renderForStorage(): IAppInStorage {
    return {
      id: this.id,
      name: this.name,
      dir: this.dir,
      start_cmd: this.start_cmd,
      auto_start: this.auto_start,
      hc: this.hc,
    }
  }

  static generateId(dir: string): string {
    return crypto.createHash('sha256').update(dir).digest('hex')
  }
}
