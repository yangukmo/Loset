import { IDynamicAppInfo } from '@/api/interface/dynamic-app-info.interface'

export class DynamicAppInfo implements IDynamicAppInfo {
  id: string
  active: boolean
  output_log: any[]
  error_log: any[]

  constructor(params: IDynamicAppInfo) {
    this.id = params.id
    this.active = false
    this.output_log = []
    this.error_log = []
  }

  pushOutputLog(log: any): void {
    this.output_log.push(log)
  }

  pushErrorLog(log: any): void {
    this.error_log.push(log)
  }
}
