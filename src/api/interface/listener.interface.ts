import { IPC_EVENT } from '@/shared/enum'
import IpcMainEvent = Electron.IpcMainEvent

export interface IIPCEvent {
  event: IPC_EVENT
  func: (event: IpcMainEvent, ...args: any[]) => void
}
