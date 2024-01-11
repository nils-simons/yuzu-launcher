const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const robot = require('robotjs');


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    show: false,
    fullscreen: true,
    width: 1000,
    
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.maximize();
  mainWindow.setAlwaysOnTop(true, 'screen');
  mainWindow.show();

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  ipcMain.on('fullscreen', (event, data) => {
    mainWindow.fullScreen = data.value;
  });
  ipcMain.on('close', (event, data) => {
    mainWindow.close();
  });

  ipcMain.on('winOnTop', (event, data) => {
    mainWindow.setAlwaysOnTop(data.value, 'screen');
  });

  ipcMain.on('isWinOnTop', (event, data) => {
    var data = mainWindow.isAlwaysOnTop()
    // console.log(data);
    mainWindow.webContents.send('respIsWinOnTop', {value: data})
    // ipcMain.emit('respIsWinOnTop', {value: mainWindow.isAlwaysOnTop()});
  });

  ipcMain.on('showWin', (event, data) => {
    if (data.value) {
      mainWindow.show();
    } else {
      mainWindow.hide();
    }
  })

  ipcMain.on('click', (event, data) => {
    robot.moveMouse(2, 2);
    robot.mouseClick();
  })


  // mainWindow.webContents.openDevTools();
};
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});