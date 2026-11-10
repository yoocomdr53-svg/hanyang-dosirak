import React, { useState } from 'react';
import { MenuItem, DailyNoticeState, StoreStatusState, MenuCategory } from '../types';
import {
  ChevronLeft,
  RotateCw,
  RotateCcw,
  Store,
  Check,
  Info,
  Camera,
  Sparkles,
  Smartphone,
  RefreshCw,
  Plus,
  PlusCircle,
  Trash2,
  Copy,
  AlertTriangle,
  UtensilsCrossed,
  Type,
  Palette,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  ArrowUpDown,
  GripVertical,
  Layers,
  Tag,
  Download,
  Upload,
  Save,
  Coins,
  Zap,
} from 'lucide-react';
import { AddMenuModal } from './AddMenuModal';
import { CategoryManageModal } from './CategoryManageModal';
import { BatchPriceEditor } from './BatchPriceEditor';
import { PartialTextStyler } from './PartialTextStyler';
import { FormattedText, stripFormatting, syncPlainTextWithStyles } from '../utils/textFormatter';
import {
  FONT_OPTIONS,
  COLOR_PRESETS,
  getFontClass,
  FONT_SIZE_OPTIONS,
  getFontSizeClass,
  getFontSizePx,
} from '../data/fontOptions';
import { INITIAL_MENUS } from '../data/initialMenus';

interface AdminConsoleProps {
  menus: MenuItem[];
  categories: string[];
  onUpdateMenu: (updated: MenuItem) => void;
  onAddMenu: (newMenu: MenuItem) => void;
  onDeleteMenu: (menuId: string) => void;
  onReorderMenus?: (newMenus: MenuItem[]) => void;
  onAddCategory: (newCategory: string) => void;
  onUpdateCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
  onReorderCategories: (newCategories: string[]) => void;
  onResetCategories: () => void;
  notice: DailyNoticeState;
  onUpdateNotice: (newNotice: DailyNoticeState) => void;
  storeStatus: StoreStatusState;
  onToggleStoreStatus: () => void;
  onCloseAdmin: () => void;
  onOpenPhotoModal: (menuId: string) => void;
  onToast: (msg: string) => void;
  installedVersion?: string;
  onCheckUpdate?: () => void;
  isCheckingUpdate?: boolean;
  onOpenInstallModal?: () => void;
  onSyncToLatestData?: (mode: 'syncToServer' | 'fetchFromServer' | 'refreshImages' | 'factoryReset' | 'forceReconcile') => void;
  onForceSync?: () => Promise<void>;
  isForceSyncing?: boolean;
  onExportBackup?: () => void;
  onImportBackup?: (jsonStr: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

interface AdminMenuThumbProps {
  item: MenuItem;
  onOpenPhotoModal: (id: string) => void;
}

const AdminMenuThumb: React.FC<AdminMenuThumbProps> = ({ item, onOpenPhotoModal }) => {
  const [hasError, setHasError] = useState(false);

  // Automatically reset error when image url changes
  React.useEffect(() => {
    setHasError(false);
  }, [item.img]);

  const showImg = Boolean(item.img && item.img.trim() !== '' && !hasError);

  return (
    <div
      onClick={() => onOpenPhotoModal(item.id)}
      title="클릭하여 사진 변경 / 업로드"
      className={`relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border cursor-pointer group transition select-none ${
        item.isSoldOut
          ? 'border-red-300 bg-stone-100'
          : 'border-brand-border bg-stone-100 hover:border-brand-terracotta'
      }`}
    >
      {showImg ? (
        <img
          key={item.img}
          src={item.img}
          alt={item.name}
          onError={() => setHasError(true)}
          className={`admin-card-img w-full h-full object-cover transition-transform group-hover:scale-105 duration-200 ${
            item.isSoldOut ? 'grayscale contrast-90' : ''
          }`}
        />
      ) : (
        <div className="admin-img-fallback absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#EFEAE4]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ECE5DD] via-[#F5EFE9] to-[#E2D8CC] filter blur-xs scale-110" />
          <div className="absolute -top-3 -left-3 w-16 h-16 bg-[#E8BA9B]/40 rounded-full filter blur-md" />
          <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-[#D48B68]/25 rounded-full filter blur-md" />
          <div className="relative z-10 flex flex-col items-center justify-center px-1 text-center">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta mb-0.5 animate-pulse" />
            <span className="text-[9px] font-extrabold text-stone-700 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded shadow-xs border border-white/80 whitespace-nowrap">
              이미지 생성중
            </span>
            <span className="text-[8px] text-brand-terracotta font-semibold mt-0.5">
              터치하여 등록
            </span>
          </div>
        </div>
      )}

      {/* Badges on Photo */}
      <div className="absolute top-1 left-1 flex flex-col items-start gap-1 z-10 pointer-events-none">
        {item.isSoldOut ? (
          <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center space-x-0.5 border border-red-400">
            <AlertTriangle className="w-2.5 h-2.5 inline" />
            <span>품절</span>
          </span>
        ) : (
          <>
            {item.isBest && (
              <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs tracking-tight">
                BEST
              </span>
            )}
            {item.isRec && (
              <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs flex items-center space-x-0.5">
                <span>★ 추천</span>
              </span>
            )}
            {item.tag && (
              <span className="bg-brand-terracotta text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs tracking-tight truncate max-w-[85px]">
                #{item.tag}
              </span>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenPhotoModal(item.id);
        }}
        className="absolute bottom-1 inset-x-1 bg-black/75 hover:bg-black text-white text-[9px] py-1 rounded flex items-center justify-center space-x-0.5 active:scale-95 transition backdrop-blur-xs cursor-pointer z-10"
      >
        <Camera className="w-3 h-3 mr-0.5" />
        <span>사진 변경</span>
      </button>
    </div>
  );
};

const QUICK_TAG_PRESETS = [
  '신메뉴',
  '인기 메뉴',
  '당일 한정',
  '국산 100%',
  '직화 불향',
  '특제 소스',
  '가성비 최고',
  '반찬 4종 포함',
];

interface CleanFormattedInputProps {
  value: string;
  isRawMode: boolean;
  onCommit: (newVal: string) => void;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  placeholder?: string;
}

/**
 * Robust input component with local typing state:
 * - Guarantees spacebar (' '), multiple spaces, and trailing spaces are 100% preserved.
 * - Protects Korean IME composition so typing syllables and spaces never gets dropped or cancelled.
 * - Automatically syncs styles with clean text when not in raw mode.
 */
const CleanFormattedInput: React.FC<CleanFormattedInputProps> = ({
  value,
  isRawMode,
  onCommit,
  className,
  style,
  title,
  placeholder,
}) => {
  const [localText, setLocalText] = useState(() => (isRawMode ? value : stripFormatting(value)));
  const isComposingRef = React.useRef(false);

  React.useEffect(() => {
    const expected = isRawMode ? value : stripFormatting(value);
    if (!isComposingRef.current && localText !== expected) {
      setLocalText(expected);
    }
  }, [value, isRawMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setLocalText(nextVal);

    if (isRawMode) {
      onCommit(nextVal);
    } else {
      onCommit(syncPlainTextWithStyles(value, nextVal));
    }
  };

  return (
    <input
      type="text"
      value={localText}
      onChange={handleChange}
      onBlur={() => {
        isComposingRef.current = false;
        if (isRawMode) {
          onCommit(localText);
        } else {
          onCommit(syncPlainTextWithStyles(value, localText));
        }
      }}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        const targetVal = (e.target as HTMLInputElement).value;
        setLocalText(targetVal);
        if (isRawMode) {
          onCommit(targetVal);
        } else {
          onCommit(syncPlainTextWithStyles(value, targetVal));
        }
      }}
      title={title}
      placeholder={placeholder}
      style={style}
      className={className}
    />
  );
};

const CleanFormattedTextarea: React.FC<{
  value: string;
  isRawMode: boolean;
  onCommit: (newVal: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  title?: string;
}> = ({ value, isRawMode, onCommit, className, placeholder, rows = 2, title }) => {
  const [localText, setLocalText] = useState(() => (isRawMode ? value : stripFormatting(value)));
  const isComposingRef = React.useRef(false);

  React.useEffect(() => {
    const expected = isRawMode ? value : stripFormatting(value);
    if (!isComposingRef.current && localText !== expected) {
      setLocalText(expected);
    }
  }, [value, isRawMode]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setLocalText(nextVal);

    if (isRawMode) {
      onCommit(nextVal);
    } else {
      onCommit(syncPlainTextWithStyles(value, nextVal));
    }
  };

  return (
    <textarea
      rows={rows}
      value={localText}
      onChange={handleChange}
      onBlur={() => {
        isComposingRef.current = false;
        if (isRawMode) {
          onCommit(localText);
        } else {
          onCommit(syncPlainTextWithStyles(value, localText));
        }
      }}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        const targetVal = (e.target as HTMLTextAreaElement).value;
        setLocalText(targetVal);
        if (isRawMode) {
          onCommit(targetVal);
        } else {
          onCommit(syncPlainTextWithStyles(value, targetVal));
        }
      }}
      placeholder={placeholder}
      title={title}
      className={className}
    />
  );
};

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  menus,
  categories,
  onUpdateMenu,
  onAddMenu,
  onDeleteMenu,
  onReorderMenus,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onResetCategories,
  notice,
  onUpdateNotice,
  storeStatus,
  onToggleStoreStatus,
  onCloseAdmin,
  onOpenPhotoModal,
  onToast,
  installedVersion = '1.0.3',
  onCheckUpdate,
  isCheckingUpdate = false,
  onOpenInstallModal,
  onSyncToLatestData,
  onForceSync,
  isForceSyncing = false,
  onExportBackup,
  onImportBackup,
  onSave,
  isSaving = false,
}) => {
  const [adminFilter, setAdminFilter] = useState<'all' | string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'soldOut'>('all');
  const [noticeDraft, setNoticeDraft] = useState(notice.content);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<MenuItem | null>(null);
  const [isPriceBatchMode, setIsPriceBatchMode] = useState(false);
  const backupInputRef = React.useRef<HTMLInputElement>(null);

  const handleBackupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content && onImportBackup) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
    if (backupInputRef.current) {
      backupInputRef.current.value = '';
    }
  };

  // Toggle category on a menu card directly
  const handleToggleMenuCategory = (menuId: string, catName: string) => {
    const item = menus.find((m) => m.id === menuId);
    if (!item) return;

    let updatedCats: string[];
    const isCurrentlyAssigned = item.category.includes(catName);

    if (isCurrentlyAssigned) {
      if (item.category.length <= 1) {
        onToast('메뉴는 최소 1개 이상의 카테고리가 지정되어야 합니다.');
        return;
      }
      updatedCats = item.category.filter((c) => c !== catName);
    } else {
      updatedCats = [...item.category, catName];
    }

    onUpdateMenu({ ...item, category: updatedCats });
    onToast(`[${stripFormatting(item.name)}] '${catName}' 카테고리가 ${isCurrentlyAssigned ? '해제' : '지정'}되었습니다.`);
  };

  // Mouse Drag and Drop Reordering States
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'before' | 'after' | null>(null);

  // Toggle for raw tag code view vs clean text view per card
  const [showRawCodeMap, setShowRawCodeMap] = useState<Record<string, boolean>>({});
  const toggleRawCode = (key: string) => {
    setShowRawCodeMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync draft if notice changes
  React.useEffect(() => {
    setNoticeDraft(notice.content);
  }, [notice.content]);

  const filteredMenus = menus.filter((m) => {
    const matchesCategory = adminFilter === 'all' || m.category.includes(adminFilter);
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'soldOut'
        ? m.isSoldOut
        : !m.isSoldOut;
    return matchesCategory && matchesStatus;
  });

  const totalCount = menus.length;
  const soldOutCount = menus.filter((m) => m.isSoldOut).length;
  const recCount = menus.filter((m) => m.isRec).length;

  const handleNameChange = (id: string, newName: string) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, name: newName });
    }
  };

  const handleNameColorChange = (id: string, newColor: string) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, nameColor: newColor });
    }
  };

  const handleNameFontChange = (id: string, newFont: string) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, nameFont: newFont });
    }
  };

  const handleNameFontSizeChange = (id: string, newFontSize: string) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, nameFontSize: newFontSize });
    }
  };

  const handleDescChange = (id: string, newDesc: string) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, desc: newDesc });
    }
  };

  const handleTagChange = (id: string, newTag: string) => {
    const item = menus.find((m) => m.id === id);
    if (item && item.tag !== newTag) {
      onUpdateMenu({ ...item, tag: newTag });
    }
  };

  const handlePriceChange = (id: string, rawVal: string) => {
    const num = parseInt(rawVal.replace(/[^0-9]/g, ''), 10) || 0;
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, price: num });
    }
  };

  const handleAdjustPrice = (id: string, delta: number) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      const newPrice = Math.max(0, item.price + delta);
      onUpdateMenu({ ...item, price: newPrice });
    }
  };

  const handleSetSoldOut = (id: string, isSoldOut: boolean) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, isSoldOut });
      const cleanName = stripFormatting(item.name);
      onToast(
        isSoldOut
          ? `[${cleanName}] '품절' 처리되었습니다. 손님 화면에서 '주문 불가'로 변경됩니다.`
          : `[${cleanName}] '판매중'으로 변경되었습니다.`
      );
    }
  };

  const handleToggleSoldOut = (id: string) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      handleSetSoldOut(id, !item.isSoldOut);
    }
  };

  const handleToggleBest = (id: string, isBest: boolean) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, isBest });
      const cleanName = stripFormatting(item.name);
      onToast(
        isBest
          ? `🔥 [${cleanName}] BEST 뱃지가 사진에 설정되었습니다!`
          : `[${cleanName}] BEST 뱃지가 해제되었습니다.`
      );
    }
  };

  const handleToggleRec = (id: string, isRec: boolean) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, isRec });
      const cleanName = stripFormatting(item.name);
      onToast(
        isRec
          ? `★ [${cleanName}] 추천 뱃지가 사진에 설정되었습니다!`
          : `[${cleanName}] 추천 뱃지가 해제되었습니다.`
      );
    }
  };

  // Menu reordering handlers
  const handleMoveMenu = (id: string, direction: 'up' | 'down') => {
    const currentIndex = menus.findIndex((m) => m.id === id);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= menus.length) return;

    const newMenus = [...menus];
    const [movedItem] = newMenus.splice(currentIndex, 1);
    newMenus.splice(targetIndex, 0, movedItem);

    if (onReorderMenus) {
      onReorderMenus(newMenus);
    }
    onToast(`[${stripFormatting(movedItem.name)}] 메뉴 순서를 ${direction === 'up' ? '위' : '아래'}로 이동했습니다 (${targetIndex + 1}번째).`);
  };

  const handleMoveToTop = (id: string) => {
    const currentIndex = menus.findIndex((m) => m.id === id);
    if (currentIndex <= 0) return;

    const newMenus = [...menus];
    const [movedItem] = newMenus.splice(currentIndex, 1);
    newMenus.unshift(movedItem);

    if (onReorderMenus) {
      onReorderMenus(newMenus);
    }
    onToast(`[${stripFormatting(movedItem.name)}] 메뉴를 맨 앞으로 이동했습니다.`);
  };

  const handleMoveToBottom = (id: string) => {
    const currentIndex = menus.findIndex((m) => m.id === id);
    if (currentIndex === -1 || currentIndex === menus.length - 1) return;

    const newMenus = [...menus];
    const [movedItem] = newMenus.splice(currentIndex, 1);
    newMenus.push(movedItem);

    if (onReorderMenus) {
      onReorderMenus(newMenus);
    }
    onToast(`[${stripFormatting(movedItem.name)}] 메뉴를 맨 뒤로 이동했습니다.`);
  };

  const handleQuickSort = (
    type: 'soldOutToBottom' | 'recFirst' | 'priceDesc' | 'priceAsc' | 'nameAsc' | 'reset'
  ) => {
    let sorted: MenuItem[];
    if (type === 'soldOutToBottom') {
      sorted = [...menus].sort((a, b) => {
        if (a.isSoldOut === b.isSoldOut) return 0;
        return a.isSoldOut ? 1 : -1;
      });
      onToast('품절된 메뉴들을 목록 맨 뒤로 정렬했습니다.');
    } else if (type === 'recFirst') {
      sorted = [...menus].sort((a, b) => {
        const scoreA = (a.isRec ? 2 : 0) + (a.isBest ? 1 : 0);
        const scoreB = (b.isRec ? 2 : 0) + (b.isBest ? 1 : 0);
        return scoreB - scoreA;
      });
      onToast('추천 및 인기 메뉴를 맨 앞으로 정렬했습니다.');
    } else if (type === 'priceDesc') {
      sorted = [...menus].sort((a, b) => b.price - a.price);
      onToast('높은 가격순으로 정렬했습니다.');
    } else if (type === 'priceAsc') {
      sorted = [...menus].sort((a, b) => a.price - b.price);
      onToast('낮은 가격순으로 정렬했습니다.');
    } else if (type === 'nameAsc') {
      sorted = [...menus].sort((a, b) => stripFormatting(a.name).localeCompare(stripFormatting(b.name), 'ko-KR'));
      onToast('메뉴 가나다순으로 정렬했습니다.');
    } else if (type === 'reset') {
      sorted = [...INITIAL_MENUS];
      onToast('초기 기본 메뉴 순서로 복원했습니다.');
    } else {
      return;
    }

    if (onReorderMenus) {
      onReorderMenus(sorted);
    }
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!draggedId || draggedId === targetId) return;

    setDragOverId(targetId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    if (relativeY < rect.height / 2) {
      setDragOverPosition('before');
    } else {
      setDragOverPosition('after');
    }
  };

  const handleDragLeave = (e: React.DragEvent, targetId: string) => {
    if (dragOverId === targetId) {
      setDragOverId(null);
      setDragOverPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    if (!sourceId || sourceId === targetId) {
      setDraggedId(null);
      setDragOverId(null);
      setDragOverPosition(null);
      return;
    }

    const sourceIndex = menus.findIndex((m) => m.id === sourceId);
    if (sourceIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      setDragOverPosition(null);
      return;
    }

    const newMenus = [...menus];
    const [movedItem] = newMenus.splice(sourceIndex, 1);

    let targetIndex = newMenus.findIndex((m) => m.id === targetId);
    if (targetIndex === -1) {
      setDraggedId(null);
      setDragOverId(null);
      setDragOverPosition(null);
      return;
    }

    if (dragOverPosition === 'after') {
      targetIndex = targetIndex + 1;
    }

    newMenus.splice(targetIndex, 0, movedItem);

    if (onReorderMenus) {
      onReorderMenus(newMenus);
    }

    onToast(`✨ [${stripFormatting(movedItem.name)}] 메뉴가 #${targetIndex + 1} 위치로 이동되었습니다.`);
    setDraggedId(null);
    setDragOverId(null);
    setDragOverPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    setDragOverPosition(null);
  };

  const handleToggleVisibility = (id: string, checked: boolean) => {
    const item = menus.find((m) => m.id === id);
    if (item) {
      onUpdateMenu({ ...item, isVisible: checked });
      onToast(
        checked
          ? '메뉴가 손님 화면에 노출됩니다.'
          : '메뉴가 손님 화면에서 숨겨집니다.'
      );
    }
  };

  const handleSaveNotice = () => {
    if (!noticeDraft.trim()) {
      onToast('공지 문구를 입력해주세요.');
      return;
    }
    onUpdateNotice({ ...notice, content: noticeDraft.trim() });
    onToast('오늘의 제철 국 & 반찬 안내 문구가 성공적으로 반영되었습니다!');
  };

  const handleToggleNoticeVisibility = () => {
    const updated = !notice.isVisible;
    onUpdateNotice({ ...notice, isVisible: updated });
    onToast(
      updated
        ? '손님 화면에 오늘의 제철 국 & 반찬 배너가 노출됩니다.'
        : '손님 화면에서 오늘의 제철 국 & 반찬 배너가 숨겨졌습니다.'
    );
  };

  const handleDuplicateMenu = (item: MenuItem) => {
    const newId = `item-custom-${Date.now()}`;
    const copy: MenuItem = {
      ...item,
      id: newId,
      name: `${item.name} (복사본)`,
    };
    onAddMenu(copy);
    onToast(`[${stripFormatting(copy.name)}] 메뉴가 복제 추가되었습니다.`);
  };

  const handleConfirmDelete = () => {
    if (menuToDelete) {
      onDeleteMenu(menuToDelete.id);
      onToast(`[${stripFormatting(menuToDelete.name)}] 메뉴가 삭제되었습니다.`);
      setMenuToDelete(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-brand-cream animate-in fade-in duration-200">
      {/* Admin TopBar */}
      <header className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-border px-3 sm:px-5 md:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={async () => {
              if (onSave) {
                await onSave();
              }
              onCloseAdmin();
            }}
            className="flex items-center space-x-1 text-xs sm:text-sm font-bold text-brand-terracotta active:scale-95 transition cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>메뉴판 보기</span>
          </button>
          <h1 className="text-sm sm:text-base font-extrabold text-brand-dark tracking-tight truncate">
            한양도시락 관리자 콘솔
          </h1>
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Hidden Backup JSON File Input */}
            <input
              type="file"
              ref={backupInputRef}
              accept=".json"
              className="hidden"
              onChange={handleBackupFileChange}
            />

            <button
              type="button"
              onClick={() => setIsPriceBatchMode((prev) => !prev)}
              className={`py-1.5 px-2.5 sm:px-3 text-xs font-bold rounded-lg shadow-xs active:scale-95 transition flex items-center space-x-1 cursor-pointer border ${
                isPriceBatchMode
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 ring-2 ring-amber-300'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
              }`}
              title="모든 메뉴의 가격을 한 번에 리스트 형태로 보고 빠르게 수정할 수 있는 가격 일괄 편집 모드"
            >
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>{isPriceBatchMode ? '일반 모드' : '가격 일괄 편집'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="py-1.5 px-2.5 sm:px-3 bg-brand-terracotta hover:bg-brand-terracottaHover text-white text-xs font-bold rounded-lg shadow-xs active:scale-95 transition flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ 메뉴 추가</span>
            </button>
            {/* Server Data Force Sync Button (Emergency & Reconcile requested by store owner) */}
            <button
              type="button"
              onClick={() => {
                if (onForceSync) {
                  onForceSync();
                } else if (onSyncToLatestData) {
                  onSyncToLatestData('forceReconcile');
                }
              }}
              disabled={isForceSyncing}
              title="서버 데이터와 로컬 데이터를 즉시 강제 비교하고 병합하여 동기화 꼬임을 해결합니다 (스마트폰/태블릿/PC 실시간 적용)"
              className="py-1.5 px-2.5 sm:px-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:from-amber-800 active:to-orange-800 disabled:opacity-60 text-white text-xs font-black rounded-lg shadow-xs active:scale-95 transition flex items-center space-x-1.5 cursor-pointer ring-1 ring-amber-400/50"
            >
              <Zap className={`w-3.5 h-3.5 ${isForceSyncing ? 'animate-spin text-amber-200' : 'text-amber-100 fill-amber-200'}`} />
              <span className="hidden sm:inline">서버 데이터 강제 동기화</span>
              <span className="sm:hidden">강제 동기화</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (onExportBackup) onExportBackup();
              }}
              title="현재 등록된 메뉴 & 설정 백업 파일 다운로드"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-sand border border-brand-border flex items-center justify-center text-stone-600 hover:text-brand-terracotta cursor-pointer transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              title="기기간 동기화 & 데이터 관리 열기"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-sand border border-brand-border flex items-center justify-center text-stone-600 hover:text-brand-terracotta cursor-pointer transition active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-700" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 px-3 sm:px-5 md:px-8 py-3 sm:py-5 space-y-3.5 sm:space-y-4">
        {/* Top Management Grid: 1-col on smartphones, 2-cols on tablets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          {/* Store Status Card */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-brand-border shadow-card flex items-center justify-between gap-2.5">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-brand-terracotta flex items-center justify-center text-xl shrink-0">
                <Store className="w-5 h-5 text-brand-terracotta" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-1.5 flex-wrap gap-y-0.5">
                  <h2 className="text-sm sm:text-base font-extrabold text-brand-dark whitespace-nowrap">
                    한양 도시락 본점
                  </h2>
                  <span
                    className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                      storeStatus.isOpen
                        ? 'text-emerald-700 bg-emerald-100'
                        : 'text-red-700 bg-red-100'
                    }`}
                  >
                    {storeStatus.isOpen ? '주문 접수중' : '주문 마감'}
                  </span>
                </div>
                {/* 운영시간 및 포장 주문 연동 활성 줄바꿈 정렬 */}
                <div className="text-[11px] sm:text-xs text-brand-muted mt-1 leading-snug break-keep">
                  <p>운영시간 11:00-17:00 (라스트오더 마감 30분전)</p>
                  <p className="text-stone-600 font-medium mt-0.5">포장 주문 연동 활성</p>
                </div>
              </div>
            </div>

            {/* 영업중 토글 Switch */}
            <div className="flex flex-col items-center space-y-1 shrink-0">
              <button
                type="button"
                onClick={onToggleStoreStatus}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  storeStatus.isOpen ? 'bg-brand-terracotta' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    storeStatus.isOpen ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-[10px] sm:text-xs font-bold text-stone-600 whitespace-nowrap">
                {storeStatus.isOpen ? '영업중' : '영업마감'}
              </span>
            </div>
          </div>

          {/* Daily Notice Edit Section */}
          <section className="bg-white rounded-2xl p-3.5 sm:p-4 border border-brand-border shadow-card space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2 gap-2">
              <div className="flex items-center space-x-1.5 min-w-0 flex-1 flex-wrap gap-y-1">
                <span className="text-base shrink-0">🍲</span>
                <h3 className="text-xs sm:text-sm font-extrabold text-brand-dark whitespace-nowrap">
                  오늘의 제철 국 &amp; 반찬 공지 관리
                </h3>
                <span className="text-[9px] sm:text-[10px] font-bold text-brand-terracotta bg-brand-sand px-1.5 py-0.5 rounded whitespace-nowrap">
                  손님 화면 상단 실시간 노출
                </span>
              </div>

              {/* 노출 상태 토글 */}
              <div className="flex flex-col items-center space-y-1 shrink-0">
                <button
                  type="button"
                  onClick={handleToggleNoticeVisibility}
                  title="공지 배너 노출 여부 토글"
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    notice.isVisible ? 'bg-emerald-600' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      notice.isVisible ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span
                  className={`text-[10px] sm:text-xs font-bold whitespace-nowrap ${
                    notice.isVisible ? 'text-emerald-700' : 'text-stone-400'
                  }`}
                >
                  {notice.isVisible ? '노출중' : '숨김'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="admin-notice-input"
                className="block text-[10px] sm:text-xs font-bold text-brand-muted"
              >
                안내 문구 수정 (국/반찬 정보 입력)
              </label>
              <textarea
                id="admin-notice-input"
                rows={2}
                value={noticeDraft}
                onChange={(e) => setNoticeDraft(e.target.value)}
                className="w-full text-xs sm:text-sm text-brand-dark bg-stone-50 border border-brand-border rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-terracotta leading-relaxed resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-[10px] sm:text-xs text-stone-400">
                저장 시 손님 화면 공지 배너에 즉시 반영됩니다.
              </p>
              <button
                type="button"
                onClick={handleSaveNotice}
                className="px-3 py-1.5 rounded-lg bg-brand-terracotta hover:bg-brand-terracottaHover text-white text-[11px] sm:text-xs font-bold shadow-sm active:scale-95 transition flex items-center space-x-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>문구 저장 및 즉시 반영</span>
              </button>
            </div>
          </section>
        </div>

        {/* 3-Column Metrics Card */}
        <div className="grid grid-cols-3 gap-2">
          <div
            onClick={() => setStatusFilter('all')}
            className={`rounded-xl p-2.5 border text-center shadow-card cursor-pointer transition ${
              statusFilter === 'all'
                ? 'bg-amber-50/50 border-brand-terracotta/40'
                : 'bg-white border-brand-border hover:bg-stone-50'
            }`}
          >
            <span className="text-[10px] font-semibold text-brand-muted">
              등록된 총 메뉴
            </span>
            <div className="text-sm font-extrabold text-brand-dark mt-0.5">
              <span>{totalCount}</span>
              <span className="text-xs font-normal">개</span>
            </div>
          </div>
          <div
            onClick={() => setStatusFilter((prev) => (prev === 'soldOut' ? 'all' : 'soldOut'))}
            className={`rounded-xl p-2.5 border text-center shadow-card cursor-pointer transition ${
              statusFilter === 'soldOut'
                ? 'bg-red-50 border-red-400 ring-1 ring-red-400'
                : 'bg-white border-brand-border hover:bg-stone-50'
            }`}
          >
            <span className="text-[10px] font-semibold text-brand-muted flex items-center justify-center space-x-1">
              <span>품절 메뉴</span>
              {soldOutCount > 0 && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              )}
            </span>
            <div
              className={`text-sm font-extrabold mt-0.5 ${
                soldOutCount > 0 ? 'text-red-600' : 'text-stone-600'
              }`}
            >
              <span>{soldOutCount}</span>
              <span className="text-xs font-normal">개</span>
            </div>
          </div>
          <div className="bg-white rounded-xl p-2.5 border border-brand-border text-center shadow-card">
            <span className="text-[10px] font-semibold text-brand-muted">
              오늘의 추천
            </span>
            <div className="text-sm font-extrabold text-brand-terracotta mt-0.5">
              <span>{recCount}</span>
              <span className="text-xs font-normal">개</span>
            </div>
          </div>
        </div>


        {/* Admin Filters: Category Chips & Status Filter Buttons */}
        <div className="space-y-2">
          {/* Category Chips Bar with "+ 카테고리 관리/추가" Button */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-semibold">
            {/* '전체 카테고리' button */}
            <button
              type="button"
              onClick={() => setAdminFilter('all')}
              className={`admin-chip shrink-0 px-3 py-1.5 rounded-full transition cursor-pointer text-xs ${
                adminFilter === 'all'
                  ? 'bg-brand-terracotta text-white shadow-sm font-bold'
                  : 'bg-white text-brand-muted border border-brand-border hover:bg-stone-50'
              }`}
            >
              전체 카테고리 ({totalCount})
            </button>

            {/* Dynamic Custom Categories from categories prop */}
            {categories.map((cat) => {
              const count = menus.filter((m) => m.category.includes(cat)).length;
              const isActive = adminFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAdminFilter(cat)}
                  className={`admin-chip shrink-0 px-3 py-1.5 rounded-full transition cursor-pointer text-xs ${
                    isActive
                      ? 'bg-brand-terracotta text-white shadow-sm font-bold'
                      : 'bg-white text-brand-muted border border-brand-border hover:bg-stone-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}

            {/* Dedicated Category Manage / Add Button */}
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-amber-950 border border-amber-300 font-extrabold text-xs transition cursor-pointer flex items-center space-x-1 shadow-2xs active:scale-95"
              title="카테고리 추가, 이름 수정, 순서 정렬, 삭제 열기"
            >
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>+ 카테고리 관리/추가</span>
            </button>
          </div>

          {/* Status Filter Pill (All / 판매중만 / 품절만) */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-[11px] font-bold text-stone-500 shrink-0">상태 보기:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                전체 ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('available')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                  statusFilter === 'available'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>판매중 ({totalCount - soldOutCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('soldOut')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                  statusFilter === 'soldOut'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span>품절만 ({soldOutCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Realtime Notice Alert Box */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300/80 rounded-xl p-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-emerald-950">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <p className="text-[11px] font-bold leading-tight">
              스마트폰 · 태블릿 · PC 모든 기기 실시간 100% 동기화 작동 중 (메뉴/사진/카테고리 자동 연동)
            </p>
          </div>
          <div className="flex items-center space-x-1.5 self-end sm:self-auto flex-wrap gap-1">
            <button
              type="button"
              onClick={() => {
                if (onForceSync) {
                  onForceSync();
                } else if (onSyncToLatestData) {
                  onSyncToLatestData('forceReconcile');
                }
              }}
              disabled={isForceSyncing}
              title="서버 데이터와 로컬 데이터를 즉시 강제 비교하고 병합합니다"
              className="text-[11px] font-black text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer shadow-2xs transition flex items-center space-x-1 active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-3 h-3 ${isForceSyncing ? 'animate-spin' : 'fill-amber-600 text-amber-700'}`} />
              <span>서버 데이터 강제 동기화</span>
            </button>
            <button
              type="button"
              onClick={() => setIsSyncModalOpen(true)}
              className="text-[11px] font-extrabold text-emerald-900 bg-white hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg shrink-0 cursor-pointer shadow-2xs transition"
            >
              ☁️ 기기간 동기화 &amp; 백업
            </button>
          </div>
        </div>

        {/* Category Management Action Card */}
        <div className="bg-gradient-to-r from-orange-50/90 via-amber-50 to-amber-100/70 border border-amber-300/80 rounded-2xl p-3 sm:p-4 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <h3 className="text-xs sm:text-sm font-extrabold text-stone-900">
                  전체 카테고리 관리 ({categories.length}개 운영중)
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200/90 px-1.5 py-0.5 rounded-full border border-amber-300">
                  손님 메뉴판 탭 실시간 연동
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                카테고리 새로 추가, 이름 수정, 노출 순서 변경, 삭제를 한곳에서 자유롭게 편집하세요.
              </p>
              <div className="flex items-center gap-1 flex-wrap mt-1">
                {categories.map((c) => (
                  <span
                    key={c}
                    className="text-[10px] font-bold bg-white text-stone-700 border border-amber-200 px-1.5 py-0.2 rounded"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs active:scale-95 transition flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
          >
            <Layers className="w-4 h-4" />
            <span>카테고리 관리 열기</span>
          </button>
        </div>

        {/* View Mode Switcher: Regular Detail Cards vs Batch Price Edit Mode */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-brand-border shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-stone-600">보기 모드:</span>
            <div className="inline-flex rounded-xl p-1 bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => setIsPriceBatchMode(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 ${
                  !isPriceBatchMode
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span>🎴 개별 카드 모드</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPriceBatchMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 ${
                  isPriceBatchMode
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-amber-800'
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>💰 가격 일괄 편집 모드 (리스트)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 flex items-center space-x-1">
            {isPriceBatchMode ? (
              <span className="text-amber-800 font-bold">
                ⚡ 전체 메뉴 가격을 한 눈에 보고 일괄 수정하는 리스트 모드입니다.
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsPriceBatchMode(true)}
                className="text-amber-800 hover:text-amber-950 font-bold hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Coins className="w-3 h-3 text-amber-600" />
                <span>메뉴 가격만 빠르게 일괄 수정하기 ➔</span>
              </button>
            )}
          </div>
        </div>

        {isPriceBatchMode ? (
          <BatchPriceEditor
            menus={menus}
            categories={categories}
            onUpdateMenu={onUpdateMenu}
            onReorderMenus={onReorderMenus}
            onClose={() => setIsPriceBatchMode(false)}
            onSave={onSave}
            isSaving={isSaving}
            onToast={onToast}
            onCloseAdmin={onCloseAdmin}
          />
        ) : (
          <>
            {/* Menu Ordering & Sorting Controls Bar */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-brand-border shadow-card space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-brand-terracotta flex items-center justify-center shrink-0 border border-amber-200">
                <ArrowUpDown className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-brand-dark flex items-center space-x-1.5 flex-wrap gap-y-1">
                  <span>메뉴 노출 순서 &amp; 빠른 정렬</span>
                  <span className="text-[9px] font-bold text-brand-terracotta bg-brand-sand px-1.5 py-0.2 rounded">
                    손님 화면 연동
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                    🖱️ 마우스 드래그 정렬 지원
                  </span>
                </h4>
                <p className="text-[10px] sm:text-[11px] text-brand-muted mt-0.5">
                  각 메뉴 상단 바(<strong>순서 #N 상단 드래그</strong>)를 마우스로 잡고 원하는 위치로 끌어다 놓으세요. (텍스트는 드래그되지 않아 편집이 편리합니다)
                </p>
              </div>
            </div>

            {/* Quick Sort Actions */}
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => handleQuickSort('soldOutToBottom')}
                title="품절된 메뉴를 메뉴판 맨 뒤로 이동"
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold transition flex items-center space-x-1 whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              >
                <span>⚡ 품절메뉴 뒤로</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSort('recFirst')}
                title="추천 및 인기 메뉴를 맨 앞으로 이동"
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold transition flex items-center space-x-1 whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              >
                <span>⭐ 추천메뉴 앞으로</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSort('priceDesc')}
                title="높은 가격순 정렬"
                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              >
                가격 높은순
              </button>
              <button
                type="button"
                onClick={() => handleQuickSort('priceAsc')}
                title="낮은 가격순 정렬"
                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              >
                가격 낮은순
              </button>
              <button
                type="button"
                onClick={() => handleQuickSort('nameAsc')}
                title="가나다순 정렬"
                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium transition whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              >
                가나다순
              </button>
              <button
                type="button"
                onClick={() => handleQuickSort('reset')}
                title="기본 순서로 복원"
                className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 text-[11px] font-medium transition whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
              >
                초기화
              </button>
            </div>
          </div>
        </div>

        {/* Drag Helper Floating Alert */}
        {draggedId && (
          <aside aria-label="드래그 안내" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center space-x-2 text-xs font-bold backdrop-blur-md border border-amber-500/50 pointer-events-none animate-bounce">
            <GripVertical className="w-4 h-4 text-amber-400" />
            <span>원하는 카드의 앞/뒤 위치로 끌어다 놓으세요 (Drop)</span>
          </aside>
        )}

        {/* Admin Menu List Edit Cards: 1-col on smartphone, 2-cols on tablet */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pb-20">
          {filteredMenus.map((item) => {
            const globalIndex = menus.findIndex((m) => m.id === item.id);
            const isBeingDragged = draggedId === item.id;
            const isDragTarget = dragOverId === item.id && !isBeingDragged;

            return (
              <article
                key={item.id}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={(e) => handleDragLeave(e, item.id)}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`admin-card rounded-2xl p-3.5 border shadow-card space-y-3 transition-all duration-150 relative ${
                  isBeingDragged
                    ? 'opacity-35 border-2 border-dashed border-brand-terracotta bg-amber-50/50 scale-[0.98]'
                    : isDragTarget
                    ? 'ring-2 ring-brand-terracotta ring-offset-2 border-brand-terracotta bg-amber-50/30'
                    : item.isSoldOut
                    ? 'border-red-300 bg-red-50/15'
                    : 'border-brand-border bg-white hover:border-brand-border/80'
                }`}
              >
                {/* Drop indicator lines */}
                {isDragTarget && dragOverPosition === 'before' && (
                  <div className="absolute -top-2 left-2 right-2 h-1.5 bg-brand-terracotta rounded-full shadow-md z-30 pointer-events-none animate-pulse" />
                )}
                {isDragTarget && dragOverPosition === 'after' && (
                  <div className="absolute -bottom-2 left-2 right-2 h-1.5 bg-brand-terracotta rounded-full shadow-md z-30 pointer-events-none animate-pulse" />
                )}

                {/* Card Header: Dedicated Drag Handle Bar at the TOP of the menu ("메뉴 상단 드래그 영역") & Up/Down Controls */}
                <div
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  title="마우스로 이 상단 바를 클릭하고 끌어서 원하는 위치로 이동하세요"
                  className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-amber-50/90 via-stone-50 to-amber-50/70 hover:from-amber-100 hover:to-amber-100/70 border border-stone-200/90 hover:border-amber-300 transition-colors cursor-grab active:cursor-grabbing select-none group"
                >
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                    {/* Draggable grip handle indicator */}
                    <div className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white shadow-2xs border border-stone-200 text-stone-700 font-bold text-[11px] group-hover:text-brand-terracotta group-hover:border-amber-400 transition">
                      <GripVertical className="w-3.5 h-3.5 text-stone-400 group-hover:text-brand-terracotta animate-pulse" />
                      <span>순서 #{globalIndex + 1}</span>
                      <span className="text-[10px] text-amber-900 bg-amber-200/70 px-1 py-0.2 rounded font-semibold ml-1">
                        상단 드래그 이동
                      </span>
                    </div>

                    <span className="text-[10px] font-bold text-brand-terracotta bg-white px-1.5 py-0.5 rounded border border-stone-200">
                      {item.category.join('/')}
                    </span>
                    {item.tag && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-terracotta text-white text-[10px] font-black border border-brand-terracotta flex items-center space-x-0.5 shadow-2xs">
                        <Tag className="w-2.5 h-2.5 inline mr-0.5" />
                        <span>#{item.tag}</span>
                      </span>
                    )}
                    {item.isSoldOut && (
                      <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-black border border-red-200 flex items-center space-x-0.5">
                        <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />
                        <span>품절 (주문 불가)</span>
                      </span>
                    )}
                  </div>

                  {/* Up / Down Reorder Buttons with stopPropagation so clicking buttons doesn't drag */}
                  <div
                    className="flex items-center space-x-1 shrink-0"
                    onMouseDown={(e) => e.stopPropagation()}
                    draggable={false}
                  >
                    <button
                      type="button"
                      disabled={globalIndex <= 0}
                      onClick={() => handleMoveMenu(item.id, 'up')}
                      title="목록에서 한 칸 위로 이동"
                      className="px-1.5 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition cursor-pointer flex items-center space-x-0.5 text-[10px] font-bold border border-stone-200"
                    >
                      <ArrowUp className="w-3 h-3 text-stone-600" />
                      <span className="hidden sm:inline">위로</span>
                    </button>
                    <button
                      type="button"
                      disabled={globalIndex >= menus.length - 1}
                      onClick={() => handleMoveMenu(item.id, 'down')}
                      title="목록에서 한 칸 아래로 이동"
                      className="px-1.5 py-0.5 rounded bg-white hover:bg-stone-100 text-stone-700 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition cursor-pointer flex items-center space-x-0.5 text-[10px] font-bold border border-stone-200"
                    >
                      <ArrowDown className="w-3 h-3 text-stone-600" />
                      <span className="hidden sm:inline">아래로</span>
                    </button>
                    <button
                      type="button"
                      disabled={globalIndex <= 0}
                      onClick={() => handleMoveToTop(item.id)}
                      title="맨 앞으로 이동"
                      className="p-1 rounded bg-white hover:bg-stone-100 text-stone-500 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 transition cursor-pointer text-[10px] border border-stone-200"
                    >
                      <ChevronsUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={globalIndex >= menus.length - 1}
                      onClick={() => handleMoveToBottom(item.id)}
                      title="맨 뒤로 이동"
                      className="p-1 rounded bg-white hover:bg-stone-100 text-stone-500 disabled:opacity-20 disabled:cursor-not-allowed active:scale-95 transition cursor-pointer text-[10px] border border-stone-200"
                    >
                      <ChevronsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {/* Photo container with auto recovery & direct badge toggles */}
                  <div className="flex flex-col items-center shrink-0 space-y-1">
                    <AdminMenuThumb item={item} onOpenPhotoModal={onOpenPhotoModal} />
                    {/* Quick Photo Badges on Thumb */}
                    <div className="flex items-center space-x-1 w-24">
                      <button
                        type="button"
                        onClick={() => handleToggleBest(item.id, !item.isBest)}
                        className={`flex-1 py-0.5 rounded text-[9px] font-black transition cursor-pointer border text-center ${
                          item.isBest
                            ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-red-50 hover:text-red-700'
                        }`}
                        title="메뉴 사진에 BEST 뱃지 노출/해제"
                      >
                        {item.isBest ? '✓BEST' : '+BEST'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleRec(item.id, !item.isRec)}
                        className={`flex-1 py-0.5 rounded text-[9px] font-black transition cursor-pointer border text-center ${
                          item.isRec
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-amber-50 hover:text-amber-800'
                        }`}
                        title="메뉴 사진에 추천 뱃지 노출/해제"
                      >
                        {item.isRec ? '✓추천' : '+추천'}
                      </button>
                    </div>
                  </div>

                  {/* Info and inputs */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* 메뉴 사진 뱃지 설정: BEST 뱃지 & 추천 뱃지 토글 버튼 */}
                    <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] font-bold text-stone-500 mr-0.5">사진 뱃지:</span>
                        {/* BEST Badge Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleBest(item.id, !item.isBest)}
                          className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer flex items-center space-x-1 border ${
                            item.isBest
                              ? 'bg-red-600 text-white border-red-700 shadow-2xs'
                              : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                          }`}
                          title="메뉴 사진에 BEST 뱃지 노출/해제"
                        >
                          <span>{item.isBest ? '✓ BEST' : '+ BEST'}</span>
                        </button>

                        {/* 추천 Badge Toggle */}
                        <button
                          type="button"
                          onClick={() => handleToggleRec(item.id, !item.isRec)}
                          className={`px-2 py-0.5 rounded text-[10px] font-black transition cursor-pointer flex items-center space-x-1 border ${
                            item.isRec
                              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                              : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200'
                          }`}
                          title="메뉴 사진에 추천 뱃지 노출/해제"
                        >
                          <span>{item.isRec ? '✓ ★ 추천' : '+ 추천'}</span>
                        </button>
                      </div>

                      {(item.isBest || item.isRec) && (
                        <span className="text-[9px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          사진 뱃지 노출중
                        </span>
                      )}
                    </div>

                    {/* 메뉴명 및 글자색/글자폰트/글자크기 제어 영역 */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="text-[10px] font-bold text-stone-500 shrink-0">메뉴명</span>

                        <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                          {/* 폰트 선택 드롭다운 */}
                          <div className="flex items-center space-x-0.5 bg-stone-100 hover:bg-stone-200/80 rounded px-1.5 py-0.5 border border-stone-200 transition">
                            <Type className="w-2.5 h-2.5 text-stone-500 shrink-0" />
                            <select
                              value={item.nameFont || 'noto'}
                              onChange={(e) => handleNameFontChange(item.id, e.target.value)}
                              title="메뉴명 폰트 변경"
                              className="text-[10px] bg-transparent text-stone-700 font-medium focus:outline-none cursor-pointer"
                            >
                              {FONT_OPTIONS.map((f) => (
                                <option key={f.id} value={f.id}>
                                  {f.shortName}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 폰트 크기 선택 드롭다운 */}
                          <div className="flex items-center space-x-0.5 bg-stone-100 hover:bg-stone-200/80 rounded px-1.5 py-0.5 border border-stone-200 transition">
                            <span className="text-[10px] font-bold text-stone-500">크기:</span>
                            <select
                              value={item.nameFontSize || 'base'}
                              onChange={(e) => handleNameFontSizeChange(item.id, e.target.value)}
                              title="메뉴명 글자 크기 변경"
                              className="text-[10px] bg-transparent text-stone-700 font-bold focus:outline-none cursor-pointer"
                            >
                              {FONT_SIZE_OPTIONS.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* 컬러 팔레트 피커 */}
                          <label
                            className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs cursor-pointer block shrink-0 hover:scale-110 transition"
                            style={{ backgroundColor: item.nameColor || '#1C1C19' }}
                            title="글자색 직접 선택"
                          >
                            <input
                              type="color"
                              value={item.nameColor || '#1C1C19'}
                              onChange={(e) => handleNameColorChange(item.id, e.target.value)}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>

                      {/* 실시간 완성 미리보기 */}
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded px-2 py-0.5 text-xs flex items-center justify-between gap-1 overflow-hidden">
                        <div className="flex items-center space-x-1 shrink-0">
                          <span className="text-[9px] font-bold text-amber-700">완성 화면:</span>
                          {(item.name.includes('[') || item.name.includes('<')) && (
                            <button
                              type="button"
                              onClick={() => toggleRawCode(item.id)}
                              className="text-[9px] text-amber-800 bg-amber-100 hover:bg-amber-200 px-1 py-0.2 rounded border border-amber-300 transition cursor-pointer"
                              title="태그 코드 직접 수정 모드 전환"
                            >
                              {showRawCodeMap[item.id] ? '일반 텍스트로 전환' : '코드 직접 편집'}
                            </button>
                          )}
                        </div>
                        <div className="font-bold truncate text-[13px] flex-1 text-right">
                          <FormattedText
                            text={item.name}
                            defaultFont={item.nameFont}
                            defaultColor={item.nameColor}
                            defaultSize={item.nameFontSize}
                            isSoldOut={item.isSoldOut}
                          />
                        </div>
                      </div>

                      {/* 메뉴명 입력창 (코드 없이 깔끔한 한글 텍스트 모드, 스페이스 띄어쓰기 및 한글 입력 100% 정상 작동) */}
                      <CleanFormattedInput
                        value={item.name}
                        isRawMode={!!showRawCodeMap[item.id]}
                        onCommit={(newVal) => handleNameChange(item.id, newVal)}
                        placeholder="메뉴명 입력 (예: 프리미엄 불고기 도시락)"
                        title={showRawCodeMap[item.id] ? '메뉴명 태그 코드 직접 수정' : '메뉴명 수정 (일반 텍스트)'}
                        style={{
                          color: item.nameColor || '#1C1C19',
                          fontSize: getFontSizePx(item.nameFontSize),
                        }}
                        className={`admin-input-name w-full font-extrabold bg-amber-50/40 hover:bg-amber-50 focus:bg-white border border-dashed border-brand-terracotta/60 rounded px-1.5 py-1 focus:outline-none transition-all ${getFontClass(
                          item.nameFont
                        )} ${getFontSizeClass(item.nameFontSize)}`}
                      />

                      {/* 빠른 글자 크기 및 색상 선택 바 */}
                      <div className="flex items-center justify-between gap-1.5 pt-0.5 flex-wrap">
                        {/* 빠른 글자 크기 버튼 */}
                        <div className="flex items-center space-x-1">
                          <span className="text-[9px] text-stone-400 shrink-0">기본크기:</span>
                          {FONT_SIZE_OPTIONS.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleNameFontSizeChange(item.id, s.id)}
                              title={`전체 글자 크기 ${s.name}`}
                              className={`px-1.5 py-0.2 text-[9px] rounded font-bold transition-all cursor-pointer ${
                                (item.nameFontSize || 'base') === s.id
                                  ? 'bg-brand-terracotta text-white shadow-2xs scale-105'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {s.shortName}
                            </button>
                          ))}
                        </div>

                        {/* 빠른 추천 색상 프리셋 버튼들 */}
                        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
                          {COLOR_PRESETS.slice(0, 5).map((c) => (
                            <button
                              key={c.hex}
                              type="button"
                              onClick={() => handleNameColorChange(item.id, c.hex)}
                              title={`${c.name} (${c.hex})`}
                              className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                                (item.nameColor || '#1C1C19').toLowerCase() === c.hex.toLowerCase()
                                  ? 'scale-125 border-brand-terracotta ring-1 ring-brand-terracotta shadow-xs'
                                  : 'border-stone-300 hover:scale-110 opacity-75 hover:opacity-100'
                              }`}
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* 일부 텍스트만 글꼴/색상/크기 적용하는 부분 서식 스타일러 */}
                      <PartialTextStyler
                        label="메뉴명"
                        rawText={item.name}
                        defaultFont={item.nameFont}
                        defaultColor={item.nameColor}
                        defaultSize={item.nameFontSize}
                        onChange={(newVal) => handleNameChange(item.id, newVal)}
                        onToast={onToast}
                      />
                    </div>

                    {/* 가격 수정 및 ±버튼 */}
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500 font-medium">
                        판매가:
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-stone-600">₩</span>
                        <input
                          type="text"
                          value={item.price.toLocaleString('ko-KR')}
                          onChange={(e) => handlePriceChange(item.id, e.target.value)}
                          className="admin-input-price w-20 text-right text-xs font-extrabold text-brand-terracotta bg-white border border-brand-border rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-brand-terracotta"
                        />
                        <span className="text-xs font-bold text-stone-700">원</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-1 mt-1 text-[10px]">
                      <button
                        type="button"
                        onClick={() => handleAdjustPrice(item.id, -500)}
                        className="px-1.5 py-0.5 bg-stone-100 rounded hover:bg-stone-200 text-stone-700 active:scale-95 cursor-pointer"
                      >
                        -500
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustPrice(item.id, 500)}
                        className="px-1.5 py-0.5 bg-stone-100 rounded hover:bg-stone-200 text-stone-700 active:scale-95 cursor-pointer"
                      >
                        +500
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAdjustPrice(item.id, 1000)}
                        className="px-1.5 py-0.5 bg-stone-100 rounded hover:bg-stone-200 text-stone-700 active:scale-95 cursor-pointer"
                      >
                        +1,000
                      </button>
                    </div>
                  </div>
                </div>

                {/* 상세 설명 수정 */}
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-1.5">
                      <label className="block text-[10px] font-bold text-stone-700">
                        메뉴 상세 설명
                      </label>
                      {(item.desc.includes('[') || item.desc.includes('<')) && (
                        <button
                          type="button"
                          onClick={() => toggleRawCode(`desc-${item.id}`)}
                          className="text-[9px] text-stone-500 hover:text-stone-800 bg-stone-100 px-1 py-0.2 rounded border border-stone-200 transition cursor-pointer"
                          title="태그 코드 직접 수정 모드 전환"
                        >
                          {showRawCodeMap[`desc-${item.id}`] ? '일반 텍스트로 전환' : '코드 직접 편집'}
                        </button>
                      )}
                    </div>
                    {item.desc && (
                      <div className="text-[9px] text-stone-500 truncate max-w-[200px]">
                        <FormattedText text={item.desc} />
                      </div>
                    )}
                  </div>
                  <CleanFormattedTextarea
                    rows={2}
                    value={item.desc}
                    isRawMode={!!showRawCodeMap[`desc-${item.id}`]}
                    onCommit={(newVal) => handleDescChange(item.id, newVal)}
                    placeholder="상세 설명 입력 (예: 매일 아침 신선한 재료로 정갈하게 조리한 정성 도시락)"
                    title={showRawCodeMap[`desc-${item.id}`] ? '상세 설명 태그 코드 직접 수정' : '상세 설명 수정 (일반 텍스트)'}
                    className="w-full text-xs text-stone-800 bg-amber-50/30 hover:bg-amber-50/60 focus:bg-white border border-brand-border rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-brand-terracotta leading-relaxed resize-none"
                  />
                  <PartialTextStyler
                    label="상세 설명"
                    rawText={item.desc}
                    onChange={(newVal) => handleDescChange(item.id, newVal)}
                    onToast={onToast}
                  />
                </div>

                {/* 강조 태그 문구 (Highlight Tag) 전용 관리 영역 */}
                <div className="pt-2 border-t border-stone-100 p-2.5 bg-amber-50/40 rounded-xl border border-amber-200/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-brand-dark flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-brand-terracotta" />
                      <span>강조 태그 문구 (카드 뱃지)</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      {item.tag ? (
                        <>
                          <span className="bg-brand-terracotta text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                            #{item.tag}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleTagChange(item.id, '')}
                            className="text-[9px] text-stone-400 hover:text-red-600 underline cursor-pointer ml-1"
                            title="태그 비우기"
                          >
                            삭제
                          </button>
                        </>
                      ) : (
                        <span className="text-[9px] text-stone-400 font-medium">태그 없음</span>
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    value={item.tag || ''}
                    onChange={(e) => handleTagChange(item.id, e.target.value)}
                    placeholder="예: 신메뉴, 인기 메뉴, 당일 한정, 국산 100%"
                    className="w-full text-xs font-bold text-brand-dark bg-white border border-brand-border rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
                  />

                  {/* Quick Tag Presets */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                    <span className="text-[9px] text-stone-400 shrink-0 font-bold">추천:</span>
                    {QUICK_TAG_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => handleTagChange(item.id, t)}
                        className={`text-[9px] px-2 py-0.5 rounded-full border transition cursor-pointer whitespace-nowrap active:scale-95 ${
                          item.tag === t
                            ? 'bg-brand-sand text-brand-terracotta border-brand-terracotta font-black shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        #{t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-stone-500 leading-tight">
                    * 설정한 강조 태그는 손님 메뉴판의 카드 상단 뱃지와 하단 태그에 실시간 100% 동기화 노출됩니다.
                  </p>
                </div>

                {/* 소속 카테고리 태그 선택기 (다중 지정 / 해제) */}
                <div className="pt-2 border-t border-stone-100 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-600 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-brand-terracotta" />
                      <span>소속 카테고리 (클릭하여 추가/해제):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="text-[9px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                    >
                      전체 카테고리 관리 &gt;
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {categories.map((catName) => {
                      const isAssigned = item.category.includes(catName);
                      return (
                        <button
                          key={catName}
                          type="button"
                          onClick={() => handleToggleMenuCategory(item.id, catName)}
                          title={`'${catName}' 카테고리 ${isAssigned ? '해제' : '추가 지정'}`}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer border ${
                            isAssigned
                              ? 'bg-brand-terracotta text-white border-brand-terracotta shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-200 hover:border-brand-terracotta/60 hover:text-stone-900'
                          }`}
                        >
                          {isAssigned ? `✓ ${catName}` : `+ ${catName}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 판매상태 (품절/판매중) & 손님 노출 제어 */}
                <div className="pt-2.5 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-xs font-bold text-stone-700">판매 상태:</span>
                    <div className="inline-flex rounded-lg p-0.5 bg-stone-100 border border-stone-200">
                      <button
                        type="button"
                        onClick={() => handleSetSoldOut(item.id, false)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                          !item.isSoldOut
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 mr-1" />
                        판매중
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSetSoldOut(item.id, true)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                          item.isSoldOut
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3 mr-0.5" />
                        품절 (주문 불가)
                      </button>
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        item.isSoldOut ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      {item.isSoldOut ? '🔴 품절 처리됨' : '🟢 정상 판매중'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2.5 flex-wrap gap-y-1 self-end sm:self-auto text-xs">
                    <label className="flex items-center space-x-1.5 cursor-pointer text-stone-700 hover:text-red-700">
                      <input
                        type="checkbox"
                        checked={!!item.isBest}
                        onChange={(e) => handleToggleBest(item.id, e.target.checked)}
                        className="rounded text-red-600 focus:ring-red-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="font-extrabold flex items-center space-x-1">
                        <span className="text-[9px] bg-red-600 text-white px-1 py-0.2 rounded font-black">BEST</span>
                        <span>뱃지</span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-1.5 cursor-pointer text-stone-700 hover:text-amber-800">
                      <input
                        type="checkbox"
                        checked={!!item.isRec}
                        onChange={(e) => handleToggleRec(item.id, e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="font-extrabold flex items-center space-x-1">
                        <span className="text-[9px] bg-amber-500 text-white px-1 py-0.2 rounded font-black">추천</span>
                        <span>뱃지</span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-1.5 text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isVisible}
                        onChange={(e) => handleToggleVisibility(item.id, e.target.checked)}
                        className="rounded text-brand-terracotta focus:ring-brand-terracotta h-3.5 w-3.5 cursor-pointer"
                      />
                      <span className="font-semibold">손님 노출</span>
                    </label>
                  </div>
                </div>

                {/* 메뉴 복제 및 삭제 도구 */}
                <div className="pt-2 border-t border-dashed border-stone-200 flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1 text-[10px] text-stone-400">
                    <span className="font-mono">#{item.id.replace('item-', '')}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicateMenu(item)}
                      title="이 메뉴를 복제하여 새 메뉴 생성"
                      className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg active:scale-95 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3 text-stone-500" />
                      <span>복제</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuToDelete(item)}
                      title="메뉴 삭제"
                      className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-200/60 active:scale-95 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                      <span>삭제</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Empty State when no menu matched */}
          {filteredMenus.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-8 border border-brand-border text-center space-y-3 shadow-card">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-dark">해당 카테고리에 등록된 메뉴가 없습니다.</p>
                <p className="text-xs text-stone-400 mt-0.5">새로운 메뉴를 등록하여 손님 메뉴판에 올려보세요.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="py-2 px-4 bg-brand-terracotta hover:bg-brand-terracottaHover text-white font-extrabold text-xs rounded-xl shadow-xs inline-flex items-center space-x-1.5 active:scale-95 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ 새 메뉴 추가하기</span>
              </button>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* App Version & Auto-update Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-extrabold text-stone-900 text-xs sm:text-sm">
                  한양도시락 앱 설치 &amp; 실시간 자동 업데이트
                </h3>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  OTA 실시간 자동동기화 ON
                </span>
              </div>
              <p className="text-[11px] text-stone-600 mt-0.5">
                스마트폰에 1회만 APK를 설치해 두시면, 향후 컴파일 시 자동으로 최신 화면이 동기화됩니다.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white border border-amber-200 text-stone-800 font-extrabold text-xs shrink-0">
            v{installedVersion}
          </span>
        </div>

        <div className="bg-white/80 rounded-xl p-2.5 border border-amber-200/70 text-xs text-stone-700 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-stone-900 text-[11px]">
            <span>✨ 1회 APK 설치 보장 안내:</span>
          </div>
          <p className="text-[11px] text-stone-600 leading-relaxed">
            고객이나 점주 스마트폰에 APK를 <strong>최초 1회만 설치</strong>해 두면, 메뉴나 가격 변경 및 새 기능 컴파일 시 <strong>앱을 재설치하지 않아도 자동으로 실시간 최신 버전으로 갱신</strong>됩니다. 통신 장애 시에도 오프라인 안전 모드로 정상 작동합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 text-xs">
          <div className="text-[11px] text-stone-600">
            💡 코드 컴파일 즉시 라이브 웹과 설치된 앱(APK)에 동시 반영
          </div>
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {onOpenInstallModal && (
              <button
                type="button"
                onClick={onOpenInstallModal}
                className="py-1.5 px-3 bg-brand-terracotta hover:bg-brand-terracottaHover text-white font-bold rounded-lg shadow-xs active:scale-95 transition flex items-center space-x-1.5 cursor-pointer text-xs"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>1회 APK 설치 / 홈화면 추가</span>
              </button>
            )}
            {onCheckUpdate && (
              <button
                type="button"
                onClick={onCheckUpdate}
                disabled={isCheckingUpdate}
                className="py-1.5 px-3 min-w-[135px] bg-white hover:bg-amber-100/80 border border-amber-300 text-brand-dark font-bold rounded-lg shadow-xs active:scale-95 transition flex items-center justify-center space-x-1.5 cursor-pointer text-xs disabled:opacity-75"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-brand-terracotta shrink-0 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                <span className="whitespace-nowrap">{isCheckingUpdate ? '확인 중...' : '최신 업데이트 검사'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Bottom Save Floating Bar */}
      <div className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border px-3 sm:px-5 md:px-8 py-3 shadow-lg flex items-center">
        <button
          type="button"
          disabled={isSaving}
          onClick={async () => {
            if (onSave) {
              await onSave();
            }
            onCloseAdmin();
          }}
          className="w-full py-3 px-4 rounded-xl bg-brand-terracotta hover:bg-brand-terracottaHover text-white font-extrabold text-sm sm:text-base shadow-float active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
        >
          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>{isSaving ? '저장 중...' : '변경사항 저장하고 메뉴판 보기'}</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {menuToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMenuToDelete(null);
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-brand-border animate-in zoom-in-95 duration-200 space-y-3.5">
            <div className="flex items-center space-x-2.5 text-red-600">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                메뉴를 삭제하시겠습니까?
              </h3>
            </div>
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
              <p className="text-xs font-bold text-brand-dark truncate">
                {menuToDelete.name}
              </p>
              <p className="text-[11px] text-stone-500">
                판매가: {menuToDelete.price.toLocaleString('ko-KR')}원 | 카테고리: {menuToDelete.category.join(', ')}
              </p>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              삭제하시면 손님 메뉴판 및 관리자 목록에서 즉시 제거됩니다.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setMenuToDelete(null)}
                className="py-2 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs transition active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제하기</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal (전체 카테고리 추가, 이름 수정, 순서 정렬, 삭제) */}
      <CategoryManageModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        menus={menus}
        onAddCategory={onAddCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
        onReorderCategories={onReorderCategories}
        onResetCategories={onResetCategories}
        onToast={onToast}
      />

      {/* Add Menu Modal */}
      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMenu={onAddMenu}
        onToast={onToast}
        availableCategories={categories}
      />

      {/* Real Data Synchronization Modal */}
      {isSyncModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsSyncModalOpen(false);
          }}
        >
          <div className="w-full max-w-md bg-brand-cream rounded-3xl p-5 sm:p-6 shadow-2xl border border-brand-border space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-brand-sand border border-brand-border flex items-center justify-center text-brand-terracotta">
                  <RotateCw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-brand-dark text-sm sm:text-base">
                    모든 기기 실시간 동기화 &amp; 데이터 관리
                  </h3>
                  <p className="text-[10px] sm:text-xs text-brand-muted">
                    스마트폰, 태블릿, PC 등 모든 기기간 실시간 메뉴 동기화 및 백업
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-full text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Option 0: Server Data Force Sync (Emergency Lossless Reconcile) */}
              <div className="p-3.5 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 rounded-2xl border-2 border-amber-500 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span className="font-black text-amber-950 text-xs sm:text-sm">
                      ⚡ 서버 데이터 강제 동기화 (로컬 ↔ 서버 강제 비교·병합)
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold text-white bg-amber-600 px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                    동기화 꼬임 즉시 해결
                  </span>
                </div>
                <p className="text-[11px] text-amber-950 font-medium leading-relaxed">
                  스마트폰, 태블릿, PC 기기간 메뉴가 다르거나 동기화가 꼬였을 때 사용하는 <strong>점주 전용 강제 동기화</strong> 기능입니다.
                  서버의 데이터와 현재 기기(로컬)의 메뉴·카테고리·상세설명·가격을 누락 없이 상호 대조하고 완벽히 병합하여 모든 기기에 즉시 강제 전송합니다.
                </p>
                <button
                  type="button"
                  disabled={isForceSyncing}
                  onClick={() => {
                    setIsSyncModalOpen(false);
                    if (onForceSync) {
                      onForceSync();
                    } else if (onSyncToLatestData) {
                      onSyncToLatestData('forceReconcile');
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-60 text-white font-black text-xs shadow-sm active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer ring-1 ring-amber-400"
                >
                  <Zap className={`w-3.5 h-3.5 ${isForceSyncing ? 'animate-spin' : 'fill-amber-200 text-amber-100'}`} />
                  <span>{isForceSyncing ? '서버와 로컬 데이터 강제 병합 중...' : '⚡ 지금 서버 데이터 강제 동기화 실행 (모든 기기 즉시 적용)'}</span>
                </button>
              </div>

              {/* Option 1: Real-time Multi-device Sync (Saves to server & notifies all devices) */}
              <div className="p-3.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 rounded-2xl border border-amber-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-brand-dark text-xs sm:text-sm">
                      ☁️ 모든 기기 실시간 100% 동기화
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-white bg-amber-600 px-1.5 py-0.2 rounded shadow-xs">
                    강력 추천
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  현재 등록/수정한 모든 메뉴({menus.length}개), 카테고리, 업로드한 사진을 서버에 100% 영구 저장하고, 접속 중인 스마트폰, 태블릿, PC에 실시간으로 즉시 반영합니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSyncModalOpen(false);
                    if (onSyncToLatestData) {
                      onSyncToLatestData('syncToServer');
                    } else if (onSave) {
                      onSave();
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>☁️ 지금 모든 기기에 100% 실시간 동기화하기</span>
                </button>
              </div>

              {/* Option 2: Pull latest from server */}
              <div className="p-3.5 bg-white rounded-2xl border border-brand-border space-y-2">
                <span className="font-extrabold text-brand-dark text-xs sm:text-sm block">
                  🔄 서버 최신 데이터 불러오기
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  다른 기기(스마트폰/태블릿/PC)에서 등록하거나 수정한 메뉴나 카테고리가 있다면, 서버에서 최신 상태를 즉시 가져와 반영합니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSyncModalOpen(false);
                    if (onSyncToLatestData) {
                      onSyncToLatestData('fetchFromServer');
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-200 active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>서버 최신 데이터로 새로고침</span>
                </button>
              </div>

              {/* Option 3: Refresh Photos Only */}
              <div className="p-3.5 bg-white rounded-2xl border border-brand-border space-y-2">
                <span className="font-extrabold text-brand-dark text-xs sm:text-sm block">
                  🖼️ 기존 메뉴 유지 + 기본 샘플 사진 고화질 갱신
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  현재 관리자 콘솔에서 직접 수정한 메뉴 이름이나 가격은 그대로 유지하면서, 사진만 최신 원본 고화질 이미지로 일괄 갱신합니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSyncModalOpen(false);
                    if (onSyncToLatestData) {
                      onSyncToLatestData('refreshImages');
                    } else {
                      onToast('사진 동기화 완료');
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-200 active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>사진만 최신 이미지로 일괄 갱신</span>
                </button>
              </div>

              {/* Option 4: Backup & Restore Data */}
              <div className="p-3.5 bg-white rounded-2xl border border-brand-border space-y-2">
                <span className="font-extrabold text-brand-dark text-xs sm:text-sm block">
                  💾 점주 데이터 안전 백업 및 복원 (JSON 파일)
                </span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  현재 등록/수정한 모든 메뉴, 업로드한 사진, 카테고리, 영업 상태를 PC 또는 스마트폰 파일로 영구 백업하거나 언제든 복원할 수 있습니다.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onExportBackup) onExportBackup();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-extrabold text-xs active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>백업 파일 받기</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSyncModalOpen(false);
                      backupInputRef.current?.click();
                    }}
                    className="py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>백업 복원하기</span>
                  </button>
                </div>
              </div>

              {/* Option 5: Danger Zone - Factory Reset with Double Confirmation */}
              <div className="p-3 bg-red-50/70 rounded-2xl border border-red-200 space-y-2">
                <div className="flex items-center space-x-1 text-red-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span className="font-extrabold text-xs">
                    ⚠️ 앱 초기 상태로 되돌리기 (공장 초기화)
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-red-700 leading-relaxed">
                  ※ 주의: 직접 추가한 메뉴, 카테고리, 등록한 사진이 모두 삭제되고 앱 최초 설치 기본 메뉴로 되돌아갑니다.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSyncModalOpen(false);
                    if (onSyncToLatestData) {
                      onSyncToLatestData('factoryReset');
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>초기 기본 데이터로 되돌리기 (주의)</span>
                </button>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="py-2 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

