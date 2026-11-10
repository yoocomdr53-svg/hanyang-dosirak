const express = require('express');
const path = require('path');
const fs = require('fs');

function createEmbeddedServer(options = {}) {
  const app = express();
  const PORT = options.port || 3000;
  const projectRoot = options.projectRoot || path.resolve(__dirname, '..');
  const distDir = path.resolve(projectRoot, 'dist');
  const dataDir = path.resolve(projectRoot, 'public', 'data');

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true, limit: '100mb' }));

  // CORS
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  let currentVersion = 1;
  let lastUpdatedAt = new Date().toISOString();
  let currentDeletedIds = [];
  const sseClients = [];

  const loadInitialData = () => {
    try {
      let jsonPath = path.resolve(dataDir, 'menus.json');
      if (!fs.existsSync(jsonPath)) {
        jsonPath = path.resolve(distDir, 'data', 'menus.json');
      }
      if (fs.existsSync(jsonPath)) {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.version) currentVersion = Number(parsed.version);
        if (parsed.updatedAt) lastUpdatedAt = parsed.updatedAt;
        if (Array.isArray(parsed.deletedIds)) currentDeletedIds = parsed.deletedIds;
      }
    } catch (e) {
      console.warn('[EmbeddedServer] Error loading menus.json:', e);
    }
  };
  loadInitialData();

  const broadcastUpdate = (data) => {
    const payload = `data: ${JSON.stringify({ type: 'update', ...data })}\n\n`;
    for (let i = sseClients.length - 1; i >= 0; i--) {
      try {
        sseClients[i].write(payload);
      } catch {
        sseClients.splice(i, 1);
      }
    }
  };

  app.get('/api/menus/version', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ version: currentVersion, updatedAt: lastUpdatedAt });
  });

  app.get('/api/menus/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    if (typeof res.flushHeaders === 'function') res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'connected', version: currentVersion, updatedAt: lastUpdatedAt })}\n\n`);
    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  app.get('/api/menus', (req, res) => {
    try {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      let jsonPath = path.resolve(dataDir, 'menus.json');
      if (!fs.existsSync(jsonPath)) {
        jsonPath = path.resolve(distDir, 'data', 'menus.json');
      }
      if (fs.existsSync(jsonPath)) {
        const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        return res.json(data);
      }
      return res.json({ menus: [], version: currentVersion, updatedAt: lastUpdatedAt });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to read menus' });
    }
  });

  app.post('/api/menus', (req, res) => {
    try {
      const { menus, notice, storeStatus, categories, deletedIds, clientId } = req.body;
      if (!Array.isArray(menus)) {
        return res.status(400).json({ error: 'menus must be an array' });
      }

      currentVersion++;
      lastUpdatedAt = new Date().toISOString();
      if (Array.isArray(deletedIds)) {
        currentDeletedIds = Array.from(new Set([...currentDeletedIds, ...deletedIds.map(String)]));
      }

      const payload = JSON.stringify(
        {
          menus,
          deletedIds: currentDeletedIds,
          notice: notice || { content: '', isVisible: false },
          storeStatus: storeStatus || { isOpen: true, hoursText: '11:00-17:00', address: '경기 평택시 송탄로 219' },
          categories: categories || ['도시락', '컵밥', '반찬'],
          version: currentVersion,
          updatedAt: lastUpdatedAt,
        },
        null,
        2
      );

      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      fs.writeFileSync(path.resolve(dataDir, 'menus.json'), payload, 'utf-8');

      const distDataDir = path.resolve(distDir, 'data');
      if (fs.existsSync(distDataDir)) {
        fs.writeFileSync(path.resolve(distDataDir, 'menus.json'), payload, 'utf-8');
      }

      broadcastUpdate({ version: currentVersion, updatedAt: lastUpdatedAt, count: menus.length, senderId: clientId });
      return res.json({ success: true, count: menus.length, version: currentVersion, updatedAt: lastUpdatedAt });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Serve static dist
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  }

  return new Promise((resolve) => {
    const server = app.listen(PORT, '127.0.0.1', () => {
      console.log(`[EmbeddedServer] Running at http://127.0.0.1:${PORT}`);
      resolve(server);
    });
    server.on('error', (err) => {
      console.warn('[EmbeddedServer] Port listen error:', err.message);
      resolve(null);
    });
  });
}

module.exports = { createEmbeddedServer };
