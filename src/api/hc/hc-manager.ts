import HealthCheck2 from '@/api/hc/hc'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class HealthCheckManager {
  private readonly hcMap: { [id: string]: HealthCheck2 }

  constructor() {
    this.hcMap = {}
  }

  addHealthCheck(hc: HealthCheck2): void {
    this.hcMap[hc.id] = hc
  }

  startHealthCheck(params: { id: string }): void {
    const hc = this.hcMap[params.id]

    if (hc) {
      hc.start()
    }
  }

  stopHealthCheck(params: { id: string }): void {
    const hc = this.hcMap[params.id]

    if (hc) {
      hc.stop()
      delete this.hcMap[params.id]
    }
  }
}
