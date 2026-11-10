export interface FontOption {
  id: string;
  name: string;
  shortName: string;
  cssClass: string;
  desc: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'noto',
    name: '기본 고딕 (Noto Sans)',
    shortName: '기본고딕',
    cssClass: 'font-noto',
    desc: '가독성이 뛰어난 현대적인 산세리프',
  },
  {
    id: 'song',
    name: '단아한 명조 (Song Myung)',
    shortName: '전통명조',
    cssClass: 'font-song',
    desc: '한양 전통의 멋을 살린 우아한 명조체',
  },
  {
    id: 'black-han',
    name: '굵은 헤드라인 (Black Han Sans)',
    shortName: '굵은헤드',
    cssClass: 'font-black-han',
    desc: '시선을 확 사로잡는 강렬한 굵은 서체',
  },
  {
    id: 'gowun-dodum',
    name: '부드러운 돋움 (Gowun Dodum)',
    shortName: '고운돋움',
    cssClass: 'font-gowun-dodum',
    desc: '따뜻하고 부드러운 감성의 돋움체',
  },
  {
    id: 'gowun-batang',
    name: '정갈한 바탕 (Gowun Batang)',
    shortName: '정갈바탕',
    cssClass: 'font-gowun-batang',
    desc: '정갈하고 반듯한 품격 있는 바탕체',
  },
];

export interface ColorPreset {
  hex: string;
  name: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { hex: '#1C1C19', name: '기본 먹색' },
  { hex: '#A6331B', name: '한양 버건디' },
  { hex: '#DC2626', name: '선명한 다홍' },
  { hex: '#D97706', name: '황금 오렌지' },
  { hex: '#854D0E', name: '따뜻한 황동' },
  { hex: '#166534', name: '솔잎 짙은녹색' },
  { hex: '#0D9488', name: '청록 에메랄드' },
  { hex: '#1E3A8A', name: '감청색 네이비' },
  { hex: '#6B21A8', name: '자줏빛 퍼플' },
  { hex: '#4B5563', name: '다크 차콜' },
];

export const getFontClass = (fontId?: string): string => {
  if (!fontId) return 'font-noto';
  const found = FONT_OPTIONS.find((f) => f.id === fontId);
  return found ? found.cssClass : 'font-noto';
};

export interface FontSizeOption {
  id: string;
  name: string;
  shortName: string;
  cssClass: string;
  sizePx: string;
}

export const FONT_SIZE_OPTIONS: FontSizeOption[] = [
  { id: 'xs', name: '아주 작게 (13px)', shortName: '13px', cssClass: 'text-[13px]', sizePx: '13px' },
  { id: 'sm', name: '약간 작게 (14px)', shortName: '14px', cssClass: 'text-sm', sizePx: '14px' },
  { id: 'base', name: '보통 (16px)', shortName: '16px', cssClass: 'text-base', sizePx: '16px' },
  { id: 'lg', name: '약간 크게 (18px)', shortName: '18px', cssClass: 'text-lg', sizePx: '18px' },
  { id: 'xl', name: '크게 (20px)', shortName: '20px', cssClass: 'text-xl', sizePx: '20px' },
  { id: '2xl', name: '아주 크게 (24px)', shortName: '24px', cssClass: 'text-2xl', sizePx: '24px' },
];

export const getFontSizeClass = (fontSizeId?: string): string => {
  if (!fontSizeId) return 'text-base';
  const found = FONT_SIZE_OPTIONS.find((f) => f.id === fontSizeId);
  return found ? found.cssClass : 'text-base';
};

export const getFontSizePx = (fontSizeId?: string): string => {
  if (!fontSizeId) return '16px';
  const found = FONT_SIZE_OPTIONS.find((f) => f.id === fontSizeId);
  return found ? found.sizePx : '16px';
};

