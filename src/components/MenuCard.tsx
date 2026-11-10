import React, { useState, useEffect } from 'react';
import { MenuItem } from '../types';
import { Sparkles, AlertTriangle } from 'lucide-react';
import { getFontClass, getFontSizeClass, getFontSizePx } from '../data/fontOptions';
import { FormattedText } from '../utils/textFormatter';
import {
  SupportedLanguage,
  translateMenuName,
  translateMenuDesc,
  translateMenuTag,
  translateCategory,
  formatPrice,
  getUIText,
} from '../utils/translations';

interface MenuCardProps {
  item: MenuItem;
  onOrderDelivery?: (app: 'baemin' | 'coupang', menuName: string) => void;
  categoryContext?: string;
  lang?: SupportedLanguage;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  onOrderDelivery,
  categoryContext,
  lang = 'ko',
}) => {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [item.img]);

  const hasImage = Boolean(item.img && item.img.trim() !== '' && !imgError);

  const displayName = translateMenuName(item.name, lang);
  const displayDesc = translateMenuDesc(item.desc, lang);
  const displayTag = item.tag ? translateMenuTag(item.tag, lang) : '';

  // Determine top-left badge based on category or context
  const renderBadge = () => {
    if (
      categoryContext === '착한' ||
      categoryContext === '착한도시락' ||
      categoryContext === '착한 도시락' ||
      categoryContext.includes('착한') ||
      item.category.includes('착한') ||
      item.category.includes('착한도시락') ||
      item.category.includes('착한 도시락') ||
      item.category.some((c) => c.includes('착한'))
    ) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold shadow-sm">
          {getUIText('donationBadge', lang)}
        </span>
      );
    }
    if (categoryContext === '세트' || categoryContext === '세트메뉴' || item.category.includes('세트') || item.category.includes('세트메뉴')) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-brand-terracotta text-white text-[10px] font-extrabold shadow-sm">
          {getUIText('setMenuBadge', lang)}
        </span>
      );
    }
    if (categoryContext === '신메뉴' || item.category.includes('신메뉴')) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shadow-sm">
          {getUIText('newMenuBadge', lang)}
        </span>
      );
    }
    if (categoryContext === '추천') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-brand-terracotta text-white text-[10px] font-extrabold shadow-sm">
          {getUIText('signatureBadge', lang)}
        </span>
      );
    }
    if (categoryContext === '대표') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-brand-wood text-white text-[10px] font-extrabold shadow-sm">
          {getUIText('signatureFullBadge', lang)}
        </span>
      );
    }
    if (categoryContext === '도시락') {
      return (
        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold shadow-sm">
          {translateCategory('도시락', lang)}
        </span>
      );
    }
    if (categoryContext) {
      return (
        <span className="px-2 py-0.5 rounded-md bg-brand-terracotta text-white text-[10px] font-extrabold shadow-sm">
          {translateCategory(categoryContext, lang)}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md bg-brand-terracotta text-white text-[10px] font-extrabold shadow-sm">
        {getUIText('popularBadge', lang)}
      </span>
    );
  };

  return (
    <article
      className={`menu-card bg-white rounded-2xl p-3.5 border shadow-card flex flex-col transition relative ${
        item.isSoldOut
          ? 'grayscale bg-stone-50/90 border-stone-300 opacity-80 select-none'
          : 'border-brand-border hover:border-brand-terracotta/40'
      }`}
      data-id={item.id}
      data-name={item.name}
    >
      {/* 16:9 Image container */}
      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 mb-3 select-none">
        {hasImage ? (
          <img
            key={item.img}
            src={item.img}
            alt={item.name}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover transition-all ${
              item.isSoldOut ? 'grayscale contrast-90' : ''
            }`}
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#EFEAE4]">
            {/* Blurry atmospheric background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#ECE5DD] via-[#F5EFE9] to-[#E2D8CC] filter blur-md scale-110" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#E8BA9B]/40 rounded-full filter blur-2xl" />
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#D48B68]/25 rounded-full filter blur-2xl" />
            <div className="absolute inset-0 backdrop-blur-md bg-white/20" />

            {/* Centered '이미지 생성중' indicator */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
              <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center border border-white/80 text-brand-terracotta">
                <Sparkles className="w-5 h-5 text-brand-terracotta animate-pulse" />
              </div>
              <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta animate-ping" />
                <span className="text-xs font-extrabold text-stone-700 tracking-tight">
                  {getUIText('preparingImage', lang)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Badges in top left: BEST / 추천 / category badge / 주문 불가 */}
        <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 z-20 flex-wrap gap-y-1">
          {item.isSoldOut ? (
            <span className="px-2.5 py-0.5 rounded-md bg-stone-900 text-white text-[10px] font-black shadow-md flex items-center space-x-1 border border-stone-700">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              <span>{getUIText('soldOut', lang)}</span>
            </span>
          ) : (
            <>
              {item.isBest && (
                <span className="px-2.5 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black shadow-md flex items-center space-x-0.5 border border-red-500">
                  <span>{getUIText('bestBadge', lang)}</span>
                </span>
              )}
              {item.isRec && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-black shadow-md flex items-center space-x-0.5 border border-amber-400">
                  <span>{getUIText('recBadge', lang)}</span>
                </span>
              )}
              {displayTag && (
                <span className="px-2 py-0.5 rounded-md bg-brand-terracotta text-white text-[10px] font-extrabold shadow-sm border border-brand-terracotta/80">
                  {displayTag}
                </span>
              )}
              {!displayTag && renderBadge()}
            </>
          )}
        </div>

        {/* Sold-out Centered Overlay with '주문 불가' label */}
        {item.isSoldOut && (
          <div className="absolute inset-0 bg-stone-950/65 backdrop-blur-[1px] flex flex-col items-center justify-center text-white z-20 p-2 text-center select-none animate-in fade-in">
            <div className="px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-black rounded-lg shadow-lg flex items-center space-x-1.5 mb-1 border border-red-400/50">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
              <span>{getUIText('soldOut', lang)}</span>
            </div>
            <span className="text-[11px] font-bold text-stone-200">
              {getUIText('soldOutDesc', lang)}
            </span>
          </div>
        )}
      </div>

      {/* Info container */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <div className="flex items-center flex-wrap gap-1">
              <h3
                className={`font-bold tracking-tight leading-snug ${
                  item.isSoldOut ? 'line-through text-stone-500' : ''
                }`}
              >
                <FormattedText
                  text={displayName}
                  defaultFont={item.nameFont}
                  defaultColor={item.nameColor}
                  defaultSize={item.nameFontSize}
                  isSoldOut={item.isSoldOut}
                />
              </h3>
              {item.isSoldOut && (
                <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-extrabold border border-red-200">
                  {getUIText('soldOut', lang)}
                </span>
              )}
            </div>
            <span
              className={`text-base font-extrabold ml-2 shrink-0 ${
                item.isSoldOut ? 'text-stone-400 line-through' : 'text-brand-terracotta'
              }`}
            >
              {formatPrice(item.price, lang)}
            </span>
          </div>
          <p className="text-xs text-brand-muted leading-relaxed">
            <FormattedText text={displayDesc} />
          </p>
        </div>

        {/* Bottom tags */}
        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <span className="bg-brand-sand px-2 py-0.5 rounded text-[11px] text-stone-700 font-medium shrink-0">
            {displayTag || getUIText('heartfeltTag', lang)}
          </span>
          {item.isSoldOut && (
            <span className="px-2.5 py-0.5 rounded bg-stone-200 text-stone-500 text-[11px] font-bold select-none">
              {getUIText('soldOut', lang)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

