import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (password.trim() === '1495&') {
      setHasError(false);
      setPassword('');
      onSuccess();
    } else {
      setHasError(true);
      setPassword('');
    }
  };

  const handleClose = () => {
    setPassword('');
    setHasError(false);
    onClose();
  };

  return (
    <div
      aria-labelledby="admin-modal-title"
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-xs sm:max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-brand-border transform transition-all scale-100 animate-in zoom-in-95 duration-200">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-brand-sand border border-brand-border text-brand-terracotta flex items-center justify-center text-2xl mb-3 shadow-inner">
            <Lock className="w-6 h-6 text-brand-terracotta" />
          </div>
          <h3 className="text-base font-extrabold text-brand-dark" id="admin-modal-title">
            관리자 모드 접속
          </h3>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
            매장 관리를 위해 관리자 비밀번호를 입력해주세요.
          </p>
        </div>

        {/* PIN Input Box (form 태그 대신 div + onKeyDown 사용하여 브라우저 비밀번호 저장 팝업 차단) */}
        <div
          className="my-5"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        >
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              name="admin_quick_pin"
              id="admin_quick_pin"
              autoComplete="new-password"
              data-lpignore="true"
              autoCapitalize="off"
              autoCorrect="off"
              autoFocus
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (hasError) setHasError(false);
              }}
              placeholder="비밀번호 입력"
              className="w-full h-12 px-4 pr-11 text-center text-lg font-bold tracking-widest rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-stone-900 focus:outline-none focus:border-brand-terracotta focus:ring-3 focus:ring-brand-terracotta/20 placeholder:text-stone-400 placeholder:text-xs placeholder:tracking-normal transition"
            />
            <button
              type="button"
              aria-label="비밀번호 표시 전환"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1.5 text-stone-400 hover:text-stone-700 focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {hasError && (
            <p className="text-[11px] text-red-500 font-bold text-center mt-2">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-xl bg-brand-terracotta hover:bg-brand-terracottaHover text-white text-xs font-bold shadow-sm active:scale-95 transition cursor-pointer"
          >
            확인 / 관리자 접속
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold active:scale-95 transition cursor-pointer"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};
