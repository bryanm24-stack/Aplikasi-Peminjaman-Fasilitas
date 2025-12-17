import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'

// Helper function untuk membaca/menulis file agar tidak berulang
const readData = (filename) => {
  try {
    if (!fs.existsSync(filename)) fs.writeFileSync(filename, '[]')
    return JSON.parse(fs.readFileSync(filename))
  } catch (e) { return [] }
}

const writeData = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2))
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200, // Lebar ditambah agar DataGrid muat
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.kampus.loan')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // --- API HANDLERS (CRUD LENGKAP) ---

  // 1. USERS
  ipcMain.handle('get_users', () => readData('./users.json'))
  ipcMain.handle('save_users', (_, data) => writeData('./users.json', data))
  
  // 2. FACILITIES (Fasilitas Kampus)
  ipcMain.handle('get_facilities', () => readData('./facilities.json'))
  ipcMain.handle('save_facilities', (_, data) => writeData('./facilities.json', data))

  // 3. LOANS (Peminjaman)
  ipcMain.handle('get_loans', () => readData('./loans.json'))
  ipcMain.handle('save_loans', (_, data) => writeData('./loans.json', data))

  // 4. FEEDBACKS (Kritik Saran)
  ipcMain.handle('get_feedbacks', () => readData('./feedbacks.json'))
  ipcMain.handle('save_feedbacks', (_, data) => writeData('./feedbacks.json', data))

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})