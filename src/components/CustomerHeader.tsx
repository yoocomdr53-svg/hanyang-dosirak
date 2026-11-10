import React from 'react';
import { StoreStatusState } from '../types';
import { MapPin, Settings, Clock, Sparkles } from 'lucide-react';
import {
  SupportedLanguage,
  getUIText,
  translateHoursText,
  translateLastOrderText,
  translateAddress,
} from '../utils/translations';
import { LanguageSelector } from './LanguageSelector';

interface CustomerHeaderProps {
  storeStatus: StoreStatusState;
  onOpenLocation: () => void;
  onOpenAdminPin: () => void;
  onDeliveryClick: (app: 'baemin' | 'coupang') => void;
  isUpdateAvailable?: boolean;
  onOpenUpdateModal?: () => void;
  currentLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({
  storeStatus,
  onOpenLocation,
  onOpenAdminPin,
  onDeliveryClick,
  isUpdateAvailable = false,
  onOpenUpdateModal,
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-cream/95 backdrop-blur-md border-b border-brand-border px-3 sm:px-5 md:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-brand-border/80 shadow-xs overflow-hidden shrink-0 flex items-center justify-center p-0.5">
              <img
                src="/pwa-192x192.png"
                alt="한양도시락 공식 아이콘"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <h1 className="text-sm sm:text-lg font-extrabold tracking-tight text-brand-dark leading-none whitespace-nowrap">
                  {getUIText('appTitle', currentLanguage)}
                </h1>
                <span
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${
                    storeStatus.isOpen
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-red-500'
                  }`}
                  title={storeStatus.isOpen ? getUIText('open', currentLanguage) : getUIText('closed', currentLanguage)}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-brand-muted mt-0.5 font-medium truncate">
                {getUIText('appSubtitle', currentLanguage)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Language Selection Button (Korean / English / Japanese / Chinese) */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onLanguageChange={onLanguageChange}
            />

            {/* If an update is available, display the update alert badge */}
            {isUpdateAvailable && (
              <button
                type="button"
                onClick={onOpenUpdateModal}
                aria-label="최신 버전 업데이트 확인"
                title="새로운 버전이 준비되었습니다!"
                className="bg-amber-500 text-stone-900 border-amber-400 font-extrabold ring-2 ring-amber-300 ring-offset-1 px-2 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full border flex items-center space-x-0.5 sm:space-x-1 active:scale-95 transition shadow-xs cursor-pointer relative"
              >
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-stone-900 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold tracking-tight whitespace-nowrap">
                  {getUIText('updateAvailable', currentLanguage)}
                </span>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
              </button>
            )}

            <button
              type="button"
              onClick={onOpenLocation}
              aria-label="한양도시락 위치 및 지도 보기"
              className="bg-brand-sand hover:border-brand-terracotta px-2 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full border border-brand-border flex items-center space-x-0.5 sm:space-x-1 active:scale-95 transition shadow-xs cursor-pointer"
            >
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-terracotta shrink-0" />
              <span className="text-[10px] sm:text-xs font-medium text-brand-dark whitespace-nowrap">
                {getUIText('locationGuide', currentLanguage)}
              </span>
            </button>

            <button
              type="button"
              onClick={onOpenAdminPin}
              aria-label="점주 전용 관리자 모드"
              title="점주 관리자 모드 (PIN: 1495&)"
              className="bg-brand-sand hover:border-brand-terracotta px-2 py-0.5 sm:px-2.5 sm:py-1.5 rounded-full border border-brand-border flex items-center space-x-1 active:scale-95 transition shadow-xs cursor-pointer shrink-0"
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-700" />
              <span className="text-[10px] sm:text-xs font-medium text-brand-dark whitespace-nowrap">
                점주 전용
              </span>
            </button>
          </div>
        </div>

        {/* 영업 정보 & 위치 띠지 */}
        <div className="mt-2 sm:mt-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2 shadow-sm">
          <div className="flex items-start space-x-2 min-w-[150px]">
            <Clock className="w-4 h-4 text-brand-sage shrink-0 mt-0.5" />
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-brand-dark text-xs sm:text-sm">
                {storeStatus.isOpen
                  ? translateHoursText(storeStatus.hoursText, currentLanguage)
                  : getUIText('closed', currentLanguage)}
              </span>
              <span className="text-[10px] sm:text-xs text-stone-500 font-normal mt-0.5">
                {translateLastOrderText(storeStatus.lastOrderText, currentLanguage)}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end text-right space-y-1">
            <span
              className={`px-2.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full border ${
                storeStatus.isOpen
                  ? 'bg-brand-terracotta/10 text-brand-terracotta border-brand-terracotta/20'
                  : 'bg-stone-200 text-stone-600 border-stone-300'
              }`}
            >
              {storeStatus.isOpen ? getUIText('takeoutAvailable', currentLanguage) : getUIText('orderClosed', currentLanguage)}
            </span>
            <div className="flex items-center space-x-1 text-stone-500 text-[10px] sm:text-xs">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="font-medium">{translateAddress(storeStatus.address, currentLanguage)}</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
