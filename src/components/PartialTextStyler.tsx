import React, { useState, useMemo } from 'react';
import {
  FONT_OPTIONS,
  COLOR_PRESETS,
  FONT_SIZE_OPTIONS,
  getFontClass,
  getFontSizePx,
} from '../data/fontOptions';
import {
  FormattedText,
  stripFormatting,
  extractStyledSegments,
  applyPartialStyle,
  removePartialStyle,
} from '../utils/textFormatter';
import { Sparkles, Trash2, RotateCcw, Check, Palette, Type, MousePointerClick } from 'lucide-react';

interface PartialTextStylerProps {
  label?: string;
  rawText: string;
  defaultFont?: string;
  defaultColor?: string;
  defaultSize?: string;
  onChange: (newText: string) => void;
  onToast?: (msg: string) => void;
}

export const PartialTextStyler: React.FC<PartialTextStylerProps> = ({
  label = '메뉴명',
  rawText,
  defaultFont = 'noto',
  defaultColor = '#1C1C19',
  defaultSize = 'base',
  onChange,
  onToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [targetFont, setTargetFont] = useState('black-han');
  const [targetColor, setTargetColor] = useState('#DC2626');
  const [targetSize, setTargetSize] = useState('18px');
  const [targetBg, setTargetBg] = useState('');
  const [targetBold, setTargetBold] = useState(false);

  // Extract clean plain text
  const plainText = useMemo(() => stripFormatting(rawText), [rawText]);

  // Smart token extraction:
  // Extracts phrases inside parentheses like (간장 불고기) -> "간장 불고기", "(간장 불고기)"
  // As well as individual words and clauses
  const smartTokens = useMemo(() => {
    if (!plainText) return [];
    const tokens = new Set<string>();

    // 1. Matches text inside parentheses: (간장 불고기)
    const parenMatches = plainText.match(/\(([^)]+)\)/g);
    if (parenMatches) {
      for (const m of parenMatches) {
        tokens.add(m); // "(간장 불고기)"
        const inner = m.replace(/[()]/g, '').trim();
        if (inner) tokens.add(inner); // "간장 불고기"
      }
    }

    // 2. Matches text inside brackets or quotes: [HOT], "시그니처"
    const bracketMatches = plainText.match(/\[([^\]]+)\]/g);
    if (bracketMatches) {
      for (const m of bracketMatches) {
        tokens.add(m);
        const inner = m.replace(/[\[\]]/g, '').trim();
        if (inner) tokens.add(inner);
      }
    }

    // 3. Split by spaces for individual words
    const words = plainText.split(/\s+/).map((w) => w.trim()).filter(Boolean);
    for (const w of words) {
      tokens.add(w);
      const cleanW = w.replace(/[()\[\],.]/g, '').trim();
      if (cleanW && cleanW !== w) tokens.add(cleanW);
    }

    // 4. Also 2-word and 3-word combinations if text has multiple words
    for (let i = 0; i < words.length - 1; i++) {
      const combo = `${words[i]} ${words[i + 1]}`.replace(/[()\[\],.]/g, '').trim();
      if (combo) tokens.add(combo);
    }
    for (let i = 0; i < words.length - 2; i++) {
      const combo3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`.replace(/[()\[\],.]/g, '').trim();
      if (combo3) tokens.add(combo3);
    }

    return Array.from(tokens).filter((t) => t.length > 0 && (plainText.includes(t) || plainText.replace(/\s+/g, ' ').includes(t)));
  }, [plainText]);

  // Extract currently styled segments
  const styledSegments = useMemo(() => extractStyledSegments(rawText), [rawText]);

  const handleApplyStyle = () => {
    const word = selectedWord.trim();
    if (!word) {
      if (onToast) onToast('서식을 적용할 글자(단어)를 선택하거나 입력해주세요.');
      return;
    }

    // Find actual matched substring in plainText (support spaces)
    let targetMatch = word;
    if (!plainText.includes(word)) {
      const normalizedPlain = plainText.replace(/\s+/g, ' ');
      const normalizedWord = word.replace(/\s+/g, ' ');
      if (!normalizedPlain.includes(normalizedWord)) {
        if (onToast) onToast(`"${word}" 단어가 현재 ${label}에 포함되어 있지 않습니다.`);
        return;
      }
      // If found in normalized, find original sliced text
      const normIdx = normalizedPlain.indexOf(normalizedWord);
      // Fallback to word
      targetMatch = word;
    }

    const updatedText = applyPartialStyle(rawText, targetMatch, {
      font: targetFont,
      color: targetColor,
      size: targetSize,
      bg: targetBg || undefined,
      bold: targetBold,
    });

    onChange(updatedText);

    if (onToast) {
      const fontObj = FONT_OPTIONS.find((f) => f.id === targetFont);
      onToast(`✨ "${word}" 부분에 [${fontObj?.shortName || targetFont} / 색상: ${targetColor} / 크기: ${targetSize}] 서식이 깔끔하게 적용되었습니다!`);
    }
  };

  const handleRemoveWordStyle = (wordToRemove: string) => {
    const updated = removePartialStyle(rawText, wordToRemove);
    onChange(updated);
    if (onToast) onToast(`"${wordToRemove}" 부분의 특별 서식이 해제되었습니다.`);
  };

  const handleClearAllStyles = () => {
    const clean = stripFormatting(rawText);
    onChange(clean);
    if (onToast) onToast(`모든 부분 서식이 초기화되어 기본 텍스트로 복원되었습니다.`);
  };

  const HIGHLIGHT_BG_PRESETS = [
    { label: '없음', val: '' },
    { label: '노랑 형광펜', val: '#FEF08A' },
    { label: '주황 형광펜', val: '#FED7AA' },
    { label: '연초록 형광펜', val: '#BBF7D0' },
    { label: '연분홍 형광펜', val: '#FBCFE8' },
  ];

  return (
    <div className="mt-1.5 rounded-xl border border-amber-200/90 bg-amber-50/50 p-2 text-xs transition-all shadow-2xs">
      {/* Header Bar with Toggle */}
      <div className="flex items-center justify-between gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 font-bold text-amber-950 hover:text-amber-700 transition cursor-pointer text-[11px]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>
            특정 단어만 글꼴/색상/크기 변경{' '}
            {styledSegments.length > 0 ? (
              <span className="text-amber-800 font-extrabold bg-amber-200/80 px-1.5 py-0.2 rounded-full">
                {styledSegments.length}개 부분 적용됨
              </span>
            ) : (
              <span className="text-stone-500 font-normal">(예: '간장 불고기'만 강조)</span>
            )}
          </span>
          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md font-semibold border border-amber-200">
            {isOpen ? '닫기 ▲' : '서식 편집 열기 ▼'}
          </span>
        </button>

        {styledSegments.length > 0 && (
          <button
            type="button"
            onClick={handleClearAllStyles}
            title="모든 부분 서식을 지우고 순수 텍스트로 초기화"
            className="flex items-center space-x-1 text-[10px] text-stone-500 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-stone-100 transition cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>서식 초기화</span>
          </button>
        )}
      </div>

      {/* Styled segments tag list (always visible if any exist) */}
      {styledSegments.length > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-stone-500">현재 강조된 단어:</span>
          {styledSegments.map((seg, idx) => {
            const fontName = FONT_OPTIONS.find((f) => f.id === seg.font)?.shortName || '기본폰트';
            return (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-white border border-amber-300 text-[10px] shadow-2xs"
              >
                <span
                  className="font-bold"
                  style={{
                    color: seg.color || defaultColor,
                    backgroundColor: seg.bg || undefined,
                  }}
                >
                  "{seg.text}"
                </span>
                <span className="text-stone-500 text-[9px]">
                  ({fontName} · {seg.size || '기본크기'})
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveWordStyle(seg.text)}
                  title={`"${seg.text}" 서식 해제`}
                  className="text-stone-400 hover:text-red-600 p-0.5 transition cursor-pointer"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Collapsible Stylizer Panel */}
      {isOpen && (
        <div className="mt-2 pt-2 border-t border-amber-200 space-y-2.5 animate-in fade-in duration-150">
          {/* Step 1: Pick Word / Target Substring */}
          <div className="bg-white/90 rounded-lg p-2 border border-stone-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-stone-800 flex items-center gap-1">
                <MousePointerClick className="w-3 h-3 text-amber-600" />
                1단계: 강조할 글자 선택 (클릭하면 바로 선택됩니다)
              </span>
              <span className="text-[9px] text-stone-400">
                예: '간장 불고기' 칩 클릭
              </span>
            </div>

            {/* Clickable Word Tokens */}
            <div className="flex items-center gap-1 flex-wrap">
              {smartTokens.map((w, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedWord(w)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer border ${
                    selectedWord === w
                      ? 'bg-amber-600 text-white border-amber-700 shadow-2xs font-extrabold scale-105'
                      : 'bg-stone-50 hover:bg-amber-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            {/* Direct Input for chosen word */}
            <div className="flex items-center space-x-1.5 pt-1">
              <span className="text-[10px] text-stone-600 font-bold shrink-0">선택된 글자:</span>
              <input
                type="text"
                value={selectedWord}
                onChange={(e) => setSelectedWord(e.target.value)}
                placeholder="단어 칩을 클릭하거나 직접 입력 (예: 간장 불고기)"
                className="flex-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs text-stone-900 font-extrabold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              {selectedWord && (
                <button
                  type="button"
                  onClick={() => setSelectedWord('')}
                  className="text-[10px] text-stone-400 hover:text-stone-700 px-1 cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Styling Controls */}
          <div className="bg-white/90 rounded-lg p-2 border border-stone-200/90 shadow-2xs space-y-2">
            <span className="block text-[11px] font-extrabold text-stone-800 mb-1">
              2단계: 선택한 글자에 적용할 글꼴 & 색상 & 크기 설정
            </span>

            {/* Font Family Selection */}
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center space-x-1 shrink-0">
                <Type className="w-3 h-3 text-stone-500" />
                <span className="text-[10px] font-bold text-stone-700">글꼴(폰트):</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTargetFont(f.id)}
                    className={`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer ${
                      targetFont === f.id
                        ? 'bg-stone-900 text-white font-bold shadow-2xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {f.shortName}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Color Selection */}
            <div className="flex items-center justify-between gap-1 flex-wrap pt-1.5 border-t border-stone-100">
              <div className="flex items-center space-x-1 shrink-0">
                <Palette className="w-3 h-3 text-stone-500" />
                <span className="text-[10px] font-bold text-stone-700">글자색:</span>
              </div>
              <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTargetColor(c.hex)}
                    title={c.name}
                    style={{ backgroundColor: c.hex }}
                    className={`w-4 h-4 rounded-full border transition cursor-pointer ${
                      targetColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'scale-125 border-stone-900 ring-2 ring-stone-900/40 shadow-2xs'
                        : 'border-stone-300 hover:scale-110'
                    }`}
                  />
                ))}
                {/* Direct Color Input */}
                <label
                  className="w-4 h-4 rounded-full border border-stone-400 block cursor-pointer overflow-hidden ml-1"
                  title="원하는 색상 직접 선택"
                >
                  <input
                    type="color"
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    className="sr-only"
                  />
                  <div className="w-full h-full" style={{ backgroundColor: targetColor }} />
                </label>
              </div>
            </div>

            {/* Font Size Selection */}
            <div className="flex items-center justify-between gap-1 flex-wrap pt-1.5 border-t border-stone-100">
              <span className="text-[10px] font-bold text-stone-700 shrink-0">글자크기:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {FONT_SIZE_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setTargetSize(s.sizePx)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      targetSize === s.sizePx
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {s.shortName} ({s.sizePx})
                  </button>
                ))}
              </div>
            </div>

            {/* Background / Highlighter Preset */}
            <div className="flex items-center justify-between gap-1 flex-wrap pt-1.5 border-t border-stone-100">
              <span className="text-[10px] font-bold text-stone-700 shrink-0">형광펜 강조:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {HIGHLIGHT_BG_PRESETS.map((bg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTargetBg(bg.val)}
                    style={{ backgroundColor: bg.val || '#ffffff' }}
                    className={`px-1.5 py-0.5 rounded text-[9px] font-medium border transition cursor-pointer ${
                      targetBg === bg.val
                        ? 'border-stone-800 ring-1 ring-stone-800 font-bold'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Apply Button with Live Preview */}
          <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center space-x-1.5 overflow-hidden">
              <span className="text-[10px] text-stone-500 shrink-0">미리보기:</span>
              <span
                className={`px-2 py-0.5 rounded ${getFontClass(targetFont)} font-extrabold shadow-2xs border border-stone-200 truncate`}
                style={{
                  color: targetColor,
                  fontSize: targetSize,
                  backgroundColor: targetBg || '#ffffff',
                }}
              >
                {selectedWord || '선택한 텍스트'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleApplyStyle}
              disabled={!selectedWord.trim()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-extrabold rounded-lg shadow-sm transition active:scale-95 cursor-pointer text-xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>선택 글자에 서식 적용</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
