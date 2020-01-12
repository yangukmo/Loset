import { IDynamicApp, IStartDynamicApp } from '@/api/interface/dynamic-app.interface'
import { ChildProcess, exec } from 'child_process'

export class DynamicApp implements IDynamicApp {
  id: string
  active: boolean
  output_log: any[]
  error_log: any[]
  process: ChildProcess | undefined
  pid: number
  private notificationFn: () => any

  constructor(params: IDynamicApp) {
    this.id = params.id
    this.active = false
    this.output_log = []
    this.error_log = []
    this.pid = 0
    this.notificationFn = () => {}
  }

  registerNotificationFn(fn: () => any): void {
    this.notificationFn = fn
  }

  unregisterNotificationFn(): void {
    this.notificationFn = () => {}
  }

  pushOutputLog(data: Buffer): void {
    this.output_log.push(data)
  }

  pushErrorLog(data: Buffer): void {
    this.error_log.push(data)
  }

  renderForClient(): any {
    return {
      id: this.id,
      active: this.active,
      pid: this.pid,
    }
  }

  start(params: IStartDynamicApp): void {
    this.stop()

    console.info('# Start App')
    this.process = exec(params.start_cmd, { cwd: params.dir, maxBuffer: 100 * 1024 * 1024 })
    this.pid = process.pid
    this.active = true
    this.notificationFn()
    this.listenEvents()
  }

  stop(): void {
    if (this.process && this.pid) {
      console.info('# Stop App')
      this.process.kill('SIGTERM')
      this.pid = 0
      this.active = false
      this.notificationFn()
    }
  }

  private listenEvents(): void {
    this.process?.stdout?.on('data', (data: Buffer) => {
      console.log('# stdout', data.toString())
      this.pushOutputLog(data)
    })

    this.process?.stderr?.on('data', (data: Buffer) => {
      console.log('# stderr', data.toString())
      this.pushErrorLog(data)
    })

    this.process?.on('close', (data: Buffer) => {
      console.log('# close', data.toString())
      this.pushErrorLog(data)
      this.process = undefined
      this.pid = 0
      this.active = false
      this.notificationFn()
    })
  }
}
