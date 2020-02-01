import {
  IDynamicApp,
  IDynamicAppConstructor,
  IRenderForClient,
  IStartDynamicApp,
} from '@/api/interface/dynamic-app.interface'
import { MESSAGE, MESSAGE_EVENT } from '@/shared/enum/message'
import { ChildProcess, exec } from 'child_process'
import readline, { Interface } from 'readline'
import treeKill from 'tree-kill'
import ProcessEnv = NodeJS.ProcessEnv

export class DynamicApp implements IDynamicApp {
  id: string
  active: boolean
  output_log: Buffer[]
  error_log: Buffer[]
  process: ChildProcess | undefined
  pid: number
  private syncAppsFn!: () => void
  private notificationFn!: (event: MESSAGE_EVENT, data: MESSAGE) => void
  private outputFn!: (data: Buffer) => void
  private stdout: Interface | undefined
  private stderr: Interface | undefined
  private env: ProcessEnv

  constructor(params: IDynamicAppConstructor) {
    this.id = params.id
    this.active = false
    this.output_log = []
    this.error_log = []
    this.pid = 0
    this.env = process.env
    delete this.env.NODE_ENV

    this.unregisterSyncAppsFn()
    this.unregisterNotificationFn()
    this.unregisterOutputFn()
  }

  registerSyncAppsFn(fn: () => void): void {
    this.syncAppsFn = fn
  }

  registerNotificationFn(fn: (event: MESSAGE_EVENT, data: MESSAGE) => void): void {
    this.notificationFn = fn
  }

  registerOutputFn(fn: (data: Buffer) => void): void {
    this.outputFn = fn
  }

  unregisterSyncAppsFn(): void {
    this.syncAppsFn = () => {
    }
  }

  unregisterNotificationFn(): void {
    this.notificationFn = () => {
    }
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

  renderForClient(): IRenderForClient {
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
    this.syncAppsFn()
    this.listenEvents()
  }

  stop(): void {
    if (this.process && this.pid) {
      console.info('# Stop App')
      treeKill(this.pid)
      this.pid = 0
      this.active = false
      this.removeEvents()
      this.syncAppsFn()
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
      this.syncAppsFn()
      this.outputFn(data)
      this.checkAndNotifyError(data)
    })
  }

  private checkAndNotifyError(data: any): void {
    switch (data) {
      case 127:
        this.notificationFn(MESSAGE_EVENT.ERROR, MESSAGE.NOT_FOUND_COMMAND)
        break
    }
  }

  private removeEvents(): void {
    this.stdout?.removeAllListeners()
    this.stderr?.removeAllListeners()
  }
}
