import { IPC_EVENT } from '@/shared/enum'
import { BrowserWindow } from 'electron'

export default class WindowManager {
  constructor(
    private readonly window: BrowserWindow,
  ) {
  }

  sendMessage<T>(event: IPC_EVENT, message: T): void {
    this.window.isDestroyed() || this.window.webContents.send(event, message)
  }

  getWindow(): BrowserWindow {
    return this.window
  }
}
