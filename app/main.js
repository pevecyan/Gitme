var debug = false;
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
var mainWindow;
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, title:"New file - Gitme"});
  mainWindow.setMenu(createMenu());
  
  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  if(debug)mainWindow.openDevTools();
  
  
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  
  mainWindow.on('close', function(event) {
    
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    event.preventDefault();
  });
  
  mainWindow.on('resize', function(){
    mainWindow.webContents.send('resize', 'true');
  });
  mainWindow.on('maximize', function(){
    mainWindow.webContents.send('resize', 'true');
  });
  mainWindow.on('unmaximize', function(){
    mainWindow.webContents.send('resize', 'true');
  });

  
});

function createMenu(){

  var Menu = require('menu');
  var MenuItem = require('menu-item');
  
  var fileMenu = new Menu();
  fileMenu.append(new MenuItem({label:"New File...",accelerator:"Ctrl+N", click: function(){newFile();} }));
  fileMenu.append(new MenuItem({ type: 'separator' }));
  fileMenu.append(new MenuItem({label:"Open File...",accelerator:"Ctrl+O",click: function(){openFile();}}));
  fileMenu.append(new MenuItem({ type: 'separator' }));
  fileMenu.append(new MenuItem({label:"Save File...",accelerator:"Ctrl+S",click: function(){saveFile(false);}}));
  fileMenu.append(new MenuItem({label:"Save File As...",accelerator:"Ctrl+Shift+S",click: function(){saveFile(true);}}));
  fileMenu.append(new MenuItem({ type: 'separator' }));
  fileMenu.append(new MenuItem({label:"Exit", click: function(){exit();}}));
  
  var editMenu = new Menu();
  editMenu.append(new MenuItem({label:"Bold",accelerator: "Ctrl+B", click: editBold}));
  editMenu.append(new MenuItem({label:"Italic",accelerator: "Ctrl+I", click: editItalic}));
  editMenu.append(new MenuItem({type:"separator"}));
  editMenu.append(new MenuItem({label:"H1",accelerator: "Ctrl+Shift+1", click: editH1}));
  editMenu.append(new MenuItem({label:"H2",accelerator: "Ctrl+Shift+2", click: editH2}));
  editMenu.append(new MenuItem({label:"H3",accelerator: "Ctrl+Shift+3", click: editH3}));
  editMenu.append(new MenuItem({label:"H4",accelerator: "Ctrl+Shift+4", click: editH4}));
  editMenu.append(new MenuItem({label:"H5",accelerator: "Ctrl+Shift+5", click: editH5}));
  editMenu.append(new MenuItem({label:"H6",accelerator: "Ctrl+Shift+6", click: editH6}));
  editMenu.append(new MenuItem({type:"separator"}));
  editMenu.append(new MenuItem({label:"Cut",accelerator: "Ctrl+X", click: function(){editText('cut');}}));
  editMenu.append(new MenuItem({label:"Copy",accelerator: "Ctrl+C", click: function(){editText('copy');}}));
  editMenu.append(new MenuItem({label:"Paste",accelerator: "Ctrl+V", click: function(){editText('paste');}}));
  editMenu.append(new MenuItem({label:"Select All",accelerator: "Ctrl+A", click: function(){editText('select-all');}}));
  
  var viewMenu = new Menu();
  viewMenu.append(new MenuItem({label:"Toggle Full Screen", accelerator:"F11", click: function(){ toggleFullScreen();}}));
  
  var menu = new Menu();
  menu.append(new MenuItem({ label: 'File', type: "submenu",submenu:fileMenu}));
  menu.append(new MenuItem({ label: 'Edit', type: "submenu",submenu:editMenu}));
  menu.append(new MenuItem({ label: 'View', type: "submenu",submenu:viewMenu}));
  return menu;
}

function openFile(){
  mainWindow.webContents.send('file-open', null);
}

function saveFile(as){
  mainWindow.webContents.send('file-save', as);
}

function newFile(){
  mainWindow.webContents.send('file-new', null);
}

function exit(){
  mainWindow.close();
}

function editBold(){
  mainWindow.webContents.send('edit-markdown', 'bold');
}
function editItalic(){
  mainWindow.webContents.send('edit-markdown', 'italic');
}
function editH1(){
  mainWindow.webContents.send('edit-markdown', 'h1');
}
function editH2(){
  mainWindow.webContents.send('edit-markdown', 'h2');
}
function editH3(){
  mainWindow.webContents.send('edit-markdown', 'h3');
}
function editH4(){
  mainWindow.webContents.send('edit-markdown', 'h4');
}
function editH5(){
  mainWindow.webContents.send('edit-markdown', 'h5');
}
function editH6(){
  mainWindow.webContents.send('edit-markdown', 'h6');
}
function editText(action){
  mainWindow.webContents.send('edit-markdown', action);
}

function toggleFullScreen(){
  if(mainWindow.isFullScreen())
    mainWindow.setFullScreen(false);
  else
    mainWindow.setFullScreen(true);
}

ipc.on('add-recent-file', function(event, arg) {
  app.addRecentDocument(arg);
});

