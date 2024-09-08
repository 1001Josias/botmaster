import { app, BrowserWindow } from 'electron'

async function createWindow(): Promise<BrowserWindow> {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
    },
    show: false,
  })

  await win.loadURL('http://localhost:3002')
  return win
}

app
  .whenReady()
  .then(createWindow)
  .then((win) => win.show())

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
