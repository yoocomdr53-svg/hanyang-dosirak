import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../utils/translations';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (lang: SupportedLanguage) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Language Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="언어 변경 (Language: English / 日本語 / 中文)"
        title="언어 변경 (Language: 한국어 / English / 日本語 / 中文)"
        className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full border flex items-center space-x-1 active:scale-95 transition shadow-xs cursor-pointer ${
          currentLanguage !== 'ko'
            ? 'bg-amber-600 text-white border-amber-600 font-bold'
            : 'bg-brand-sand hover:border-brand-terracotta border-brand-border text-brand-dark'
        }`}
      >
        <Globe
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
            currentLanguage !== 'ko' ? 'text-white' : 'text-brand-terracotta'
          }`}
        />
        <span className="text-[11px] sm:text-xs font-semibold whitespace-nowrap">
          {activeOption.nativeLabel}
        </span>
        <ChevronDown
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${
            currentLanguage !== 'ko' ? 'text-amber-200' : 'text-stone-500'
          }`}
        />
      </button>

      {/* Language Selection Modal / Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-44 sm:w-48 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 border-b border-stone-100 mb-1">
            <span className="text-[10px] font-bold text-stone-600 tracking-wider">
              LANGUAGE / 언어 선택
            </span>
          </div>

          <div className="space-y-0.5 px-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-extrabold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs">{lang.nativeLabel}</span>
                      <span className="text-[10px] text-stone-500 font-normal">{lang.label}</span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
