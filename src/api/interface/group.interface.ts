export interface IGroup {
  id: string
  name: string
  apps: string[]
  order: number
  theme: {
    color: string
  }
  created_at: number
  updated_at?: number
}

export interface IUpdateGroup {
  id: string
  name: string
  theme: {
    color: string
  }
}
