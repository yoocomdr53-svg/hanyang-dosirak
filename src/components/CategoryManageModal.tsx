import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Layers,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { MenuItem } from '../types';

interface CategoryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  menus: MenuItem[];
  onAddCategory: (newCategory: string) => void;
  onUpdateCategory: (oldCategory: string, newCategory: string) => void;
  onDeleteCategory: (categoryToDelete: string) => void;
  onReorderCategories: (newCategories: string[]) => void;
  onResetCategories: () => void;
  onToast: (msg: string) => void;
}

const CATEGORY_SUGGESTIONS = [
  '신메뉴',
  '인기메뉴',
  '스페셜',
  '사이드',
  '음료/주류',
  '샐러드',
  '디저트',
  '어린이',
];

export const CategoryManageModal: React.FC<CategoryManageModalProps> = ({
  isOpen,
  onClose,
  categories,
  menus,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onReorderCategories,
  onResetCategories,
  onToast,
}) => {
  const [newCatInput, setNewCatInput] = useState('');
  const [editingCat, setEditingCat] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [deletingCat, setDeletingCat] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle adding category
  const handleAdd = (nameToAdd?: string) => {
    const target = (nameToAdd || newCatInput).trim();
    if (!target) {
      onToast('추가할 카테고리명을 입력해주세요.');
      return;
    }

    if (categories.some((c) => c.toLowerCase() === target.toLowerCase())) {
      onToast(`'${target}' 카테고리는 이미 존재합니다.`);
      return;
    }

    onAddCategory(target);
    setNewCatInput('');
  };

  // Start inline editing
  const handleStartEdit = (cat: string) => {
    setEditingCat(cat);
    setEditingValue(cat);
  };

  // Submit edit
  const handleSaveEdit = (oldCat: string) => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      onToast('카테고리명은 비워둘 수 없습니다.');
      return;
    }

    if (trimmed !== oldCat && categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      onToast(`'${trimmed}' 카테고리는 이미 존재합니다.`);
      return;
    }

    onUpdateCategory(oldCat, trimmed);
    setEditingCat(null);
  };

  // Reorder up / down
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onReorderCategories(updated);
  };

  // Confirm delete
  const handleConfirmDelete = (cat: string) => {
    if (categories.length <= 1) {
      onToast('최소 1개 이상의 카테고리가 유지되어야 합니다.');
      return;
    }
    onDeleteCategory(cat);
    setDeletingCat(null);
  };

  // Count how many menus belong to each category
  const getMenuCountForCategory = (cat: string) => {
    return menus.filter((m) => m.category.includes(cat)).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-brand-cream via-amber-50 to-orange-50 border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-terracotta text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-brand-dark tracking-tight">
                전체 카테고리 관리
              </h2>
              <p className="text-[11px] text-brand-muted">
                손님 메뉴판 카테고리 추가, 이름 수정, 순서 정렬 및 삭제
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-stone-200 hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* 1. Add New Category */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 space-y-2">
            <label className="block text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-amber-700" />
              <span>새 카테고리 추가</span>
            </label>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                placeholder="새 카테고리명 입력 (예: 신메뉴, 사이드, 음료)"
                className="flex-1 bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-stone-800 placeholder:font-normal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              />
              <button
                type="button"
                onClick={() => handleAdd()}
                disabled={!newCatInput.trim()}
                className="px-4 py-2 bg-brand-terracotta hover:bg-brand-terracottaHover disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition active:scale-95 cursor-pointer shrink-0 flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>추가</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="pt-1">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] text-amber-800/80 font-bold shrink-0">추천 예시:</span>
                {CATEGORY_SUGGESTIONS.filter((s) => !categories.includes(s)).slice(0, 5).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAdd(s)}
                    className="text-[10px] bg-white hover:bg-amber-100 text-stone-700 hover:text-amber-900 border border-amber-200 rounded-md px-2 py-0.5 font-medium transition cursor-pointer active:scale-95 flex items-center space-x-0.5"
                  >
                    <span>+ {s}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Current Category List with Edit/Delete/Reorder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-brand-dark flex items-center gap-1.5">
                <span>등록된 카테고리 목록 ({categories.length}개)</span>
              </span>
              <span className="text-[10px] text-stone-400">
                위/아래 화살표로 손님 화면 노출 순서 변경
              </span>
            </div>

            <div className="space-y-1.5 border border-stone-200 rounded-xl p-2 bg-stone-50/50 max-h-[320px] overflow-y-auto">
              {categories.map((cat, idx) => {
                const count = getMenuCountForCategory(cat);
                const isEditing = editingCat === cat;

                return (
                  <div
                    key={cat}
                    className={`flex items-center justify-between p-2 rounded-xl border transition ${
                      isEditing
                        ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-300'
                        : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    {/* Left: Reorder and Info */}
                    <div className="flex items-center space-x-2 flex-1 min-w-0 mr-2">
                      {/* Reorder Buttons */}
                      <div className="flex items-center space-x-0.5 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          title="한 칸 위로 이동"
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-20 text-stone-600 flex items-center justify-center transition cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === categories.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          title="한 칸 아래로 이동"
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-20 text-stone-600 flex items-center justify-center transition cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Number badge */}
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>

                      {/* Category Name or Inline Editor */}
                      {isEditing ? (
                        <div className="flex items-center space-x-1.5 flex-1 min-w-0">
                          <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(cat);
                              if (e.key === 'Escape') setEditingCat(null);
                            }}
                            autoFocus
                            className="flex-1 bg-white border border-amber-400 rounded-lg px-2 py-1 text-xs font-extrabold text-stone-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(cat)}
                            title="변경사항 저장"
                            className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer shrink-0"
                          >
                            <Check className="w-3.5 h-3.5 inline mr-0.5" />
                            <span>저장</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCat(null)}
                            title="취소"
                            className="px-2 py-1 rounded bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium transition cursor-pointer shrink-0"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className="text-xs sm:text-sm font-extrabold text-stone-900 truncate">
                            {cat}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                              count > 0
                                ? 'bg-amber-100/70 text-amber-800 border-amber-200'
                                : 'bg-stone-100 text-stone-400 border-stone-200'
                            }`}
                          >
                            {count}개 메뉴
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    {!isEditing && (
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          title="카테고리명 수정"
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCat(cat)}
                          title="카테고리 삭제"
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delete Confirmation Alert Banner */}
          {deletingCat && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs text-red-950 flex-1">
                  <p className="font-bold">
                    '{deletingCat}' 카테고리를 정말 삭제하시겠습니까?
                  </p>
                  {getMenuCountForCategory(deletingCat) > 0 ? (
                    <p className="text-[11px] text-red-700 mt-0.5">
                      이 카테고리를 사용하는 메뉴가{' '}
                      <strong>{getMenuCountForCategory(deletingCat)}개</strong> 있습니다. 삭제 시
                      해당 메뉴들의 카테고리 목록에서 제거됩니다.
                    </p>
                  ) : (
                    <p className="text-[11px] text-red-600 mt-0.5">
                      현재 이 카테고리를 사용하는 메뉴는 없습니다.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end space-x-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setDeletingCat(null)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDelete(deletingCat)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-xs transition active:scale-95 cursor-pointer"
                >
                  삭제 확인
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-stone-50 border-t border-brand-border flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('정말 기본 5대 카테고리로 초기화하시겠습니까? 직접 추가하신 카테고리는 삭제됩니다.')) {
                onResetCategories();
              }
            }}
            title="초기 기본 5대 카테고리로 복원"
            className="flex items-center space-x-1 text-xs text-stone-500 hover:text-red-700 font-semibold px-2 py-1 rounded hover:bg-stone-200/60 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본 카테고리로 초기화</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-brand-terracotta hover:bg-brand-terracottaHover text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};
