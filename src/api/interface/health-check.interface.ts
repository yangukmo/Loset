export interface IHealthCheck {
  active: boolean
  port: number
  path: string
  interval: number
}

export interface IHealthCheck2 {
  id: string
  port: number
  path: string
  interval: number
}
