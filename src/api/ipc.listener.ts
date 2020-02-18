import IpcService from '@/api/ipc.service'
import { IPC_EVENT } from '@/shared/enum'
import { ipcMain } from 'electron'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class IpcListener {
  constructor(
    private readonly ipcService: IpcService,
  ) {
    this.listenEvents()
  }

  listenEvents(): void {
    ipcMain.on(IPC_EVENT.RESET, this.ipcService.reset)
  }

  removeEvents(): void {
    ipcMain.removeAllListeners(IPC_EVENT.RESET)
  }
}
