// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const { ipcMain } = require('electron')
const { systemPreferences } = require('electron')

ipcMain.on('isDarkMode', (event, arg) => {
  var isDarkMode = systemPreferences.isDarkMode();
  console.log("Got event: 'IsDarkMode'\tReturning: '" + isDarkMode + "'");
  event.returnValue = isDarkMode;
});

ipcMain.on('getVersion', (event, arg) => {
  var version = app.getVersion();
  console.log("Got event: 'getVersion'\tReturning: '" + version + "'");
  event.returnValue = version;
});

global.commands;
global.buttonCommands;
global.selectedButtonID;
ipcMain.on("setCommandsObj", (event, argObj) => {
  global.commands = argObj;
});
ipcMain.on("setButtonCommandsObj", (event, argObj) => {
  global.buttonCommands = argObj;
});
ipcMain.on("setSelectedButtonIDObj", (event, argObj) => {
  global.selectedButtonID = argObj;
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: false
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  const isDev = require('electron-is-dev');
  if (isDev) {
    console.log('App is running in development mode...');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
