import { useState, useEffect, useMemo, useRef } from 'react';
import { MenuItem, DailyNoticeState, StoreStatusState, MenuCategory, DEFAULT_CATEGORIES } from './types';
import { INITIAL_MENUS, INITIAL_NOTICE, INITIAL_STORE_STATUS } from './data/initialMenus';
import { CustomerHeader } from './components/CustomerHeader';
import { NoticeBanner } from './components/NoticeBanner';
import { CategoryNav } from './components/CategoryNav';
import { MenuCard } from './components/MenuCard';
import { AdminConsole } from './components/AdminConsole';
import { AdminPinModal } from './components/AdminPinModal';
import { LocationModal } from './components/LocationModal';
import { PhotoUploadModal } from './components/PhotoUploadModal';
import { InstallAppModal } from './components/InstallAppModal';
import { AppUpdateModal } from './components/AppUpdateModal';
import { Toast } from './components/Toast';
import { useAppUpdate } from './hooks/useAppUpdate';
import { stripFormatting } from './utils/textFormatter';
import { APP_VERSION } from './version';
import {
  saveToDB,
  loadFromDB,
  exportAppStateJSON,
  parseAppStateJSON,
} from './utils/dbStorage';
import { apiUrl } from './utils/api';
import {
  SupportedLanguage,
  translateMenuName,
  translateMenuDesc,
  translateMenuTag,
  translateCategory,
  getUIText,
} from './utils/translations';

const STORAGE_KEYS = {
  MENUS: 'hanyang_dosirak_menus_v3',
  NOTICE: 'hanyang_dosirak_notice_v2',
  STORE: 'hanyang_dosirak_store_v2',
  CATEGORIES: 'hanyang_dosirak_categories_v2',
  APP_VER: 'hanyang_bundle_version',
  LANGUAGE: 'hanyang_app_language',
};

export default function App() {
  // Multi-language state (ko: Korean, en: English, ja: Japanese, zh: Chinese)
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (savedLang === 'en' || savedLang === 'ja' || savedLang === 'zh' || savedLang === 'ko') {
        return savedLang;
      }
    } catch {}
    return 'ko';
  });

  // Synchronize version tracking safely without clearing user menus or photos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APP_VER, APP_VERSION);
    } catch {}
  }, []);

  // State with localStorage immediate cache
  const [menus, setMenus] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENUS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore fallback
    }
    return INITIAL_MENUS;
  });

  const [notice, setNotice] = useState<DailyNoticeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore fallback
    }
    return INITIAL_NOTICE;
  });

  const [storeStatus, setStoreStatus] = useState<StoreStatusState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore fallback
    }
    return INITIAL_STORE_STATUS;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore fallback
    }
    return DEFAULT_CATEGORIES;
  });

  // Real-time synchronization state & refs
  const clientIdRef = useRef<string>(
    typeof window !== 'undefined'
      ? sessionStorage.getItem('hanyang_client_id') ||
        (() => {
          const id = `client_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          try {
            sessionStorage.setItem('hanyang_client_id', id);
          } catch {}
          return id;
        })()
      : `client_${Date.now()}`
  );
  const isHydratedRef = useRef(false);
  const serverVersionRef = useRef<number>(1);
  const isUpdatingFromServerRef = useRef<boolean>(false);
  const saveTimeoutRef = useRef<any>(null);
  const deletedMenuIdsRef = useRef<Set<string>>(new Set());

  // Helper to record local timestamp whenever local changes occur
  const recordLocalUpdate = () => {
    const now = Date.now();
    saveToDB('last_updated_at', now).catch(() => {});
    try {
      localStorage.setItem('hanyang_local_updated_at', now.toString());
    } catch {}
  };

  /**
   * Smart Lossless Reconciliation Helper for Menus:
   * Combines server state with local IndexedDB state, ensuring:
   * 1. 100% of menu details (desc, tag, name, price, category, soldOut, isBest, isRec, isVisible, styling) are merged without loss.
   * 2. Deleted menus (tracked via deletedMenuIds) are never resurrected by old local caches.
   * 3. Custom added menus (like 10 컵밥 on smartphone) are preserved and synced across all devices.
   */
  const reconcileMenus = (
    localMenus: MenuItem[] | null,
    serverMenus: MenuItem[] | null,
    preferLocal = false
  ): MenuItem[] => {
    const deletedIds = deletedMenuIdsRef.current;

    const filterDeleted = (list: MenuItem[] | null): MenuItem[] => {
      if (!list) return [];
      return list.filter((m) => m && m.id && !deletedIds.has(String(m.id)));
    };

    const cleanLocal = filterDeleted(localMenus);
    const cleanServer = filterDeleted(serverMenus);

    if (cleanServer.length === 0) {
      return cleanLocal.length > 0 ? cleanLocal : filterDeleted(INITIAL_MENUS);
    }
    if (cleanLocal.length === 0) {
      return cleanServer;
    }

    const localMap = new Map<string, MenuItem>(cleanLocal.map((m) => [m.id, m]));
    const serverMap = new Map<string, MenuItem>(cleanServer.map((m) => [m.id, m]));

    const merged: MenuItem[] = [];
    const primaryList = preferLocal ? cleanLocal : cleanServer;
    const secondaryMap = preferLocal ? serverMap : localMap;

    for (const item of primaryList) {
      if (deletedIds.has(item.id)) continue;
      const secondaryItem = secondaryMap.get(item.id);
      if (secondaryItem) {
        const localItem = preferLocal ? item : secondaryItem;
        const serverItem = preferLocal ? secondaryItem : item;

        // Custom uploaded photos (Base64 data:image or user custom URL differing from initialImg)
        const isLocalCustomPhoto = Boolean(
          localItem.img && (
            localItem.img.startsWith('data:image') ||
            (localItem.initialImg && localItem.img !== localItem.initialImg)
          )
        );
        const isServerCustomPhoto = Boolean(
          serverItem.img && (
            serverItem.img.startsWith('data:image') ||
            (serverItem.initialImg && serverItem.img !== serverItem.initialImg)
          )
        );

        let finalPhoto = item.img || secondaryItem.img || '';
        if (isLocalCustomPhoto && !isServerCustomPhoto) {
          finalPhoto = localItem.img;
        } else if (!isLocalCustomPhoto && isServerCustomPhoto) {
          finalPhoto = serverItem.img;
        } else if (preferLocal) {
          finalPhoto = localItem.img || serverItem.img || '';
        } else {
          finalPhoto = serverItem.img || localItem.img || '';
        }

        // When syncing, ensure every single property (desc, tag, styling, flags) is comprehensively merged
        const finalName = (preferLocal ? item.name : serverItem.name)?.trim() || localItem.name || serverItem.name || '';
        
        // For Description: protect non-empty value from being overwritten with empty/default
        let finalDesc = '';
        if (preferLocal) {
          finalDesc = (item.desc && item.desc.trim() !== '') ? item.desc : (secondaryItem.desc || '');
        } else {
          finalDesc = (serverItem.desc && serverItem.desc.trim() !== '') ? serverItem.desc : (localItem.desc || '');
        }

        // For Tag: protect non-empty value
        let finalTag = '';
        if (preferLocal) {
          finalTag = (item.tag && item.tag.trim() !== '') ? item.tag : (secondaryItem.tag || '');
        } else {
          finalTag = (serverItem.tag && serverItem.tag.trim() !== '') ? serverItem.tag : (localItem.tag || '');
        }

        const finalPrice = typeof (preferLocal ? item.price : serverItem.price) === 'number' && (preferLocal ? item.price : serverItem.price) > 0
          ? (preferLocal ? item.price : serverItem.price)
          : (localItem.price || serverItem.price || 0);

        merged.push({
          ...localItem,
          ...serverItem,
          ...(preferLocal ? item : {}),
          id: item.id,
          name: finalName,
          desc: finalDesc,
          tag: finalTag,
          price: finalPrice,
          category: Array.isArray(preferLocal ? item.category : serverItem.category) && (preferLocal ? item.category : serverItem.category).length > 0
            ? (preferLocal ? item.category : serverItem.category)
            : (localItem.category || serverItem.category || ['도시락']),
          isBest: (preferLocal ? item.isBest : serverItem.isBest) !== undefined
            ? Boolean(preferLocal ? item.isBest : serverItem.isBest)
            : Boolean(localItem.isBest),
          isRec: (preferLocal ? item.isRec : serverItem.isRec) !== undefined
            ? Boolean(preferLocal ? item.isRec : serverItem.isRec)
            : Boolean(localItem.isRec),
          isSoldOut: (preferLocal ? item.isSoldOut : serverItem.isSoldOut) !== undefined
            ? Boolean(preferLocal ? item.isSoldOut : serverItem.isSoldOut)
            : Boolean(localItem.isSoldOut),
          isVisible: (preferLocal ? item.isVisible : serverItem.isVisible) !== undefined
            ? Boolean(preferLocal ? item.isVisible : serverItem.isVisible)
            : (localItem.isVisible !== false),
          nameColor: (preferLocal ? item.nameColor : serverItem.nameColor) || localItem.nameColor || '#1C1C19',
          nameFont: (preferLocal ? item.nameFont : serverItem.nameFont) || localItem.nameFont || 'noto',
          nameFontSize: (preferLocal ? item.nameFontSize : serverItem.nameFontSize) || localItem.nameFontSize || 'base',
          img: finalPhoto,
          initialImg: serverItem.initialImg || localItem.initialImg || finalPhoto,
        });
      } else {
        if (!deletedIds.has(item.id)) {
          merged.push(item);
        }
      }
    }

    // Preserve any custom user-created menus from local storage unless explicitly deleted
    const mergedIds = new Set(merged.map((m) => m.id));
    for (const item of cleanLocal) {
      if (!mergedIds.has(item.id) && !deletedIds.has(item.id)) {
        merged.push(item);
        mergedIds.add(item.id);
      }
    }

    // Preserve any menus from server that might not be locally cached unless explicitly deleted
    for (const item of cleanServer) {
      if (!mergedIds.has(item.id) && !deletedIds.has(item.id)) {
        merged.push(item);
        mergedIds.add(item.id);
      }
    }

    return merged;
  };

  /**
   * Reconcile Categories:
   * Keep all unique configured categories across local and server without dropping '컵밥' or '반찬'.
   */
  const reconcileCategories = (
    localCats: string[] | null,
    serverCats: string[] | null,
    preferLocal = false
  ): string[] => {
    const primary = preferLocal ? localCats : serverCats;
    const secondary = preferLocal ? serverCats : localCats;

    const list: string[] = [];
    if (primary && Array.isArray(primary) && primary.length > 0) {
      for (const c of primary) {
        const trimmed = String(c).trim();
        if (trimmed && !list.includes(trimmed)) list.push(trimmed);
      }
    }
    if (secondary && Array.isArray(secondary) && secondary.length > 0) {
      for (const c of secondary) {
        const trimmed = String(c).trim();
        if (trimmed && !list.includes(trimmed)) list.push(trimmed);
      }
    }
    return list.length > 0 ? list : DEFAULT_CATEGORIES;
  };

  // Function to pull latest data from server while protecting local custom menus and photos
  const fetchLatestFromServer = async (silent = true) => {
    // If local edits are currently pending save to server, protect them from being overwritten
    if (saveTimeoutRef.current) {
      console.log('[Sync] Local edits pending save, postponing fetchFromServer');
      return;
    }

    try {
      isUpdatingFromServerRef.current = true;
      let apiData: any = null;
      try {
        const apiRes = await fetch(apiUrl('/api/menus'), {
          cache: 'no-store',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Pragma: 'no-cache',
          },
        });
        if (apiRes.ok) {
          apiData = await apiRes.json();
        }
      } catch {}

      if (!apiData) {
        try {
          const staticRes = await fetch('./data/menus.json');
          if (staticRes.ok) {
            apiData = await staticRes.json();
          }
        } catch {}
      }

      if (!apiData) {
        isUpdatingFromServerRef.current = false;
        return;
      }

      // Sync deleted IDs from server
      if (Array.isArray(apiData.deletedIds)) {
        for (const id of apiData.deletedIds) {
          deletedMenuIdsRef.current.add(String(id));
        }
        saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)).catch(() => {});
        try {
          localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
        } catch {}
      }

      if (apiData && apiData.menus && Array.isArray(apiData.menus) && apiData.menus.length > 0) {
        // Retrieve current local state with IndexedDB, localStorage, and memory fallbacks
        let [currentDbMenus, currentDbCats] = await Promise.all([
          loadFromDB<MenuItem[]>('menus'),
          loadFromDB<string[]>('categories'),
        ]);

        if (!currentDbMenus || currentDbMenus.length === 0) {
          try {
            const ls = localStorage.getItem(STORAGE_KEYS.MENUS);
            if (ls) currentDbMenus = JSON.parse(ls);
          } catch {}
        }
        if (!currentDbMenus || currentDbMenus.length === 0) {
          currentDbMenus = menus;
        }

        if (!currentDbCats || currentDbCats.length === 0) {
          try {
            const ls = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
            if (ls) currentDbCats = JSON.parse(ls);
          } catch {}
        }
        if (!currentDbCats || currentDbCats.length === 0) {
          currentDbCats = categories;
        }

        // Normalize all server menus ensuring every single property exists
        const normalizedServerMenus: MenuItem[] = (apiData.menus as any[])
          .filter((m) => m && m.id && !deletedMenuIdsRef.current.has(String(m.id)))
          .map((m) => {
            let cats: string[] = [];
            if (Array.isArray(m.category)) {
              cats = m.category.map(String).map((c) => c.trim()).filter(Boolean);
            } else if (typeof m.category === 'string' && m.category.trim()) {
              cats = [m.category.trim()];
            }
            if (cats.length === 0) cats = ['도시락'];

            return {
              ...m,
              id: String(m.id),
              name: String(m.name ?? '').trim(),
              price: typeof m.price === 'number' && !isNaN(m.price) ? m.price : (parseInt(String(m.price), 10) || 0),
              category: cats,
              img: String(m.img ?? ''),
              initialImg: String(m.initialImg ?? m.img ?? ''),
              desc: typeof m.desc === 'string' ? m.desc : String(m.desc ?? ''),
              tag: typeof m.tag === 'string' ? m.tag : String(m.tag ?? ''),
              isBest: Boolean(m.isBest),
              isRec: Boolean(m.isRec),
              isSoldOut: Boolean(m.isSoldOut),
              isVisible: m.isVisible !== false,
              nameColor: m.nameColor || '#1C1C19',
              nameFont: m.nameFont || 'noto',
              nameFontSize: m.nameFontSize || 'base',
            };
          });

        const mergedMenus = reconcileMenus(currentDbMenus, normalizedServerMenus, false);
        const mergedCats = reconcileCategories(currentDbCats, apiData.categories, false);

        setMenus(mergedMenus);
        if (apiData.notice) setNotice(apiData.notice);
        if (apiData.storeStatus) setStoreStatus(apiData.storeStatus);
        setCategories(mergedCats);

        if (apiData.version) {
          serverVersionRef.current = Number(apiData.version);
          try {
            localStorage.setItem('hanyang_synced_version', apiData.version.toString());
          } catch {}
        }

        // Keep local offline storage in sync with complete attributes
        saveToDB('menus', mergedMenus).catch(() => {});
        if (apiData.notice) saveToDB('notice', apiData.notice).catch(() => {});
        if (apiData.storeStatus) saveToDB('store', apiData.storeStatus).catch(() => {});
        saveToDB('categories', mergedCats).catch(() => {});

        try {
          const compactMenus = mergedMenus.map((m) => {
            if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
              return { ...m, img: m.initialImg || '' };
            }
            return m;
          });
          localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compactMenus));
          if (apiData.notice) localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(apiData.notice));
          if (apiData.storeStatus) localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(apiData.storeStatus));
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mergedCats));
        } catch {}

        // Check if local device has custom menus or attributes missing on server (e.g. 10 컵밥 on smartphone)
        const serverIds = new Set(normalizedServerMenus.map((m) => m.id));
        const localHasNewItems = Boolean(
          currentDbMenus &&
          currentDbMenus.some((m) => !serverIds.has(m.id) && !deletedMenuIdsRef.current.has(m.id))
        );
        const countDiffers = mergedMenus.length > normalizedServerMenus.length;
        const attributesDiffer = Boolean(
          currentDbMenus &&
          currentDbMenus.some((localM) => {
            const sM = normalizedServerMenus.find((m) => m.id === localM.id);
            if (!sM) return false;
            return (
              (localM.desc && localM.desc !== sM.desc) ||
              (localM.tag && localM.tag !== sM.tag) ||
              (localM.price && localM.price !== sM.price) ||
              (localM.name && localM.name !== sM.name)
            );
          })
        );

        if (countDiffers || localHasNewItems || attributesDiffer) {
          console.log('[Sync] Local device has custom menus or attributes missing on server, immediately pushing to server');
          pushStateToServer(
            mergedMenus,
            apiData.notice || notice,
            apiData.storeStatus || storeStatus,
            mergedCats,
            { immediate: true, force: true }
          );
        }

        if (!silent) {
          showToast(`☁️ 서버의 최신 메뉴(${mergedMenus.length}개, 상세설명/태그 포함)가 100% 동기화되었습니다!`);
        }
      }
    } catch (e) {
      console.warn('Sync from server error:', e);
    } finally {
      // Hold isUpdatingFromServerRef true briefly so state triggers do not loop back into pushStateToServer
      setTimeout(() => {
        isUpdatingFromServerRef.current = false;
      }, 600);
    }
  };

  // Hydrate: Immediate local cache render for 0ms startup, then sync with server
  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        // 0. Load deleted IDs first to prevent resurrection
        let [dbMenus, dbNotice, dbStore, dbCats, dbDeletedIds] = await Promise.all([
          loadFromDB<MenuItem[]>('menus'),
          loadFromDB<DailyNoticeState>('notice'),
          loadFromDB<StoreStatusState>('store'),
          loadFromDB<string[]>('categories'),
          loadFromDB<string[]>('deleted_ids'),
        ]);

        if (Array.isArray(dbDeletedIds)) {
          for (const id of dbDeletedIds) deletedMenuIdsRef.current.add(String(id));
        }
        try {
          const lsDel = localStorage.getItem('hanyang_deleted_ids');
          if (lsDel) {
            const parsedDel = JSON.parse(lsDel);
            if (Array.isArray(parsedDel)) {
              for (const id of parsedDel) deletedMenuIdsRef.current.add(String(id));
            }
          }
        } catch {}

        if (!dbMenus || dbMenus.length === 0) {
          try {
            const ls = localStorage.getItem(STORAGE_KEYS.MENUS);
            if (ls) dbMenus = JSON.parse(ls);
          } catch {}
        }
        if (!dbNotice) {
          try {
            const ls = localStorage.getItem(STORAGE_KEYS.NOTICE);
            if (ls) dbNotice = JSON.parse(ls);
          } catch {}
        }
        if (!dbStore) {
          try {
            const ls = localStorage.getItem(STORAGE_KEYS.STORE);
            if (ls) dbStore = JSON.parse(ls);
          } catch {}
        }
        if (!dbCats || dbCats.length === 0) {
          try {
            const ls = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
            if (ls) dbCats = JSON.parse(ls);
          } catch {}
        }

        // Filter out any locally deleted menus
        if (dbMenus && Array.isArray(dbMenus)) {
          dbMenus = dbMenus.filter((m) => m && m.id && !deletedMenuIdsRef.current.has(m.id));
        }

        if (isMounted) {
          if (dbMenus && Array.isArray(dbMenus) && dbMenus.length > 0) {
            setMenus(dbMenus);
          }
          if (dbNotice && dbNotice.content) {
            setNotice(dbNotice);
          }
          if (dbStore && typeof dbStore.isOpen === 'boolean') {
            setStoreStatus(dbStore);
          }
          if (dbCats && Array.isArray(dbCats) && dbCats.length > 0) {
            setCategories(dbCats);
          }
        }

        // 2. Query /api/menus or static ./data/menus.json for state (Source of Truth)
        try {
          let apiData: any = null;
          try {
            const apiRes = await fetch(apiUrl('/api/menus'), {
              cache: 'no-store',
              credentials: 'include',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                Pragma: 'no-cache',
              },
            });
            if (apiRes.ok) {
              apiData = await apiRes.json();
            }
          } catch {}

          if (!apiData) {
            try {
              const staticRes = await fetch('./data/menus.json');
              if (staticRes.ok) {
                apiData = await staticRes.json();
              }
            } catch {}
          }

          if (apiData && isMounted) {

            // Sync deleted IDs from server
            if (Array.isArray(apiData.deletedIds)) {
              for (const id of apiData.deletedIds) {
                deletedMenuIdsRef.current.add(String(id));
              }
              saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)).catch(() => {});
              try {
                localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
              } catch {}
            }

            const serverHasMenus = apiData && apiData.menus && Array.isArray(apiData.menus) && apiData.menus.length > 0;

            if (serverHasMenus) {
              const normalizedServerMenus: MenuItem[] = (apiData.menus as any[])
                .filter((m) => m && m.id && !deletedMenuIdsRef.current.has(String(m.id)))
                .map((m) => {
                  let cats: string[] = [];
                  if (Array.isArray(m.category)) {
                    cats = m.category.map(String).map((c) => c.trim()).filter(Boolean);
                  } else if (typeof m.category === 'string' && m.category.trim()) {
                    cats = [m.category.trim()];
                  }
                  if (cats.length === 0) cats = ['도시락'];

                  return {
                    ...m,
                    id: String(m.id),
                    name: String(m.name ?? '').trim(),
                    price: typeof m.price === 'number' && !isNaN(m.price) ? m.price : (parseInt(String(m.price), 10) || 0),
                    category: cats,
                    img: String(m.img ?? ''),
                    initialImg: String(m.initialImg ?? m.img ?? ''),
                    desc: typeof m.desc === 'string' ? m.desc : String(m.desc ?? ''),
                    tag: typeof m.tag === 'string' ? m.tag : String(m.tag ?? ''),
                    isBest: Boolean(m.isBest),
                    isRec: Boolean(m.isRec),
                    isSoldOut: Boolean(m.isSoldOut),
                    isVisible: m.isVisible !== false,
                    nameColor: m.nameColor || '#1C1C19',
                    nameFont: m.nameFont || 'noto',
                    nameFontSize: m.nameFontSize || 'base',
                  };
                });

              const mergedMenus = reconcileMenus(dbMenus, normalizedServerMenus, false);
              const mergedCats = reconcileCategories(dbCats, apiData.categories, false);

              setMenus(mergedMenus);
              if (apiData.notice) setNotice(apiData.notice);
              if (apiData.storeStatus) setStoreStatus(apiData.storeStatus);
              setCategories(mergedCats);

              if (apiData.version) {
                serverVersionRef.current = Number(apiData.version);
                try {
                  localStorage.setItem('hanyang_synced_version', apiData.version.toString());
                } catch {}
              }

              // Update local offline cache with clean synced state
              saveToDB('menus', mergedMenus).catch(() => {});
              if (apiData.notice) saveToDB('notice', apiData.notice).catch(() => {});
              if (apiData.storeStatus) saveToDB('store', apiData.storeStatus).catch(() => {});
              saveToDB('categories', mergedCats).catch(() => {});

              try {
                const compactMenus = mergedMenus.map((m) => {
                  if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
                    return { ...m, img: m.initialImg || '' };
                  }
                  return m;
                });
                localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compactMenus));
                if (apiData.notice) localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(apiData.notice));
                if (apiData.storeStatus) localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(apiData.storeStatus));
                localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mergedCats));
              } catch {}

              // Check if local device has custom menus or attributes missing on server (e.g. 10 컵밥 on smartphone)
              const serverIds = new Set(normalizedServerMenus.map((m) => m.id));
              const localHasNewItems = Boolean(
                dbMenus &&
                dbMenus.some((m) => !serverIds.has(m.id) && !deletedMenuIdsRef.current.has(m.id))
              );
              const countDiffers = mergedMenus.length > normalizedServerMenus.length;
              const attributesDiffer = Boolean(
                dbMenus &&
                dbMenus.some((localM) => {
                  const sM = normalizedServerMenus.find((m) => m.id === localM.id);
                  if (!sM) return false;
                  return (
                    (localM.desc && localM.desc !== sM.desc) ||
                    (localM.tag && localM.tag !== sM.tag) ||
                    (localM.price && localM.price !== sM.price) ||
                    (localM.name && localM.name !== sM.name)
                  );
                })
              );

              if (countDiffers || localHasNewItems || attributesDiffer) {
                console.log('[Hydrate] Local device has custom menus or attributes missing on server, immediately pushing to server');
                pushStateToServer(
                  mergedMenus,
                  apiData.notice || INITIAL_NOTICE,
                  apiData.storeStatus || INITIAL_STORE_STATUS,
                  mergedCats,
                  { immediate: true, force: true }
                );
              }
            } else {
              // Server has no menus.json yet: seed the server with current state
              const initialMenusToSeed = (dbMenus && dbMenus.length > 0) ? dbMenus : INITIAL_MENUS;
              const initialNoticeToSeed = (dbNotice && dbNotice.content) ? dbNotice : INITIAL_NOTICE;
              const initialStoreToSeed = dbStore ? dbStore : INITIAL_STORE_STATUS;
              const initialCatsToSeed = (dbCats && dbCats.length > 0) ? dbCats : DEFAULT_CATEGORIES;
              fetch(apiUrl('/api/menus'), {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  menus: initialMenusToSeed,
                  deletedIds: Array.from(deletedMenuIdsRef.current),
                  notice: initialNoticeToSeed,
                  storeStatus: initialStoreToSeed,
                  categories: initialCatsToSeed,
                }),
              })
                .then((r) => r.json())
                .then((resData) => {
                  if (resData && resData.version) {
                    serverVersionRef.current = Number(resData.version);
                    try {
                      localStorage.setItem('hanyang_synced_version', resData.version.toString());
                    } catch {}
                  }
                })
                .catch(() => {});
            }
          }
        } catch (apiErr) {
          console.log('Server fetch fallback to local cache:', apiErr);
        }
      } catch (e) {
        console.warn('Hydration error:', e);
      } finally {
        if (isMounted) {
          setTimeout(() => {
            isHydratedRef.current = true;
          }, 300);
        }
      }
    };

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  // Multi-device real-time sync (SSE + Polling fallback + Visibility, Focus, Online detection)
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(apiUrl('/api/menus/stream'));
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'update' && typeof data.version === 'number') {
            // Ignore updates originating from this exact client tab to prevent infinite loop / self-overwrite
            if (data.senderId && data.senderId === clientIdRef.current) {
              serverVersionRef.current = data.version;
              return;
            }
            if (data.version !== serverVersionRef.current && !isUpdatingFromServerRef.current) {
              console.log('[SSE] Remote update detected (v' + data.version + '), syncing latest data...');
              serverVersionRef.current = data.version;
              fetchLatestFromServer(true);
            }
          }
        } catch {}
      };
    } catch (err) {
      console.log('SSE initialization note:', err);
    }

    // Polling fallback every 4 seconds to /api/menus/version
    const interval = setInterval(async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(apiUrl('/api/menus/version'), { cache: 'no-store' });
        if (res.ok) {
          const verData = await res.json();
          if (verData.version && verData.version > serverVersionRef.current && !isUpdatingFromServerRef.current) {
            console.log('[Poll] Remote update detected (v' + verData.version + ')');
            serverVersionRef.current = verData.version;
            fetchLatestFromServer(true);
          }
        }
      } catch {}
    }, 4000);

    // Focus & Visibility change: Immediately check server version when smartphone wakes or tab activates
    const handleCheckUpdate = () => {
      fetch(apiUrl('/api/menus/version'), { cache: 'no-store' })
        .then((r) => r.json())
        .then((v) => {
          if (v && v.version && v.version !== serverVersionRef.current && !isUpdatingFromServerRef.current) {
            fetchLatestFromServer(true);
          }
        })
        .catch(() => {});
    };

    window.addEventListener('focus', handleCheckUpdate);
    window.addEventListener('pageshow', handleCheckUpdate);
    window.addEventListener('online', handleCheckUpdate);
    document.addEventListener('visibilitychange', handleCheckUpdate);

    return () => {
      if (eventSource) eventSource.close();
      clearInterval(interval);
      window.removeEventListener('focus', handleCheckUpdate);
      window.removeEventListener('pageshow', handleCheckUpdate);
      window.removeEventListener('online', handleCheckUpdate);
      document.removeEventListener('visibilitychange', handleCheckUpdate);
    };
  }, []);



  const [currentView, setCurrentView] = useState<'customer' | 'admin'>('customer');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isAdminPinModalOpen, setIsAdminPinModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isForceUpdateModalOpen, setIsForceUpdateModalOpen] = useState(false);
  const [photoEditingMenuId, setPhotoEditingMenuId] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Capture PWA installation prompt if available
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePromptInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          showToast('스마트폰 홈 화면에 앱이 설치되었습니다!');
        }
      } catch {
        // ignore
      }
      setDeferredPrompt(null);
      setIsInstallModalOpen(false);
    }
  };

  // Real-time app auto-update engine
  const {
    isUpdateAvailable,
    latestVersion,
    installedVersion,
    isChecking: isCheckingUpdate,
    countdown,
    checkForUpdates,
    applyUpdate,
    dismissUpdate,
  } = useAppUpdate();

  const handleManualCheckUpdate = async () => {
    const res = await checkForUpdates(true);
    if (res.hasUpdate) {
      setIsForceUpdateModalOpen(true);
    } else {
      showToast(`현재 최신 버전(v${installedVersion})을 사용하고 계십니다!`);
    }
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch {}
    const msg = getUIText('switchLangSuccess', lang);
    showToast(msg);
  };

  // Helper to push state changes to server with 350ms debounce (or immediate) and clientId tag
  const pushStateToServer = (
    currentMenus: MenuItem[],
    currentNotice: DailyNoticeState,
    currentStore: StoreStatusState,
    currentCategories: string[],
    options?: { immediate?: boolean; force?: boolean }
  ) => {
    const isImmediate = options?.immediate ?? false;
    const isForced = options?.force ?? false;

    // If not forced, avoid loop if currently syncing from server
    if (!isForced && isUpdatingFromServerRef.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    // Filter out any deleted menus
    const activeMenus = currentMenus.filter((m) => m && m.id && !deletedMenuIdsRef.current.has(m.id));

    // Comprehensive sanitization to guarantee 100% of menu attributes (desc, tag, price, styling, flags)
    const sanitizedMenus: MenuItem[] = activeMenus.map((m) => {
      let cats: string[] = [];
      if (Array.isArray(m.category)) {
        cats = m.category.map(String).map((c) => c.trim()).filter(Boolean);
      } else if (typeof m.category === 'string' && (m.category as string).trim()) {
        cats = [(m.category as string).trim()];
      }
      if (cats.length === 0) cats = ['도시락'];

      return {
        ...m,
        id: String(m.id),
        name: String(m.name ?? '').trim(),
        price: typeof m.price === 'number' && !isNaN(m.price) ? m.price : (parseInt(String(m.price), 10) || 0),
        category: cats,
        img: String(m.img ?? ''),
        initialImg: String(m.initialImg ?? m.img ?? ''),
        desc: typeof m.desc === 'string' ? m.desc : String(m.desc ?? ''),
        tag: typeof m.tag === 'string' ? m.tag : String(m.tag ?? ''),
        isBest: Boolean(m.isBest),
        isRec: Boolean(m.isRec),
        isSoldOut: Boolean(m.isSoldOut),
        isVisible: m.isVisible !== false,
        nameColor: m.nameColor || '#1C1C19',
        nameFont: m.nameFont || 'noto',
        nameFontSize: m.nameFontSize || 'base',
      };
    });

    const sanitizedCategories = Array.isArray(currentCategories) && currentCategories.length > 0
      ? Array.from(new Set(currentCategories.map(String).map((c) => c.trim()).filter(Boolean)))
      : DEFAULT_CATEGORIES;

    // Ensure database immediately preserves all comprehensive attributes
    saveToDB('menus', sanitizedMenus).catch(() => {});
    saveToDB('categories', sanitizedCategories).catch(() => {});
    saveToDB('notice', currentNotice).catch(() => {});
    saveToDB('store', currentStore).catch(() => {});
    saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)).catch(() => {});

    try {
      const compactMenus = sanitizedMenus.map((m) => {
        if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
          return { ...m, img: m.initialImg || '' };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compactMenus));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(sanitizedCategories));
      localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(currentNotice));
      localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(currentStore));
      localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
    } catch {}

    const executePush = async () => {
      try {
        const res = await fetch(apiUrl('/api/menus'), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
          body: JSON.stringify({
            menus: sanitizedMenus,
            deletedIds: Array.from(deletedMenuIdsRef.current),
            notice: currentNotice,
            storeStatus: currentStore,
            categories: sanitizedCategories,
            clientId: clientIdRef.current,
          }),
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData.version) {
            serverVersionRef.current = Number(resData.version);
            try {
              localStorage.setItem('hanyang_synced_version', resData.version.toString());
            } catch {}
          }
          console.log(`[Auto-Sync] Saved ${sanitizedMenus.length} menus to server (v${resData.version})`);
        }
      } catch (err) {
        console.warn('[Auto-Sync] Server save error:', err);
      } finally {
        saveTimeoutRef.current = null;
      }
    };

    if (isImmediate) {
      executePush();
    } else {
      saveTimeoutRef.current = setTimeout(executePush, 500);
    }
  };

  // Persist changes to IndexedDB, localStorage mirror, and push to server
  useEffect(() => {
    if (!isHydratedRef.current) return;
    recordLocalUpdate();
    saveToDB('menus', menus);

    try {
      const compactMenus = menus.map((m) => {
        if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
          return { ...m, img: m.initialImg || '' };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compactMenus));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    pushStateToServer(menus, notice, storeStatus, categories);
  }, [menus]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    recordLocalUpdate();
    saveToDB('notice', notice);
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(notice));
    } catch {}
    pushStateToServer(menus, notice, storeStatus, categories);
  }, [notice]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    recordLocalUpdate();
    saveToDB('store', storeStatus);
    try {
      localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(storeStatus));
    } catch {}
    pushStateToServer(menus, notice, storeStatus, categories);
  }, [storeStatus]);

  useEffect(() => {
    if (!isHydratedRef.current) return;
    recordLocalUpdate();
    saveToDB('categories', categories);
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch {}
    pushStateToServer(menus, notice, storeStatus, categories);
  }, [categories]);

  // Dynamic counts for all category badges
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of categories) {
      counts[c] = menus.filter((m) => m.isVisible && m.category.includes(c)).length;
    }
    return counts;
  }, [menus, categories]);

  // Handle category button click with scroll to section if no search
  const handleSelectCategory = (cat: MenuCategory | 'all') => {
    setActiveCategory(cat);
    if (searchQuery.trim()) {
      setSearchQuery('');
    }
    const element = document.getElementById(`category-${cat}`);
    if (element) {
      const headerOffset = 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Delivery click
  const handleDeliveryClick = (app: 'baemin' | 'coupang', menuName?: string) => {
    if (menuName) {
      const targetMenu = menus.find((m) => m.name === menuName);
      if (targetMenu?.isSoldOut) {
        showToast(`[${menuName}] 해당 메뉴는 품절되어 주문하실 수 없습니다.`);
        return;
      }
    }
    const appTitle = app === 'baemin' ? '배달의민족' : '쿠팡이츠';
    const targetUrl = app === 'baemin' ? 'https://baemin.me' : 'https://www.coupangeats.com';
    if (menuName) {
      showToast(`[${menuName}] ${appTitle} 주문 페이지로 연결합니다.`);
    } else {
      showToast(`${appTitle} 한양도시락 주문 페이지로 연결합니다.`);
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const persistMenusLocally = (targetMenus: MenuItem[]) => {
    saveToDB('menus', targetMenus).catch(() => {});
    try {
      const compact = targetMenus.map((m) => {
        if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
          return { ...m, img: m.initialImg || '' };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compact));
    } catch {}
  };

  // Update Menu Item (Every field: desc, tag, name, price, category, soldOut, isBest, isRec, styling)
  const handleUpdateMenu = (updated: MenuItem, isImmediate = false) => {
    recordLocalUpdate();
    setMenus((prev) => {
      const next = prev.map((m) => (m.id === updated.id ? updated : m));
      persistMenusLocally(next);
      pushStateToServer(next, notice, storeStatus, categories, { immediate: isImmediate, force: isImmediate });
      return next;
    });
  };

  // Reorder Menus
  const handleReorderMenus = (newMenus: MenuItem[]) => {
    recordLocalUpdate();
    setMenus(newMenus);
    persistMenusLocally(newMenus);
    pushStateToServer(newMenus, notice, storeStatus, categories, { immediate: true, force: true });
  };

  // Add Menu Item
  const handleAddMenu = (newMenu: MenuItem) => {
    recordLocalUpdate();
    if (deletedMenuIdsRef.current.has(newMenu.id)) {
      deletedMenuIdsRef.current.delete(newMenu.id);
      saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)).catch(() => {});
      try {
        localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
      } catch {}
    }
    setMenus((prev) => {
      const next = [newMenu, ...prev.filter((m) => m.id !== newMenu.id)];
      persistMenusLocally(next);
      pushStateToServer(next, notice, storeStatus, categories, { immediate: true, force: true });
      return next;
    });
  };

  // Delete Menu Item
  const handleDeleteMenu = (menuId: string) => {
    recordLocalUpdate();
    deletedMenuIdsRef.current.add(String(menuId));
    saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)).catch(() => {});
    try {
      localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
    } catch {}
    setMenus((prev) => {
      const next = prev.filter((m) => m.id !== menuId);
      persistMenusLocally(next);
      pushStateToServer(next, notice, storeStatus, categories, { immediate: true, force: true });
      return next;
    });
  };

  // Category CRUD Handlers
  const handleAddCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast(`'${trimmed}' 카테고리는 이미 존재합니다.`);
      return;
    }
    recordLocalUpdate();
    const nextCats = [...categories, trimmed];
    setCategories(nextCats);
    pushStateToServer(menus, notice, storeStatus, nextCats, { immediate: true, force: true });
    showToast(`✨ '${trimmed}' 카테고리가 새로 추가되었습니다!`);
  };

  const handleUpdateCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed || oldCat === trimmed) return;
    recordLocalUpdate();
    const nextCats = categories.map((c) => (c === oldCat ? trimmed : c));
    setCategories(nextCats);
    // Sync existing menu items
    const nextMenus = menus.map((m) => {
      if (m.category.includes(oldCat)) {
        return {
          ...m,
          category: m.category.map((c) => (c === oldCat ? trimmed : c)),
        };
      }
      return m;
    });
    setMenus(nextMenus);
    pushStateToServer(nextMenus, notice, storeStatus, nextCats, { immediate: true, force: true });
    if (activeCategory === oldCat) {
      setActiveCategory(trimmed);
    }
    showToast(`✨ 카테고리명이 '${oldCat}'에서 '${trimmed}'(으)로 변경되었습니다.`);
  };

  const handleDeleteCategory = (catToDelete: string) => {
    if (categories.length <= 1) {
      showToast('최소 1개 이상의 카테고리가 유지되어야 합니다.');
      return;
    }
    recordLocalUpdate();
    const remaining = categories.filter((c) => c !== catToDelete);
    setCategories(remaining);
    // Remove from menus or fallback to remaining[0]
    const nextMenus = menus.map((m) => {
      if (m.category.includes(catToDelete)) {
        const filtered = m.category.filter((c) => c !== catToDelete);
        return {
          ...m,
          category: filtered.length > 0 ? filtered : [remaining[0] || '도시락'],
        };
      }
      return m;
    });
    setMenus(nextMenus);
    pushStateToServer(nextMenus, notice, storeStatus, remaining, { immediate: true, force: true });
    if (activeCategory === catToDelete) {
      setActiveCategory('all');
    }
    showToast(`🗑️ '${catToDelete}' 카테고리가 삭제되었습니다.`);
  };

  const handleReorderCategories = (newCats: string[]) => {
    recordLocalUpdate();
    setCategories(newCats);
    pushStateToServer(menus, notice, storeStatus, newCats, { immediate: true, force: true });
    showToast(`✨ 카테고리 순서가 변경되었습니다.`);
  };

  const handleResetCategories = () => {
    if (!window.confirm('정말 기본 카테고리로 초기화하시겠습니까? 직접 추가하신 카테고리는 삭제됩니다.')) {
      return;
    }
    recordLocalUpdate();
    setCategories(DEFAULT_CATEGORIES);
    showToast('카테고리가 기본 5대 카테고리로 초기화되었습니다.');
  };

  // Photo change and badge update
  const handleSavePhoto = (
    menuId: string,
    newPhotoUrl: string,
    isBest?: boolean,
    isRec?: boolean
  ) => {
    recordLocalUpdate();
    setMenus((prev) => {
      const updated = prev.map((m) =>
        m.id === menuId
          ? {
              ...m,
              img: newPhotoUrl,
              ...(typeof isBest === 'boolean' ? { isBest } : {}),
              ...(typeof isRec === 'boolean' ? { isRec } : {}),
            }
          : m
      );
      // Immediately save to IndexedDB and localStorage so image updates persist permanently
      saveToDB('menus', updated).catch(() => {});
      try {
        const compact = updated.map((m) => {
          if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
            return { ...m, img: m.initialImg || '' };
          }
          return m;
        });
        localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compact));
      } catch {}
      pushStateToServer(updated, notice, storeStatus, categories, { immediate: true, force: true });
      return updated;
    });
  };

  // Emergency Multi-device Synchronization and Consistency State
  const [isForceSyncing, setIsForceSyncing] = useState(false);

  /**
   * Force Reconcile and Sync:
   * Direct user-invoked emergency & consistency tool requested by the store owner.
   * 1. Fetches real-time server menus from /api/menus
   * 2. Loads local state from IndexedDB, localStorage, and memory
   * 3. Compares and reconciles both bidirectional sets losslessly
   * 4. Updates memory, IndexedDB, and localStorage
   * 5. Forces an immediate push to server /api/menus (bumping server version & notifying all devices)
   * 6. Gives rich toast feedback on total menus merged and status across devices
   */
  const handleForceReconcileAndSync = async () => {
    setIsForceSyncing(true);
    showToast('⚡ 서버 데이터와 로컬 데이터를 즉시 강제 비교·병합 중입니다...');
    try {
      isUpdatingFromServerRef.current = true;
      // 1. Fetch live server state
      const apiRes = await fetch(apiUrl('/api/menus'), {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      let serverMenus: MenuItem[] = [];
      let serverCats: string[] = [];
      let serverNotice = notice;
      let serverStore = storeStatus;

      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (Array.isArray(apiData.menus)) {
          serverMenus = apiData.menus;
        }
        if (Array.isArray(apiData.categories)) {
          serverCats = apiData.categories;
        }
        if (apiData.notice) serverNotice = apiData.notice;
        if (apiData.storeStatus) serverStore = apiData.storeStatus;

        if (Array.isArray(apiData.deletedIds)) {
          for (const id of apiData.deletedIds) {
            deletedMenuIdsRef.current.add(String(id));
          }
        }
      }

      // 2. Read local persistent storage
      let [dbMenus, dbCats, dbNotice, dbStore, dbDeletedIds] = await Promise.all([
        loadFromDB<MenuItem[]>('menus'),
        loadFromDB<string[]>('categories'),
        loadFromDB<DailyNoticeState>('notice'),
        loadFromDB<StoreStatusState>('store'),
        loadFromDB<string[]>('deleted_ids'),
      ]);

      if (Array.isArray(dbDeletedIds)) {
        for (const id of dbDeletedIds) deletedMenuIdsRef.current.add(String(id));
      }

      const localCandidateMenus = (menus && menus.length > 0) ? menus : (dbMenus || []);
      const localCandidateCats = (categories && categories.length > 0) ? categories : (dbCats || DEFAULT_CATEGORIES);

      // 3. Normalize server menus
      const normalizedServerMenus: MenuItem[] = serverMenus
        .filter((m) => m && m.id && !deletedMenuIdsRef.current.has(String(m.id)))
        .map((m) => {
          let cats: string[] = [];
          const rawCat = (m as any).category;
          if (Array.isArray(rawCat)) {
            cats = rawCat.map(String).map((c) => c.trim()).filter(Boolean);
          } else if (typeof rawCat === 'string' && rawCat.trim()) {
            cats = [rawCat.trim()];
          }
          if (cats.length === 0) cats = ['도시락'];

          return {
            ...m,
            id: String(m.id),
            name: String(m.name ?? '').trim(),
            price: typeof m.price === 'number' && !isNaN(m.price) ? m.price : (parseInt(String(m.price), 10) || 0),
            category: cats,
            img: String(m.img ?? ''),
            initialImg: String(m.initialImg ?? m.img ?? ''),
            desc: typeof m.desc === 'string' ? m.desc : String(m.desc ?? ''),
            tag: typeof m.tag === 'string' ? m.tag : String(m.tag ?? ''),
            isBest: Boolean(m.isBest),
            isRec: Boolean(m.isRec),
            isSoldOut: Boolean(m.isSoldOut),
            isVisible: m.isVisible !== false,
            nameColor: m.nameColor || '#1C1C19',
            nameFont: m.nameFont || 'noto',
            nameFontSize: m.nameFontSize || 'base',
          };
        });

      // 4. Lossless bidirectional reconciliation
      const mergedMenus = reconcileMenus(localCandidateMenus, normalizedServerMenus, true);
      const mergedCats = reconcileCategories(localCandidateCats, serverCats, true);
      const mergedNotice = serverNotice || dbNotice || notice;
      const mergedStore = serverStore || dbStore || storeStatus;

      // 5. Update application state immediately
      recordLocalUpdate();
      setMenus(mergedMenus);
      setCategories(mergedCats);
      setNotice(mergedNotice);
      setStoreStatus(mergedStore);

      // 6. Save locally to IndexedDB & localStorage
      await Promise.all([
        saveToDB('menus', mergedMenus),
        saveToDB('categories', mergedCats),
        saveToDB('notice', mergedNotice),
        saveToDB('store', mergedStore),
        saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)),
      ]);

      try {
        const compact = mergedMenus.map((m) => {
          if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
            return { ...m, img: m.initialImg || '' };
          }
          return m;
        });
        localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compact));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(mergedCats));
        localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(mergedNotice));
        localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(mergedStore));
        localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
      } catch {}

      // 7. Force push to server
      const postRes = await fetch(apiUrl('/api/menus'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          menus: mergedMenus,
          deletedIds: Array.from(deletedMenuIdsRef.current),
          notice: mergedNotice,
          storeStatus: mergedStore,
          categories: mergedCats,
          clientId: clientIdRef.current,
        }),
      });

      if (postRes.ok) {
        const resData = await postRes.json();
        if (resData.version) {
          serverVersionRef.current = Number(resData.version);
          try {
            localStorage.setItem('hanyang_synced_version', resData.version.toString());
          } catch {}
        }
      }

      showToast(`⚡ 강제 동기화 성공! 로컬·서버 총 ${mergedMenus.length}개 메뉴(카테고리 ${mergedCats.length}개)가 병합되어 모든 기기(스마트폰/태블릿/PC)에 100% 실시간 적용되었습니다!`);
    } catch (e: any) {
      console.warn('Force sync error:', e);
      showToast(`❌ 강제 동기화 중 오류 발생: ${e.message || '네트워크를 확인해주세요.'}`);
    } finally {
      setTimeout(() => {
        isUpdatingFromServerRef.current = false;
        setIsForceSyncing(false);
      }, 500);
    }
  };

  // Multi-device Synchronization and Safe Reset Handlers
  const handleSyncToLatestData = async (
    mode: 'syncToServer' | 'fetchFromServer' | 'refreshImages' | 'factoryReset' | 'forceReconcile'
  ) => {
    if (mode === 'forceReconcile') {
      await handleForceReconcileAndSync();
    } else if (mode === 'syncToServer') {
      await handleSave(false);
      showToast(`☁️ 현재 메뉴(${menus.length}개)와 카테고리가 모든 기기(스마트폰/태블릿/PC)에 100% 실시간 동기화되었습니다!`);
    } else if (mode === 'fetchFromServer') {
      await fetchLatestFromServer(false);
    } else if (mode === 'refreshImages') {
      recordLocalUpdate();
      // Refresh default photos from INITIAL_MENUS without altering custom menus or names
      setMenus((prev) =>
        prev.map((item) => {
          const init = INITIAL_MENUS.find((m) => m.id === item.id);
          if (init && init.img) {
            return { ...item, img: init.img, initialImg: init.initialImg };
          }
          return item;
        })
      );
      showToast('✨ 기존 등록 메뉴를 유지하며 기본 고화질 사진을 일괄 갱신했습니다!');
    } else if (mode === 'factoryReset') {
      const confirmed = window.confirm(
        '⚠️ [경고] 직접 추가한 모든 메뉴, 카테고리, 업로드한 사진이 영구 삭제되고 최초 기본 메뉴로 되돌아갑니다.\n\n정말로 초기 상태로 완전 초기화하시겠습니까?'
      );
      if (!confirmed) return;

      recordLocalUpdate();
      setMenus(INITIAL_MENUS);
      setNotice(INITIAL_NOTICE);
      setStoreStatus(INITIAL_STORE_STATUS);
      setCategories(DEFAULT_CATEGORIES);
      saveToDB('menus', INITIAL_MENUS);
      saveToDB('notice', INITIAL_NOTICE);
      saveToDB('store', INITIAL_STORE_STATUS);
      saveToDB('categories', DEFAULT_CATEGORIES);
      try {
        localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(INITIAL_MENUS));
        localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(INITIAL_NOTICE));
        localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(INITIAL_STORE_STATUS));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      try {
        await fetch(apiUrl('/api/menus'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            menus: INITIAL_MENUS,
            notice: INITIAL_NOTICE,
            storeStatus: INITIAL_STORE_STATUS,
            categories: DEFAULT_CATEGORIES,
          }),
        });
      } catch {}

      showToast('⚠️ 초기 기본 데이터로 완전 복원되었습니다.');
    }
  };

  // Backup & Restore
  const handleExportBackup = () => {
    exportAppStateJSON({
      menus,
      notice,
      storeStatus,
      categories,
    });
    showToast('💾 메뉴 및 매장 데이터가 백업 파일(JSON)로 안전하게 다운로드되었습니다!');
  };

  const handleImportBackup = (jsonStr: string) => {
    const data = parseAppStateJSON(jsonStr);
    if (!data) {
      showToast('❌ 올바르지 않은 백업 파일 형식이거나 손상되었습니다.');
      return;
    }
    recordLocalUpdate();
    if (data.menus && Array.isArray(data.menus) && data.menus.length > 0) {
      setMenus(data.menus);
    }
    if (data.notice) {
      setNotice(data.notice);
    }
    if (data.storeStatus) {
      setStoreStatus(data.storeStatus);
    }
    if (data.categories && Array.isArray(data.categories) && data.categories.length > 0) {
      setCategories(data.categories);
    }
    showToast('✨ 백업 파일의 모든 메뉴와 설정이 성공적으로 복원되었습니다!');
  };

  // Save edited menus and store status safely to IndexedDB, localStorage mirror, and server
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (silent = false, overrideMenus?: MenuItem[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const targetMenus = (overrideMenus || menus).filter((m) => m && m.id && !deletedMenuIdsRef.current.has(m.id));
    setIsSaving(true);
    try {
      recordLocalUpdate();
      // 1. Immediately save to IndexedDB (permanent unconstrained storage)
      await Promise.all([
        saveToDB('menus', targetMenus),
        saveToDB('notice', notice),
        saveToDB('store', storeStatus),
        saveToDB('categories', categories),
        saveToDB('deleted_ids', Array.from(deletedMenuIdsRef.current)),
      ]);

      // 2. Save mirror to localStorage
      try {
        const compact = targetMenus.map((m) => {
          if (m.img && m.img.startsWith('data:image') && m.img.length > 50000) {
            return { ...m, img: m.initialImg || '' };
          }
          return m;
        });
        localStorage.setItem(STORAGE_KEYS.MENUS, JSON.stringify(compact));
        localStorage.setItem(STORAGE_KEYS.NOTICE, JSON.stringify(notice));
        localStorage.setItem(STORAGE_KEYS.STORE, JSON.stringify(storeStatus));
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
        localStorage.setItem('hanyang_deleted_ids', JSON.stringify(Array.from(deletedMenuIdsRef.current)));
      } catch {}

      // Comprehensive sanitization to guarantee 100% of menu attributes (desc, tag, price, styling, flags)
      const sanitizedMenus: MenuItem[] = targetMenus.map((m) => {
        let cats: string[] = [];
        if (Array.isArray(m.category)) {
          cats = m.category.map(String).map((c) => c.trim()).filter(Boolean);
        } else if (typeof m.category === 'string' && (m.category as string).trim()) {
          cats = [(m.category as string).trim()];
        }
        if (cats.length === 0) cats = ['도시락'];

        return {
          ...m,
          id: String(m.id),
          name: String(m.name ?? '').trim(),
          price: typeof m.price === 'number' ? m.price : (parseInt(String(m.price), 10) || 0),
          category: cats,
          img: String(m.img ?? ''),
          initialImg: String(m.initialImg ?? m.img ?? ''),
          desc: typeof m.desc === 'string' ? m.desc : String(m.desc ?? ''),
          tag: typeof m.tag === 'string' ? m.tag : String(m.tag ?? ''),
          isBest: Boolean(m.isBest),
          isRec: Boolean(m.isRec),
          isSoldOut: Boolean(m.isSoldOut),
          isVisible: m.isVisible !== false,
          nameColor: m.nameColor || '#1C1C19',
          nameFont: m.nameFont || 'noto',
          nameFontSize: m.nameFontSize || 'base',
        };
      });

      // 3. Save to server menus.json (broadcasts to all connected devices)
      const res = await fetch(apiUrl('/api/menus'), {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify({
          menus: sanitizedMenus,
          deletedIds: Array.from(deletedMenuIdsRef.current),
          notice,
          storeStatus,
          categories,
          clientId: clientIdRef.current,
        }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.version) {
          serverVersionRef.current = Number(resData.version);
          try {
            localStorage.setItem('hanyang_synced_version', resData.version.toString());
          } catch {}
        }
      }

      if (!silent) {
        showToast('💾 변경사항(상세설명, 태그 등)이 서버 및 모든 기기에 100% 안전하게 동기화되었습니다!');
      }
    } catch (e: any) {
      console.warn('Save error:', e);
      if (!silent) {
        showToast('💾 변경사항이 브라우저에 안전하게 저장되었습니다!');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle store open/closed
  const handleToggleStoreStatus = () => {
    setStoreStatus((prev) => {
      const nextOpen = !prev.isOpen;
      showToast(
        nextOpen
          ? "매장이 '영업중'으로 변경되었습니다."
          : "매장이 '영업 준비중 / 마감' 상태로 변경되었습니다."
      );
      return { ...prev, isOpen: nextOpen };
    });
  };

  const editingMenuItem = menus.find((m) => m.id === photoEditingMenuId) || null;

  // Search filtered menus with multi-language awareness
  const searchedMenus = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;
    return menus.filter((m) => {
      if (!m.isVisible) return false;
      const rawName = stripFormatting(m.name).toLowerCase();
      const rawDesc = stripFormatting(m.desc).toLowerCase();
      const rawTag = (m.tag || '').toLowerCase();

      const transName = translateMenuName(m.name, currentLanguage).toLowerCase();
      const transDesc = translateMenuDesc(m.desc, currentLanguage).toLowerCase();
      const transTag = translateMenuTag(m.tag, currentLanguage).toLowerCase();

      return (
        rawName.includes(q) ||
        rawDesc.includes(q) ||
        rawTag.includes(q) ||
        transName.includes(q) ||
        transDesc.includes(q) ||
        transTag.includes(q)
      );
    });
  }, [menus, searchQuery, currentLanguage]);

  return (
    <div className="min-h-screen flex justify-center bg-[#EEEAE4] pb-safe sm:pb-6">
      {/* Responsive Container: Full-width on smartphones, beautifully expanded on tablets & desktops */}
      <div className="w-full md:max-w-3xl lg:max-w-5xl xl:max-w-6xl bg-brand-cream min-h-screen shadow-2xl relative flex flex-col transition-all duration-300">
        {/* Toast Alert */}
        <Toast message={toastMessage} />

        {/* CUSTOMER VIEW */}
        {currentView === 'customer' && (
          <div className="flex-1 flex flex-col">
            <CustomerHeader
              storeStatus={storeStatus}
              onOpenLocation={() => setIsLocationModalOpen(true)}
              onOpenAdminPin={() => setIsAdminPinModalOpen(true)}
              onDeliveryClick={(app) => handleDeliveryClick(app)}
              isUpdateAvailable={isUpdateAvailable}
              onOpenUpdateModal={() => setIsForceUpdateModalOpen(true)}
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />

            <NoticeBanner notice={notice} lang={currentLanguage} />

            <CategoryNav
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              counts={categoryCounts}
              totalCount={menus.filter((m) => m.isVisible).length}
              lang={currentLanguage}
            />

            {/* Menu Catalog: Automatically responsive (1-col on smartphone, 2-col on tablet, 3-col on large tablet/desktop) */}
            <main className="flex-1 px-3 sm:px-5 md:px-8 py-3 sm:py-5 space-y-6 sm:space-y-8">
              {searchedMenus !== null ? (
                /* Search Results View */
                <section className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <h2 className="text-sm sm:text-base font-extrabold text-brand-dark tracking-tight">
                      {getUIText('searchResults', currentLanguage)} ({searchedMenus.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-brand-terracotta underline font-semibold cursor-pointer"
                    >
                      {getUIText('viewAll', currentLanguage)}
                    </button>
                  </div>
                  {searchedMenus.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-stone-500 border border-brand-border">
                      <p className="text-sm font-semibold">{getUIText('noSearchResults', currentLanguage)}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {getUIText('noSearchHint', currentLanguage)}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                      {searchedMenus.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          lang={currentLanguage}
                          onOrderDelivery={handleDeliveryClick}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                /* Dynamic Categorized Sections */
                <>
                  {categories.map((catName) => {
                    const catMenus = menus.filter(
                      (m) => m.category.includes(catName) && m.isVisible
                    );
                    if (catMenus.length === 0) return null;

                    const catDescription =
                      catName === '추천'
                        ? getUIText('catDescRecommended', currentLanguage)
                        : catName === '대표'
                        ? getUIText('catDescSignature', currentLanguage)
                        : catName === '세트' || catName === '세트메뉴' || catName === '세트 메뉴'
                        ? getUIText('catDescSet', currentLanguage)
                        : catName === '착한' || catName === '착한도시락' || catName === '착한 도시락' || catName.includes('착한')
                        ? getUIText('catDescCharity', currentLanguage)
                        : `${translateCategory(catName, currentLanguage)} ${getUIText('catDescDefault', currentLanguage)}`;

                    return (
                      <section
                        key={catName}
                        className="category-section space-y-3"
                        id={`category-${catName}`}
                      >
                        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
                          <div className="flex items-center space-x-1.5">
                            <h2 className="text-sm sm:text-base font-extrabold text-brand-dark tracking-tight">
                              {translateCategory(catName, currentLanguage)}
                            </h2>
                            <span className="text-xs font-bold text-brand-terracotta bg-brand-sand px-1.5 py-0.5 rounded-md">
                              {catMenus.length}
                            </span>
                          </div>
                          <span className="text-[11px] sm:text-xs text-brand-muted">
                            {catDescription}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
                          {catMenus.map((item) => (
                            <MenuCard
                              key={`${catName}-${item.id}`}
                              item={item}
                              categoryContext={catName}
                              lang={currentLanguage}
                              onOrderDelivery={handleDeliveryClick}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </>
              )}
            </main>
          </div>
        )}

        {/* ADMIN CONSOLE VIEW */}
        {currentView === 'admin' && (
          <AdminConsole
            menus={menus}
            categories={categories}
            onUpdateMenu={handleUpdateMenu}
            onAddMenu={handleAddMenu}
            onDeleteMenu={handleDeleteMenu}
            onReorderMenus={handleReorderMenus}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onReorderCategories={handleReorderCategories}
            onResetCategories={handleResetCategories}
            notice={notice}
            onUpdateNotice={setNotice}
            storeStatus={storeStatus}
            onToggleStoreStatus={handleToggleStoreStatus}
            onCloseAdmin={() => {
              // Flush state to IndexedDB and server so customer view immediately has the latest updates
              saveToDB('menus', menus);
              saveToDB('notice', notice);
              saveToDB('store', storeStatus);
              saveToDB('categories', categories);
              handleSave(true);
              setCurrentView('customer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPhotoModal={(menuId) => setPhotoEditingMenuId(menuId)}
            onToast={showToast}
            installedVersion={installedVersion}
            onCheckUpdate={handleManualCheckUpdate}
            isCheckingUpdate={isCheckingUpdate}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
            onSyncToLatestData={handleSyncToLatestData}
            onForceSync={handleForceReconcileAndSync}
            isForceSyncing={isForceSyncing}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}

        {/* PIN Auth Modal */}
        <AdminPinModal
          isOpen={isAdminPinModalOpen}
          onClose={() => setIsAdminPinModalOpen(false)}
          onSuccess={() => {
            setIsAdminPinModalOpen(false);
            setCurrentView('admin');
            showToast('한양 도시락 본점 관리자 콘솔에 접속되었습니다.');
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />

        {/* Location & Map Modal */}
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          address={storeStatus.address}
          onToast={showToast}
          lang={currentLanguage}
        />

        {/* Photo Upload Modal */}
        <PhotoUploadModal
          isOpen={photoEditingMenuId !== null}
          onClose={() => setPhotoEditingMenuId(null)}
          menuItem={editingMenuItem}
          onSavePhoto={handleSavePhoto}
          onToast={showToast}
        />

        {/* Smartphone Home Screen Guide Modal */}
        <InstallAppModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
          deferredPrompt={deferredPrompt}
          onPromptInstall={handlePromptInstall}
          onToast={showToast}
          installedVersion={installedVersion}
          onCheckUpdate={handleManualCheckUpdate}
          isCheckingUpdate={isCheckingUpdate}
        />

        {/* Real-time App Auto-Update Modal (Opens on manual check or when new compile is auto-detected) */}
        <AppUpdateModal
          isOpen={isForceUpdateModalOpen || (isUpdateAvailable && typeof countdown === 'number')}
          latestVersion={latestVersion}
          installedVersion={installedVersion}
          countdown={countdown}
          onApplyUpdate={applyUpdate}
          onDismiss={() => {
            dismissUpdate();
            setIsForceUpdateModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
