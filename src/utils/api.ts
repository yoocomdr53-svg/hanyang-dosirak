/**
 * Utility to resolve API endpoints across Web Browser, PWA, and Android APK WebView.
 * When running inside the Android APK (localhost / native bridge), requests are routed
 * to the remote Cloud server so that data synchronization is 100% active and shared.
 */

export const REMOTE_SERVER_URL = 'https://ais-dev-flee3vxwioyt6xffh6ak3i-3004181187.asia-northeast1.run.app';

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const isFileProtocol = protocol === 'file:';

    // 1. Check if Android Native bridge explicitly provides central server URL
    const bridge = (window as any).HanyangNativeBridge;
    if (bridge && typeof bridge.getServerUrl === 'function') {
      try {
        const u = bridge.getServerUrl();
        if (u && typeof u === 'string' && u.startsWith('http')) {
          return u.replace(/\/$/, '');
        }
      } catch {}
    }

    // 2. Normal HTTP / HTTPS web environment (including dev server, PWA, and browser on smartphone/tablet/PC)
    if (!isFileProtocol) {
      try {
        localStorage.setItem('hanyang_server_origin', window.location.origin);
      } catch {}
      return '';
    }

    // 3. File protocol (offline Android APK webview fallback)
    try {
      const cached = localStorage.getItem('hanyang_server_origin');
      if (cached && cached.startsWith('http')) {
        return cached.replace(/\/$/, '');
      }
    } catch {}

    // 4. Default to live remote server
    return REMOTE_SERVER_URL;
  }

  return '';
};

export const apiUrl = (endpoint: string): string => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
};
