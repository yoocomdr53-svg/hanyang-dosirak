import { useState, useEffect, useCallback, useRef } from 'react';
import { AppVersionInfo } from '../types';
import { APP_VERSION, APP_VERSION_CODE, APP_BUILD_TIME } from '../version';
import { apiUrl } from '../utils/api';

export const CURRENT_APP_VERSION = APP_VERSION;
const VERSION_STORAGE_KEY = 'hanyang_dosirak_installed_version';
const VERSION_CODE_STORAGE_KEY = 'hanyang_version_code';
const BUILD_TIME_STORAGE_KEY = 'hanyang_build_time';
const AUTO_UPDATE_PREF_KEY = 'hanyang_auto_update_enabled';

export function useAppUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState<AppVersionInfo | null>(null);
  const latestVersionRef = useRef<AppVersionInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState<boolean>(false);

  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check if running inside offline APK container or hybrid app
  const isApkEnvironment =
    typeof window !== 'undefined' &&
    (Boolean((window as any).HanyangNativeBridge) ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.protocol === 'file:');

  // Currently running code version
  const [installedVersion, setInstalledVersion] = useState<string>(APP_VERSION);

  // Synchronize localStorage with currently running code version to kill any stale version keys
  useEffect(() => {
    try {
      localStorage.setItem(VERSION_STORAGE_KEY, APP_VERSION);
      localStorage.setItem(VERSION_CODE_STORAGE_KEY, String(APP_VERSION_CODE));
      localStorage.setItem(BUILD_TIME_STORAGE_KEY, String(APP_BUILD_TIME));
      localStorage.setItem(AUTO_UPDATE_PREF_KEY, 'false');
    } catch {}
  }, []);

  // Apply update: clear caches, activate new service worker, and reload
  const applyUpdate = useCallback(async () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);

    const targetInfo = latestVersionRef.current || latestVersion;
    try {
      // 1. Update version & build time in localStorage
      if (targetInfo?.version) {
        localStorage.setItem(VERSION_STORAGE_KEY, targetInfo.version);
        setInstalledVersion(targetInfo.version);
      }
      if (targetInfo?.versionCode) {
        localStorage.setItem(VERSION_CODE_STORAGE_KEY, String(targetInfo.versionCode));
      }
      if (targetInfo?.buildTime) {
        localStorage.setItem(BUILD_TIME_STORAGE_KEY, String(targetInfo.buildTime));
      }

      // 2. Clear all cache storages
      if ('caches' in window) {
        const keys = await window.caches.keys();
        await Promise.all(keys.map((k) => window.caches.delete(k)));
      }

      // 3. Notify SW to skip waiting
      if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg?.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }

      // 4. If running in native bridge, let native app know
      if (typeof window !== 'undefined' && (window as any).HanyangNativeBridge?.refreshApp) {
        (window as any).HanyangNativeBridge.refreshApp();
        return;
      }
    } catch (e) {
      console.warn('Error during update cleanup:', e);
    } finally {
      // Reload in place so the new version is immediately active and displayed inside the app
      window.location.reload();
    }
  }, [latestVersion]);

  // Check version from server
  const checkForUpdates = useCallback(
    async (isManual = false): Promise<{ hasUpdate: boolean; info?: AppVersionInfo }> => {
      if (isManual) {
        setIsChecking(true);
      }
      try {
        const fetchUrl = apiUrl(`/version.json?_t=${Date.now()}`);

        const res = await fetch(fetchUrl, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });

        if (!res.ok) {
          if (isManual) setIsChecking(false);
          return { hasUpdate: false };
        }

        const serverInfo: AppVersionInfo = await res.json();
        latestVersionRef.current = serverInfo;
        setLatestVersion(serverInfo);

        // An update is ONLY available if the server strictly has a higher versionCode or newer buildTime for a new version
        const isNewerCode = serverInfo.versionCode > APP_VERSION_CODE;
        const isNewerBuild = Boolean(
          serverInfo.buildTime &&
          serverInfo.buildTime > APP_BUILD_TIME &&
          serverInfo.version !== APP_VERSION
        );

        const hasUpdate = isNewerCode || isNewerBuild;

        if (hasUpdate) {
          setIsUpdateAvailable(true);
          setIsDismissed(false);
        } else {
          setIsUpdateAvailable(false);
          setCountdown(null);
        }

        // Inform service worker in background
        if ('serviceWorker' in navigator && registrationRef.current) {
          registrationRef.current.update().catch(() => {});
        }

        if (isManual) setIsChecking(false);
        return { hasUpdate, info: serverInfo };
      } catch (err) {
        console.warn('Update check failed:', err);
        if (isManual) setIsChecking(false);
        return { hasUpdate: false };
      }
    },
    []
  );

  const dismissUpdate = useCallback(() => {
    setIsDismissed(true);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setCountdown(null);
  }, []);

  const toggleAutoUpdate = useCallback((enabled: boolean) => {
    setAutoUpdateEnabled(enabled);
    try {
      localStorage.setItem(AUTO_UPDATE_PREF_KEY, String(enabled));
    } catch {}
  }, []);

  // Service worker registration hook & auto check listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          registrationRef.current = reg;

          // Check if there's an already waiting worker
          if (reg.waiting) {
            setIsUpdateAvailable(true);
          }

          // Listen for new workers installed
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  checkForUpdates();
                }
              });
            }
          });
        }
      });
    }

    // Check version immediately on mount
    checkForUpdates();

    // Check on visibility change (when smartphone screen turns on or app comes to foreground)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodically check every 45 seconds
    const interval = setInterval(() => {
      checkForUpdates();
    }, 45 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, [checkForUpdates]);

  return {
    isUpdateAvailable: isUpdateAvailable && !isDismissed,
    latestVersion,
    installedVersion,
    isChecking,
    countdown,
    autoUpdateEnabled,
    toggleAutoUpdate,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
    isApkEnvironment,
  };
}
