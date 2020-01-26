'use strict'

import AppManager from '@/api/app/app-manager'
import HealthCheckManager from '@/api/hc/hc-manager'
import IpcListener from '@/api/ipc.listener'
import IpcService from '@/api/ipc.service'
import StorageManager from '@/api/store/storage-manager'
import WindowManager from '@/api/window-mananger'
import { MESSAGE } from '@/shared/enum/message'
import { app, BrowserWindow, dialog, protocol } from 'electron'
import ElectronStore from 'electron-store'
import fixPath from 'fix-path'
import 'reflect-metadata'
import treeKill from 'tree-kill'
import { createProtocol, installVueDevtools } from 'vue-cli-plugin-electron-builder/lib'

const isDevelopment = (process.env.NODE_ENV !== 'production')
fixPath()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    minWidth: 800,
    height: 600,
    title: 'Loset',
    titleBarStyle: 'customButtonsOnHover',
    backgroundColor: '#081B26',
    webPreferences: {
      nodeIntegration: true,
    },
    show: false,
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  const electronStore = new ElectronStore({ defaults: StorageManager.getDefaults() })
  const storageManager = new StorageManager(electronStore)
  const windowManager = new WindowManager(win)
  const appManager = new AppManager(storageManager, windowManager)
  const hcManager = new HealthCheckManager()
  const ipcService = new IpcService(appManager, hcManager, windowManager)
  const ipcRouter = new IpcListener(ipcService)

  win.on('close', async (event) => {
    const activeAppCount = appManager.getActiveAppCount()

    if (activeAppCount > 0) {
      const { response } = await dialog.showMessageBox({
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Confirm',
        message: MESSAGE.QUIT_LOSET + `\n${activeAppCount} apps are working.`,
      })

      if (response === 1) {
        event.preventDefault()
      }
    }
  })

  win.on('closed', () => {
    win = null

    ipcRouter.removeEvents()
    appManager.stopApps()
    windowManager.closeChildWindows()
    treeKill(process.pid)
  })

  win.once('ready-to-show', () => {
    (win as BrowserWindow).show()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
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
  iconPath: '',
  version: '',
  website: process.env.npm_package_homepate,
})

// Exit cleanly on request from parent process in development mode.
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
