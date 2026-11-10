import React, { useState, useMemo, useRef } from 'react';
import { MenuItem } from '../types';
import { stripFormatting } from '../utils/textFormatter';
import {
  Coins,
  Search,
  Check,
  Undo2,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertCircle,
  X,
  Layers,
  CheckCircle2,
  RefreshCw,
  Tag,
} from 'lucide-react';

interface BatchPriceEditorProps {
  menus: MenuItem[];
  categories: string[];
  onUpdateMenu: (updated: MenuItem) => void;
  onReorderMenus?: (newMenus: MenuItem[]) => void;
  onClose: () => void;
  onSave?: () => Promise<void> | void;
  isSaving?: boolean;
  onToast: (msg: string) => void;
  onCloseAdmin?: () => void;
}

export const BatchPriceEditor: React.FC<BatchPriceEditorProps> = ({
  menus,
  categories,
  onUpdateMenu,
  onReorderMenus,
  onClose,
  onSave,
  isSaving = false,
  onToast,
  onCloseAdmin,
}) => {
  // Snapshot of original prices when the batch editor was opened
  const initialPricesRef = useRef<Record<string, number>>({});
  if (Object.keys(initialPricesRef.current).length === 0) {
    menus.forEach((m) => {
      initialPricesRef.current[m.id] = m.price;
    });
  }

  // Working prices state for real-time reactive editing
  const [workingPrices, setWorkingPrices] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    menus.forEach((m) => {
      init[m.id] = m.price;
    });
    return init;
  });

  // Sold out overrides
  const [workingSoldOut, setWorkingSoldOut] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    menus.forEach((m) => {
      init[m.id] = Boolean(m.isSoldOut);
    });
    return init;
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyModified, setShowOnlyModified] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc' | 'name' | 'diff'>('default');

  // Bulk adjustment toolbar state
  const [showBatchTools, setShowBatchTools] = useState(false);
  const [customDeltaAmount, setCustomDeltaAmount] = useState<string>('1000');

  // Count modified items
  const modifiedItems = useMemo(() => {
    return menus.filter((m) => {
      const origPrice = initialPricesRef.current[m.id] ?? m.price;
      const currentPrice = workingPrices[m.id] ?? m.price;
      const origSoldOut = Boolean(m.isSoldOut);
      const currentSoldOut = workingSoldOut[m.id] ?? origSoldOut;
      return origPrice !== currentPrice || origSoldOut !== currentSoldOut;
    });
  }, [menus, workingPrices, workingSoldOut]);

  const modifiedCount = modifiedItems.length;

  // Filtered and sorted menus
  const displayedMenus = useMemo(() => {
    let result = [...menus];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((m) => {
        const plainName = stripFormatting(m.name).toLowerCase();
        const catMatch = m.category.some((c) => c.toLowerCase().includes(q));
        return plainName.includes(q) || catMatch;
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((m) => m.category.includes(selectedCategory));
    }

    // Filter by modified only
    if (showOnlyModified) {
      result = result.filter((m) => {
        const origPrice = initialPricesRef.current[m.id] ?? m.price;
        const currentPrice = workingPrices[m.id] ?? m.price;
        const origSoldOut = Boolean(m.isSoldOut);
        const currentSoldOut = workingSoldOut[m.id] ?? origSoldOut;
        return origPrice !== currentPrice || origSoldOut !== currentSoldOut;
      });
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      result.sort((a, b) => (workingPrices[a.id] ?? a.price) - (workingPrices[b.id] ?? b.price));
    } else if (sortBy === 'priceDesc') {
      result.sort((a, b) => (workingPrices[b.id] ?? b.price) - (workingPrices[a.id] ?? a.price));
    } else if (sortBy === 'name') {
      result.sort((a, b) => stripFormatting(a.name).localeCompare(stripFormatting(b.name), 'ko-KR'));
    } else if (sortBy === 'diff') {
      result.sort((a, b) => {
        const diffA = Math.abs((workingPrices[a.id] ?? a.price) - (initialPricesRef.current[a.id] ?? a.price));
        const diffB = Math.abs((workingPrices[b.id] ?? b.price) - (initialPricesRef.current[b.id] ?? b.price));
        return diffB - diffA;
      });
    }

    return result;
  }, [menus, searchQuery, selectedCategory, showOnlyModified, sortBy, workingPrices, workingSoldOut]);

  // Handle single price change
  const handleSinglePriceChange = (id: string, rawVal: string) => {
    const num = parseInt(rawVal.replace(/[^0-9]/g, ''), 10) || 0;
    setWorkingPrices((prev) => ({
      ...prev,
      [id]: num,
    }));
  };

  // Handle step delta (+1,000, -500, etc.)
  const handleStepPrice = (id: string, delta: number) => {
    setWorkingPrices((prev) => {
      const current = prev[id] ?? 0;
      const next = Math.max(0, current + delta);
      return {
        ...prev,
        [id]: next,
      };
    });
  };

  // Revert single item to original price
  const handleRevertSingle = (id: string) => {
    const orig = initialPricesRef.current[id];
    const origItem = menus.find((m) => m.id === id);
    if (typeof orig === 'number') {
      setWorkingPrices((prev) => ({
        ...prev,
        [id]: orig,
      }));
    }
    if (origItem) {
      setWorkingSoldOut((prev) => ({
        ...prev,
        [id]: Boolean(origItem.isSoldOut),
      }));
    }
  };

  // Toggle sold out
  const handleToggleSoldOut = (id: string) => {
    setWorkingSoldOut((prev) => {
      const current = prev[id] ?? false;
      return {
        ...prev,
        [id]: !current,
      };
    });
  };

  // Bulk Apply delta to currently displayed menus
  const handleApplyBatchDelta = (delta: number) => {
    if (displayedMenus.length === 0) {
      onToast('적용할 대상 메뉴가 없습니다.');
      return;
    }
    setWorkingPrices((prev) => {
      const updated = { ...prev };
      displayedMenus.forEach((m) => {
        const current = updated[m.id] ?? m.price;
        updated[m.id] = Math.max(0, current + delta);
      });
      return updated;
    });
    onToast(`현재 목록의 ${displayedMenus.length}개 메뉴 가격에 ${delta > 0 ? `+${delta.toLocaleString()}원` : `${delta.toLocaleString()}원`}이 적용되었습니다.`);
  };

  // Bulk Apply percentage change (e.g. +10%, -10% rounded to 100 won)
  const handleApplyBatchPercent = (percent: number) => {
    if (displayedMenus.length === 0) {
      onToast('적용할 대상 메뉴가 없습니다.');
      return;
    }
    setWorkingPrices((prev) => {
      const updated = { ...prev };
      displayedMenus.forEach((m) => {
        const current = updated[m.id] ?? m.price;
        const newPrice = Math.max(0, Math.round((current * (1 + percent / 100)) / 100) * 100);
        updated[m.id] = newPrice;
      });
      return updated;
    });
    onToast(`현재 목록의 ${displayedMenus.length}개 메뉴 가격에 ${percent > 0 ? `+${percent}%` : `${percent}%`}가 적용되었습니다.`);
  };

  // Revert all to original
  const handleRevertAll = () => {
    if (modifiedCount === 0) {
      onToast('수정된 가격 내역이 없습니다.');
      return;
    }
    if (window.confirm('수정한 모든 가격을 원래 상태로 되돌리시겠습니까?')) {
      const revertedPrices: Record<string, number> = {};
      const revertedSoldOut: Record<string, boolean> = {};
      menus.forEach((m) => {
        revertedPrices[m.id] = initialPricesRef.current[m.id] ?? m.price;
        revertedSoldOut[m.id] = Boolean(m.isSoldOut);
      });
      setWorkingPrices(revertedPrices);
      setWorkingSoldOut(revertedSoldOut);
      onToast('모든 메뉴 가격이 원래대로 복구되었습니다.');
    }
  };

  // Apply all changes to state and persist
  const handleSaveAndApply = async (exitToCustomerView: boolean = false) => {
    // 1. Build updated menus array
    const updatedMenus: MenuItem[] = menus.map((m) => {
      const newPrice = workingPrices[m.id] !== undefined ? workingPrices[m.id] : m.price;
      const newSoldOut = workingSoldOut[m.id] !== undefined ? workingSoldOut[m.id] : Boolean(m.isSoldOut);
      return {
        ...m,
        price: newPrice,
        isSoldOut: newSoldOut,
      };
    });

    // 2. Dispatch updates
    if (onReorderMenus) {
      onReorderMenus(updatedMenus);
    } else {
      updatedMenus.forEach((m) => onUpdateMenu(m));
    }

    // 3. Update snapshot so diff clears
    updatedMenus.forEach((m) => {
      initialPricesRef.current[m.id] = m.price;
    });

    // 4. Save to DB & server if onSave provided
    if (onSave) {
      await onSave();
    }

    onToast(`총 ${modifiedCount > 0 ? modifiedCount : '모든'}개 메뉴 가격 변경사항이 성공적으로 저장되었습니다!`);

    if (exitToCustomerView && onCloseAdmin) {
      onCloseAdmin();
    } else if (exitToCustomerView) {
      onClose();
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-400 shadow-xl overflow-hidden mb-8 transition-all animate-in fade-in duration-200">
      {/* Top Banner / Mode Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 text-white p-3.5 sm:p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <Coins className="w-5 h-5 text-amber-100" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                전체 메뉴 가격 일괄 편집 모드
              </h2>
              <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                빠른 수정 전용
              </span>
              {modifiedCount > 0 && (
                <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs animate-pulse">
                  {modifiedCount}개 메뉴 수정됨
                </span>
              )}
            </div>
            <p className="text-xs text-amber-100/90 mt-0.5">
              모든 메뉴의 가격을 한 번에 리스트 형태로 확인하고, 키보드 입력 또는 증감 버튼으로 초고속 수정할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowBatchTools((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs border ${
              showBatchTools
                ? 'bg-white text-amber-900 border-white'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/30'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>일괄 인상/인하 도구 {showBatchTools ? '접기' : '열기'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 text-white text-xs font-bold transition flex items-center space-x-1 cursor-pointer border border-white/20"
          >
            <X className="w-3.5 h-3.5" />
            <span>일반 카드 모드로 닫기</span>
          </button>
        </div>
      </div>

      {/* Expandable Batch Tools Toolbar */}
      {showBatchTools && (
        <div className="bg-amber-50/90 border-b border-amber-200 p-3 sm:p-4 animate-in slide-in-from-top-2 duration-150 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-xs font-extrabold text-amber-950">
                조회된 {displayedMenus.length}개 메뉴 가격 일괄 조정:
              </span>
            </div>
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
              <button
                type="button"
                onClick={() => handleApplyBatchDelta(1000)}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                +1,000원 일괄 인상
              </button>
              <button
                type="button"
                onClick={() => handleApplyBatchDelta(500)}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                +500원 일괄 인상
              </button>
              <button
                type="button"
                onClick={() => handleApplyBatchDelta(-500)}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                -500원 일괄 인하
              </button>
              <button
                type="button"
                onClick={() => handleApplyBatchDelta(-1000)}
                className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                -1,000원 일괄 인하
              </button>
              <button
                type="button"
                onClick={() => handleApplyBatchPercent(10)}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 rounded-lg text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                +10% 인상
              </button>
              <button
                type="button"
                onClick={() => handleApplyBatchPercent(-10)}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg text-xs font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                -10% 인하
              </button>
            </div>
          </div>

          {/* Custom Delta Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-amber-200/70 text-xs">
            <div className="flex items-center space-x-2">
              <span className="text-stone-600 font-bold shrink-0">직접 금액 입력:</span>
              <div className="relative inline-flex items-center">
                <input
                  type="text"
                  inputMode="numeric"
                  value={customDeltaAmount}
                  onChange={(e) => setCustomDeltaAmount(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="예: 2000"
                  className="w-24 px-2 py-1 bg-white border border-amber-300 rounded-lg text-right font-extrabold text-stone-800 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <span className="ml-1 text-stone-600 font-bold">원</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const num = parseInt(customDeltaAmount, 10);
                  if (num > 0) handleApplyBatchDelta(num);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                더하기 (+)
              </button>
              <button
                type="button"
                onClick={() => {
                  const num = parseInt(customDeltaAmount, 10);
                  if (num > 0) handleApplyBatchDelta(-num);
                }}
                className="px-2.5 py-1 bg-stone-700 hover:bg-stone-800 text-white rounded-lg font-bold shadow-2xs transition active:scale-95 cursor-pointer"
              >
                빼기 (-)
              </button>
            </div>

            {modifiedCount > 0 && (
              <button
                type="button"
                onClick={handleRevertAll}
                className="text-stone-600 hover:text-red-600 font-bold underline transition flex items-center space-x-1 cursor-pointer self-end sm:self-auto"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>모든 수정 취소 (원래 가격 복구)</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter & Controls Bar */}
      <div className="p-3 sm:p-4 bg-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="메뉴명 검색..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown/Chips */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              전체 ({menus.length})
            </button>
            {categories.map((cat) => {
              const count = menus.filter((m) => m.category.includes(cat)).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* View toggles & Sort */}
        <div className="flex items-center space-x-2 shrink-0 flex-wrap">
          <label className="flex items-center space-x-1.5 text-xs font-bold text-stone-700 cursor-pointer bg-white px-2.5 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
            <input
              type="checkbox"
              checked={showOnlyModified}
              onChange={(e) => setShowOnlyModified(e.target.checked)}
              className="accent-amber-600 w-3.5 h-3.5 rounded"
            />
            <span>수정된 메뉴만 보기 ({modifiedCount})</span>
          </label>

          <div className="relative inline-flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs"
            >
              <option value="default">기본 순서</option>
              <option value="priceAsc">가격 낮은순</option>
              <option value="priceDesc">가격 높은순</option>
              <option value="name">가나다순</option>
              <option value="diff">가격 변동 큰 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-100/90 text-stone-600 font-extrabold border-b border-stone-200 select-none">
              <th className="py-2.5 px-3 w-12 text-center">번호</th>
              <th className="py-2.5 px-3 w-14 text-center">사진</th>
              <th className="py-2.5 px-3 min-w-[160px]">메뉴명 &amp; 카테고리</th>
              <th className="py-2.5 px-2.5 w-24 text-center">판매 상태</th>
              <th className="py-2.5 px-3 w-28 text-right">기존 판매가</th>
              <th className="py-2.5 px-3 min-w-[280px]">수정할 판매가 (원)</th>
              <th className="py-2.5 px-3 w-28 text-center">변동 금액</th>
              <th className="py-2.5 px-2.5 w-16 text-center">원복</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {displayedMenus.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-stone-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-stone-400" />
                  <p className="font-bold">조건에 맞는 메뉴가 없습니다.</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">검색어나 카테고리 필터를 변경해 보세요.</p>
                </td>
              </tr>
            ) : (
              displayedMenus.map((item, idx) => {
                const originalPrice = initialPricesRef.current[item.id] ?? item.price;
                const currentPrice = workingPrices[item.id] ?? item.price;
                const isSoldOut = workingSoldOut[item.id] ?? Boolean(item.isSoldOut);
                const priceDiff = currentPrice - originalPrice;
                const percentDiff = originalPrice > 0 ? Math.round((priceDiff / originalPrice) * 100) : 0;
                const isModified = priceDiff !== 0 || isSoldOut !== Boolean(item.isSoldOut);

                return (
                  <tr
                    key={item.id}
                    className={`transition-colors hover:bg-amber-50/40 ${
                      isModified ? 'bg-amber-50/60 font-medium' : isSoldOut ? 'bg-red-50/20' : 'bg-white'
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center text-stone-400 font-bold">
                      {idx + 1}
                    </td>

                    {/* Small Thumbnail */}
                    <td className="py-2 px-3 text-center">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 mx-auto shrink-0 relative">
                        {item.img && item.img.trim() ? (
                          <img
                            src={item.img}
                            alt={item.name}
                            className={`w-full h-full object-cover ${isSoldOut ? 'grayscale contrast-75' : ''}`}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                            사진
                          </div>
                        )}
                        {item.isBest && (
                          <span className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black px-1 rounded-bl">
                            ★
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Menu Name, Categories & Highlight Tag */}
                    <td className="py-2.5 px-3">
                      <div className="font-extrabold text-stone-900 text-xs sm:text-sm truncate max-w-xs flex items-center gap-1.5 flex-wrap">
                        <span>{stripFormatting(item.name)}</span>
                        {item.tag && (
                          <span className="bg-brand-terracotta text-white text-[9px] font-black px-1.5 py-0.2 rounded shadow-2xs inline-flex items-center gap-0.5">
                            <Tag className="w-2.5 h-2.5" />
                            <span>#{item.tag}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                        {item.category.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-semibold bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded border border-stone-200"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Sold out toggle */}
                    <td className="py-2.5 px-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleSoldOut(item.id)}
                        className={`px-2 py-1 rounded-md text-[11px] font-extrabold transition cursor-pointer shadow-2xs whitespace-nowrap active:scale-95 ${
                          isSoldOut
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                        }`}
                        title="클릭하여 판매중/품절 상태 전환"
                      >
                        {isSoldOut ? '품절' : '판매중'}
                      </button>
                    </td>

                    {/* Original Price */}
                    <td className="py-2.5 px-3 text-right font-bold text-stone-500 whitespace-nowrap">
                      {originalPrice.toLocaleString('ko-KR')}원
                    </td>

                    {/* Editable Price Field + Step Delta Buttons */}
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        {/* Direct Price Input */}
                        <div className="relative inline-flex items-center">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={currentPrice.toLocaleString('ko-KR')}
                            onChange={(e) => handleSinglePriceChange(item.id, e.target.value)}
                            className={`w-28 text-right font-black text-sm px-2 py-1.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs transition ${
                              isModified
                                ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-extrabold'
                                : 'bg-white text-stone-900 border-stone-300'
                            }`}
                          />
                          <span className="ml-1 text-stone-600 font-bold text-xs">원</span>
                        </div>

                        {/* Step delta quick buttons */}
                        <div className="inline-flex rounded-lg border border-stone-200 bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleStepPrice(item.id, -1000)}
                            className="px-1.5 py-1 hover:bg-stone-100 text-stone-600 text-[10px] font-bold border-r border-stone-200 transition active:scale-90"
                            title="1,000원 인하"
                          >
                            -1천
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepPrice(item.id, -500)}
                            className="px-1.5 py-1 hover:bg-stone-100 text-stone-600 text-[10px] font-bold border-r border-stone-200 transition active:scale-90"
                            title="500원 인하"
                          >
                            -500
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepPrice(item.id, 500)}
                            className="px-1.5 py-1 hover:bg-amber-100 text-amber-800 text-[10px] font-bold border-r border-stone-200 transition active:scale-90"
                            title="500원 인상"
                          >
                            +500
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStepPrice(item.id, 1000)}
                            className="px-1.5 py-1 hover:bg-amber-100 text-amber-800 text-[10px] font-bold transition active:scale-90"
                            title="1,000원 인상"
                          >
                            +1천
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Price Diff Indicator */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {priceDiff === 0 ? (
                        <span className="text-stone-400 font-bold text-[11px]">- 동일 -</span>
                      ) : priceDiff > 0 ? (
                        <span className="inline-flex items-center space-x-0.5 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-black text-[11px] border border-emerald-200">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span>+{priceDiff.toLocaleString()}원 (+{percentDiff}%)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-0.5 text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-black text-[11px] border border-red-200">
                          <TrendingDown className="w-3 h-3 text-red-600" />
                          <span>{priceDiff.toLocaleString()}원 ({percentDiff}%)</span>
                        </span>
                      )}
                    </td>

                    {/* Revert Single Item Button */}
                    <td className="py-2.5 px-2.5 text-center">
                      {isModified ? (
                        <button
                          type="button"
                          onClick={() => handleRevertSingle(item.id)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-800 border border-stone-300 flex items-center justify-center transition active:scale-90 shadow-2xs mx-auto cursor-pointer"
                          title="이 메뉴를 원래 가격으로 되돌리기"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-stone-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Sticky Bottom Save Action Bar inside Batch Mode */}
      <div className="bg-stone-900 text-white p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-amber-500 shadow-2xl">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-stone-400">총 대상:</span>
            <span className="font-extrabold text-amber-400">{menus.length}개 메뉴</span>
          </div>
          <span className="text-stone-600">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-stone-400">가격 변경된 메뉴:</span>
            <span
              className={`font-black px-2 py-0.5 rounded-full text-xs ${
                modifiedCount > 0
                  ? 'bg-amber-500 text-stone-950 font-black animate-pulse'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              {modifiedCount}개
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none py-2.5 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition cursor-pointer border border-stone-700 active:scale-95"
          >
            취소 / 일반 모드 복귀
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleSaveAndApply(false)}
            className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-black transition cursor-pointer shadow-lg active:scale-95 flex items-center justify-center space-x-1.5 disabled:opacity-60"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>
              {isSaving
                ? '저장 중...'
                : modifiedCount > 0
                ? `수정된 ${modifiedCount}건 가격 일괄 저장`
                : '가격 변경사항 즉시 저장'}
            </span>
          </button>

          {onCloseAdmin && (
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveAndApply(true)}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-brand-terracotta hover:bg-brand-terracottaHover text-white text-xs sm:text-sm font-black transition cursor-pointer shadow-lg active:scale-95 flex items-center justify-center space-x-1.5 disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>저장하고 손님 메뉴판 보기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
