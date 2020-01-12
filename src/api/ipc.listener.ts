import IpcService from '@/api/ipc.service'
import { IPC_EVENT } from '@/shared/enum'
import { ipcMain } from 'electron'

export default class IpcListener {
  constructor(
    private readonly ipcService: IpcService,
  ) {
    this.listenEvents()
  }

  listenEvents() {
    ipcMain.on(IPC_EVENT.APPS, this.ipcService.getApps)
      .on(IPC_EVENT.SELECT_DIRECTORY, this.ipcService.selectDirectory)
      .on(IPC_EVENT.CREATE_APP, this.ipcService.createApp)
      .on(IPC_EVENT.DELETE_APPS, this.ipcService.deleteApps)
      .on(IPC_EVENT.START_APP, this.ipcService.startApp)
      .on(IPC_EVENT.STOP_APP, this.ipcService.stopApp)
      .on(IPC_EVENT.DELETE_APP, this.ipcService.deleteApp)
  }

  removeEvents() {
    ipcMain.removeAllListeners(IPC_EVENT.APPS)
    ipcMain.removeAllListeners(IPC_EVENT.SELECT_DIRECTORY)
    ipcMain.removeAllListeners(IPC_EVENT.CREATE_APP)
    ipcMain.removeAllListeners(IPC_EVENT.DELETE_APPS)
    ipcMain.removeAllListeners(IPC_EVENT.START_APP)
    ipcMain.removeAllListeners(IPC_EVENT.STOP_APP)
    ipcMain.removeAllListeners(IPC_EVENT.DELETE_APP)
  }
}
