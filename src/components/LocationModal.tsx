import React from 'react';
import { MapPin, X, Copy, ExternalLink } from 'lucide-react';
import {
  SupportedLanguage,
  getUIText,
  translateAddress,
} from '../utils/translations';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
  onToast: (msg: string) => void;
  lang?: SupportedLanguage;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  address,
  onToast,
  lang = 'ko',
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const naverMapUrl = `https://m.map.naver.com/search2/search.naver?query=${encodeURIComponent(
    address
  )}`;

  const handleCopy = () => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(address)
        .then(() => {
          setCopied(true);
          onToast(getUIText('addressCopiedToast', lang));
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      const tempInput = document.createElement('input');
      tempInput.value = address;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      setCopied(true);
      onToast(getUIText('addressCopiedToast', lang));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast(address);
    }
  };

  return (
    <div
      aria-labelledby="location-modal-title"
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md bg-brand-cream rounded-2xl p-5 sm:p-6 shadow-2xl border border-brand-border transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border/70">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand-terracotta" />
            <h3 className="font-extrabold text-brand-dark text-sm" id="location-modal-title">
              {getUIText('locationModalTitle', lang)}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-full text-base transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <div className="bg-white p-3 rounded-xl border border-brand-border/60">
            <p className="text-[11px] text-brand-muted font-medium mb-1">
              {getUIText('streetAddressTitle', lang)}
            </p>
            <p className="text-xs font-bold text-brand-dark select-all">
              {translateAddress(address, lang)}
            </p>
          </div>

          <div className="space-y-2">
            <a
              href={naverMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-[#03C75A] hover:bg-[#02b350] text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-sm active:scale-95 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{getUIText('naverMapBtn', lang)}</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border border-brand-border text-brand-dark text-xs font-bold flex items-center justify-center space-x-1.5 active:scale-95 transition cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-stone-600" />
              <span>
                {copied ? getUIText('copiedSuccess', lang) : getUIText('copyAddressBtn', lang)}
              </span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center border-t border-brand-border/60">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-brand-muted hover:text-brand-dark py-1 cursor-pointer"
          >
            {getUIText('close', lang)}
          </button>
        </div>
      </div>
    </div>
  );
};
