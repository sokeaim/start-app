const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    mainWindow.loadFile('index.html');
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater.');
})
autoUpdater.on('download-progress', (ev, progressObj) => {
    sendStatusToWindow('Download progress...');
})
autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow('Update downloaded; will install in 5 seconds');
});
ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});