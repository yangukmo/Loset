import AppService from '@/api/app/app.service'
import { IIpcEvent } from '@/api/interface/listener.interface'
import { IPC_EVENT } from '@/shared/enum'
import { ipcMain } from 'electron'
import 'reflect-metadata'
import { Service } from 'typedi'

@Service()
export default class AppListener {
  private readonly eventList: IIpcEvent[]

  constructor(
    private readonly appService: AppService,
  ) {
    this.eventList = [
      { event: IPC_EVENT.GET_APP, func: this.appService.getApp },
      { event: IPC_EVENT.GET_APPS, func: this.appService.getApps },
      { event: IPC_EVENT.CREATE_APP, func: this.appService.createApp },
      { event: IPC_EVENT.UPDATE_APP, func: this.appService.updateApp },
      { event: IPC_EVENT.UPDATE_APPS_ORDER, func: this.appService.updateAppsOrder },
      { event: IPC_EVENT.DELETE_APP, func: this.appService.deleteApp },
      { event: IPC_EVENT.DELETE_APPS, func: this.appService.deleteApps },
      { event: IPC_EVENT.START_APP, func: this.appService.startApp },
      { event: IPC_EVENT.START_APPS, func: this.appService.startApps },
      { event: IPC_EVENT.STOP_APP, func: this.appService.stopApp },
      { event: IPC_EVENT.STOP_APPS, func: this.appService.stopApps },
      { event: IPC_EVENT.SELECT_DIRECTORY, func: this.appService.selectDirectory },
      { event: IPC_EVENT.OPEN_OUTPUT_WINDOW, func: this.appService.openOutputWindow },
      { event: IPC_EVENT.GET_ALL_OUTPUT, func: this.appService.getAllOutput },
      { event: IPC_EVENT.DELETE_APP_OUTPUT, func: this.appService.deleteOutput },
      { event: IPC_EVENT.OPEN_DIRECTORY, func: this.appService.openDirectory },
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
