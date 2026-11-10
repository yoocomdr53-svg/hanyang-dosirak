import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, MenuCategory } from '../types';
import { INITIAL_IMAGES } from '../data/sampleImages';
import {
  X,
  Plus,
  Upload,
  Image as ImageIcon,
  Check,
  FolderOpen,
  Sparkles,
  Tag,
  DollarSign,
  UtensilsCrossed,
  Info,
  CheckSquare,
  Square,
  Type,
  Palette,
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';
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

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMenu: (newMenu: MenuItem) => void;
  onToast: (msg: string) => void;
  availableCategories?: string[];
}

const QUICK_PRICE_PRESETS = [7900, 8900, 9900, 10900, 11900, 12900, 14900, 16900];

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

const SAMPLE_PHOTOS = [
  { name: '김치찌개', url: INITIAL_IMAGES.kimchi },
  { name: '불고기', url: INITIAL_IMAGES.gochujang },
  { name: '돈까스', url: INITIAL_IMAGES.donkatsu },
  { name: '치킨마요', url: INITIAL_IMAGES.chickenmayo },
  { name: '간장불고기', url: INITIAL_IMAGES.ganjang },
  { name: '크림치킨', url: INITIAL_IMAGES.creamchicken },
  { name: '닭볶음', url: INITIAL_IMAGES.spicychicken },
  { name: '컵밥', url: INITIAL_IMAGES.cupBulgogi },
];

/**
 * Local input preserving spaces and Korean IME without interruption
 */
const CleanFormattedInput: React.FC<{
  value: string;
  onCommit: (newVal: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  required?: boolean;
}> = ({ value, onCommit, className, style, placeholder, required }) => {
  const [localText, setLocalText] = useState(() => stripFormatting(value));
  const isComposingRef = useRef(false);

  useEffect(() => {
    const expected = stripFormatting(value);
    if (!isComposingRef.current && localText !== expected) {
      setLocalText(expected);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setLocalText(nextVal);
    onCommit(syncPlainTextWithStyles(value, nextVal));
  };

  return (
    <input
      type="text"
      required={required}
      value={localText}
      onChange={handleChange}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        const targetVal = (e.target as HTMLInputElement).value;
        setLocalText(targetVal);
        onCommit(syncPlainTextWithStyles(value, targetVal));
      }}
      placeholder={placeholder}
      style={style}
      className={className}
    />
  );
};

const CleanFormattedTextarea: React.FC<{
  value: string;
  onCommit: (newVal: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
}> = ({ value, onCommit, className, placeholder, rows = 2 }) => {
  const [localText, setLocalText] = useState(() => stripFormatting(value));
  const isComposingRef = useRef(false);

  useEffect(() => {
    const expected = stripFormatting(value);
    if (!isComposingRef.current && localText !== expected) {
      setLocalText(expected);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextVal = e.target.value;
    setLocalText(nextVal);
    onCommit(syncPlainTextWithStyles(value, nextVal));
  };

  return (
    <textarea
      rows={rows}
      value={localText}
      onChange={handleChange}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        const targetVal = (e.target as HTMLTextAreaElement).value;
        setLocalText(targetVal);
        onCommit(syncPlainTextWithStyles(value, targetVal));
      }}
      placeholder={placeholder}
      className={className}
    />
  );
};

export const AddMenuModal: React.FC<AddMenuModalProps> = ({
  isOpen,
  onClose,
  onAddMenu,
  onToast,
  availableCategories = ['추천', '대표', '도시락', '세트', '착한'],
}) => {
  const [name, setName] = useState('');
  const [nameColor, setNameColor] = useState('#1C1C19');
  const [nameFont, setNameFont] = useState('noto');
  const [nameFontSize, setNameFontSize] = useState('base');
  const [price, setPrice] = useState<number>(9900);
  const [priceInput, setPriceInput] = useState('9,900');
  const [categories, setCategories] = useState<MenuCategory[]>([availableCategories[0] || '추천']);
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('신메뉴');
  const [isBest, setIsBest] = useState(false);
  const [isRec, setIsRec] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Image state
  const [img, setImg] = useState<string>('');
  const [imageFileName, setImageFileName] = useState<string>('기본 이미지 (생성중 대기)');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePriceChange = (val: string) => {
    const rawNumber = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    setPrice(rawNumber);
    setPriceInput(rawNumber > 0 ? rawNumber.toLocaleString('ko-KR') : '');
  };

  const handleSelectPricePreset = (presetVal: number) => {
    setPrice(presetVal);
    setPriceInput(presetVal.toLocaleString('ko-KR'));
  };

  const handleAdjustPrice = (delta: number) => {
    const nextVal = Math.max(0, price + delta);
    setPrice(nextVal);
    setPriceInput(nextVal.toLocaleString('ko-KR'));
  };

  const handleToggleCategory = (cat: MenuCategory) => {
    if (categories.includes(cat)) {
      if (categories.length === 1) {
        onToast('최소 하나 이상의 카테고리를 선택해야 합니다.');
        return;
      }
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl, compressedSizeKB } = await compressImage(file);
      setImg(dataUrl);
      setImageFileName(`${file.name} (최적화 ${compressedSizeKB} KB)`);
      onToast('사진이 가볍고 선명하게 최적화되었습니다.');
    } catch {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        if (result) {
          setImg(result);
          setImageFileName(file.name);
          onToast('메뉴 사진이 선택되었습니다.');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      onToast('메뉴 이름을 입력해주세요.');
      return;
    }

    if (categories.length === 0) {
      onToast('최소 1개 이상의 카테고리를 선택해주세요.');
      return;
    }

    const newId = `item-custom-${Date.now()}`;
    const newMenuItem: MenuItem = {
      id: newId,
      name: trimmedName,
      price: price > 0 ? price : 0,
      category: categories,
      img: img.trim(),
      initialImg: img.trim(),
      desc: desc.trim() || '매일 아침 신선한 재료로 정갈하게 조리한 정성 도시락',
      tag: tag.trim() || '신메뉴',
      isBest,
      isRec: isRec || categories.includes('추천'),
      isSoldOut,
      isVisible,
      nameColor,
      nameFont,
      nameFontSize,
    };

    onAddMenu(newMenuItem);
    onToast(`[${stripFormatting(trimmedName)}] 새 메뉴가 성공적으로 등록되었습니다!`);

    // Reset form
    setName('');
    setNameColor('#1C1C19');
    setNameFont('noto');
    setNameFontSize('base');
    setPrice(9900);
    setPriceInput('9,900');
    setCategories(['도시락']);
    setDesc('');
    setTag('신메뉴');
    setImg('');
    setIsBest(false);
    setIsRec(false);
    setIsSoldOut(false);
    setIsVisible(true);

    onClose();
  };

  return (
    <div
      aria-labelledby="add-menu-modal-title"
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-brand-cream rounded-3xl p-4 sm:p-6 shadow-2xl border border-brand-border transform transition-all max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-brand-border shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="w-8 h-8 rounded-full bg-brand-sand border border-brand-border flex items-center justify-center text-brand-terracotta">
              <UtensilsCrossed className="w-4 h-4" />
            </span>
            <div>
              <h3
                id="add-menu-modal-title"
                className="font-extrabold text-brand-dark text-base sm:text-lg tracking-tight"
              >
                새 메뉴 등록
              </h3>
              <p className="text-[11px] text-brand-muted">
                손님 메뉴판과 관리자 콘솔에 즉시 추가 등록됩니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full text-base transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 flex-1">
          {/* 1. Menu Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1 text-xs font-extrabold text-brand-dark">
                <span>메뉴명</span>
                <span className="text-red-500">*</span>
              </label>

              {/* 글자 폰트, 글자 크기 & 글자색 선택 */}
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                {/* 폰트 선택 드롭다운 */}
                <div className="flex items-center space-x-1 bg-stone-100 rounded-lg px-2 py-1 border border-stone-200">
                  <Type className="w-3 h-3 text-stone-500 shrink-0" />
                  <select
                    value={nameFont}
                    onChange={(e) => setNameFont(e.target.value)}
                    title="글자 폰트 선택"
                    className="text-[11px] bg-transparent text-stone-800 font-semibold focus:outline-none cursor-pointer"
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 폰트 크기 선택 드롭다운 */}
                <div className="flex items-center space-x-1 bg-stone-100 rounded-lg px-2 py-1 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500">크기:</span>
                  <select
                    value={nameFontSize}
                    onChange={(e) => setNameFontSize(e.target.value)}
                    title="글자 크기 선택"
                    className="text-[11px] bg-transparent text-stone-800 font-bold focus:outline-none cursor-pointer"
                  >
                    {FONT_SIZE_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 컬러 피커 */}
                <div className="flex items-center space-x-1 bg-stone-100 rounded-lg px-2 py-1 border border-stone-200">
                  <Palette className="w-3 h-3 text-stone-500 shrink-0" />
                  <label
                    className="w-4 h-4 rounded-full border border-stone-300 shadow-2xs cursor-pointer block shrink-0 hover:scale-110 transition"
                    style={{ backgroundColor: nameColor }}
                    title="글자색 직접 선택"
                  >
                    <input
                      type="color"
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 실시간 완성 미리보기 */}
            {name.trim() && (
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg px-2.5 py-1 text-xs flex items-center justify-between gap-1 overflow-hidden">
                <span className="text-[10px] font-bold text-amber-700 shrink-0">완성 화면:</span>
                <div className="font-bold truncate text-[14px] flex-1 text-right">
                  <FormattedText
                    text={name}
                    defaultFont={nameFont}
                    defaultColor={nameColor}
                    defaultSize={nameFontSize}
                  />
                </div>
              </div>
            )}

            <CleanFormattedInput
              required
              placeholder="예: 수제 떡갈비 정식 도시락"
              value={name}
              onCommit={(newVal) => setName(newVal)}
              style={{
                color: nameColor,
                fontSize: getFontSizePx(nameFontSize),
              }}
              className={`w-full font-bold bg-white border border-brand-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-terracotta focus:border-transparent placeholder:font-normal placeholder:text-stone-400 transition-all ${getFontClass(
                nameFont
              )} ${getFontSizeClass(nameFontSize)}`}
            />

            {/* 빠른 글자 크기 및 색상 선택 바 */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5 flex-wrap">
              {/* 빠른 글자 크기 버튼 */}
              <div className="flex items-center space-x-1">
                <span className="text-[10px] text-stone-400 shrink-0">크기:</span>
                {FONT_SIZE_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setNameFontSize(s.id)}
                    title={`글자 크기 ${s.name}`}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                      nameFontSize === s.id
                        ? 'bg-brand-terracotta text-white shadow-2xs scale-105'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {s.shortName}
                  </button>
                ))}
              </div>

              {/* 빠른 추천 색상 프리셋 */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] text-stone-400 shrink-0">글자색:</span>
                {COLOR_PRESETS.slice(0, 6).map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setNameColor(c.hex)}
                    title={`${c.name} (${c.hex})`}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer ${
                      nameColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'scale-125 border-brand-terracotta ring-1 ring-brand-terracotta shadow-xs'
                        : 'border-stone-300 hover:scale-110 opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* 일부 텍스트만 글꼴/색상/크기 변경 컴포넌트 */}
            <PartialTextStyler
              label="새 메뉴명"
              rawText={name}
              defaultFont={nameFont}
              defaultColor={nameColor}
              defaultSize={nameFontSize}
              onChange={(newVal) => setName(newVal)}
              onToast={onToast}
            />
          </div>

          {/* 2. Price with Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1 text-xs font-extrabold text-brand-dark">
                <DollarSign className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>판매 가격</span>
                <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(-1000)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded active:scale-95 cursor-pointer"
                >
                  -1,000
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(500)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded active:scale-95 cursor-pointer"
                >
                  +500
                </button>
                <button
                  type="button"
                  onClick={() => handleAdjustPrice(1000)}
                  className="px-2 py-0.5 text-[11px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded active:scale-95 cursor-pointer"
                >
                  +1,000
                </button>
              </div>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm font-bold text-stone-500">₩</span>
              <input
                type="text"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="0"
                className="w-full text-sm font-extrabold text-brand-terracotta bg-white border border-brand-border rounded-xl pl-8 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
              />
              <span className="absolute right-3 text-xs font-bold text-stone-600">원</span>
            </div>

            {/* Quick Price Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-stone-400 shrink-0 font-medium">추천단가:</span>
              {QUICK_PRICE_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPricePreset(p)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md shrink-0 border transition cursor-pointer ${
                    price === p
                      ? 'bg-brand-terracotta text-white border-brand-terracotta'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {p.toLocaleString('ko-KR')}원
                </button>
              ))}
            </div>
          </div>

          {/* 3. Categories (Multi-select) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-brand-dark">
                카테고리 선택 <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-stone-400">
                (다중 선택 가능 - {categories.length}개 선택됨)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableCategories.map((catName) => {
                const isSelected = categories.includes(catName);
                return (
                  <button
                    key={catName}
                    type="button"
                    onClick={() => handleToggleCategory(catName)}
                    className={`p-2 rounded-xl border text-left flex items-start space-x-2 transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/80 border-brand-terracotta text-brand-dark shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="pt-0.5">
                      {isSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-brand-terracotta" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold leading-none">{catName}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold text-brand-dark">
                메뉴 상세 설명
              </label>
              {desc && (
                <div className="text-[10px] text-stone-500 truncate max-w-[200px]">
                  <FormattedText text={desc} />
                </div>
              )}
            </div>
            <CleanFormattedTextarea
              rows={2}
              value={desc}
              onCommit={(newVal) => setDesc(newVal)}
              placeholder="예: 국내산 암퇘지와 특제 갈비 양념으로 직화 조리하여 쫄깃하고 담백한 수제 떡갈비와 계절 반찬"
              className="w-full text-xs text-brand-dark bg-white border border-brand-border rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-brand-terracotta leading-relaxed resize-none placeholder:text-stone-400"
            />
            <PartialTextStyler
              label="상세 설명"
              rawText={desc}
              onChange={(newVal) => setDesc(newVal)}
              onToast={onToast}
            />
          </div>

          {/* 5. Tag / Highlight Badge */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1 text-xs font-extrabold text-brand-dark">
                <Tag className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>강조 태그 문구</span>
              </label>
              <span className="text-[10px] text-stone-400">카드 상단 뱃지 표시</span>
            </div>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="예: 신메뉴, 인기, 당일 한정 수량"
              className="w-full text-xs font-bold text-brand-dark bg-white border border-brand-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-terracotta"
            />

            {/* Tag Quick Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {QUICK_TAG_PRESETS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition cursor-pointer whitespace-nowrap ${
                    tag === t
                      ? 'bg-brand-sand text-brand-terracotta border-brand-terracotta font-bold'
                      : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
          </div>

          {/* 6. Photo & Image Selection */}
          <div className="space-y-2 p-3 bg-white border border-brand-border rounded-2xl">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-1 text-xs font-extrabold text-brand-dark">
                <ImageIcon className="w-3.5 h-3.5 text-brand-terracotta" />
                <span>메뉴 사진 설정</span>
              </label>
              <span className="text-[10px] text-brand-terracotta font-bold">
                {img ? '사진 등록됨' : '미등록 시 "이미지 생성중" 표시'}
              </span>
            </div>

            <div className="flex space-x-3 items-center">
              {/* Photo Preview */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-brand-border shrink-0 relative cursor-pointer group"
                title="사진 선택하기"
              >
                {img ? (
                  <img src={img} alt="미리보기" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#EFEAE4] p-1 text-center">
                    <Sparkles className="w-4 h-4 text-brand-terracotta mb-0.5" />
                    <span className="text-[9px] font-bold text-stone-600 leading-tight">
                      이미지 생성중
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition">
                  <Upload className="w-4 h-4" />
                </div>
              </div>

              {/* Upload actions */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-[11px] font-bold text-brand-dark truncate">{imageFileName}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 bg-brand-sand hover:bg-brand-border text-brand-dark rounded-lg text-[11px] font-bold border border-brand-border flex items-center space-x-1 cursor-pointer active:scale-95 transition"
                  >
                    <FolderOpen className="w-3 h-3" />
                    <span>기기 사진 찾기</span>
                  </button>
                  {img && (
                    <button
                      type="button"
                      onClick={() => {
                        setImg('');
                        setImageFileName('기본 이미지 (생성중 대기)');
                      }}
                      className="px-2 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-[11px] font-medium cursor-pointer"
                    >
                      사진 비우기
                    </button>
                  )}
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Quick Sample Photos */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[10px] text-stone-500 font-semibold block mb-1">
                또는 대표 샘플 이미지 바로 선택:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {SAMPLE_PHOTOS.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      setImg(sample.url);
                      setImageFileName(`샘플: ${sample.name}`);
                    }}
                    className={`relative aspect-square rounded-lg overflow-hidden border transition active:scale-95 cursor-pointer ${
                      img === sample.url ? 'ring-2 ring-brand-terracotta border-transparent' : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = INITIAL_IMAGES.donkatsu;
                      }}
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white py-0.5 text-center truncate">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Badges & Initial Status Switches */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* BEST Badge */}
            <label className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-brand-border cursor-pointer hover:bg-amber-50/40">
              <input
                type="checkbox"
                checked={isBest}
                onChange={(e) => setIsBest(e.target.checked)}
                className="rounded text-brand-terracotta focus:ring-brand-terracotta h-4 w-4"
              />
              <div>
                <span className="font-extrabold text-brand-dark block">BEST 뱃지</span>
                <span className="text-[10px] text-stone-400">인기 대표 메뉴 표시</span>
              </div>
            </label>

            {/* REC Badge */}
            <label className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-brand-border cursor-pointer hover:bg-amber-50/40">
              <input
                type="checkbox"
                checked={isRec}
                onChange={(e) => setIsRec(e.target.checked)}
                className="rounded text-brand-terracotta focus:ring-brand-terracotta h-4 w-4"
              />
              <div>
                <span className="font-extrabold text-brand-dark block">추천 뱃지</span>
                <span className="text-[10px] text-stone-400">오늘의 추천 강조</span>
              </div>
            </label>

            {/* Visible toggle */}
            <label className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-brand-border cursor-pointer hover:bg-amber-50/40">
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="rounded text-brand-terracotta focus:ring-brand-terracotta h-4 w-4"
              />
              <div>
                <span className="font-extrabold text-brand-dark block">손님 화면 노출</span>
                <span className="text-[10px] text-stone-400">즉시 주문 메뉴판 노출</span>
              </div>
            </label>

            {/* Sold out toggle */}
            <label className="flex items-center space-x-2 bg-white p-2.5 rounded-xl border border-brand-border cursor-pointer hover:bg-amber-50/40">
              <input
                type="checkbox"
                checked={isSoldOut}
                onChange={(e) => setIsSoldOut(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
              />
              <div>
                <span className="font-extrabold text-brand-dark block">초기 품절 상태</span>
                <span className="text-[10px] text-stone-400">재료 소진 시 체크</span>
              </div>
            </label>
          </div>

          {/* Form Action Buttons */}
          <div className="pt-2 flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm active:scale-95 transition cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-brand-terracotta hover:bg-brand-terracottaHover text-white font-extrabold text-xs sm:text-sm shadow-float active:scale-98 transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>새 메뉴 등록하기</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
