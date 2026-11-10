import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../types';
import { INITIAL_IMAGES } from '../data/sampleImages';
import { compressImage } from '../utils/imageCompressor';
import {
  X,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  RotateCw,
  Sun,
  Check,
  FolderOpen,
  Sparkles,
  ImageOff,
  Loader2,
} from 'lucide-react';
import { stripFormatting } from '../utils/textFormatter';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem | null;
  onSavePhoto: (menuId: string, newPhotoUrl: string, isBest?: boolean, isRec?: boolean) => void;
  onToast: (msg: string) => void;
}

export const PhotoUploadModal: React.FC<PhotoUploadModalProps> = ({
  isOpen,
  onClose,
  menuItem,
  onSavePhoto,
  onToast,
}) => {
  const [stagedImg, setStagedImg] = useState<string>('');
  const [fileName, setFileName] = useState<string>('현재 적용된 사진');
  const [fileSize, setFileSize] = useState<string>('기기 사진을 선택하여 교체할 수 있습니다.');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isBest, setIsBest] = useState<boolean>(false);
  const [isRec, setIsRec] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && menuItem) {
      setStagedImg(menuItem.img || '');
      setIsBest(!!menuItem.isBest);
      setIsRec(!!menuItem.isRec);
      setFileName(menuItem.img ? '현재 적용된 사진' : '사진 없음 (이미지 생성중)');
      setFileSize(
        menuItem.img
          ? '스마트폰 앨범 사진 또는 샘플을 선택하여 교체할 수 있습니다.'
          : '사진을 선택해주세요.'
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, menuItem?.id, menuItem?.img, menuItem?.isBest, menuItem?.isRec]);

  if (!isOpen || !menuItem) return null;

  const samplePresets = [
    { name: '김치찌개', url: INITIAL_IMAGES.kimchi },
    { name: '제육볶음', url: INITIAL_IMAGES.gochujang },
    { name: '돈까스', url: INITIAL_IMAGES.donkatsu },
    { name: '치킨마요', url: INITIAL_IMAGES.chickenmayo },
    { name: '간장불고기', url: INITIAL_IMAGES.ganjang },
    { name: '크림치킨', url: INITIAL_IMAGES.creamchicken },
    { name: '닭볶음', url: INITIAL_IMAGES.spicychicken },
    { name: '불고기컵밥', url: INITIAL_IMAGES.cupBulgogi },
    { name: '치킨마요컵밥', url: INITIAL_IMAGES.cupChicken },
    { name: '치킨세트', url: INITIAL_IMAGES.setChicken },
    { name: '착한김치', url: INITIAL_IMAGES.kindKimchi },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    setFileName(`[압축 처리 중] ${file.name}`);
    setFileSize('고화질 스마트폰 사진을 가볍게 최적화하는 중...');

    try {
      const { dataUrl, originalSizeKB, compressedSizeKB } = await compressImage(file);
      setStagedImg(dataUrl);
      setFileName(file.name);
      setFileSize(
        `최적화 완료: ${originalSizeKB} KB → ${compressedSizeKB} KB (저장 가능)`
      );
      onToast("사진이 최적화되었습니다. '적용하기'를 눌러 저장하세요!");
    } catch {
      // Fallback: standard FileReader
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        if (result) {
          setStagedImg(result);
          setFileName(file.name);
          setFileSize(`선택 완료 (${(file.size / 1024).toFixed(0)} KB)`);
          onToast("사진이 로드되었습니다. '적용하기'를 눌러 저장하세요!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
      // Reset input value so selecting the same file or subsequent files always triggers onChange!
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApply = () => {
    onSavePhoto(menuItem.id, stagedImg, isBest, isRec);
    const cleanName = stripFormatting(menuItem.name);
    const badgeMsg = isBest && isRec ? ' (BEST/추천 뱃지 적용)' : isBest ? ' (BEST 뱃지 적용)' : isRec ? ' (추천 뱃지 적용)' : '';
    if (stagedImg) {
      onToast(`[${cleanName}] 사진 및 뱃지가 성공적으로 변경 및 저장되었습니다!${badgeMsg}`);
    } else {
      onToast(`[${cleanName}] 사진이 비워져 "이미지 생성중"으로 적용되었습니다.${badgeMsg}`);
    }
    onClose();
  };

  const handleClearPhoto = () => {
    setStagedImg('');
    setFileName('사진 없음 (이미지 생성중)');
    setFileSize('"이 사진으로 적용하기" 클릭 시 "이미지 생성중"으로 표시됩니다.');
    onToast('사진이 비워졌습니다. "이 사진으로 적용하기"를 누르면 반영됩니다.');
  };

  const handleResetToInitial = () => {
    const original = menuItem.initialImg || INITIAL_IMAGES.kimchi;
    setStagedImg(original);
    setFileName('원래 기본 사진으로 복원됨');
    setFileSize('적용하기를 눌러 저장하세요.');
    onToast('기본 사진으로 리셋되었습니다.');
  };

  const handleSelectPreset = (url: string, name: string) => {
    setStagedImg(url);
    setFileName(`샘플: ${name}`);
    setFileSize('샘플 이미지 선택됨');
    onToast(`샘플 [${name}] 사진이 선택되었습니다.`);
  };

  const handleRotateImage = () => {
    if (!stagedImg) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      const rotatedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setStagedImg(rotatedDataUrl);
      onToast('사진이 90° 회전되었습니다. [수정하기]를 누르면 저장됩니다.');
    };
    img.src = stagedImg;
  };

  const handleEnhanceImage = () => {
    if (!stagedImg) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.filter = 'brightness(1.1) contrast(1.08) saturate(1.12)';
      ctx.drawImage(img, 0, 0);
      const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setStagedImg(enhancedDataUrl);
      onToast('음식 사진이 더욱 먹음직스럽게 보정되었습니다! [수정하기]를 누르면 저장됩니다.');
    };
    img.src = stagedImg;
  };

  return (
    <div
      aria-labelledby="photo-modal-title"
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-brand-cream rounded-3xl p-5 shadow-2xl border border-brand-border transform transition-all max-h-[92vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center space-x-2">
            <span className="w-7 h-7 rounded-full bg-brand-sand border border-brand-border flex items-center justify-center text-brand-terracotta text-sm">
              📸
            </span>
            <div>
              <h3 className="font-extrabold text-brand-dark text-sm" id="photo-modal-title">
                메뉴 사진 변경 / 업로드
              </h3>
              <p className="text-[11px] text-brand-muted font-medium">
                선택된 메뉴: {stripFormatting(menuItem.name)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full text-base transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-3.5 space-y-3">
          {/* Main Image Preview & Select Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 border-2 border-dashed border-brand-terracotta/40 flex flex-col items-center justify-center group cursor-pointer hover:border-brand-terracotta transition select-none"
          >
            {stagedImg ? (
              <img
                src={stagedImg}
                alt="메뉴 사진 미리보기"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#EFEAE4]">
                {/* Blurry atmospheric background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ECE5DD] via-[#F5EFE9] to-[#E2D8CC] filter blur-md scale-110" />
                <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#E8BA9B]/40 rounded-full filter blur-xl" />
                <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-[#D48B68]/25 rounded-full filter blur-xl" />
                <div className="absolute inset-0 backdrop-blur-md bg-white/20" />

                <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center border border-white/80 text-brand-terracotta">
                    <Sparkles className="w-5 h-5 text-brand-terracotta animate-pulse" />
                  </div>
                  <div className="flex items-center space-x-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta animate-ping" />
                    <span className="text-xs font-extrabold text-stone-700 tracking-tight">
                      이미지 생성중
                    </span>
                  </div>
                </div>
              </div>
            )}
            {isCompressing && (
              <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-xs flex flex-col items-center justify-center text-white z-30 animate-in fade-in">
                <Loader2 className="w-7 h-7 text-brand-terracottaLight animate-spin mb-1.5" />
                <span className="text-xs font-bold">사진 최적화 중...</span>
                <span className="text-[10px] text-stone-300">고화질 사진을 가볍게 압축하고 있습니다</span>
              </div>
            )}
            <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-bold transition p-4 text-center z-20">
              <Upload className="w-6 h-6 mb-1" />
              <span>스마트폰 앨범 / 파일에서 사진 선택</span>
              <span className="text-[10px] font-normal text-stone-200 mt-0.5">
                클릭하여 새 사진 업로드
              </span>
            </div>
            <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold backdrop-blur-xs z-20">
              미리보기
            </span>

            {/* Live Badges Preview on Photo */}
            <div className="absolute top-2 left-2 flex items-center space-x-1.5 z-20 pointer-events-none">
              {isBest && (
                <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm tracking-tight border border-red-500">
                  BEST
                </span>
              )}
              {isRec && (
                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center space-x-0.5 border border-amber-400">
                  <span>★ 추천</span>
                </span>
              )}
            </div>
          </div>

          {/* Image Quick Editing Controls */}
          {stagedImg && (
            <div className="flex items-center justify-between gap-1.5 p-2 bg-white rounded-xl border border-brand-border text-xs shadow-2xs">
              <span className="text-[11px] font-bold text-stone-600 pl-1 shrink-0">
                사진 수정:
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={handleRotateImage}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95"
                  title="사진을 90도 회전합니다"
                >
                  <RotateCw className="w-3.5 h-3.5 text-stone-600" />
                  <span>90° 회전</span>
                </button>
                <button
                  type="button"
                  onClick={handleEnhanceImage}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95"
                  title="음식 사진의 밝기와 색감을 먹음직스럽게 자동 보정합니다"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span>색감 보정</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95"
                  title="새 사진 파일로 교체합니다"
                >
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>사진 교체</span>
                </button>
              </div>
            </div>
          )}

          {/* File Meta Info */}
          <div className="bg-white p-2.5 rounded-xl border border-brand-border flex items-center justify-between text-[11px]">
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <ImageIcon className="w-4 h-4 text-stone-500 shrink-0" />
              <div className="truncate">
                <p className="font-bold text-brand-dark truncate">{fileName}</p>
                <p className="text-[10px] text-brand-muted">{fileSize}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 bg-brand-sand hover:bg-brand-border text-brand-dark px-2.5 py-1.5 rounded-lg font-bold text-[11px] border border-brand-border active:scale-95 transition flex items-center space-x-1 cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>파일 찾기</span>
            </button>
          </div>

          {/* 메뉴 사진 뱃지 설정: BEST & 추천 뱃지 토글 */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-brand-muted">
              메뉴 사진 뱃지 설정 (새 메뉴 등록과 동일)
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* BEST Badge */}
              <label
                className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                  isBest ? 'bg-red-50/80 border-red-300 shadow-2xs' : 'bg-white border-brand-border hover:bg-stone-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isBest}
                  onChange={(e) => setIsBest(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                />
                <div className="min-w-0">
                  <span className="font-extrabold text-brand-dark flex items-center space-x-1">
                    <span className="text-[9px] bg-red-600 text-white px-1.5 py-0.2 rounded font-black">BEST</span>
                    <span>뱃지</span>
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">사진 좌측 상단 붉은 BEST</span>
                </div>
              </label>

              {/* 추천 Badge */}
              <label
                className={`flex items-center space-x-2 p-2.5 rounded-xl border cursor-pointer transition select-none ${
                  isRec ? 'bg-amber-50/80 border-amber-300 shadow-2xs' : 'bg-white border-brand-border hover:bg-stone-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isRec}
                  onChange={(e) => setIsRec(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 cursor-pointer"
                />
                <div className="min-w-0">
                  <span className="font-extrabold text-brand-dark flex items-center space-x-1">
                    <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-black">추천</span>
                    <span>뱃지</span>
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">사진 좌측 상단 노란 추천</span>
                </div>
              </label>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleApply}
              className="w-full py-3 rounded-xl bg-brand-terracotta hover:bg-brand-terracottaHover text-white text-xs font-extrabold shadow-float flex items-center justify-center space-x-1.5 active:scale-98 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{stagedImg ? '업로드/선택한 사진으로 메뉴 수정하기' : '사진 없이 "이미지 생성중"으로 적용'}</span>
            </button>
            <div className="flex space-x-1.5">
              <button
                type="button"
                onClick={handleClearPhoto}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-stone-50 border border-brand-border text-stone-700 text-xs font-semibold active:scale-95 transition flex items-center justify-center space-x-1 cursor-pointer"
                title="사진을 비우고 '이미지 생성중' 상태로 설정"
              >
                <ImageOff className="w-3.5 h-3.5 text-stone-500" />
                <span>사진 비우기</span>
              </button>
              <button
                type="button"
                onClick={handleResetToInitial}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-stone-50 border border-brand-border text-stone-700 text-xs font-semibold active:scale-95 transition flex items-center justify-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>원래 복원</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-3.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold active:scale-95 transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>

          {/* Quick Preset Sample Images */}
          <div className="pt-2 border-t border-brand-border/70">
            <label className="block text-[10px] font-bold text-brand-muted mb-1.5">
              또는 추천 샘플 사진 중 선택
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {samplePresets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url, preset.name)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-brand-border hover:border-brand-terracotta active:scale-95 transition cursor-pointer"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = INITIAL_IMAGES.donkatsu;
                    }}
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white py-0.5 text-center truncate">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
