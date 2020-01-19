import { net } from 'electron'
import { IHealthCheck2 } from '@/api/interface/health-check.interface'

export default class HealthCheck2 implements IHealthCheck2 {
  id: string
  port: number
  path: string
  interval: number
  private intervalObj: NodeJS.Timeout | undefined

  constructor(props: IHealthCheck2) {
    this.id = props.id
    this.port = props.port
    this.path = props.path
    this.interval = props.interval || 10000
  }

  start(): void {
    this.intervalObj = setInterval(async () => await this.request(), this.interval)
  }

  stop(): void {
    if (this.intervalObj) {
      clearInterval(this.intervalObj)
    }
  }

  private request(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = net.request(`http://localhost:${this.port}${this.path}`)
      request.on('response', () => resolve())
      request.on('error', () => reject())
      request.end()
    })
  }
}
