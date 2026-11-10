import React from 'react';
import { Sparkles, RefreshCw, CheckCircle2, X, Clock } from 'lucide-react';
import { AppVersionInfo } from '../types';

interface AppUpdateModalProps {
  isOpen: boolean;
  latestVersion: AppVersionInfo | null;
  installedVersion: string;
  countdown?: number | null;
  onApplyUpdate: () => void;
  onDismiss: () => void;
}

export const AppUpdateModal: React.FC<AppUpdateModalProps> = ({
  isOpen,
  latestVersion,
  installedVersion,
  countdown = null,
  onApplyUpdate,
  onDismiss,
}) => {
  if (!isOpen || !latestVersion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-terracotta to-orange-600 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold leading-tight">
                한양도시락 최신 업데이트
              </h3>
              <p className="text-[10px] text-white/80">
                실시간 자동 동기화 시스템
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white/90"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="text-center space-y-1">
            <h4 className="text-base font-extrabold text-stone-900">
              최신 컴파일 업데이트 반영 안내
            </h4>
            <p className="text-xs text-stone-600">
              새로운 메뉴 및 변경사항이 준비되었습니다.
            </p>
          </div>

          {/* Auto Countdown Pill if active */}
          {typeof countdown === 'number' && countdown > 0 && (
            <div className="bg-amber-100/80 border border-amber-300 rounded-xl p-2.5 flex items-center justify-center space-x-2 text-xs font-bold text-amber-900 animate-pulse">
              <Clock className="w-4 h-4 text-brand-terracotta animate-spin" />
              <span>
                <strong>{countdown}초</strong> 뒤 최신 화면으로 자동 반영됩니다!
              </span>
            </div>
          )}

          {/* Version Pill */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex items-center justify-around text-xs">
            <div>
              <span className="text-[10px] text-stone-500 block">현재 버전</span>
              <span className="font-bold text-stone-700">v{installedVersion}</span>
            </div>
            <div className="text-brand-terracotta font-extrabold">➔</div>
            <div>
              <span className="text-[10px] text-amber-700 font-bold block">새 버전</span>
              <span className="font-extrabold text-brand-dark">v{latestVersion.version}</span>
            </div>
          </div>

          {/* Release Notes */}
          {latestVersion.notes && latestVersion.notes.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 space-y-1.5 text-xs text-stone-700">
              {latestVersion.notes.map((note, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{note}</span>
                </div>
              ))}
            </div>
          )}

          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-center">
            💡 설치된 스마트폰 앱(APK)도 앱 재설치 없이 실시간 자동 동기화됩니다.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="button"
              onClick={onDismiss}
              className="flex-1 py-3 px-3 border border-stone-200 text-stone-700 hover:bg-stone-100 font-bold rounded-xl text-xs transition active:scale-95 cursor-pointer"
            >
              나중에 하기
            </button>
            <button
              type="button"
              onClick={onApplyUpdate}
              className="flex-2 py-3 px-4 bg-gradient-to-r from-brand-terracotta to-orange-600 hover:from-brand-terracotta-dark hover:to-orange-700 text-white font-extrabold rounded-xl text-xs shadow-md transition active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>지금 즉시 반영</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
