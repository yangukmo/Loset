import { IPC_EVENT } from '@/shared/enum'
import { BrowserWindow } from 'electron'
import windowStateKeeper from 'electron-window-state'

export default class WindowManager {
  private readonly childWindows: { [id: string]: BrowserWindow }

  constructor(
    private readonly window: BrowserWindow,
  ) {
    this.childWindows = {}
  }

  sendMessage<T>(event: IPC_EVENT, message: T): void {
    this.window.isDestroyed() || this.window.webContents.send(event, message)
  }

  getWindow(): BrowserWindow {
    return this.window
  }

  openChildWindow(id: string): void {
    const activeChildWindow = this.childWindows[id]
    if (activeChildWindow) {
      activeChildWindow.focus()
      return
    }

    const childWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 500,
    })

    const isDev = (process.env.NODE_ENV === 'development')
    const winURL = isDev ? `${process.env.WEBPACK_DEV_SERVER_URL}/#/output/${id}` : `app://./index.html#output/${id}`
    const childWindow = new BrowserWindow({
      width: childWindowState.width,
      height: childWindowState.height,
      x: childWindowState.x,
      y: childWindowState.y,
      alwaysOnTop: false,
      title: 'Devy',
      titleBarStyle: 'customButtonsOnHover',
      backgroundColor: '#081B26',
      webPreferences: {
        nodeIntegration: true
      }
    })
    childWindow.loadURL(winURL)
    childWindow.on('closed', () => {
      delete this.childWindows[id]
    })

    childWindowState.manage(childWindow)

    this.childWindows[id] = childWindow
  }

  closeChildWindows(): void {
    Object.entries(this.childWindows).forEach(([id, window]) => {
      window.close()
      delete this.childWindows[id]
    })
  }

  sendOutput(params: ISendOutput): void {
    const { id, data } = params

    if (!this.childWindows[id]?.isDestroyed()) {
      this.childWindows[id]?.webContents.send(IPC_EVENT.OUTPUT, data)
    }
  }
}

interface ISendOutput {
  id: string
  data: Buffer
}
