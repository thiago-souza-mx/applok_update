require('dotenv').config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
})
const electron = require('electron');
const { app, BrowserWindow, Menu, Tray } = electron;
const { exec } = require("child_process");
const url = require('url');
const path = require('path');
const ipc = electron.ipcMain;
const isDevelopment = process.env.NODE_ENV !== 'production'
const Info = require('./package.json');

// Menu Template

const menuTemplate = [{
  label: 'File',
  submenu: [{
      label: 'Add item'
    },
    {
      label: 'Clear items'
    },
    {
      label: 'Quit',
      click() {
        app.quit();
      }
    },
  ]
}]

var trayIcon;

if (handleSquirrelEvent(app)) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

//require("electron-reload")(__dirname, { electron: require(`${__dirname}/node_modules/electron`),});

const App = {
  name: Info.application.name_app,
  local: Info.application.local
}

let win;

app.on('ready', () => {

  const init = () => {

    win = new BrowserWindow({
      show: false,
      backgroundColor: 'rgba(0,0,0,0)',
      //transparent: true, 
      frame: false,
      minWidth: 400,
      minHeight: 300,
      webPreferences: {
        nodeIntegration: true,
      }
    });

    if (process.env.IS_TEST) win.webContents.openDevTools();

    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
      search: `App=${JSON.stringify(App)}`,
    }));

    win.on('closed', () => {
      win = null
    });

    win.once('ready-to-show', () => {
      win.show()
    })

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
  }

  const options = {
    type: 'info',
    buttons: ['Cancelar', 'Sim', 'Não'],
    defaultId: 2,
    title: 'Abortar',
    message: Info.name_app + ' já está aberto',
    detail: 'Deseja reinicia o aplicativo em uma nova janela',
  };

  const taskKill = () => {
    let resp = new Promise((resolve, reject) => {
      exec("TaskKill /F /IM \"" + Info.name + ".exe\"", (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
        }
        resolve(stdout ? true : false);
      })
    });
    resp.then(() => {
      init();
    })
  }

  const espera = async() => {
      return new Promise((resolve, reject) => {
        exec("tasklist /svc | findstr /spin \"" + Info.name + ".exe\"", (error, stdout, stderr) => {
          console.log(this);
          if (error) {
            console.warn(error);
          }
          resolve(stdout ? stdout : false);
        })
      });
    }
    /*espera().then(resp=>{
        if(resp && resp.indexOf(process.pid)== -1){            
            electron.dialog.showMessageBox(null, options,).then( (data) => {
                console.log(data.response); 
                data.response == 1 ? taskKill() : app.quit() ;               
            });
        }else{
            init(); 
        } 
    })*/

  init();
});

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

// botoes de acao

ipc.on('close', function(event) {
  //win.close(); 
  app.quit();
})

ipc.on('maximize', function(event) {
  win.maximize();
})

ipc.on('minimize', function(event) {
  win.minimize();
})

ipc.on('unmaximize', function(event) {
  win.unmaximize();
})

ipc.on('hide', function(event) {
  win.hide();

  trayIcon = new Tray(__dirname + "/assets/icons/win/android-chrome-192x192.ico");

  var trayMenuTemplate = [{
      label: 'Log',
      click: function() {
        exec('notepad c:\\applok\\logs\\log.txt', (error, stdout, stderr) => {
          if (error) {
            console.warn(error);
          }
        })
      }
    },
    {
      label: 'Restore',
      click: function() {
        win.show()
        trayIcon.destroy();
      }
    },
    {
      label: 'devtools',
      click: function() {
        win.show()
        win.webContents.toggleDevTools();
        trayIcon.destroy();
      }
    },
    {
      label: 'Exit',
      click: function() {
        app.quit();
      }
    }
  ];

  var trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  trayIcon.setContextMenu(trayMenu);

  trayIcon.on("click", function() {
    win.show();
    trayIcon.destroy();
  });

})


ipc.on('ismaximized', function(event) {
  return win.isMaximized();
})

ipc.on('relaunch', function(event) {
  app.relaunch()
  app.exit()
})

function handleSquirrelEvent(application) {
  if (process.argv.length === 1) {
      return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
          spawnedProcess = ChildProcess.spawn(command, args, {
              detached: true
          });
      } catch (error) {}

      return spawnedProcess;
  };

  const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
      case '--squirrel-install':


      case '--squirrel-updated':
          // Optionally do things such as:
          // - Add your .exe to the PATH
          // - Write to the registry for things like file associations and
          //   explorer context menus

          // Install desktop and start menu shortcuts
          spawnUpdate(['--createShortcut', exeName]);   

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-uninstall':
          // Undo anything you did in the --squirrel-install and
          // --squirrel-updated handlers

          // Remove desktop and start menu shortcuts
          spawnUpdate(['--removeShortcut', exeName]);

          setTimeout(application.quit, 1000);
          return true;

      case '--squirrel-obsolete':
          // This is called on the outgoing version of your app before
          // we update to the new version - it's the opposite of
          // --squirrel-updated

          application.quit();
          return true;
  }
};