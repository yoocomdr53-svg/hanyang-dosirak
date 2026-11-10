import React from 'react';
import { DailyNoticeState } from '../types';
import { SupportedLanguage, getUIText, translateNoticeContent } from '../utils/translations';

interface NoticeBannerProps {
  notice: DailyNoticeState;
  lang?: SupportedLanguage;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({ notice, lang = 'ko' }) => {
  if (!notice.isVisible) return null;

  return (
    <section aria-label="매장 공지" className="px-3 sm:px-5 md:px-8 pt-2.5 sm:pt-3.5 pb-1">
      <div className="bg-brand-woodLight/70 border border-brand-wood/20 rounded-xl p-3 sm:p-3.5 flex items-start space-x-2.5 shadow-sm">
        <span className="text-base sm:text-lg leading-none">🍱</span>
        <div className="flex-1 text-xs sm:text-sm leading-relaxed text-[#543E2E]">
          <span className="font-bold text-brand-dark mr-1">
            {getUIText('dailyNoticeTitle', lang)}
          </span>
          <span>{lang === 'ko' ? notice.content : translateNoticeContent(notice.content, lang)}</span>
        </div>
      </div>
    </section>
  );
};
