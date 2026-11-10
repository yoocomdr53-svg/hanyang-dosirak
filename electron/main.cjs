const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let serverProcess = null;
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function checkServerReady(port, callback) {
  const check = () => {
    const req = http.get(`http://localhost:${port}/api/menus/version`, (res) => {
      if (res.statusCode === 200 || res.statusCode === 304) {
        callback();
      } else {
        setTimeout(check, 300);
      }
    });
    req.on('error', () => {
      setTimeout(check, 300);
    });
  };
  check();
}

function startBackendServer() {
  const projectRoot = isDev ? path.resolve(__dirname, '..') : process.resourcesPath;

  if (isDev) {
    // In dev mode, run via tsx
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    serverProcess = spawn(npxCmd, ['tsx', 'server.ts'], {
      cwd: projectRoot,
      env: { ...process.env, PORT: String(PORT), NODE_ENV: 'development' },
      stdio: 'inherit',
      shell: true,
    });
  } else {
    // In production, execute the bundled server
    const serverScript = path.join(projectRoot, 'dist-server', 'server.mjs');
    serverProcess = spawn('node', [serverScript], {
      cwd: projectRoot,
      env: { ...process.env, PORT: String(PORT), NODE_ENV: 'production' },
      stdio: 'inherit',
      shell: true,
    });
  }

  serverProcess.on('error', (err) => {
    console.error('[Electron Main] Failed to start backend server:', err);
  });
}

function createWindow() {
  const iconPath = path.join(__dirname, '../public/pwa-512x512.png');

  mainWindow = new BrowserWindow({
    width: 1366,
    height: 868,
    minWidth: 960,
    minHeight: 640,
    title: '한양도시락 (漢陽) - 키오스크 & 매장 관리 시스템',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
    autoHideMenuBar: false,
  });

  // Setup Application Menu
  const menuTemplate = [
    {
      label: '한양도시락',
      submenu: [
        { label: '새로고침 (F5)', accelerator: 'F5', click: () => mainWindow && mainWindow.reload() },
        { label: '강제 새로고침 (Ctrl+R)', accelerator: 'CmdOrCtrl+R', click: () => mainWindow && mainWindow.webContents.reloadIgnoringCache() },
        { type: 'separator' },
        { label: '종료', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
      ],
    },
    {
      label: '보기',
      submenu: [
        { label: '전체화면 (F11)', accelerator: 'F11', click: () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { label: '실제 크기', accelerator: 'CmdOrCtrl+0', click: () => mainWindow && mainWindow.webContents.setZoomLevel(0) },
        { label: '확대', accelerator: 'CmdOrCtrl+Plus', click: () => mainWindow && mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() + 0.5) },
        { label: '축소', accelerator: 'CmdOrCtrl+-', click: () => mainWindow && mainWindow.webContents.setZoomLevel(mainWindow.webContents.getZoomLevel() - 0.5) },
        { type: 'separator' },
        { label: '개발자 도구 (F12)', accelerator: 'F12', click: () => mainWindow && mainWindow.webContents.toggleDevTools() },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  const targetUrl = `http://localhost:${PORT}`;

  checkServerReady(PORT, () => {
    console.log(`[Electron Main] Backend is ready at ${targetUrl}, loading window...`);
    mainWindow.loadURL(targetUrl);
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

// App lifecycle
app.whenReady().then(() => {
  startBackendServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(serverProcess.pid), '/f', '/t']);
      } else {
        serverProcess.kill('SIGTERM');
      }
    } catch (e) {
      console.warn('Error killing server process:', e);
    }
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
