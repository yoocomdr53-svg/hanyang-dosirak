import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Support large Base64 images in menu payload
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // CORS Middleware for Android APK WebView, PWA, and cross-origin synchronization with credentials support
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  let currentVersion = 1;
  let lastUpdatedAt = new Date().toISOString();
  let currentDeletedIds: string[] = [];
  const sseClients: Array<express.Response> = [];

  // Helper to ensure public/data directory exists and read existing version if available
  const checkExistingData = () => {
    try {
      const jsonDir = path.resolve(__dirname, 'public', 'data');
      if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir, { recursive: true });
      }
      let jsonPath = path.resolve(jsonDir, 'menus.json');
      if (!fs.existsSync(jsonPath)) {
        jsonPath = path.resolve(__dirname, 'dist', 'data', 'menus.json');
      }
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.version) currentVersion = Number(parsed.version);
        if (parsed.updatedAt) lastUpdatedAt = parsed.updatedAt;
        if (Array.isArray(parsed.deletedIds)) currentDeletedIds = parsed.deletedIds;
      }
    } catch (err) {
      console.warn('[Server] Error checking existing menus.json:', err);
    }
  };
  checkExistingData();

  const broadcastUpdate = (data: { version: number; updatedAt: string; count: number; deletedIds?: string[]; senderId?: string | null }) => {
    const payload = `data: ${JSON.stringify({ type: 'update', ...data })}\n\n`;
    for (let i = sseClients.length - 1; i >= 0; i--) {
      try {
        sseClients[i].write(payload);
      } catch {
        sseClients.splice(i, 1);
      }
    }
  };

  /**
   * SSE Stream Endpoint: All connected smartphones, tablets, and PCs receive instant notifications
   */
  app.get('/api/menus/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof (res as any).flushHeaders === 'function') {
      (res as any).flushHeaders();
    }

    // Handshake
    res.write(`data: ${JSON.stringify({ type: 'connected', version: currentVersion, updatedAt: lastUpdatedAt })}\n\n`);
    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  /**
   * Lightweight version endpoint for rapid polling & focus checks
   */
  app.get('/api/menus/version', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.json({ version: currentVersion, updatedAt: lastUpdatedAt });
  });

  const DEFAULT_NOTICE = {
    content: '맑은 두부계란국, 유채나물무침, 특제 비트초절임, 수제 반찬 4종이 매일 아침 당일 조리되어 함께 제공됩니다.',
    isVisible: false,
  };
  const DEFAULT_STORE_STATUS = {
    isOpen: true,
    hoursText: '영업중 : 11:00-17:00',
    lastOrderText: '(라스트오더 마감 30분전)',
    address: '경기 평택시 송탄로 219',
  };
  const DEFAULT_CATS = ['도시락', '컵밥', '반찬'];

  /**
   * API Endpoint: Save menus, notice, store status to public/data/menus.json
   */
  app.post('/api/menus', async (req, res) => {
    try {
      const { menus, notice, storeStatus, categories, deletedIds, clientId, senderId } = req.body;
      const clientSenderId = clientId || senderId || null;
      if (!menus || !Array.isArray(menus)) {
        return res.status(400).json({ success: false, error: 'menus must be an array' });
      }

      if (Array.isArray(deletedIds)) {
        currentDeletedIds = Array.from(new Set([...currentDeletedIds, ...deletedIds.map(String)]));
      }

      currentVersion++;
      lastUpdatedAt = new Date().toISOString();

      const jsonDir = path.resolve(__dirname, 'public', 'data');
      if (!fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir, { recursive: true });
      }

      const payload = JSON.stringify(
        {
          menus,
          deletedIds: currentDeletedIds,
          notice: notice || DEFAULT_NOTICE,
          storeStatus: storeStatus || DEFAULT_STORE_STATUS,
          categories: categories && categories.length > 0 ? categories : DEFAULT_CATS,
          version: currentVersion,
          updatedAt: lastUpdatedAt,
        },
        null,
        2
      );

      fs.writeFileSync(path.resolve(jsonDir, 'menus.json'), payload, 'utf-8');

      // Also update dist/data/menus.json if in production
      const distJsonDir = path.resolve(__dirname, 'dist', 'data');
      if (fs.existsSync(distJsonDir)) {
        fs.writeFileSync(path.resolve(distJsonDir, 'menus.json'), payload, 'utf-8');
      }

      console.log(`[API /api/menus] Successfully saved ${menus.length} menus (v${currentVersion}, sender: ${clientSenderId || 'none'})`);
      broadcastUpdate({ version: currentVersion, updatedAt: lastUpdatedAt, count: menus.length, deletedIds: currentDeletedIds, senderId: clientSenderId });

      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.json({ success: true, count: menus.length, deletedIds: currentDeletedIds, version: currentVersion, updatedAt: lastUpdatedAt, senderId: clientSenderId });
    } catch (err: any) {
      console.error('[Save Error]', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to save' });
    }
  });

  // Alias /api/save-code to /api/menus for backward compatibility
  app.post('/api/save-code', (req, res, next) => {
    req.url = '/api/menus';
    app._router.handle(req, res, next);
  });

  // API Endpoint: Get live menus from disk
  app.get('/api/menus', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');

      let jsonPath = path.resolve(__dirname, 'public', 'data', 'menus.json');
      if (!fs.existsSync(jsonPath)) {
        jsonPath = path.resolve(__dirname, 'dist', 'data', 'menus.json');
      }
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const data = JSON.parse(raw);
        data.version = data.version || currentVersion;
        data.updatedAt = data.updatedAt || lastUpdatedAt;
        data.deletedIds = Array.isArray(data.deletedIds) ? data.deletedIds : currentDeletedIds;
        return res.json(data);
      }
      return res.json({
        menus: null,
        deletedIds: currentDeletedIds,
        version: currentVersion,
        updatedAt: lastUpdatedAt,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read menus' });
    }
  });

  // Serve APK if present
  app.get('/hanyang-dosirak.apk', (req, res, next) => {
    const apkPath = path.resolve(__dirname, 'public', 'hanyang-dosirak.apk');
    if (fs.existsSync(apkPath)) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment; filename="hanyang-dosirak.apk"');
      return res.sendFile(apkPath);
    }
    next();
  });

  if (isProd) {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    // Mount Vite dev server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Hanyang Dosirak server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
