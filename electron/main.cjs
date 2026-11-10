const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const { createEmbeddedServer } = require('./embedded-server.cjs');

let mainWindow = null;
let embeddedServer = null;
const PORT = 3000;

async function createWindow() {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  const projectRoot = isDev ? path.resolve(__dirname, '..') : (process.resourcesPath ? path.resolve(process.resourcesPath, 'app') : path.resolve(__dirname, '..'));
  const distHtml = path.resolve(__dirname, '../dist/index.html');
  const iconPath = path.resolve(__dirname, '../public/pwa-512x512.png');

  // Start embedded express server within Electron Node runtime
  try {
    embeddedServer = await createEmbeddedServer({
      port: PORT,
      projectRoot: path.resolve(__dirname, '..'),
    });
  } catch (err) {
    console.warn('[Electron Main] Embedded server start failed, falling back to static loadFile:', err);
  }

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 868,
    minWidth: 960,
    minHeight: 640,
    title: '한양도시락 (漢陽) - 키오스크 & 매장 메뉴판',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allows seamless local resource/data-url loading
    },
    autoHideMenuBar: false,
    backgroundColor: '#EEEAE4',
    show: false, // Show once ready-to-show to prevent blank screen flicker
  });

  // Application Menu
  const menuTemplate = [
    {
      label: '한양도시락',
      submenu: [
        { label: '새로고침 (F5)', accelerator: 'F5', click: () => mainWindow && mainWindow.reload() },
        { label: '캐시 초기화 새로고침 (Ctrl+F5)', accelerator: 'CmdOrCtrl+F5', click: () => mainWindow && mainWindow.webContents.reloadIgnoringCache() },
        { type: 'separator' },
        { label: '종료 (Alt+F4)', accelerator: 'Alt+F4', click: () => app.quit() },
      ],
    },
    {
      label: '보기',
      submenu: [
        { label: '전체화면 (F11)', accelerator: 'F11', click: () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { label: '실제 크기', accelerator: 'CmdOrCtrl+0', click: () => mainWindow && mainWindow.webContents.setZoomLevel(0) },
        { label: '확대 (+)', accelerator: 'CmdOrCtrl+Plus', click: () => mainWindow && mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5) },
        { label: '축소 (-)', accelerator: 'CmdOrCtrl+-', click: () => mainWindow && mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5) },
        { type: 'separator' },
        { label: '개발자 도구 (F12)', accelerator: 'F12', click: () => mainWindow && mainWindow.webContents.toggleDevTools() },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Try loading local embedded server first, fallback to direct index.html if network fails
  if (embeddedServer) {
    console.log('[Electron Main] Loading URL http://127.0.0.1:3000');
    mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  } else if (fs.existsSync(distHtml)) {
    console.log('[Electron Main] Loading file fallback:', distHtml);
    mainWindow.loadFile(distHtml);
  } else {
    mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  }

  // Double fallback on did-fail-load: NEVER leave the user with a blank white screen
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.warn('[Electron Main] did-fail-load triggered:', errorCode, errorDescription);
    if (fs.existsSync(distHtml)) {
      console.log('[Electron Main] Falling back to direct loadFile...');
      mainWindow.loadFile(distHtml);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (embeddedServer) {
    try {
      embeddedServer.close();
    } catch {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
