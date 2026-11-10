import React, { useState } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Share2,
  PlusSquare,
  Sparkles,
  Copy,
  Check,
  Globe,
  RefreshCw,
  Download,
  ShieldAlert,
} from 'lucide-react';
import { APP_VERSION } from '../version';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
  onPromptInstall: () => void;
  onToast: (msg: string) => void;
  installedVersion?: string;
  onCheckUpdate?: () => void;
  isCheckingUpdate?: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onPromptInstall,
  onToast,
  installedVersion = APP_VERSION,
  onCheckUpdate,
  isCheckingUpdate = false,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    typeof window !== 'undefined'
      ? window.location.href.split('?')[0]
      : 'https://hanyang-0910.ai.studio';

  const handleCopyUrl = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl).then(() => {
        setCopied(true);
        onToast('주소가 클립보드에 복사되었습니다!');
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleDownloadApk = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch(`/hanyang-dosirak.apk?_t=${Date.now()}`);
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'hanyang-dosirak.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
        onToast('한양도시락 최신 APK 다운로드가 시작되었습니다!');
        return;
      }
    } catch (e) {
      console.warn('Fetch download note:', e);
    } finally {
      setIsDownloading(false);
    }

    const fallbackLink = document.createElement('a');
    fallbackLink.href = `/hanyang-dosirak.apk?_t=${Date.now()}`;
    fallbackLink.download = 'hanyang-dosirak.apk';
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
    onToast('한양도시락 APK 다운로드 창으로 연결되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-brand-border overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-terracotta to-orange-600 px-5 py-4 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold leading-tight">
                  스마트폰 홈화면 추가 안내
                </h3>
                <p className="text-[11px] text-white/80">
                  앱처럼 원터치로 한양도시락 바로 접속
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer text-white/90"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* App Icon Preview Card */}
          <div className="flex items-center space-x-3.5 p-3 bg-stone-50 border border-brand-border rounded-xl">
            <div className="w-13 h-13 rounded-2xl bg-white border border-stone-200 shadow-md overflow-hidden shrink-0 flex items-center justify-center p-1">
              <img
                src="/pwa-192x192.png?v=17"
                alt="한양도시락 앱 아이콘"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-brand-dark text-sm leading-tight">
                  한양도시락
                </span>
                <span className="text-[10px] font-bold text-brand-terracotta bg-brand-sand px-1.5 py-0.5 rounded-full">
                  v{installedVersion}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                설치 시 스마트폰 홈화면에 생성되는 공식 아이콘
              </p>
            </div>
          </div>

          {/* OS Switcher Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('android')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'android'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              갤럭시 / 안드로이드
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ios')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                activeTab === 'ios'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              아이폰 (iOS / Safari)
            </button>
          </div>

          {/* Android Guide */}
          {activeTab === 'android' && (
            <div className="space-y-3">
              {/* Highlight Card: 1-Time Install with Lifelong Auto-Update */}
              <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-brand-dark font-extrabold text-xs">
                  <Sparkles className="w-4 h-4 text-brand-terracotta shrink-0 animate-pulse" />
                  <span className="text-brand-terracotta">1회 설치 후 평생 자동 업데이트 (OTA 지원)</span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed font-medium">
                  스마트폰에 아래 APK를 <strong>1회만 설치</strong>해 두시면, 향후 메뉴나 가격 변경 시 <strong>앱을 재설치할 필요 없이 자동으로 최신 화면이 실시간 동기화</strong>됩니다!
                </p>
                <div className="flex items-center space-x-2 text-[10px] text-amber-900 bg-white/80 p-2 rounded-lg border border-amber-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>인터넷 연결 시 자동 갱신 + 오프라인 접속 시 내장 메뉴판 안전 작동</span>
                </div>
              </div>

              {/* Direct APK Download Card */}
              <div className="p-3.5 bg-brand-sand/60 border border-brand-border rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-brand-dark font-extrabold text-xs">
                    <Smartphone className="w-4 h-4 text-brand-terracotta" />
                    <span>안드로이드 독립 실행 APK 설치파일</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    전자서명 v1/v2/v3 검증
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  스마트폰에 전용 앱(APK)으로 설치하여 전체화면 앱으로 이용하세요.
                </p>
                <button
                  type="button"
                  onClick={handleDownloadApk}
                  disabled={isDownloading}
                  className="w-full py-3.5 px-4 bg-brand-terracotta hover:bg-brand-terracottaHover text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition active:scale-98 flex items-center justify-center space-x-2 cursor-pointer border-0"
                >
                  <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>
                    {isDownloading
                      ? '최신 APK 파일 준비 및 다운로드 중...'
                      : `한양도시락 최신 APK 1회 설치파일 다운로드 (v${installedVersion})`}
                  </span>
                </button>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                  <span>다운로드가 안 되시나요?</span>
                  <a
                    href={`/hanyang-dosirak.apk?_t=${Date.now()}`}
                    download="hanyang-dosirak.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-terracotta underline font-bold hover:text-brand-terracottaHover cursor-pointer"
                  >
                    직접 다운로드 링크
                  </a>
                </div>
              </div>

              {/* Install Notice Guide */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-[11px] text-amber-900 leading-relaxed">
                <div className="flex items-center space-x-1.5 font-bold text-amber-950">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>최초 1회 설치 시 설치 안내</span>
                </div>
                <p className="text-stone-700">
                  구글 플레이스토어를 거치지 않고 직접 설치하는 독립 패키지입니다.
                </p>
                <ul className="list-disc list-inside space-y-1 text-stone-700 pl-1">
                  <li className="text-brand-terracotta font-extrabold">
                    <b>기존 구버전 앱이 있는 경우</b>: 폰에서 기존 앱을 <u>[삭제/제거]</u>한 후 1회 설치하세요. 이후부터는 삭제 없이 자동 갱신됩니다.
                  </li>
                  <li><strong>출처를 알 수 없는 앱</strong>: 팝업 시 [설정] &gt; [이 출처 허용] 켜기</li>
                  <li><strong>Play 프로텍트 검사</strong>: [세부정보 보기] &gt; <strong>[무시하고 설치]</strong> 터치</li>
                </ul>
              </div>

              {deferredPrompt && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-brand-terracotta" />
                    <span>또는 웹 바로가기로 즉시 설치!</span>
                  </div>
                  <button
                    type="button"
                    onClick={onPromptInstall}
                    className="w-full py-2 px-4 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-lg text-xs shadow-xs transition active:scale-98 flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>홈 화면 바로가기 추가</span>
                  </button>
                </div>
              )}

              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 text-xs text-stone-700">
                <p className="font-bold text-stone-900">삼성 인터넷 / 크롬 브라우저 바로가기 방법:</p>
                <ol className="space-y-1.5 list-decimal list-inside text-[11px] leading-relaxed text-stone-600">
                  <li>
                    브라우저 우측 상단(또는 하단)의 <strong>더보기(⋮ 또는 ≡)</strong> 터치
                  </li>
                  <li>
                    메뉴에서 <strong>[현재 페이지 추가]</strong> 또는 <strong>[홈 화면에 추가]</strong> 터치
                  </li>
                  <li>바탕화면에 한양도시락 런처 아이콘 생성 완료</li>
                </ol>
              </div>
            </div>
          )}

          {/* iOS Guide */}
          {activeTab === 'ios' && (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2 text-xs text-stone-700">
              <p className="font-bold text-stone-900">Safari(사파리) 브라우저 기준:</p>
              <ol className="space-y-2.5 list-decimal list-inside text-[11px] leading-relaxed text-stone-600">
                <li className="flex items-start space-x-2">
                  <Share2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>하단 바 중앙의 <strong>[공유(네모에 화살표)]</strong> 아이콘을 누릅니다.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <PlusSquare className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <span>메뉴를 아래로 내려 <strong>[홈 화면에 추가]</strong>를 누릅니다.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>우측 상단의 <strong>[추가]</strong>를 누르면 아이콘이 생성됩니다.</span>
                </li>
              </ol>
            </div>
          )}

          {/* URL Copy Box */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span className="font-medium flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-stone-500" />
                <span>접속 주소</span>
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-brand-terracotta hover:underline font-bold text-[11px] flex items-center space-x-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? '복사완료' : '주소 복사'}</span>
              </button>
            </div>
            <div className="text-[11px] font-mono text-stone-600 bg-white p-2 rounded-lg border border-stone-200 break-all select-all">
              {currentUrl}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-brand-border flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">
            버전: v{installedVersion}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-lg text-xs transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
