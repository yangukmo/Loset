import 'reflect-metadata'
import AppManager from '@/api/app/app-manager'
import GroupManager from '@/api/group/group-manager'
import WindowManager from '@/api/window/window-mananger'
import { MESSAGE, MESSAGE_EVENT } from '@/shared/enum/message'
import { dialog, IpcMainEvent } from 'electron'
import { Service } from 'typedi'

@Service()
export default class ConfigService {
  constructor(
    private readonly appManager: AppManager,
    private readonly groupManager: GroupManager,
    private readonly windowManager: WindowManager,
  ) {
  }

  reset = async (event: IpcMainEvent): Promise<void> => {
    const { response } = await dialog.showMessageBox(this.windowManager.getWindow(), {
      buttons: ['Cancel', 'Reset'],
      message: MESSAGE.RESET,
      type: 'warning',
    })

    if (response === 0) {
      event.returnValue = false
      return
    }

    this.appManager.deleteApps()
    this.groupManager.deleteGroups()
    // TODO config-manager

    this.windowManager.sendMessage(MESSAGE_EVENT.SUCCESS, MESSAGE.COMPLETED_RESET)
    event.returnValue = true
  }
}
