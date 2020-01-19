import { IHealthCheck } from '@/api/interface/health-check.interface'

export default class HealthCheck implements IHealthCheck {
  active: boolean
  port: number
  path: string
  interval: number

  constructor(props: IHealthCheck) {
    this.active = props.active || false
    this.port = props.port
    this.path = props.path
    this.interval = props.interval
  }

  isActive(): boolean {
    return this.active
  }

  isValidConfig(): boolean {
    return this.isValidPort() && this.isValidPath() && this.isValidInterval()
  }

  renderForStorage(): any {
    return {
      active: this.active,
      port: this.port,
      path: this.path,
      interval: this.interval,
    }
  }

  renderForClient(): any {
    return {
      active: this.active,
      port: this.port,
      path: this.path,
      interval: this.interval,
    }
  }

  private isValidPort(): boolean {
    const numPort = +(this.port || 0)
    const isNumber = Number.isSafeInteger(numPort)
    const inRange = (numPort >= 0) && (numPort <= 65535)

    return isNumber && inRange
  }

  private isValidPath(): boolean {
    return !!this.path
  }

  private isValidInterval(): boolean {
    const numPort = +(this.port || 0)
    const isNumber = Number.isSafeInteger(numPort)
    const inRange = (numPort >= 5000) && (numPort <= 60000)

    return isNumber && inRange
  }
}
