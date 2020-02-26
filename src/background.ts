import AppManager from '@/api/app/app-manager'
import AppListener from '@/api/app/app.listener'
import ConfigListener from '@/api/config/config.listener'
import GroupListener from '@/api/group/group.listener'
import StorageManager from '@/api/store/storage-manager'
import WindowManager from '@/api/window/window-mananger'
import { MESSAGE } from '@/shared/enum/message'
import { app, BrowserWindow, dialog, protocol } from 'electron'
import ElectronStore from 'electron-store'
import windowStateKeeper from 'electron-window-state'
import fixPath from 'fix-path'
import path from 'path'
import 'reflect-metadata'
import treeKill from 'tree-kill'
import { Container } from 'typedi'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = (process.env.NODE_ENV !== 'production')
let win: BrowserWindow | null

fixPath()
app.allowRendererProcessReuse = true
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow(): void {
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 700,
  })

  win = new BrowserWindow({
    minWidth: 600,
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    title: app.name,
    titleBarStyle: 'customButtonsOnHover',
    backgroundColor: '#081B26',
    webPreferences: {
      nodeIntegration: true,
    },
    darkTheme: true,
    show: false,
    icon: path.join(__dirname, 'images/logo/loset-icon-border.png'),
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }

  Container.set('electron-store', new ElectronStore({ defaults: StorageManager.getDefaults() }))
  Container.set('main-window', win)

  const groupListener = Container.get(GroupListener)
  const appListener = Container.get(AppListener)
  const configListener = Container.get(ConfigListener)
  const appManager = Container.get(AppManager)
  const windowManager = Container.get(WindowManager)
  // TODO etc listener

  win.on('close', async (event) => {
    const activeAppCount = appManager.getActiveAppCount()

    if (activeAppCount > 0) {
      const { response } = await dialog.showMessageBox({
        type: 'question',
        buttons: ['No', 'Yes'],
        title: 'Confirm',
        message: MESSAGE.QUIT_LOSET + `\n${activeAppCount} apps are working.`,
      })

      if (response === 0) {
        event.preventDefault()
      }
    }
  })

  win.on('closed', () => {
    win = null
    Container.remove('main-window')

    groupListener.removeEvents()
    appListener.removeEvents()
    configListener.removeEvents()
    appManager.stopApps()
    windowManager.closeChildWindows()
    treeKill(process.pid)
  })

  win.once('ready-to-show', () => {
    (win as BrowserWindow).show()
  })

  mainWindowState.manage(win)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}).on('activate', () => {
  if (win === null) {
    createWindow()
  }
}).on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }

  }
  createWindow()
})

app.setAboutPanelOptions({
  applicationName: process.env.npm_package_productName,
  applicationVersion: process.env.npm_package_version,
  iconPath: path.join(__dirname, 'images/logo/loset-icon-border.png'),
  version: '',
  website: process.env.npm_package_homepage,
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
