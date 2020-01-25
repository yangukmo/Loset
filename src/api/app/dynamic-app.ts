import { IDynamicApp, IDynamicAppConstructor, IStartDynamicApp } from '@/api/interface/dynamic-app.interface'
import { ChildProcess, exec } from 'child_process'
import readline, { Interface } from 'readline'
import ProcessEnv = NodeJS.ProcessEnv

export class DynamicApp implements IDynamicApp {
  id: string
  active: boolean
  output_log: Buffer[]
  error_log: Buffer[]
  process: ChildProcess | undefined
  pid: number
  private notificationFn: () => void
  private outputFn: (data: Buffer) => void
  private stdout: Interface | undefined
  private stderr: Interface | undefined
  private env: ProcessEnv

  constructor(params: IDynamicAppConstructor) {
    this.id = params.id
    this.active = false
    this.output_log = []
    this.error_log = []
    this.pid = 0
    this.notificationFn = () => {}
    this.outputFn = () => {}
    this.env = process.env

    delete this.env.NODE_ENV
  }

  registerNotificationFn(fn: () => void): void {
    this.notificationFn = fn
  }

  unregisterNotificationFn(): void {
    this.notificationFn = () => {
    }
  }

  registerOutputFn(fn: (data: Buffer) => void): void {
    this.outputFn = fn
  }

  unregisterOutputFn(): void {
    this.outputFn = () => {
    }
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
    const { env } = process
    delete env.NODE_ENV

    console.info('# Start App')
    this.process = exec(params.start_cmd, { cwd: params.dir, env, maxBuffer: 100 * 1024 * 1024 })
    this.pid = this.process.pid
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
      this.removeEvents()
      this.notificationFn()
      this.output_log = []
    }
  }

  private listenEvents(): void {
    this.stdout = readline.createInterface({ input: this.process?.stdout as NodeJS.ReadableStream, terminal: false })
    this.stderr = readline.createInterface({ input: this.process?.stderr as NodeJS.ReadableStream, terminal: false })

    this.stdout.on('line', (data: Buffer) => {
      console.log('# stdout', data?.toString())
      this.pushOutputLog(data)
      this.outputFn(data)
    })

    this.stderr.on('line', (data: Buffer) => {
      console.log('# stderr', data?.toString())
      this.pushErrorLog(data)
      this.outputFn(data)
    })

    this.process?.on('close', (data: Buffer) => {
      console.log('# close', data?.toString())
      this.pushErrorLog(data)
      this.process = undefined
      this.pid = 0
      this.active = false
      this.notificationFn()
      this.outputFn(data)
    })
  }

  private removeEvents(): void {
    this.stdout?.removeAllListeners()
    this.stderr?.removeAllListeners()
  }
}
