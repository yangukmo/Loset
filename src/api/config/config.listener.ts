import ConfigService from '@/api/config/config.service'
import { IIpcEvent } from '@/api/interface/listener.interface'
import { IPC_EVENT } from '@/shared/enum'
import { ipcMain } from 'electron'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class ConfigListener {
  private readonly eventList: IIpcEvent[]

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.eventList = [
      { event: IPC_EVENT.RESET, func: this.configService.reset },
    ]
    this.listenEvents()
  }

  private listenEvents(): void {
    this.eventList.forEach((ipcEvent) => ipcMain.on(ipcEvent.event, ipcEvent.func))
  }

  removeEvents(): void {
    this.eventList.forEach((ipcEvent) => ipcMain.removeAllListeners(ipcEvent.event))
  }
}
