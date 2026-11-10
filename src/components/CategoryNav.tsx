import React from 'react';
import { Search } from 'lucide-react';
import { MenuCategory } from '../types';
import { SupportedLanguage, translateCategory, getUIText } from '../utils/translations';

interface CategoryNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: string[];
  activeCategory: MenuCategory | 'all';
  onSelectCategory: (category: MenuCategory | 'all') => void;
  counts: Record<string, number>;
  totalCount?: number;
  lang?: SupportedLanguage;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onSelectCategory,
  counts,
  totalCount,
  lang = 'ko',
}) => {
  return (
    <section className="sticky top-[102px] sm:top-[115px] z-30 bg-brand-cream/95 backdrop-blur-sm pt-2 sm:pt-3 pb-2 sm:pb-3 px-3 sm:px-5 md:px-8 border-b border-brand-border/80">
      {/* Search Input */}
      <div className="relative mb-2 sm:mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={getUIText('searchPlaceholder', lang)}
          className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-4 text-xs sm:text-sm bg-white rounded-xl border border-brand-border focus:outline-none focus:ring-2 focus:ring-brand-terracotta/40 focus:border-brand-terracotta placeholder:text-stone-400 shadow-xs"
        />
        <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-stone-400 absolute left-3 sm:left-3.5 top-2.5 sm:top-3" />
      </div>

      {/* Customer Category Filter Pills */}
      <nav
        aria-label="메뉴 카테고리"
        className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-1 text-xs sm:text-sm font-semibold"
      >
        {/* '전체' Category button */}
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`category-btn shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition active:scale-95 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-brand-terracotta text-white shadow-sm font-bold'
              : 'bg-white text-brand-muted border border-brand-border hover:border-brand-terracotta hover:text-brand-terracotta font-medium'
          }`}
        >
          {getUIText('allCategory', lang)} {totalCount !== undefined ? `(${totalCount})` : ''}
        </button>

        {/* Dynamic Custom Categories */}
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = counts[cat] || 0;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`category-btn shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-brand-terracotta text-white shadow-sm font-bold'
                  : 'bg-white text-brand-muted border border-brand-border hover:border-brand-terracotta hover:text-brand-terracotta font-medium'
              }`}
            >
              {translateCategory(cat, lang)} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </nav>
    </section>
  );
};
