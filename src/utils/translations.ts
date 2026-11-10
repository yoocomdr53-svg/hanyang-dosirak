/**
 * Comprehensive Multi-Language Translation Engine for Hanyang Dosirak
 * Supports: Korean (ko, default), English (en), Japanese (ja), Chinese (zh)
 * Fully translates 100% of the entire app:
 * - All Dosirak (Bento), Cupbap (Rice Bowl, all sizes: Light, Basic, Mega), and Set menus
 * - Tags, Badges (NEW / 신메뉴, Recommended, Set, BEST, etc.)
 * - Descriptions with or without style tags ([c:...]...[/c], <span...>, etc.)
 * - Operating Hours, Last Order, Address, Daily Notice, Modals, and UI strings
 */

export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ko', label: '한국어', nativeLabel: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳' },
];

export function resolveLang(lang?: string | SupportedLanguage): SupportedLanguage {
  if (lang === 'en' || lang === 'ja' || lang === 'zh') return lang;
  return 'ko';
}

// UI Fixed Labels
export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  ko: {
    appTitle: '한양 도시락 본점',
    appSubtitle: '따뜻한 정성을 정갈히 담은 한상',
    open: '영업중',
    closed: '영업 준비중 / 마감',
    takeoutAvailable: '포장 가능',
    orderClosed: '주문 마감',
    locationGuide: '위치 안내',
    updateAvailable: '업데이트',
    adminMode: '관리자',
    languageButton: 'Language',
    searchPlaceholder: '메뉴명, 재료를 검색해보세요 (예: 김치찌개, 돈까스)',
    allCategory: '전체',
    searchResults: '검색 결과',
    viewAll: '전체보기',
    noSearchResults: '검색된 메뉴가 없습니다.',
    noSearchHint: '다른 메뉴명이나 재료를 입력해보세요.',
    soldOut: '주문 불가',
    soldOutDesc: '오늘 준비된 수량이 품절되었습니다',
    preparingImage: '이미지 생성중',
    heartfeltTag: '정성 가득',
    currencyUnit: '원',
    bestBadge: 'BEST',
    recBadge: '★ 추천',
    donationBadge: '착한 기부 1+1',
    setMenuBadge: '세트',
    signatureBadge: '대표',
    signatureFullBadge: '대표 정식',
    popularBadge: '인기',
    newMenuBadge: '신메뉴',
    dailyNoticeTitle: '오늘의 제철 국 & 반찬:',
    catDescRecommended: '오늘 가장 인기 있는 추천 메뉴',
    catDescSignature: '한양도시락 정식 라인업',
    catDescSet: '+5,000원에 국산 김치찌개 정량 제공',
    catDescCharity: '❤️ 1개 주문시 결식아동에게 1개 기부',
    catDescDefault: '라인업',
    switchLangSuccess: '언어가 변경되었습니다.',
    locationModalTitle: '한양도시락 위치 안내',
    streetAddressTitle: '매장 도로명 주소',
    naverMapBtn: '네이버 지도로 바로가기 (새창)',
    copyAddressBtn: '주소 복사하기',
    copiedSuccess: '복사 완료 ✓',
    close: '닫기',
    addressCopiedToast: '주소가 클립보드에 복사되었습니다.',
  },
  en: {
    appTitle: 'Hanyang Dosirak Main Branch',
    appSubtitle: 'A hearty, neatly prepared Korean meal',
    open: 'Open Now',
    closed: 'Closed / Preparing',
    takeoutAvailable: 'Takeout Available',
    orderClosed: 'Order Closed',
    locationGuide: 'Location',
    updateAvailable: 'Update',
    adminMode: 'Admin',
    languageButton: 'Language',
    searchPlaceholder: 'Search dishes or ingredients (e.g. Kimchi, Tonkatsu)',
    allCategory: 'All',
    searchResults: 'Search Results',
    viewAll: 'View All',
    noSearchResults: 'No dishes found.',
    noSearchHint: 'Try searching for other dishes or ingredients.',
    soldOut: 'Sold Out',
    soldOutDesc: 'Sold out for today',
    preparingImage: 'Preparing Photo',
    heartfeltTag: 'Fresh & Heartfelt',
    currencyUnit: 'KRW',
    bestBadge: 'BEST',
    recBadge: '★ Recommended',
    donationBadge: 'Donation 1+1',
    setMenuBadge: 'Set Combo',
    signatureBadge: 'Signature',
    signatureFullBadge: 'Signature Table',
    popularBadge: 'Popular',
    newMenuBadge: 'NEW',
    dailyNoticeTitle: "Today's Seasonal Soup & Side Dishes:",
    catDescRecommended: "Today's most popular recommended dishes",
    catDescSignature: 'Hanyang Dosirak traditional table lineup',
    catDescSet: '+5,000 KRW for full-size Korean Kimchi Stew',
    catDescCharity: '❤️ 1 meal donated to children in need per order',
    catDescDefault: 'Lineup',
    switchLangSuccess: 'Language switched to English.',
    locationModalTitle: 'Hanyang Dosirak Store Location',
    streetAddressTitle: 'Street Address',
    naverMapBtn: 'Open in Naver Map (New Window)',
    copyAddressBtn: 'Copy Address',
    copiedSuccess: 'Copied ✓',
    close: 'Close',
    addressCopiedToast: 'Address copied to clipboard.',
  },
  ja: {
    appTitle: '漢陽(ハニャン)お弁当 本店',
    appSubtitle: '温かい真心を端正に込めた一膳',
    open: '営業中',
    closed: '準備中 / 営業終了',
    takeoutAvailable: 'テイクアウト可',
    orderClosed: '注文受付終了',
    locationGuide: '店舗案内',
    updateAvailable: '更新',
    adminMode: '管理者',
    languageButton: '言語切替',
    searchPlaceholder: 'メニューや食材を検索 (例: キムチチゲ、とんかつ)',
    allCategory: 'すべて',
    searchResults: '検索結果',
    viewAll: 'すべて表示',
    noSearchResults: '該当するメニューがありません。',
    noSearchHint: '他のメニュー名や食材を入力してください。',
    soldOut: '売り切れ',
    soldOutDesc: '本日の数量は完売いたしました',
    preparingImage: '画像準備中',
    heartfeltTag: '真心たっぷり',
    currencyUnit: 'ウォン',
    bestBadge: '人気No.1',
    recBadge: '★ おすすめ',
    donationBadge: '寄付 1+1',
    setMenuBadge: 'セット',
    signatureBadge: '看板',
    signatureFullBadge: '看板定食',
    popularBadge: '人気',
    newMenuBadge: '新メニュー',
    dailyNoticeTitle: '本日の季節のスープ＆おかず:',
    catDescRecommended: '本日一番人気のおすすめメニュー',
    catDescSignature: '漢陽お弁当の本格定食ラインナップ',
    catDescSet: '+5,000ウォンで韓国産キムチチゲをたっぷり提供',
    catDescCharity: '❤️ 1個注文につき食事に困る子どもたちへ1個寄付',
    catDescDefault: 'ラインナップ',
    switchLangSuccess: '言語を日本語に切り替えました。',
    locationModalTitle: '漢陽(ハニャン)お弁当 店舗案内',
    streetAddressTitle: '店舗住所 (道路名住所)',
    naverMapBtn: 'NAVERマップで開く (新規ウィンドウ)',
    copyAddressBtn: '住所をコピー',
    copiedSuccess: 'コピー完了 ✓',
    close: '閉じる',
    addressCopiedToast: '住所がクリップボードにコピーされました。',
  },
  zh: {
    appTitle: '汉阳便当 总店',
    appSubtitle: '精心烹制的精致韩式暖心套餐',
    open: '营业中',
    closed: '准备中 / 打烊',
    takeoutAvailable: '可外带',
    orderClosed: '截止点单',
    locationGuide: '店铺位置',
    updateAvailable: '更新',
    adminMode: '管理员',
    languageButton: '切换语言',
    searchPlaceholder: '搜索菜品或食材 (例如: 泡菜汤, 炸猪排)',
    allCategory: '全部',
    searchResults: '搜索结果',
    viewAll: '查看全部',
    noSearchResults: '未找到相关菜单。',
    noSearchHint: '请尝试输入其他菜品名称或食材。',
    soldOut: '已售罄',
    soldOutDesc: '今日份量已售罄',
    preparingImage: '图片准备中',
    heartfeltTag: '诚意满满',
    currencyUnit: '韩元',
    bestBadge: '招牌TOP',
    recBadge: '★ 推荐',
    donationBadge: '爱心公益 1+1',
    setMenuBadge: '套餐',
    signatureBadge: '招牌',
    signatureFullBadge: '招牌正餐',
    popularBadge: '人气',
    newMenuBadge: '新品',
    dailyNoticeTitle: '今日时令汤品与小菜:',
    catDescRecommended: '今日最受欢迎的推荐菜品',
    catDescSignature: '汉阳便当传统正餐阵容',
    catDescSet: '+5,000韩元享纯正韩国泡菜汤一份',
    catDescCharity: '❤️ 每点一份即为贫困儿童捐赠一份',
    catDescDefault: '阵容',
    switchLangSuccess: '已切换为中文。',
    locationModalTitle: '汉阳便当 店铺地理位置',
    streetAddressTitle: '店铺道路名地址',
    naverMapBtn: '在NAVER地图中打开 (新窗口)',
    copyAddressBtn: '复制地址',
    copiedSuccess: '复制成功 ✓',
    close: '关闭',
    addressCopiedToast: '地址已复制到剪贴板。',
  },
};

// 100% Complete 1:1 Menu Name Translations for Dosirak, Cupbap (all sizes), and Set menus
export const MENU_NAME_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // --- 1. DOSIRAK (BENTO) ---
  '국산 김치찌개 도시락': {
    ko: '국산 김치찌개 도시락',
    en: 'Domestic Kimchi Stew Bento',
    ja: '国産キムチチゲ弁当',
    zh: '国产泡菜汤便当',
  },
  '치킨마요 도시락': {
    ko: '치킨마요 도시락',
    en: 'Chicken Mayo Bento',
    ja: 'チキンマヨ弁当',
    zh: '鸡肉蛋黄酱便当',
  },
  '간장 불고기 도시락': {
    ko: '간장 불고기 도시락',
    en: 'Soy Sauce Bulgogi Bento',
    ja: '醤油プルコギ弁当',
    zh: '酱油烤肉便当',
  },
  '고추장 불고기 도시락': {
    ko: '고추장 불고기 도시락',
    en: 'Spicy Gochujang Bulgogi Bento',
    ja: 'コチュジャンプルコギ弁当',
    zh: '辣酱烤肉便当',
  },
  '왕등심 돈가스 도시락': {
    ko: '왕등심 돈가스 도시락',
    en: 'Jumbo Pork Sirloin Cutlet Bento',
    ja: '大判ロースかつ弁当',
    zh: '大王里脊炸猪排便当',
  },
  '크림퐁당 닭가슴살 도시락': {
    ko: '크림퐁당 닭가슴살 도시락',
    en: 'Cream Fondue Chicken Breast Bento',
    ja: 'クリームフォンデュ鶏むね肉弁当',
    zh: '奶油鸡胸肉便当',
  },
  '수제 생등심 돈가스 도시락': {
    ko: '수제 생등심 돈가스 도시락',
    en: 'Handmade Fresh Sirloin Cutlet Bento',
    ja: '自家製生ロースかつ弁当',
    zh: '手工鲜里脊炸猪排便当',
  },
  '김치나베 돈가스 도시락': {
    ko: '김치나베 돈가스 도시락',
    en: 'Kimchi Nabe Pork Cutlet Bento',
    ja: 'キムチ鍋かつ弁当',
    zh: '泡菜锅炸猪排便当',
  },
  '프리미엄 고추장 불고기 도시락': {
    ko: '프리미엄 고추장 불고기 도시락',
    en: 'Premium Spicy Gochujang Bulgogi Bento',
    ja: '特選コチュジャンプルコギ弁当',
    zh: '特级辣酱烤肉便当',
  },
  '프리미엄 간장 불고기 도시락': {
    ko: '프리미엄 간장 불고기 도시락',
    en: 'Premium Soy Sauce Bulgogi Bento',
    ja: '特選醤油プルコギ弁当',
    zh: '特级酱油烤肉便当',
  },
  '프리미엄 우삼겹 도시락': {
    ko: '프리미엄 우삼겹 도시락',
    en: 'Premium Beef Short Plate Bento',
    ja: '特選牛バラ焼き弁当',
    zh: '特级牛五花便当',
  },

  // --- 2. CUPBAP (BASE DISHES & SIZE COMBOS) ---
  '치킨마요 컵밥': {
    ko: '치킨마요 컵밥',
    en: 'Chicken Mayo Cupbap',
    ja: 'チキンマヨカップご飯',
    zh: '炸鸡蛋黄酱杯饭',
  },
  '치킨마요 컵밥 라이트': {
    ko: '치킨마요 컵밥 라이트',
    en: 'Chicken Mayo Cupbap Light',
    ja: 'チキンマヨカップご飯 ライト',
    zh: '炸鸡蛋黄酱杯饭 轻量',
  },
  '치킨마요 컵밥 베이직': {
    ko: '치킨마요 컵밥 베이직',
    en: 'Chicken Mayo Cupbap Basic',
    ja: 'チキンマヨカップご飯 ベーシック',
    zh: '炸鸡蛋黄酱杯饭 经典',
  },
  '치킨마요 컵밥 메가': {
    ko: '치킨마요 컵밥 메가',
    en: 'Chicken Mayo Cupbap Mega',
    ja: 'チキンマヨカップご飯 メガ',
    zh: '炸鸡蛋黄酱杯饭 特大',
  },

  '간장 불고기 컵밥': {
    ko: '간장 불고기 컵밥',
    en: 'Soy Sauce Bulgogi Cupbap',
    ja: '醤油プルコギカップご飯',
    zh: '酱油烤肉杯饭',
  },
  '간장 불고기 컵밥 라이트': {
    ko: '간장 불고기 컵밥 라이트',
    en: 'Soy Sauce Bulgogi Cupbap Light',
    ja: '醤油プルコギカップご飯 ライト',
    zh: '酱油烤肉杯饭 轻量',
  },
  '간장 불고기 컵밥 베이직': {
    ko: '간장 불고기 컵밥 베이직',
    en: 'Soy Sauce Bulgogi Cupbap Basic',
    ja: '醤油プルコギカップご飯 ベーシック',
    zh: '酱油烤肉杯饭 经典',
  },
  '간장 불고기 컵밥 메가': {
    ko: '간장 불고기 컵밥 메가',
    en: 'Soy Sauce Bulgogi Cupbap Mega',
    ja: '醤油プルコギカップご飯 メガ',
    zh: '酱油烤肉杯饭 特大',
  },

  '고추장 불고기 컵밥': {
    ko: '고추장 불고기 컵밥',
    en: 'Spicy Gochujang Bulgogi Cupbap',
    ja: 'コチュジャンプルコギカップご飯',
    zh: '辣酱烤肉杯饭',
  },
  '고추장 불고기 컵밥 라이트': {
    ko: '고추장 불고기 컵밥 라이트',
    en: 'Spicy Gochujang Bulgogi Cupbap Light',
    ja: 'コチュジャンプルコギカップご飯 ライト',
    zh: '辣酱烤肉杯饭 轻量',
  },
  '고추장 불고기 컵밥 베이직': {
    ko: '고추장 불고기 컵밥 베이직',
    en: 'Spicy Gochujang Bulgogi Cupbap Basic',
    ja: 'コチュジャンプルコギカップご飯 ベーシック',
    zh: '辣酱烤肉杯饭 经典',
  },
  '고추장 불고기 컵밥 메가': {
    ko: '고추장 불고기 컵밥 메가',
    en: 'Spicy Gochujang Bulgogi Cupbap Mega',
    ja: 'コチュジャンプルコギカップご飯 メガ',
    zh: '辣酱烤肉杯饭 特大',
  },

  '불고기 컵밥': {
    ko: '불고기 컵밥',
    en: 'Bulgogi Cupbap (Rice Bowl)',
    ja: 'プルコギカップご飯',
    zh: '韩式烤肉杯饭',
  },
  '불고기 컵밥 라이트': {
    ko: '불고기 컵밥 라이트',
    en: 'Bulgogi Cupbap Light',
    ja: 'プルコギカップご飯 ライト',
    zh: '烤肉杯饭 轻量',
  },
  '불고기 컵밥 베이직': {
    ko: '불고기 컵밥 베이직',
    en: 'Bulgogi Cupbap Basic',
    ja: 'プルコギカップご飯 ベーシック',
    zh: '烤肉杯饭 经典',
  },
  '불고기 컵밥 메가': {
    ko: '불고기 컵밥 메가',
    en: 'Bulgogi Cupbap Mega',
    ja: 'プルコギカップご飯 メガ',
    zh: '烤肉杯饭 特大',
  },

  '참치마요 컵밥': {
    ko: '참치마요 컵밥',
    en: 'Tuna Mayo Cupbap',
    ja: 'ツナマヨカップご飯',
    zh: '金枪鱼蛋黄酱杯饭',
  },
  '참치마요 컵밥 라이트': {
    ko: '참치마요 컵밥 라이트',
    en: 'Tuna Mayo Cupbap Light',
    ja: 'ツナマヨカップご飯 ライト',
    zh: '金枪鱼蛋黄酱杯饭 轻量',
  },
  '참치마요 컵밥 베이직': {
    ko: '참치마요 컵밥 베이직',
    en: 'Tuna Mayo Cupbap Basic',
    ja: 'ツナマヨカップご飯 ベーシック',
    zh: '金枪鱼蛋黄酱杯饭 经典',
  },
  '참치마요 컵밥 메가': {
    ko: '참치마요 컵밥 메가',
    en: 'Tuna Mayo Cupbap Mega',
    ja: 'ツナマヨカップご飯 メガ',
    zh: '金枪鱼蛋黄酱杯饭 特大',
  },

  '스팸마요 컵밥': {
    ko: '스팸마요 컵밥',
    en: 'Spam Mayo Cupbap',
    ja: 'スパムマヨカップご飯',
    zh: '世棒午餐肉杯饭',
  },
  '스팸마요 컵밥 라이트': {
    ko: '스팸마요 컵밥 라이트',
    en: 'Spam Mayo Cupbap Light',
    ja: 'スパムマヨカップご飯 ライト',
    zh: '世棒午餐肉杯饭 轻量',
  },
  '스팸마요 컵밥 베이직': {
    ko: '스팸마요 컵밥 베이직',
    en: 'Spam Mayo Cupbap Basic',
    ja: 'スパムマヨカップご飯 ベーシック',
    zh: '世棒午餐肉杯饭 经典',
  },
  '스팸마요 컵밥 메가': {
    ko: '스팸마요 컵밥 메가',
    en: 'Spam Mayo Cupbap Mega',
    ja: 'スパムマヨカップご飯 メガ',
    zh: '世棒午餐肉杯饭 特大',
  },

  '제육 컵밥': {
    ko: '제육 컵밥',
    en: 'Spicy Pork Cupbap',
    ja: 'ピリ辛豚肉カップご飯',
    zh: '辣炒猪肉杯饭',
  },
  '제육 컵밥 라이트': {
    ko: '제육 컵밥 라이트',
    en: 'Spicy Pork Cupbap Light',
    ja: 'ピリ辛豚肉カップご飯 ライト',
    zh: '辣炒猪肉杯饭 轻量',
  },
  '제육 컵밥 베이직': {
    ko: '제육 컵밥 베이직',
    en: 'Spicy Pork Cupbap Basic',
    ja: 'ピリ辛豚肉カップご飯 ベーシック',
    zh: '辣炒猪肉杯饭 经典',
  },
  '제육 컵밥 메가': {
    ko: '제육 컵밥 메가',
    en: 'Spicy Pork Cupbap Mega',
    ja: 'ピリ辛豚肉カップご飯 メガ',
    zh: '辣炒猪肉杯饭 特大',
  },

  '수제 돈까스 컵밥': {
    ko: '수제 돈까스 컵밥',
    en: 'Handmade Pork Cutlet Cupbap',
    ja: '自家製とんかつカップご飯',
    zh: '手工炸猪排杯饭',
  },
  '수제 돈까스 컵밥 라이트': {
    ko: '수제 돈까스 컵밥 라이트',
    en: 'Handmade Pork Cutlet Cupbap Light',
    ja: '自家製とんかつカップご飯 ライト',
    zh: '手工炸猪排杯饭 轻量',
  },
  '수제 돈까스 컵밥 베이직': {
    ko: '수제 돈까스 컵밥 베이직',
    en: 'Handmade Pork Cutlet Cupbap Basic',
    ja: '自家製とんかつカップご飯 ベーシック',
    zh: '手工炸猪排杯饭 经典',
  },
  '수제 돈까스 컵밥 메가': {
    ko: '수제 돈까스 컵밥 메가',
    en: 'Handmade Pork Cutlet Cupbap Mega',
    ja: '自家製とんかつカップご飯 メガ',
    zh: '手工炸猪排杯饭 特大',
  },

  '소불고기 컵밥': {
    ko: '소불고기 컵밥',
    en: 'Beef Bulgogi Cupbap',
    ja: '牛プルコギカップご飯',
    zh: '牛肉烤肉杯饭',
  },
  '소불고기 컵밥 라이트': {
    ko: '소불고기 컵밥 라이트',
    en: 'Beef Bulgogi Cupbap Light',
    ja: '牛プルコギカップご飯 ライト',
    zh: '牛肉烤肉杯饭 轻量',
  },
  '소불고기 컵밥 베이직': {
    ko: '소불고기 컵밥 베이직',
    en: 'Beef Bulgogi Cupbap Basic',
    ja: '牛プルコギカップご飯 ベーシック',
    zh: '牛肉烤肉杯饭 经典',
  },
  '소불고기 컵밥 메가': {
    ko: '소불고기 컵밥 메가',
    en: 'Beef Bulgogi Cupbap Mega',
    ja: '牛プルコギカップご飯 メガ',
    zh: '牛肉烤肉杯饭 特大',
  },

  '김치제육 컵밥': {
    ko: '김치제육 컵밥',
    en: 'Kimchi Spicy Pork Cupbap',
    ja: 'キムチ豚炒めカップご飯',
    zh: '泡菜炒猪肉杯饭',
  },
  '김치제육 컵밥 라이트': {
    ko: '김치제육 컵밥 라이트',
    en: 'Kimchi Spicy Pork Cupbap Light',
    ja: 'キムチ豚炒めカップご飯 ライト',
    zh: '泡菜炒猪肉杯饭 轻量',
  },
  '김치제육 컵밥 베이직': {
    ko: '김치제육 컵밥 베이직',
    en: 'Kimchi Spicy Pork Cupbap Basic',
    ja: 'キムチ豚炒めカップご飯 ベーシック',
    zh: '泡菜炒猪肉杯饭 经典',
  },
  '김치제육 컵밥 메가': {
    ko: '김치제육 컵밥 메가',
    en: 'Kimchi Spicy Pork Cupbap Mega',
    ja: 'キムチ豚炒めカップご飯 メガ',
    zh: '泡菜炒猪肉杯饭 特大',
  },

  '치킨카레 컵밥': {
    ko: '치킨카레 컵밥',
    en: 'Chicken Curry Cupbap',
    ja: 'チキンカレーカップご飯',
    zh: '咖喱炸鸡杯饭',
  },
  '치킨카레 컵밥 라이트': {
    ko: '치킨카레 컵밥 라이트',
    en: 'Chicken Curry Cupbap Light',
    ja: 'チキンカレーカップご飯 ライト',
    zh: '咖喱炸鸡杯饭 轻量',
  },
  '치킨카레 컵밥 베이직': {
    ko: '치킨카레 컵밥 베이직',
    en: 'Chicken Curry Cupbap Basic',
    ja: 'チキンカレーカップご飯 ベーシック',
    zh: '咖喱炸鸡杯饭 经典',
  },
  '치킨카레 컵밥 메가': {
    ko: '치킨카레 컵밥 메가',
    en: 'Chicken Curry Cupbap Mega',
    ja: 'チキンカレーカップご飯 メガ',
    zh: '咖喱炸鸡杯饭 特大',
  },

  '통새우튀김 컵밥': {
    ko: '통새우튀김 컵밥',
    en: 'Crispy Jumbo Shrimp Cupbap',
    ja: 'エビフライカップご飯',
    zh: '香酥炸虾杯饭',
  },
  '통새우튀김 컵밥 라이트': {
    ko: '통새우튀김 컵밥 라이트',
    en: 'Crispy Jumbo Shrimp Cupbap Light',
    ja: 'エビフライカップご飯 ライト',
    zh: '香酥炸虾杯饭 轻量',
  },
  '통새우튀김 컵밥 베이직': {
    ko: '통새우튀김 컵밥 베이직',
    en: 'Crispy Jumbo Shrimp Cupbap Basic',
    ja: 'エビフライカップご飯 ベーシック',
    zh: '香酥炸虾杯饭 经典',
  },
  '통새우튀김 컵밥 메가': {
    ko: '통새우튀김 컵밥 메가',
    en: 'Crispy Jumbo Shrimp Cupbap Mega',
    ja: 'エビフライカップご飯 メガ',
    zh: '香酥炸虾杯饭 特大',
  },

  // --- 3. SET MENUS (세트 메뉴) ---
  '프리미엄 고추장 불고기 도시락 세트': {
    ko: '프리미엄 고추장 불고기 도시락 세트',
    en: 'Premium Spicy Gochujang Bulgogi Bento Set',
    ja: '特選コチュジャンプルコギ弁当セット',
    zh: '特级辣酱烤肉便当套餐',
  },
  '프리미엄 간장 불고기 도시락 세트': {
    ko: '프리미엄 간장 불고기 도시락 세트',
    en: 'Premium Soy Sauce Bulgogi Bento Set',
    ja: '特選醤油プルコギ弁当セット',
    zh: '特级酱油烤肉便当套餐',
  },
  '프리미엄 우삼겹 도시락 세트': {
    ko: '프리미엄 우삼겹 도시락 세트',
    en: 'Premium Beef Short Plate Bento Set',
    ja: '特選牛バラ焼き弁当セット',
    zh: '特级牛五花便当套餐',
  },
  '김치나베 돈가스 도시락 세트': {
    ko: '김치나베 돈가스 도시락 세트',
    en: 'Kimchi Nabe Pork Cutlet Bento Set',
    ja: 'キムチ鍋かつ弁当セット',
    zh: '泡菜锅炸猪排便当套餐',
  },
  '치킨마요 도시락 세트': {
    ko: '치킨마요 도시락 세트',
    en: 'Chicken Mayo Bento Set',
    ja: 'チキンマヨ弁当セット',
    zh: '鸡肉蛋黄酱便当套餐',
  },
  '왕등심 돈가스 도시락 세트': {
    ko: '왕등심 돈가스 도시락 세트',
    en: 'Jumbo Pork Sirloin Cutlet Bento Set',
    ja: '大判ロースかつ弁当セット',
    zh: '大王里脊炸猪排便当套餐',
  },
  '수제 생등심 돈가스 도시락 세트': {
    ko: '수제 생등심 돈가스 도시락 세트',
    en: 'Handmade Fresh Sirloin Cutlet Bento Set',
    ja: '自家製生ロースかつ弁当セット',
    zh: '手工鲜里脊炸猪排便当套餐',
  },
  '크림퐁당 닭가슴살 도시락 세트': {
    ko: '크림퐁당 닭가슴살 도시락 세트',
    en: 'Cream Fondue Chicken Breast Bento Set',
    ja: 'クリームフォンデュ鶏むね肉弁当セット',
    zh: '奶油鸡胸肉便当套餐',
  },
  '국산 김치찌개 도시락 세트': {
    ko: '국산 김치찌개 도시락 세트',
    en: 'Domestic Kimchi Stew Bento Set',
    ja: '国産キムチチゲ弁当セット',
    zh: '国产泡菜汤便当套餐',
  },
  '고추장 불고기 세트': {
    ko: '고추장 불고기 세트',
    en: 'Spicy Gochujang Bulgogi Set',
    ja: 'コチュジャンプルコギセット',
    zh: '辣酱烤肉套餐',
  },
  '간장 불고기 세트': {
    ko: '간장 불고기 세트',
    en: 'Soy Sauce Bulgogi Set',
    ja: '醤油プルコギセット',
    zh: '酱油烤肉套餐',
  },
  '치킨마요 세트': {
    ko: '치킨마요 세트',
    en: 'Chicken Mayo Set',
    ja: 'チキンマヨセット',
    zh: '鸡肉蛋黄酱套餐',
  },
  '돈가스 세트': {
    ko: '돈가스 세트',
    en: 'Pork Cutlet Set',
    ja: 'とんかつセット',
    zh: '炸猪排套餐',
  },
  '돈까스 세트': {
    ko: '돈까스 세트',
    en: 'Pork Cutlet Set',
    ja: 'とんかつセット',
    zh: '炸猪排套餐',
  },
  '제육 세트': {
    ko: '제육 세트',
    en: 'Spicy Pork Set',
    ja: '豚肉炒めセット',
    zh: '辣炒猪肉套餐',
  },
  '김치찌개 세트': {
    ko: '김치찌개 세트',
    en: 'Kimchi Stew Set',
    ja: 'キムチチゲセット',
    zh: '泡菜汤套餐',
  },
  '불고기 컵밥 세트': {
    ko: '불고기 컵밥 세트',
    en: 'Bulgogi Cupbap Set',
    ja: 'プルコギカップご飯セット',
    zh: '韩式烤肉杯饭套餐',
  },
  '치킨마요 컵밥 세트': {
    ko: '치킨마요 컵밥 세트',
    en: 'Chicken Mayo Cupbap Set',
    ja: 'チキンマヨカップご飯セット',
    zh: '炸鸡蛋黄酱杯饭套餐',
  },
  '참치마요 컵밥 세트': {
    ko: '참치마요 컵밥 세트',
    en: 'Tuna Mayo Cupbap Set',
    ja: 'ツナマヨカップご飯セット',
    zh: '金枪鱼蛋黄酱杯饭套餐',
  },
  '스팸마요 컵밥 세트': {
    ko: '스팸마요 컵밥 세트',
    en: 'Spam Mayo Cupbap Set',
    ja: 'スパムマヨカップご飯セット',
    zh: '世棒午餐肉杯饭套餐',
  },
  '제육 컵밥 세트': {
    ko: '제육 컵밥 세트',
    en: 'Spicy Pork Cupbap Set',
    ja: 'ピリ辛豚肉カップご飯セット',
    zh: '辣炒猪肉杯饭套餐',
  },
  '수제 돈까스 컵밥 세트': {
    ko: '수제 돈까스 컵밥 세트',
    en: 'Handmade Pork Cutlet Cupbap Set',
    ja: '自家製とんかつカップご飯セット',
    zh: '手工炸猪排杯饭套餐',
  },
  '소불고기 컵밥 세트': {
    ko: '소불고기 컵밥 세트',
    en: 'Beef Bulgogi Cupbap Set',
    ja: '牛プルコギカップご飯セット',
    zh: '牛肉烤肉杯饭套餐',
  },
  '김치제육 컵밥 세트': {
    ko: '김치제육 컵밥 세트',
    en: 'Kimchi Spicy Pork Cupbap Set',
    ja: 'キムチ豚炒めカップご飯セット',
    zh: '泡菜炒猪肉杯饭套餐',
  },
  '치킨카레 컵밥 세트': {
    ko: '치킨카레 컵밥 세트',
    en: 'Chicken Curry Cupbap Set',
    ja: 'チキンカレーカップご飯セット',
    zh: '咖喱炸鸡杯饭套餐',
  },
  '통새우튀김 컵밥 세트': {
    ko: '통새우튀김 컵밥 세트',
    en: 'Crispy Jumbo Shrimp Cupbap Set',
    ja: 'エビフライカップご飯セット',
    zh: '香酥炸虾杯饭套餐',
  },

  // --- 4. SIDES (반찬) ---
  '수제 반찬 4종 세트': {
    ko: '수제 반찬 4종 세트',
    en: 'Handmade 4 Side Dishes Set',
    ja: '自家製おかず4種セット',
    zh: '手工精选4样小菜',
  },
  '얼큰 국산 김치찌개(단품)': {
    ko: '얼큰 국산 김치찌개(단품)',
    en: 'Spicy Domestic Kimchi Stew (Single)',
    ja: '旨辛国産キムチチゲ(単品)',
    zh: '香辣国产泡菜汤(单品)',
  },
};

// 100% Complete 1:1 Menu Description Translations
export const MENU_DESC_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  // --- DOSIRAK (BENTO) DESCRIPTIONS ---
  '국내산 배추, 고춧가루, 양념을 사용하여 끓인 김치찌개와 정성 가득한 반찬': {
    ko: '국내산 배추, 고춧가루, 양념을 사용하여 끓인 김치찌개와 정성 가득한 반찬',
    en: 'Authentic spicy kimchi stew simmered with 100% domestic cabbage and chili powder, served with wholesome side dishes.',
    ja: '国産白菜・唐辛子粉・特製ヤンニョムで煮込んだ伝統キムチチゲと真心込めたおかず。',
    zh: '选用韩国国产白菜、辣椒面与秘制调料精心熬制的浓郁泡菜汤，搭配多款精致手工小菜。',
  },
  '우유를 넣어 부드러운 스크램블 에그와 특제 소스로 만든 치킨마요 덮밥 도시락': {
    ko: '우유를 넣어 부드러운 스크램블 에그와 특제 소스로 만든 치킨마요 덮밥 도시락',
    en: 'Crispy chicken and silky scrambled milk eggs glazed with our savory secret sauce over warm rice.',
    ja: '牛乳を加えてふわとろに仕上げたスクランブルエッグと秘伝ソースが絶品のチキンマヨ弁当。',
    zh: '加入鲜奶的丝滑炒蛋，搭配香脆鸡肉与秘制酱汁的经典韩式便当。',
  },
  '맵지 않고 달콤 짭짤한 간장 양념의 돼지 불고기와 정성 가득한 반찬이 어우러진 정식': {
    ko: '맵지 않고 달콤 짭짤한 간장 양념의 돼지 불고기와 정성 가득한 반찬이 어우러진 정식',
    en: 'Sweet and savory soy-glazed pork bulgogi with an array of freshly prepared daily sides.',
    ja: '辛くなく甘じょっぱい特製醤油ダレの豚プルコギと真心込めたおかずが調和した満足定食。',
    zh: '甜咸适口秘制酱油猪肉烤肉，搭配丰盛手工小菜的温馨正餐。',
  },
  '한양도시락 대표 메뉴. 자극적이지 않고 매콤달콤한 고추장 불고기와 정갈한 찬': {
    ko: '한양도시락 대표 메뉴. 자극적이지 않고 매콤달콤한 고추장 불고기와 정갈한 찬',
    en: 'Signature dish. Sweet & spicy fire-grilled gochujang pork bulgogi served with neat sides.',
    ja: '漢陽お弁当の看板メニュー。程よい辛さと甘さのコチュジャンプルコギと端正なおかず。',
    zh: '汉阳便当经典代表。甜辣可口秘制韩式辣酱烤肉，搭配清爽小菜。',
  },
  '한돈 왕등심 돈까스(200g 이상)와 수제 피클과 정성 가득한 반찬이 어우러진 도시락': {
    ko: '한돈 왕등심 돈까스(200g 이상)와 수제 피클과 정성 가득한 반찬이 어우러진 도시락',
    en: 'Jumbo Korean pork sirloin cutlet (over 200g) paired with homemade pickles and hearty sides.',
    ja: '韓国産大判ロースかつ(200g以上)と手作りピクルス、真心のおかずが調和した豪華弁当。',
    zh: '精选大王里脊炸猪排(200g以上)配手工腌黄瓜与精致小菜的实在便当。',
  },
  '부드러운 크림소스에 퐁당 빠진 담백한 닭가슴살. 고춧가루와 갈릭 파우더로 느끼함 없는 맛': {
    ko: '부드러운 크림소스에 퐁당 빠진 담백한 닭가슴살. 고춧가루와 갈릭 파우더로 느끼함 없는 맛',
    en: 'Tender chicken breast in rich velvety cream sauce, accented with garlic powder and chili flakes.',
    ja: '滑らかなクリームソースを絡めたヘルシーな鶏むね肉。ガーリックパウダーで後味すっきり。',
    zh: '浸润浓郁奶油酱汁的鲜嫩鸡胸肉，蒜香与微辣点缀，香浓不腻。',
  },
  '신선한 국내산 생등심을 매일 아침 직접 빵가루를 입혀 튀겨낸 바삭 촉촉 프리미엄 돈가스': {
    ko: '신선한 국내산 생등심을 매일 아침 직접 빵가루를 입혀 튀겨낸 바삭 촉촉 프리미엄 돈가스',
    en: 'Fresh domestic sirloin hand-breaded and fried each morning for maximum crispness and juiciness.',
    ja: '毎朝手仕込みの生パン粉で揚げた、外はサクサク中はジューシーな最高級生ロースかつ。',
    zh: '每日清晨手工裹糠现炸的新鲜生里脊，外酥里嫩的豪华炸猪排。',
  },
  '얼큰하고 시원한 김치 국물에 바삭한 돈까스가 어우러진 찌개 나베': {
    ko: '얼큰하고 시원한 김치 국물에 바삭한 돈까스가 어우러진 찌개 나베',
    en: 'Crispy pork cutlet simmered in savory, refreshing kimchi broth hot pot.',
    ja: '旨辛キムチスープにサクサクとんかつが絶妙に絡む特製鍋。',
    zh: '酥脆炸猪排浸入鲜香爽辣泡菜浓汤中的热腾腾锅物。',
  },
  '매콤달콤 불고기와 얼큰한 국산 김치찌개 한상 세트': {
    ko: '매콤달콤 불고기와 얼큰한 국산 김치찌개 한상 세트',
    en: 'Delightful set combo with sweet-spicy bulgogi and authentic domestic kimchi stew table.',
    ja: '甘辛プルコギと旨辛の国産キムチチゲが揃った満足セット。',
    zh: '甜辣烤肉配正宗国产辣泡菜汤的丰盛正餐套餐。',
  },
  '달콤짭조름한 간장 불고기에 시원 칼칼한 김치찌개 세트': {
    ko: '달콤짭조름한 간장 불고기에 시원 칼칼한 김치찌개 세트',
    en: 'Classic savory combo: soy sauce bulgogi paired with hearty kimchi stew.',
    ja: '甘辛醤油プルコギと爽快なピリ辛キムチチゲの王道セット。',
    zh: '咸甜酱油烤肉搭配酸辣爽口泡菜汤的经典套餐。',
  },
  '고소한 우삼겹 구이와 얼큰한 찌개까지 즐기는 최고급 한상': {
    ko: '고소한 우삼겹 구이와 얼큰한 찌개까지 즐기는 최고급 한상',
    en: 'Premium feast pairing tender grilled beef short plate with rich savory stew.',
    ja: '香ばしい牛バラ焼きと旨辛チゲを贅沢に楽しむ極上セット。',
    zh: '焦香烤牛五花搭配香浓辣炖汤的尊享豪华套餐。',
  },

  // --- CUPBAP COMPLETE DESCRIPTIONS (INCLUDING USER SCREENSHOT & SIZES) ---
  '정성가득 고추장 불고기에 계란후라이가 곁들어진 컵밥': {
    ko: '정성가득 고추장 불고기에 계란후라이가 곁들어진 컵밥',
    en: 'Hearty rice bowl topped with spicy gochujang bulgogi and a fresh fried egg.',
    ja: '真心込めたコチュジャンプルコギに目玉焼きを添えたカップご飯。',
    zh: '精心烹制的辣酱烤肉搭配煎蛋的元气杯饭。',
  },
  '우유를 넣어 부드러운 스크럼블 에그와 특제 소스가 어우러진 치킨마요 컵밥': {
    ko: '우유를 넣어 부드러운 스크럼블 에그와 특제 소스가 어우러진 치킨마요 컵밥',
    en: 'Crispy chicken mayo cupbap with silky milk scrambled eggs and special glaze sauce.',
    ja: '牛乳を加えたふわとろスクランブルエッグと秘伝ソースが絶品のチキンマヨカップご飯。',
    zh: '鲜奶丝滑炒蛋搭配酥脆鸡肉与秘制酱汁的经典鸡肉蛋黄酱杯饭。',
  },
  '고소하고 담백한 참치와 부드러운 마요네즈, 김가루, 계란 지단이 어우러진 베스트셀러 컵밥': {
    ko: '고소하고 담백한 참치와 부드러운 마요네즈, 김가루, 계란 지단이 어우러진 베스트셀러 컵밥',
    en: 'Bestselling rice bowl with savory tuna, creamy mayo, seaweed flakes, and egg strips.',
    ja: '香ばしいツナとクリーミーなマヨネーズ、刻み海苔と錦糸卵が調和した大人気カップご飯。',
    zh: '浓香金枪鱼、柔滑蛋黄酱、海苔碎与鲜香蛋丝相融合的热销经典杯饭。',
  },
  '노릇하게 구운 짭조름한 정품 스팸과 포슬포슬 계란 스크램블, 특제 데리야끼 소스의 환상 조화': {
    ko: '노릇하게 구운 짭조름한 정품 스팸과 포슬포슬 계란 스크램블, 특제 데리야끼 소스의 환상 조화',
    en: 'Golden pan-seared SPAM, fluffy scrambled eggs, and sweet savory teriyaki sauce.',
    ja: 'こんがり焼いたスパムとふわふわスクランブルエッグ、特製テリヤキソースの極上ハーモニー。',
    zh: '金黄香煎世棒午餐肉搭配蓬松炒蛋与特调照烧酱，回味无穷。',
  },
  '매콤달콤한 특제 고추장 양념에 불맛을 더해 볶아낸 제육볶음과 신선한 채소 컵밥': {
    ko: '매콤달콤한 특제 고추장 양념에 불맛을 더해 볶아낸 제육볶음과 신선한 채소 컵밥',
    en: 'Wok-fired sweet & spicy pork bulgogi topped with crisp fresh greens over rice.',
    ja: '直火の香ばしさを加えた旨辛特製豚肉炒めと新鮮野菜のカップご飯。',
    zh: '炭火镬气十足的甜辣秘酱炒猪肉与爽口蔬菜相融的盖浇饭。',
  },
  '매일 아침 직접 튀긴 바삭한 수제 생등심 돈까스에 특제 돈부리 소스를 얹은 든든한 한 그릇': {
    ko: '매일 아침 직접 튀긴 바삭한 수제 생등심 돈까스에 특제 돈부리 소스를 얹은 든든한 한 그릇',
    en: 'Crispy handmade pork sirloin cutlet freshly fried daily with special savory donburi sauce.',
    ja: '毎朝揚げたてのサクサク生ロースかつに特製丼タレをかけた大満足の一膳。',
    zh: '每日现炸酥脆里脊炸猪排淋上特制盖饭酱汁的实在一碗。',
  },
  '부드러운 육질의 소불고기와 달콤 짭조름한 특제 간장 양념이 밥알에 촉촉하게 스며든 프리미엄 컵밥': {
    ko: '부드러운 육질의 소불고기와 달콤 짭조름한 특제 간장 양념이 밥알에 촉촉하게 스며든 프리미엄 컵밥',
    en: 'Tender beef bulgogi soaked in sweet-savory soy glaze over steaming warm rice.',
    ja: '柔らかい牛プルコギと甘辛特製醤油ダレがご飯に染み込んだ極上プレミアムカップご飯。',
    zh: '鲜嫩牛肉与醇香甜咸酱汁浸润粒粒香糯米饭的特级杯饭。',
  },
  '잘 익은 국내산 묵은지 볶음과 매콤한 제육볶음이 어우러져 한국인의 입맛을 저격하는 인기 컵밥': {
    ko: '잘 익은 국내산 묵은지 볶음과 매콤한 제육볶음이 어우러져 한국인의 입맛을 저격하는 인기 컵밥',
    en: 'Aged domestic sautéed kimchi and spicy pork stir-fry for an authentic Korean flavor.',
    ja: '熟成国産炒めキムチとピリ辛豚炒めが織りなす本場韓国の絶品カップご飯。',
    zh: '熟成酸爽炒泡菜与香辣炒猪肉交织的超高人气韩式盖饭。',
  },
  '바삭하게 튀겨낸 순살 치킨 가라아게에 깊고 진한 일본식 정통 카레 소스를 듬뿍 얹은 별미 컵밥': {
    ko: '바삭하게 튀겨낸 순살 치킨 가라아게에 깊고 진한 일본식 정통 카레 소스를 듬뿍 얹은 별미 컵밥',
    en: 'Crispy chicken karaage smothered in rich and deeply spiced traditional curry.',
    ja: 'サクサク骨なしチキン唐揚げに濃厚な本格カレールーをたっぷりかけた特製カップご飯。',
    zh: '香脆炸鸡块浇上醇厚浓郁正宗日式咖喱酱的特色杯饭。',
  },
  '탱글탱글한 왕새우튀김에 감칠맛 넘치는 특제 소스와 마요가 어우러진 바삭 고소한 컵밥': {
    ko: '탱글탱글한 왕새우튀김에 감칠맛 넘치는 특제 소스와 마요가 어우러진 바삭 고소한 컵밥',
    en: 'Plump golden jumbo fried shrimp with savory glaze and creamy mayo drizzle.',
    ja: 'ぷりぷりの大エビフライに旨味たっぷり特製タレとマヨが絡むサクサクカップご飯。',
    zh: '弹牙饱满大炸虾搭配特调鲜美酱汁与蛋黄酱的香酥杯饭。',
  },

  // --- SIDES ---
  '매일 아침 당일 조리되는 정갈하고 신선한 수제 반찬 4종 세트': {
    ko: '매일 아침 당일 조리되는 정갈하고 신선한 수제 반찬 4종 세트',
    en: 'Four wholesome, freshly prepared handmade Korean side dishes made every morning.',
    ja: '毎朝手作りで調理される端正で新鮮な自家製おかず4種セット。',
    zh: '每日清晨现做、新鲜精致的手工韩式特色4色小菜组合。',
  },
  '국내산 배추와 양념으로 깊고 시원하게 끓여낸 찌개 단품 (공깃밥 별도)': {
    ko: '국내산 배추와 양념으로 깊고 시원하게 끓여낸 찌개 단품 (공깃밥 별도)',
    en: 'Rich, refreshing stew made with 100% domestic cabbage and seasonings (Rice sold separately).',
    ja: '国産白菜と特製ダレで深みとコクを煮込んだチゲ単品(ご飯別売)。',
    zh: '选用国产白菜与传统酱料熬制的醇厚泡菜汤单品 (米饭另计)。',
  },
};

// Tag Translations (including NEW, sizes, set badges)
export const TAG_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  '신메뉴': { ko: '신메뉴', en: 'NEW', ja: '新メニュー', zh: '新品' },
  '신메뉴 출시': { ko: '신메뉴 출시', en: 'New Arrival', ja: '新登場', zh: '新品上市' },
  '라이트': { ko: '라이트', en: 'Light', ja: 'ライト', zh: '轻量' },
  '베이직': { ko: '베이직', en: 'Basic', ja: 'ベーシック', zh: '经典' },
  '메가': { ko: '메가', en: 'Mega', ja: 'メガ', zh: '特大' },
  '세트': { ko: '세트', en: 'Set', ja: 'セット', zh: '套餐' },
  '세트 메뉴': { ko: '세트 메뉴', en: 'Set Menu', ja: 'セットメニュー', zh: '套餐' },
  '추천 세트': { ko: '추천 세트', en: 'Recommended Set', ja: 'おすすめセット', zh: '推荐套餐' },
  '도시락 세트': { ko: '도시락 세트', en: 'Bento Set', ja: 'お弁当セット', zh: '便当套餐' },
  '컵밥 세트': { ko: '컵밥 세트', en: 'Cupbap Set', ja: 'カップご飯セット', zh: '杯饭套餐' },
  '소식좌를 위한 라이트': { ko: '소식좌를 위한 라이트', en: 'Light Portion', ja: 'ライトサイズ', zh: '小胃口轻量' },
  '든든한 정량 베이직': { ko: '든든한 정량 베이직', en: 'Standard Basic', ja: '定番ベーシック', zh: '饱腹经典正装' },
  '대용량 메가': { ko: '대용량 메가', en: 'Jumbo Mega', ja: 'メガ盛り', zh: '超大份特大' },
  '국산 재료 100%': { ko: '국산 재료 100%', en: '100% Domestic Ingredients', ja: '国産原料100%', zh: '100%国产原料' },
  '특제 소스 듬뿍': { ko: '특제 소스 듬뿍', en: 'Generous Secret Sauce', ja: '特製ソースたっぷり', zh: '特制酱汁多量' },
  '공깃밥+반찬 4종 포함': { ko: '공깃밥+반찬 4종 포함', en: 'Includes Rice + 4 Sides', ja: 'ご飯＋おかず4種付き', zh: '含米饭与4种小菜' },
  '직화 풍미 매콤달콤': { ko: '직화 풍미 매콤달콤', en: 'Fire-Grilled Sweet & Spicy', ja: '直火風味 甘辛仕立て', zh: '炭火风味 甜辣爽口' },
  '데미 소스 & 피클 포함': { ko: '데미 소스 & 피클 포함', en: 'Demi-Glace & Pickles', ja: 'デミソース＆ピクルス付き', zh: '含多蜜酱与腌黄瓜' },
  '크림 & 갈릭의 조화': { ko: '크림 & 갈릭의 조화', en: 'Cream & Garlic Harmony', ja: 'クリーム＆ガーリックの調和', zh: '奶油与大蒜的黄金搭配' },
  '겉바속촉 수제': { ko: '겉바속촉 수제', en: 'Crispy Outside Juicy Inside', ja: '外サク中フワ自家製', zh: '外酥里嫩 手工匠心' },
  '얼큰 칼칼 국물': { ko: '얼큰 칼칼 국물', en: 'Rich Spicy Broth', ja: 'コク旨ピリ辛スープ', zh: '浓香爽辣汤底' },
  '추천 세트 조합': { ko: '추천 세트 조합', en: 'Recommended Combo', ja: 'おすすめセット', zh: '推荐超值搭配' },
  '단짠칼칼 정석': { ko: '단짠칼칼 정석', en: 'Sweet, Savory & Spicy', ja: '甘辛ピリ辛の王道', zh: '咸甜香辣经典' },
  '최고급 세트': { ko: '최고급 세트', en: 'Premium Luxury Set', ja: '最高級プレミアムセット', zh: '顶级豪华套餐' },
  '직화 불향 100%': { ko: '직화 불향 100%', en: '100% Wok Flame Aroma', ja: '100%直火の香ばしさ', zh: '100%直火炭烤风味' },
  '스크램블 에그 듬뿍': { ko: '스크램블 에그 듬뿍', en: 'Fluffy Scrambled Egg', ja: 'ふわふわ卵たっぷり', zh: '满满滑嫩炒蛋' },
  '고소한 참치마요': { ko: '고소한 참치마요', en: 'Savory Tuna Mayo', ja: '香ばしいツナマヨ', zh: '香浓金枪鱼蛋黄酱' },
  '노릇노릇 스팸': { ko: '노릇노릇 스팸', en: 'Golden Grilled SPAM', ja: 'こんがりジューシースパム', zh: '金黄焦香世棒午餐肉' },
  '매콤달콤 불맛': { ko: '매콤달콤 불맛', en: 'Spicy Sweet Wok Flavor', ja: '旨辛直火風味', zh: '甜辣浓香 镬气十足' },
  '바삭한 돈가스': { ko: '바삭한 돈가스', en: 'Crispy Pork Cutlet', ja: 'サクサクとんかつ', zh: '酥脆金黄炸猪排' },
  '부드러운 소불고기': { ko: '부드러운 소불고기', en: 'Tender Beef Bulgogi', ja: '柔らかジューシー牛プルコギ', zh: '鲜嫩多汁牛肉烤肉' },
  '칼칼 볶음김치': { ko: '칼칼 볶음김치', en: 'Zesty Sautéed Kimchi', ja: 'ピリ辛炒めキムチ', zh: '酸辣爽口炒泡菜' },
  '진한 카레향': { ko: '진한 카레향', en: 'Rich Curry Aroma', ja: '芳醇なスパイスカレー', zh: '浓郁日式咖喱香' },
  '탱글 바삭 새우': { ko: '탱글 바삭 새우', en: 'Crispy Jumbo Shrimp', ja: 'ぷりぷりサクサク海老', zh: '外酥里嫩 弹牙大虾' },
  '당일 조리 신선': { ko: '당일 조리 신선', en: 'Cooked Daily Fresh', ja: '当日朝調理・新鮮', zh: '当日现做 新鲜美味' },
  '정성 가득': { ko: '정성 가득', en: 'Heartfelt Recipe', ja: '真心たっぷり', zh: '诚意满满' },
};

// Category Translations
export const CATEGORY_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  '전체': { ko: '전체', en: 'All', ja: 'すべて', zh: '全部' },
  '도시락': { ko: '도시락', en: 'Dosirak (Bento)', ja: 'お弁当', zh: '便当' },
  '컵밥': { ko: '컵밥', en: 'Cupbap (Rice Bowl)', ja: 'カップご飯', zh: '杯饭' },
  '반찬': { ko: '반찬', en: 'Side Dishes', ja: 'おかず', zh: '精美小菜' },
  '반찬류': { ko: '반찬류', en: 'Side Dishes', ja: 'おかず類', zh: '小菜专区' },
  '세트': { ko: '세트', en: 'Set Combo', ja: 'セット', zh: '套餐' },
  '세트메뉴': { ko: '세트메뉴', en: 'Set Combo', ja: 'セットメニュー', zh: '套餐专区' },
  '세트 메뉴': { ko: '세트 메뉴', en: 'Set Menu', ja: 'セットメニュー', zh: '套餐专区' },
  '착한': { ko: '착한', en: 'Donation 1+1', ja: '寄付 1+1', zh: '爱心公益' },
  '착한도시락': { ko: '착한도시락', en: 'Charity Bento (1+1)', ja: '思いやり弁当 (寄付1+1)', zh: '爱心便当 (1+1)' },
  '착한 도시락': { ko: '착한 도시락', en: 'Charity Bento (1+1)', ja: '思いやり弁当 (寄付1+1)', zh: '爱心便当 (1+1)' },
  '착한메뉴': { ko: '착한메뉴', en: 'Charity Menu (1+1)', ja: '思いやりメニュー (寄付1+1)', zh: '爱心菜单 (1+1)' },
  '착한 메뉴': { ko: '착한 메뉴', en: 'Charity Menu (1+1)', ja: '思いやりメニュー (寄付1+1)', zh: '爱心菜单 (1+1)' },
  '기부도시락': { ko: '기부도시락', en: 'Donation Bento', ja: '寄付弁当', zh: '爱心便当' },
  '추천': { ko: '추천', en: 'Recommended', ja: 'おすすめ', zh: '精选推荐' },
  '추천메뉴': { ko: '추천메뉴', en: 'Recommended Menu', ja: 'おすすめメニュー', zh: '推荐菜单' },
  '추천 메뉴': { ko: '추천 메뉴', en: 'Recommended Menu', ja: 'おすすめメニュー', zh: '推荐菜单' },
  '대표': { ko: '대표', en: 'Signature', ja: '定番', zh: '招牌特色' },
  '대표메뉴': { ko: '대표메뉴', en: 'Signature Menu', ja: '代表メニュー', zh: '招牌菜单' },
  '대표 메뉴': { ko: '대표 메뉴', en: 'Signature Menu', ja: '代表メニュー', zh: '招牌菜单' },
  '인기': { ko: '인기', en: 'Popular', ja: '人気', zh: '人气热销' },
  '인기메뉴': { ko: '인기메뉴', en: 'Popular Menu', ja: '人気メニュー', zh: '人气菜单' },
  '인기 메뉴': { ko: '인기 메뉴', en: 'Popular Menu', ja: '人気メニュー', zh: '人气菜单' },
  '신메뉴': { ko: '신메뉴', en: 'NEW', ja: '新メニュー', zh: '新品' },
  '스페셜': { ko: '스페셜', en: 'Special', ja: 'スペシャル', zh: '特选系列' },
  '스페셜도시락': { ko: '스페셜도시락', en: 'Special Bento', ja: 'スペシャル弁当', zh: '特选便当' },
  '스페셜 도시락': { ko: '스페셜 도시락', en: 'Special Bento', ja: 'スペシャル弁当', zh: '特选便当' },
  '프리미엄': { ko: '프리미엄', en: 'Premium', ja: 'プレミアム', zh: '特级系列' },
  '프리미엄도시락': { ko: '프리미엄도시락', en: 'Premium Bento', ja: '特選お弁当', zh: '特级便当' },
  '덮밥': { ko: '덮밥', en: 'Rice Bowl (Donburi)', ja: '丼もの', zh: '盖浇饭' },
  '덮밥류': { ko: '덮밥류', en: 'Rice Bowls', ja: '丼もの類', zh: '盖浇饭类' },
  '볶음밥': { ko: '볶음밥', en: 'Fried Rice', ja: 'チャーハン', zh: '炒饭' },
  '찌개': { ko: '찌개', en: 'Stew', ja: 'チゲ', zh: '韩式浓汤' },
  '찌개류': { ko: '찌개류', en: 'Stews', ja: 'チゲ類', zh: '浓汤类' },
  '국/탕': { ko: '국/탕', en: 'Soups & Stews', ja: '汁物・スープ', zh: '汤羹类' },
  '탕류': { ko: '탕류', en: 'Soups', ja: 'スープ類', zh: '鲜汤类' },
  '면류': { ko: '면류', en: 'Noodles', ja: '麺類', zh: '面条类' },
  '분식': { ko: '분식', en: 'Korean Snacks', ja: '軽食・粉食', zh: '韩式简餐' },
  '튀김': { ko: '튀김', en: 'Fried Dishes', ja: '揚げ物', zh: '炸物小吃' },
  '튀김류': { ko: '튀김류', en: 'Fried Dishes', ja: '揚げ物類', zh: '精选炸物' },
  '사이드': { ko: '사이드', en: 'Side Dishes', ja: 'サイドメニュー', zh: '副食小食' },
  '사이드메뉴': { ko: '사이드메뉴', en: 'Side Menu', ja: 'サイドメニュー', zh: '配菜小食' },
  '사이드 메뉴': { ko: '사이드 메뉴', en: 'Side Menu', ja: 'サイドメニュー', zh: '配菜小食' },
  '안주': { ko: '안주', en: 'Bar Snacks', ja: 'おつまみ', zh: '下酒菜' },
  '안주류': { ko: '안주류', en: 'Bar Snacks', ja: 'おつまみ類', zh: '下酒菜类' },
  '음료': { ko: '음료', en: 'Beverages', ja: 'お飲み物', zh: '酒水饮料' },
  '음료/주류': { ko: '음료/주류', en: 'Drinks & Alcohol', ja: '飲料・お酒', zh: '饮品酒水' },
  '단품': { ko: '단품', en: 'A la carte', ja: '単品', zh: '单品' },
  '단품메뉴': { ko: '단품메뉴', en: 'Single Dishes', ja: '単品メニュー', zh: '单品专区' },
  '단품 메뉴': { ko: '단품 메뉴', en: 'Single Dishes', ja: '単品メニュー', zh: '单品专区' },
  '정식': { ko: '정식', en: 'Table Set', ja: '定食', zh: '正餐定食' },
  '어린이': { ko: '어린이', en: 'Kids Menu', ja: 'お子様メニュー', zh: '儿童餐' },
  '어린이메뉴': { ko: '어린이메뉴', en: 'Kids Menu', ja: 'お子様メニュー', zh: '儿童菜单' },
  '어린이 메뉴': { ko: '어린이 메뉴', en: 'Kids Menu', ja: 'お子様メニュー', zh: '儿童菜单' },
  '다이어트': { ko: '다이어트', en: 'Healthy Diet', ja: 'ヘルシー・ダイエット', zh: '减脂轻食' },
  '건강식': { ko: '건강식', en: 'Healthy Choice', ja: '健康食', zh: '养生轻食' },
};

// Store Status & Notice Translations
export const NOTICE_TRANSLATIONS: Record<string, Record<SupportedLanguage, string>> = {
  '맑은 두부계란국, 유채나물무침, 특제 비트초절임, 수제 반찬 4종이 매일 아침 당일 조리되어 함께 제공됩니다.': {
    ko: '맑은 두부계란국, 유채나물무침, 특제 비트초절임, 수제 반찬 4종이 매일 아침 당일 조리되어 함께 제공됩니다.',
    en: 'Clear tofu egg soup, seasoned rape greens, beet pickles, and 4 fresh homemade sides are prepared daily every morning.',
    ja: '澄まし豆腐卵スープ、菜の花の和え物、特製ビーツの甘酢漬け、自家製おかず4種を毎朝調理しお届けします。',
    zh: '每日清晨现做：清炖豆腐鸡蛋汤、凉拌油菜、秘制腌甜菜与4款手工小菜，暖心随餐提供。',
  },
};

// Multi-word vocabulary dictionary for phrase replacement (ordered from longest to shortest)
const RAW_VOCABULARY: Record<string, Record<SupportedLanguage, string>> = {
  // --- Phrases (Longer phrases MUST match first) ---
  '치킨과 밥을 아낌없이 꽉 채운 대용량': {
    ko: '치킨과 밥을 아낌없이 꽉 채운 대용량',
    en: 'Mega portion packed with generous chicken and rice',
    ja: 'チキンとご飯を惜しみなくたっぷり詰めたメガ盛り',
    zh: '满满鸡肉与米饭的超大特大份',
  },
  'Chicken 과 밥을 아낌없이 꽉 채운 대용량': {
    ko: '치킨과 밥을 아낌없이 꽉 채운 대용량',
    en: 'Mega portion packed with generous chicken and rice',
    ja: 'チキンとご飯を惜しみなくたっぷり詰めたメガ盛り',
    zh: '满满鸡肉与米饭的超大特大份',
  },
  '소식좌를 위한 라이트': {
    ko: '소식좌를 위한 라이트',
    en: 'Light portion for light eaters',
    ja: '少食の方にぴったりなライト',
    zh: '为小胃口定制的轻量版',
  },
  '소식좌를 위한': {
    ko: '소식좌를 위한',
    en: 'for light eaters',
    ja: '少食の方向け',
    zh: '为小胃口定制',
  },
  '든든한 정량 베이직': {
    ko: '든든한 정량 베이직',
    en: 'Hearty standard Basic portion',
    ja: 'しっかり満足な定番ベーシック',
    zh: '份量十足的经典正装',
  },
  '든든한 정량': {
    ko: '든든한 정량',
    en: 'Hearty standard portion',
    ja: 'しっかり満足な定番量',
    zh: '份量十足的标配',
  },
  '대용량 메가': {
    ko: '대용량 메가',
    en: 'Generous Mega portion',
    ja: '大満足のメガ盛り',
    zh: '超大份量特大碗',
  },
  '대용량': {
    ko: '대용량',
    en: 'Mega portion',
    ja: '大盛り',
    zh: '超大份',
  },
  '따뜻한 밥 위에': {
    ko: '따뜻한 밥 위에',
    en: 'over warm rice',
    ja: '温かいご飯の上に',
    zh: '在香热米饭上',
  },
  '바삭한 순살 치킨과': {
    ko: '바삭한 순살 치킨과',
    en: 'crispy boneless chicken and',
    ja: 'サクサクの骨なしチキンと',
    zh: '酥脆无骨炸鸡与',
  },
  '바삭한 순살 Chicken 과': {
    ko: '바삭한 순살 치킨과',
    en: 'crispy boneless chicken and',
    ja: 'サクサクの骨なしチキンと',
    zh: '酥脆无骨炸鸡与',
  },
  '바삭한 순살': {
    ko: '바삭한 순살',
    en: 'crispy boneless',
    ja: 'サクサク骨なし',
    zh: '酥脆无骨',
  },
  '고소한 계란 지단': {
    ko: '고소한 계란 지단',
    en: 'savory egg strips',
    ja: '香ばしい錦糸卵',
    zh: '浓香蛋丝',
  },
  '달콤 짭짤한': {
    ko: '달콤 짭짤한',
    en: 'sweet and savory',
    ja: '甘じょっぱい',
    zh: '甜咸适口',
  },
  'Sweet 짭짤한': {
    ko: '달콤 짭짤한',
    en: 'sweet and savory',
    ja: '甘じょっぱい',
    zh: '甜咸适口',
  },
  '간장 양념이 쏙 배': {
    ko: '간장 양념이 쏙 배',
    en: 'marinated in savory soy sauce',
    ja: '特製醤油ダレがしっかり染み込み',
    zh: '秘制酱油调料入味',
  },
  '부드러운 불고기와': {
    ko: '부드러운 불고기와',
    en: 'tender bulgogi and',
    ja: '柔らかいプルコギと',
    zh: '鲜嫩烤肉与',
  },
  '부드러운 Bulgogi 와': {
    ko: '부드러운 불고기와',
    en: 'tender bulgogi and',
    ja: '柔らかいプルコギと',
    zh: '鲜嫩烤肉与',
  },
  '아삭한 채소를': {
    ko: '아삭한 채소를',
    en: 'crisp fresh vegetables',
    ja: 'シャキシャキ野菜を',
    zh: '爽脆时蔬',
  },
  '아삭한 채소와': {
    ko: '아삭한 채소와',
    en: 'crisp vegetables and',
    ja: 'シャキシャキ野菜と',
    zh: '爽脆蔬菜与',
  },
  '푸짐하게 올렸습니다': {
    ko: '푸짐하게 올렸습니다',
    en: 'generously served on top',
    ja: 'たっぷり盛り付けました',
    zh: '丰盛盖在饭上',
  },
  '소스를 듬뿍 올렸습니다': {
    ko: '소스를 듬뿍 올렸습니다',
    en: 'generously drizzled with sauce',
    ja: 'ソースをたっぷりかけました',
    zh: '淋上满满秘制酱汁',
  },
  '데리야끼와 마요 소스': {
    ko: '데리야끼와 마요 소스',
    en: 'teriyaki and mayo sauce',
    ja: 'テリヤキ＆マヨネーズソース',
    zh: '照烧酱与蛋黄酱',
  },
  '데리야끼와 Mayo 소스': {
    ko: '데리야끼와 마요 소스',
    en: 'teriyaki and mayo sauce',
    ja: 'テリヤキ＆マヨネーズソース',
    zh: '照烧酱与蛋黄酱',
  },
  '화끈하고 매콤달콤한': {
    ko: '화끈하고 매콤달콤한',
    en: 'fiery sweet and spicy',
    ja: 'ピリッと甘辛い',
    zh: '香辣微甜',
  },
  '화끈하고 Spicy Sweet 한': {
    ko: '화끈하고 매콤달콤한',
    en: 'fiery sweet and spicy',
    ja: 'ピリッと甘辛い',
    zh: '香辣微甜',
  },
  '국산 김치찌개 한상 세트': {
    ko: '국산 김치찌개 한상 세트',
    en: 'Domestic Kimchi Stew Table Set',
    ja: '国産キムチチゲ満喫セット',
    zh: '韩国国产泡菜汤正餐套餐',
  },
  '국산 김치찌개 세트': {
    ko: '국산 김치찌개 세트',
    en: 'Domestic Kimchi Stew Set',
    ja: '国産キムチチゲセット',
    zh: '国产泡菜汤套餐',
  },
  '국산 김치찌개': {
    ko: '국산 김치찌개',
    en: 'Domestic Kimchi Stew',
    ja: '国産キムチチゲ',
    zh: '国产泡菜汤',
  },
  '김치찌개 세트': {
    ko: '김치찌개 세트',
    en: 'Kimchi Stew Set',
    ja: 'キムチチゲセット',
    zh: '泡菜汤套餐',
  },
  '김치나베 돈가스': {
    ko: '김치나베 돈가스',
    en: 'Kimchi Nabe Pork Cutlet',
    ja: 'キムチ鍋かつ',
    zh: '泡菜锅炸猪排',
  },
  '수제 생등심 돈가스': {
    ko: '수제 생등심 돈가스',
    en: 'Handmade Fresh Sirloin Cutlet',
    ja: '自家製生ロースかつ',
    zh: '手工鲜里脊炸猪排',
  },
  '수제 돈까스': {
    ko: '수제 돈까스',
    en: 'Handmade Pork Cutlet',
    ja: '自家製とんかつ',
    zh: '手工炸猪排',
  },
  '왕등심 돈가스': {
    ko: '왕등심 돈가스',
    en: 'Jumbo Pork Sirloin Cutlet',
    ja: '大判ロースかつ',
    zh: '大王里脊炸猪排',
  },
  '간장 불고기': {
    ko: '간장 불고기',
    en: 'Soy Sauce Bulgogi',
    ja: '醤油プルコギ',
    zh: '酱油烤肉',
  },
  '간장 Bulgogi': {
    ko: '간장 불고기',
    en: 'Soy Sauce Bulgogi',
    ja: '醤油プルコギ',
    zh: '酱油烤肉',
  },
  '고추장 불고기': {
    ko: '고추장 불고기',
    en: 'Spicy Gochujang Bulgogi',
    ja: 'コチュジャンプルコギ',
    zh: '辣酱烤肉',
  },
  '고추장 Bulgogi': {
    ko: '고추장 불고기',
    en: 'Spicy Gochujang Bulgogi',
    ja: 'コチュジャンプルコギ',
    zh: '辣酱烤肉',
  },
  '소불고기': {
    ko: '소불고기',
    en: 'Beef Bulgogi',
    ja: '牛プルコギ',
    zh: '牛肉烤肉',
  },
  '우삼겹': {
    ko: '우삼겹',
    en: 'Beef Short Plate',
    ja: '牛バラ肉',
    zh: '牛五花',
  },
  '치킨마요': {
    ko: '치킨마요',
    en: 'Chicken Mayo',
    ja: 'チキンマヨ',
    zh: '炸鸡蛋黄酱',
  },
  '참치마요': {
    ko: '참치마요',
    en: 'Tuna Mayo',
    ja: 'ツナマヨ',
    zh: '金枪鱼蛋黄酱',
  },
  '스팸마요': {
    ko: '스팸마요',
    en: 'Spam Mayo',
    ja: 'スパムマヨ',
    zh: '世棒午餐肉',
  },
  '김치제육': {
    ko: '김치제육',
    en: 'Kimchi Spicy Pork',
    ja: 'キムチ豚炒め',
    zh: '泡菜炒猪肉',
  },
  '치킨카레': {
    ko: '치킨카레',
    en: 'Chicken Curry',
    ja: 'チキンカレー',
    zh: '咖喱炸鸡',
  },
  '통새우튀김': {
    ko: '통새우튀김',
    en: 'Crispy Jumbo Shrimp',
    ja: 'エビフライ',
    zh: '香酥炸虾',
  },
  '통새우': {
    ko: '통새우',
    en: 'Jumbo Shrimp',
    ja: '大エビ',
    zh: '整只大虾',
  },
  '닭가슴살': {
    ko: '닭가슴살',
    en: 'Chicken Breast',
    ja: '鶏むね肉',
    zh: '鸡胸肉',
  },
  '수제 반찬': {
    ko: '수제 반찬',
    en: 'Handmade Side Dishes',
    ja: '自家製おかず',
    zh: '手工小菜',
  },
  '한상 세트': {
    ko: '한상 세트',
    en: 'Table Set',
    ja: '御膳セット',
    zh: '丰盛套餐',
  },
  '세트 메뉴': {
    ko: '세트 메뉴',
    en: 'Set Menu',
    ja: 'セットメニュー',
    zh: '套餐',
  },
  '세트': {
    ko: '세트',
    en: 'Set',
    ja: 'セット',
    zh: '套餐',
  },
  '도시락': {
    ko: '도시락',
    en: 'Bento',
    ja: 'お弁当',
    zh: '便当',
  },
  '컵밥': {
    ko: '컵밥',
    en: 'Cupbap',
    ja: 'カップご飯',
    zh: '杯饭',
  },
  'Cupbap': {
    ko: '컵밥',
    en: 'Cupbap',
    ja: 'カップご飯',
    zh: '杯饭',
  },
  '반찬': {
    ko: '반찬',
    en: 'Side Dish',
    ja: 'おかず',
    zh: '小菜',
  },
  '김치찌개': {
    ko: '김치찌개',
    en: 'Kimchi Stew',
    ja: 'キムチチゲ',
    zh: '泡菜汤',
  },
  '김치': {
    ko: '김치',
    en: 'Kimchi',
    ja: 'キムチ',
    zh: '泡菜',
  },
  '치킨': {
    ko: '치킨',
    en: 'Chicken',
    ja: 'チキン',
    zh: '炸鸡',
  },
  'Chicken': {
    ko: '치킨',
    en: 'Chicken',
    ja: 'チキン',
    zh: '炸鸡',
  },
  '돈가스': {
    ko: '돈가스',
    en: 'Pork Cutlet',
    ja: 'とんかつ',
    zh: '炸猪排',
  },
  '돈까스': {
    ko: '돈까스',
    en: 'Pork Cutlet',
    ja: 'とんかつ',
    zh: '炸猪排',
  },
  '생등심': {
    ko: '생등심',
    en: 'Fresh Sirloin',
    ja: '生ロース',
    zh: '鲜里脊',
  },
  '등심': {
    ko: '등심',
    en: 'Sirloin',
    ja: 'ロース',
    zh: '里脊',
  },
  '불고기': {
    ko: '불고기',
    en: 'Bulgogi',
    ja: 'プルコギ',
    zh: '烤肉',
  },
  'Bulgogi': {
    ko: '불고기',
    en: 'Bulgogi',
    ja: 'プルコギ',
    zh: '烤肉',
  },
  '제육': {
    ko: '제육',
    en: 'Spicy Pork',
    ja: '豚肉炒め',
    zh: '辣炒猪肉',
  },
  '스팸': {
    ko: '스팸',
    en: 'Spam',
    ja: 'スパム',
    zh: '午餐肉',
  },
  '참치': {
    ko: '참치',
    en: 'Tuna',
    ja: 'ツナ',
    zh: '金枪鱼',
  },
  '새우': {
    ko: '새우',
    en: 'Shrimp',
    ja: 'エビ',
    zh: '虾',
  },
  '카레': {
    ko: '카레',
    en: 'Curry',
    ja: 'カレー',
    zh: '咖喱',
  },
  '마요': {
    ko: '마요',
    en: 'Mayo',
    ja: 'マヨ',
    zh: '蛋黄酱',
  },
  'Mayo': {
    ko: '마요',
    en: 'Mayo',
    ja: 'マヨ',
    zh: '蛋黄酱',
  },
  '크림': {
    ko: '크림',
    en: 'Cream',
    ja: 'クリーム',
    zh: '奶油',
  },
  '간장': {
    ko: '간장',
    en: 'Soy Sauce',
    ja: '醤油',
    zh: '酱油',
  },
  '고추장': {
    ko: '고추장',
    en: 'Spicy Gochujang',
    ja: 'コチュジャン',
    zh: '辣酱',
  },
  '라이트': {
    ko: '라이트',
    en: 'Light',
    ja: 'ライト',
    zh: '轻量',
  },
  'Light': {
    ko: '라이트',
    en: 'Light',
    ja: 'ライト',
    zh: '轻量',
  },
  '베이직': {
    ko: '베이직',
    en: 'Basic',
    ja: 'ベーシック',
    zh: '经典',
  },
  'Basic': {
    ko: '베이직',
    en: 'Basic',
    ja: 'ベーシック',
    zh: '经典',
  },
  '메가': {
    ko: '메가',
    en: 'Mega',
    ja: 'メガ',
    zh: '特大',
  },
  'Mega': {
    ko: '메가',
    en: 'Mega',
    ja: 'メガ',
    zh: '特大',
  },
  '신메뉴': {
    ko: '신메뉴',
    en: 'NEW',
    ja: '新メニュー',
    zh: '新品',
  },
  'NEW': {
    ko: '신메뉴',
    en: 'NEW',
    ja: '新メニュー',
    zh: '新品',
  },
  '스크램블': {
    ko: '스크램블',
    en: 'Scrambled',
    ja: 'スクランブル',
    zh: '炒蛋',
  },
  '계란': {
    ko: '계란',
    en: 'Egg',
    ja: '卵',
    zh: '鸡蛋',
  },
  '데리야끼': {
    ko: '데리야끼',
    en: 'Teriyaki',
    ja: 'テリヤキ',
    zh: '照烧',
  },
  '지단': {
    ko: '지단',
    en: 'Egg Strips',
    ja: '錦糸卵',
    zh: '蛋丝',
  },
  '정식': {
    ko: '정식',
    en: 'Table',
    ja: '定食',
    zh: '正餐',
  },
  '나베': {
    ko: '나베',
    en: 'Hot Pot',
    ja: '鍋',
    zh: '锅物',
  },
  '단품': {
    ko: '단품',
    en: 'Single',
    ja: '単品',
    zh: '单品',
  },
  '공깃밥': {
    ko: '공깃밥',
    en: 'Rice',
    ja: 'ご飯',
    zh: '米饭',
  },
  '별도': {
    ko: '별도',
    en: 'Separately',
    ja: '別売',
    zh: '另计',
  },
  '포함': {
    ko: '포함',
    en: 'Included',
    ja: '付き',
    zh: '包含',
  },
};

// Sort vocabulary keys by character length in descending order
const VOCABULARY_KEYS = Object.keys(RAW_VOCABULARY).sort((a, b) => b.length - a.length);

/**
 * Splits text into alternating array of style tags and raw text segments.
 * Example: "치킨마요 컵밥 [c:#e11d48]메가[/c]"
 * -> [{type:'text', val:'치킨마요 컵밥 '}, {type:'tag', val:'[c:#e11d48]'}, {type:'text', val:'메가'}, {type:'tag', val:'[/c]'}]
 */
function splitByTags(text: string): Array<{ type: 'text' | 'tag'; val: string }> {
  const parts: Array<{ type: 'text' | 'tag'; val: string }> = [];
  const regex = /(\[[^\]]+\]|<[^>]+>)/gi;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push({ type: 'text', val: text.slice(lastIdx, match.index) });
    }
    parts.push({ type: 'tag', val: match[0] });
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push({ type: 'text', val: text.slice(lastIdx) });
  }
  return parts;
}

/**
 * Normalizes hybrid text (e.g. from prior partial replacements) to clean Korean keys
 */
function normalizeKoreanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/Chicken\s*Mayo\s*(Cupbap|컵밥)/gi, '치킨마요 컵밥')
    .replace(/Bulgogi\s*(Cupbap|컵밥)/gi, '불고기 컵밥')
    .replace(/Soy\s*Sauce\s*Bulgogi/gi, '간장 불고기')
    .replace(/Spicy\s*(Gochujang\s*)?Bulgogi/gi, '고추장 불고기')
    .replace(/Spicy\s*Sweet/gi, '매콤달콤')
    .replace(/Sweet\s*짭짤한/gi, '달콤 짭짤한')
    .replace(/Mayo\s*소스/gi, '마요 소스')
    .replace(/Chicken\s*과/gi, '치킨과')
    .replace(/Bulgogi\s*와/gi, '불고기와')
    .trim();
}

// Category Base & Modifier Definitions for Dynamic Category Translation
const CATEGORY_BASE_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '도시락 세트': { ko: '도시락 세트', en: 'Bento Set', ja: 'お弁当セット', zh: '便当套餐' },
  '컵밥 세트': { ko: '컵밥 세트', en: 'Cupbap Set', ja: 'カップご飯セット', zh: '杯饭套餐' },
  '세트메뉴': { ko: '세트메뉴', en: 'Set Combo', ja: 'セットメニュー', zh: '套餐专区' },
  '세트 메뉴': { ko: '세트 메뉴', en: 'Set Menu', ja: 'セットメニュー', zh: '套餐专区' },
  '세트': { ko: '세트', en: 'Set Combo', ja: 'セット', zh: '套餐' },
  '도시락': { ko: '도시락', en: 'Bento', ja: 'お弁当', zh: '便当' },
  '컵밥': { ko: '컵밥', en: 'Cupbap', ja: 'カップご飯', zh: '杯饭' },
  '덮밥류': { ko: '덮밥류', en: 'Rice Bowls', ja: '丼もの類', zh: '盖浇饭类' },
  '덮밥': { ko: '덮밥', en: 'Rice Bowl (Donburi)', ja: '丼もの', zh: '盖浇饭' },
  '볶음밥': { ko: '볶음밥', en: 'Fried Rice', ja: 'チャーハン', zh: '炒饭' },
  '비빔밥': { ko: '비빔밥', en: 'Bibimbap', ja: 'ビビンバ', zh: '拌饭' },
  '찌개류': { ko: '찌개류', en: 'Stews', ja: 'チゲ類', zh: '浓汤类' },
  '찌개': { ko: '찌개', en: 'Stew', ja: 'チゲ', zh: '浓汤' },
  '국/탕': { ko: '국/탕', en: 'Soups & Stews', ja: '汁物・スープ', zh: '汤羹类' },
  '탕류': { ko: '탕류', en: 'Soups', ja: 'スープ類', zh: '鲜汤类' },
  '탕': { ko: '탕', en: 'Soup', ja: 'スープ', zh: '鲜汤' },
  '국류': { ko: '국류', en: 'Soups', ja: '汁物', zh: '清汤类' },
  '국': { ko: '국', en: 'Soup', ja: 'スープ', zh: '清汤' },
  '면류': { ko: '면류', en: 'Noodles', ja: '麺類', zh: '面条类' },
  '면': { ko: '면', en: 'Noodles', ja: '麺', zh: '面' },
  '튀김류': { ko: '튀김류', en: 'Fried Dishes', ja: '揚げ物類', zh: '炸物类' },
  '튀김': { ko: '튀김', en: 'Fried Dishes', ja: '揚げ物', zh: '炸物' },
  '반찬류': { ko: '반찬류', en: 'Side Dishes', ja: 'おかず類', zh: '小菜专区' },
  '반찬': { ko: '반찬', en: 'Side Dishes', ja: 'おかず', zh: '精美小菜' },
  '사이드메뉴': { ko: '사이드메뉴', en: 'Side Menu', ja: 'サイドメニュー', zh: '配菜小食' },
  '사이드 메뉴': { ko: '사이드 메뉴', en: 'Side Menu', ja: 'サイドメニュー', zh: '配菜小食' },
  '사이드': { ko: '사이드', en: 'Side Dishes', ja: 'サイドメニュー', zh: '配菜小食' },
  '안주류': { ko: '안주류', en: 'Bar Snacks', ja: 'おつまみ類', zh: '下酒菜类' },
  '안주': { ko: '안주', en: 'Bar Snacks', ja: 'おつまみ', zh: '下酒菜' },
  '음료/주류': { ko: '음료/주류', en: 'Drinks & Alcohol', ja: '飲料・お酒', zh: '饮品酒水' },
  '음료': { ko: '음료', en: 'Beverages', ja: 'お飲み物', zh: '酒水饮料' },
  '주류': { ko: '주류', en: 'Alcoholic Drinks', ja: 'お酒', zh: '酒类' },
  '단품메뉴': { ko: '단품메뉴', en: 'Single Dishes', ja: '単品メニュー', zh: '单品专区' },
  '단품 메뉴': { ko: '단품 메뉴', en: 'Single Dishes', ja: '単品メニュー', zh: '单品专区' },
  '단품': { ko: '단품', en: 'A la carte', ja: '単品', zh: '单品' },
  '정식': { ko: '정식', en: 'Table Set', ja: '定食', zh: '正餐定食' },
  '분식': { ko: '분식', en: 'Korean Snacks', ja: '軽食・粉食', zh: '韩式简餐' },
  '어린이메뉴': { ko: '어린이메뉴', en: 'Kids Menu', ja: 'お子様メニュー', zh: '儿童菜单' },
  '어린이 메뉴': { ko: '어린이 메뉴', en: 'Kids Menu', ja: 'お子様メニュー', zh: '儿童菜单' },
  '어린이': { ko: '어린이', en: 'Kids Menu', ja: 'お子様メニュー', zh: '儿童餐' },
  '다이어트': { ko: '다이어트', en: 'Healthy Diet', ja: 'ヘルシー・ダイエット', zh: '减脂轻食' },
  '건강식': { ko: '건강식', en: 'Healthy Choice', ja: '健康食', zh: '养生轻食' },
  '샐러드': { ko: '샐러드', en: 'Salad', ja: 'サラダ', zh: '沙拉' },
  '디저트': { ko: '디저트', en: 'Dessert', ja: 'デザート', zh: '甜品' },
  '카테고리': { ko: '카테고리', en: 'Category', ja: 'カテゴリー', zh: '分类' },
  '메뉴': { ko: '메뉴', en: 'Menu', ja: 'メニュー', zh: '菜单' },
  '코너': { ko: '코너', en: 'Section', ja: 'コーナー', zh: '专区' },
};

const CATEGORY_MODIFIER_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '신규': { ko: '신규', en: 'New', ja: '新規', zh: '新品' },
  '새로운': { ko: '새로운', en: 'New', ja: '新しい', zh: '全新' },
  '착한': { ko: '착한', en: 'Charity (1+1)', ja: '思いやり (寄付1+1)', zh: '爱心 (1+1)' },
  '추천': { ko: '추천', en: 'Recommended', ja: 'おすすめ', zh: '精选推荐' },
  '대표': { ko: '대표', en: 'Signature', ja: '看板', zh: '招牌特色' },
  '인기': { ko: '인기', en: 'Popular', ja: '人気', zh: '人气热销' },
  '신메뉴': { ko: '신메뉴', en: 'NEW', ja: '新登場', zh: '新品' },
  '신': { ko: '신', en: 'New', ja: '新作', zh: '新' },
  '스페셜': { ko: '스페셜', en: 'Special', ja: 'スペシャル', zh: '特选' },
  '프리미엄': { ko: '프리미엄', en: 'Premium', ja: 'プレミアム', zh: '特级' },
  '수제': { ko: '수제', en: 'Handmade', ja: '自家製', zh: '手工' },
  '실속': { ko: '실속', en: 'Value', ja: 'お得', zh: '超值' },
  '직화': { ko: '직화', en: 'Fire-Grilled', ja: '直火焼き', zh: '炭火烤' },
  '순살': { ko: '순살', en: 'Boneless', ja: '骨なし', zh: '无骨' },
  '통': { ko: '통', en: 'Whole', ja: '丸ごと', zh: '整只' },
  '국산': { ko: '국산', en: 'Domestic', ja: '国産', zh: '国产' },
  '국내산': { ko: '국내산', en: 'Domestic', ja: '国産', zh: '国产' },
  '신선한': { ko: '신선한', en: 'Fresh', ja: '新鮮', zh: '新鲜' },
  '매콤': { ko: '매콤', en: 'Spicy', ja: 'ピリ辛', zh: '香辣' },
  '매콤한': { ko: '매콤한', en: 'Spicy', ja: 'ピリ辛', zh: '香辣' },
  '달콤': { ko: '달콤', en: 'Sweet', ja: '甘口', zh: '甜味' },
  '달콤한': { ko: '달콤한', en: 'Sweet', ja: '甘口', zh: '甜味' },
  '단짠': { ko: '단짠', en: 'Sweet & Savory', ja: '甘じょっぱい', zh: '甜咸' },
  '얼큰': { ko: '얼큰', en: 'Spicy', ja: '旨辛', zh: '香辣' },
  '얼큰한': { ko: '얼큰한', en: 'Spicy', ja: '旨辛', zh: '香辣' },
  '칼칼': { ko: '칼칼', en: 'Zesty', ja: 'コク辛', zh: '爽辣' },
  '칼칼한': { ko: '칼칼한', en: 'Zesty', ja: 'コク辛', zh: '爽辣' },
  '바삭': { ko: '바삭', en: 'Crispy', ja: 'サクサク', zh: '香脆' },
  '바삭한': { ko: '바삭한', en: 'Crispy', ja: 'サクサク', zh: '香脆' },
  '치즈': { ko: '치즈', en: 'Cheese', ja: 'チーズ', zh: '芝士' },
  '불고기': { ko: '불고기', en: 'Bulgogi', ja: 'プルコギ', zh: '烤肉' },
  '소불고기': { ko: '소불고기', en: 'Beef Bulgogi', ja: '牛プルコギ', zh: '牛肉烤肉' },
  '돼지불고기': { ko: '돼지불고기', en: 'Pork Bulgogi', ja: '豚プルコギ', zh: '猪肉烤肉' },
  '제육': { ko: '제육', en: 'Spicy Pork', ja: '豚肉炒め', zh: '辣炒猪肉' },
  '치킨': { ko: '치킨', en: 'Chicken', ja: 'チキン', zh: '炸鸡' },
  '닭갈비': { ko: '닭갈비', en: 'Chicken Galbi', ja: 'タッカルビ', zh: '炒鸡排' },
  '돈가스': { ko: '돈가스', en: 'Pork Cutlet', ja: 'とんかつ', zh: '炸猪排' },
  '돈까스': { ko: '돈까스', en: 'Pork Cutlet', ja: 'とんかつ', zh: '炸猪排' },
  '김치': { ko: '김치', en: 'Kimchi', ja: 'キムチ', zh: '泡菜' },
  '참치': { ko: '참치', en: 'Tuna', ja: 'ツナ', zh: '金枪鱼' },
  '스팸': { ko: '스팸', en: 'SPAM', ja: 'スパム', zh: '世棒午餐肉' },
  '새우': { ko: '새우', en: 'Shrimp', ja: 'エビ', zh: '鲜虾' },
  '우삼겹': { ko: '우삼겹', en: 'Beef Short Plate', ja: '牛バラ肉', zh: '牛五花' },
};

const CATEGORY_BASES_SORTED = Object.keys(CATEGORY_BASE_MAP).sort((a, b) => b.length - a.length);
const CATEGORY_MODIFIERS_SORTED = Object.keys(CATEGORY_MODIFIER_MAP).sort((a, b) => b.length - a.length);
const ALL_CATEGORY_TERMS: Array<{ key: string; map: Record<string, Record<SupportedLanguage, string>> }> = [
  ...Object.keys(CATEGORY_BASE_MAP).map((k) => ({ key: k, map: CATEGORY_BASE_MAP })),
  ...Object.keys(CATEGORY_MODIFIER_MAP).map((k) => ({ key: k, map: CATEGORY_MODIFIER_MAP })),
].sort((a, b) => b.key.length - a.key.length);

/**
 * Dynamic Auto-Translation for Category Names
 * Handles custom categories added by store owner across English, Japanese, and Chinese
 */
export function translateCategory(cat: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!cat || targetLang === 'ko') return cat;

  const trimmed = cat.trim();

  // 1. Exact match in full dictionary
  if (CATEGORY_TRANSLATIONS[trimmed] && CATEGORY_TRANSLATIONS[trimmed][targetLang]) {
    return CATEGORY_TRANSLATIONS[trimmed][targetLang];
  }

  // 2. Special handling for '착한' (Charity / Donation) category variations
  if (trimmed.includes('착한')) {
    if (trimmed.includes('도시락')) {
      if (targetLang === 'en') return 'Charity Bento (1+1)';
      if (targetLang === 'ja') return '思いやり弁当 (寄付1+1)';
      if (targetLang === 'zh') return '爱心便当 (1+1)';
    }
    if (trimmed.includes('컵밥')) {
      if (targetLang === 'en') return 'Charity Cupbap (1+1)';
      if (targetLang === 'ja') return '思いやりカップご飯 (寄付1+1)';
      if (targetLang === 'zh') return '爱心杯饭 (1+1)';
    }
    if (trimmed.includes('세트')) {
      if (targetLang === 'en') return 'Charity Set (1+1)';
      if (targetLang === 'ja') return '思いやりセット (寄付1+1)';
      if (targetLang === 'zh') return '爱心套餐 (1+1)';
    }
    if (targetLang === 'en') return 'Charity (1+1)';
    if (targetLang === 'ja') return '寄付 (1+1)';
    if (targetLang === 'zh') return '爱心公益 (1+1)';
  }

  // 3. Suffix / Compound matching (e.g. "스페셜도시락" -> "Special Bento", "치즈컵밥" -> "Cheese Cupbap")
  for (const base of CATEGORY_BASES_SORTED) {
    if (trimmed.endsWith(base) && trimmed.length > base.length) {
      const prefix = trimmed.slice(0, trimmed.length - base.length).trim();
      let prefixTrans =
        CATEGORY_MODIFIER_MAP[prefix]?.[targetLang] ||
        RAW_VOCABULARY[prefix]?.[targetLang];
      if (!prefixTrans || prefixTrans === prefix) {
        prefixTrans = translateCategory(prefix, targetLang);
      }
      const baseTrans = CATEGORY_BASE_MAP[base][targetLang];

      if (targetLang === 'en') {
        return `${prefixTrans} ${baseTrans}`.trim();
      }
      return `${prefixTrans}${baseTrans}`;
    }
  }

  // 4. Space-separated multi-word category (e.g. "스페셜 도시락", "매콤 덮밥")
  if (trimmed.includes(' ')) {
    const parts = trimmed.split(/\s+/);
    const transParts = parts.map((part) => {
      if (CATEGORY_BASE_MAP[part]?.[targetLang]) return CATEGORY_BASE_MAP[part][targetLang];
      if (CATEGORY_MODIFIER_MAP[part]?.[targetLang]) return CATEGORY_MODIFIER_MAP[part][targetLang];
      if (RAW_VOCABULARY[part]?.[targetLang]) return RAW_VOCABULARY[part][targetLang];
      return part;
    });
    if (targetLang === 'en') {
      return transParts.join(' ');
    }
    return transParts.join('');
  }

  // 5. Morpheme Decomposition for arbitrary compound categories (e.g. "신규추천카테고리", "치즈불고기도시락")
  let remCat = trimmed;
  const matchedTokens: Array<{ ko: string; trans: Record<SupportedLanguage, string> }> = [];

  while (remCat.length > 0) {
    let matched = false;
    const trimmedRem = remCat.trim();

    for (const term of ALL_CATEGORY_TERMS) {
      if (trimmedRem.startsWith(term.key)) {
        matchedTokens.push({ ko: term.key, trans: term.map[term.key] });
        remCat = trimmedRem.slice(term.key.length).trim();
        matched = true;
        break;
      }
    }

    if (!matched) {
      const nextSpace = trimmedRem.indexOf(' ');
      const unknownToken = nextSpace > 0 ? trimmedRem.slice(0, nextSpace) : trimmedRem;
      if (RAW_VOCABULARY[unknownToken]?.[targetLang]) {
        matchedTokens.push({ ko: unknownToken, trans: RAW_VOCABULARY[unknownToken] });
      } else {
        matchedTokens.push({
          ko: unknownToken,
          trans: { ko: unknownToken, en: unknownToken, ja: unknownToken, zh: unknownToken },
        });
      }
      remCat = nextSpace > 0 ? trimmedRem.slice(nextSpace).trim() : '';
    }
  }

  if (matchedTokens.length > 0 && matchedTokens.some((t) => t.trans[targetLang] !== t.ko)) {
    if (targetLang === 'en') {
      return matchedTokens.map((t) => t.trans.en).join(' ').trim();
    }
    return matchedTokens.map((t) => t.trans[targetLang]).join('').trim();
  }

  // 6. Fallback phrase replacement
  let translated = trimmed;
  for (const koreanPhrase of VOCABULARY_KEYS) {
    const transMap = RAW_VOCABULARY[koreanPhrase];
    if (translated.includes(koreanPhrase) && transMap[targetLang]) {
      translated = translated.replaceAll(koreanPhrase, ` ${transMap[targetLang]} `);
    }
  }
  return translated.replace(/\s+/g, ' ').trim() || trimmed;
}

// Morpheme Dictionaries for Dynamic Menu Name Auto-Translation
const MENU_SIZE_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '라이트': { ko: '라이트', en: 'Light', ja: 'ライト', zh: '轻量' },
  'light': { ko: '라이트', en: 'Light', ja: 'ライト', zh: '轻量' },
  '베이직': { ko: '베이직', en: 'Basic', ja: 'ベーシック', zh: '经典' },
  'basic': { ko: '베이직', en: 'Basic', ja: 'ベーシック', zh: '经典' },
  '메가': { ko: '메가', en: 'Mega', ja: 'メガ', zh: '特大' },
  'mega': { ko: '메가', en: 'Mega', ja: 'メガ', zh: '特大' },
  '특대': { ko: '특대', en: 'Mega Jumbo', ja: '特大盛り', zh: '超大份' },
  '대용량': { ko: '대용량', en: 'Mega Size', ja: '大盛り', zh: '大份' },
  '세트': { ko: '세트', en: 'Set', ja: 'セット', zh: '套餐' },
};

const MENU_MODIFIERS_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '매콤달콤한': { ko: '매콤달콤한', en: 'Sweet & Spicy', ja: '甘辛', zh: '甜辣' },
  '매콤달콤': { ko: '매콤달콤', en: 'Sweet & Spicy', ja: '甘辛', zh: '甜辣' },
  '화끈하고': { ko: '화끈하고', en: 'Fiery', ja: 'ピリッと', zh: '火辣' },
  '화끈한': { ko: '화끈한', en: 'Fiery', ja: 'ピリ辛', zh: '火辣' },
  '매콤한': { ko: '매콤한', en: 'Spicy', ja: 'ピリ辛', zh: '香辣' },
  '매콤': { ko: '매콤', en: 'Spicy', ja: 'ピリ辛', zh: '香辣' },
  '달콤한': { ko: '달콤한', en: 'Sweet', ja: '甘口', zh: '甜味' },
  '달콤': { ko: '달콤', en: 'Sweet', ja: '甘口', zh: '甜味' },
  '단짠': { ko: '단짠', en: 'Sweet & Savory', ja: '甘じょっぱい', zh: '甜咸' },
  '얼큰한': { ko: '얼큰한', en: 'Spicy', ja: '旨辛', zh: '香辣' },
  '얼큰': { ko: '얼큰', en: 'Spicy', ja: '旨辛', zh: '香辣' },
  '칼칼한': { ko: '칼칼한', en: 'Zesty', ja: 'コク辛', zh: '爽辣' },
  '칼칼': { ko: '칼칼', en: 'Zesty', ja: 'コク辛', zh: '爽辣' },
  '바삭한': { ko: '바삭한', en: 'Crispy', ja: 'サクサク', zh: '香脆' },
  '바삭': { ko: '바삭', en: 'Crispy', ja: 'サクサク', zh: '香脆' },
  '부드러운': { ko: '부드러운', en: 'Tender', ja: '柔らか', zh: '柔嫩' },
  '고소한': { ko: '고소한', en: 'Savory', ja: '香ばしい', zh: '浓香' },
  '담백한': { ko: '담백한', en: 'Light & Savory', ja: 'あっさり', zh: '清淡' },
  '수제': { ko: '수제', en: 'Handmade', ja: '自家製', zh: '手工' },
  '생등심': { ko: '생등심', en: 'Fresh Sirloin', ja: '生ロース', zh: '鲜里脊' },
  '등심': { ko: '등심', en: 'Sirloin', ja: 'ロース', zh: '里脊' },
  '생': { ko: '생', en: 'Fresh', ja: '生', zh: '鲜' },
  '왕등심': { ko: '왕등심', en: 'Jumbo Sirloin', ja: '大判ロース', zh: '大王里脊' },
  '왕': { ko: '왕', en: 'Jumbo', ja: '大判', zh: '大王' },
  '특': { ko: '특', en: 'Special', ja: '特製', zh: '特级' },
  '프리미엄': { ko: '프리미엄', en: 'Premium', ja: '特選', zh: '特级' },
  '스페셜': { ko: '스페셜', en: 'Special', ja: 'スペシャル', zh: '特选' },
  '직화': { ko: '직화', en: 'Fire-Grilled', ja: '直火焼き', zh: '炭火烤' },
  '순살': { ko: '순살', en: 'Boneless', ja: '骨なし', zh: '无骨' },
  '통': { ko: '통', en: 'Whole', ja: '丸ごと', zh: '整只' },
  '국산': { ko: '국산', en: 'Domestic', ja: '国産', zh: '国产' },
  '국내산': { ko: '국내산', en: 'Domestic', ja: '国産', zh: '国产' },
  '신선한': { ko: '신선한', en: 'Fresh', ja: '新鮮', zh: '新鲜' },
  '신선': { ko: '신선', en: 'Fresh', ja: '新鮮', zh: '新鲜' },
  '착한': { ko: '착한', en: 'Charity', ja: '思いやり', zh: '爱心' },
  '새로추가된': { ko: '새로추가된', en: 'New', ja: '新作', zh: '新品' },
  '새로 추가된': { ko: '새로 추가된', en: 'New', ja: '新作', zh: '新品' },
  '새로운': { ko: '새로운', en: 'New', ja: '新しい', zh: '全新' },
  '신규': { ko: '신규', en: 'New', ja: '新規', zh: '新品' },
  '신': { ko: '신', en: 'New', ja: '新', zh: '新' },
};

const MENU_INGREDIENTS_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '양념치킨': { ko: '양념치킨', en: 'Seasoned Chicken', ja: 'ヤンニョムチキン', zh: '韩式甜辣炸鸡' },
  '치킨가라아게': { ko: '치킨가라아게', en: 'Chicken Karaage', ja: 'チキン唐揚げ', zh: '日式炸鸡块' },
  '닭가슴살': { ko: '닭가슴살', en: 'Chicken Breast', ja: '鶏むね肉', zh: '鸡胸肉' },
  '닭갈비': { ko: '닭갈비', en: 'Chicken Galbi', ja: 'タッカルビ', zh: '炒鸡排' },
  '치킨': { ko: '치킨', en: 'Chicken', ja: 'チキン', zh: '炸鸡' },
  'Chicken': { ko: '치킨', en: 'Chicken', ja: 'チキン', zh: '炸鸡' },
  '치킨까스': { ko: '치킨까스', en: 'Chicken Cutlet', ja: 'チキンカツ', zh: '炸鸡排' },
  '치킨가스': { ko: '치킨가스', en: 'Chicken Cutlet', ja: 'チキンカツ', zh: '炸鸡排' },
  '돈까스': { ko: '돈까스', en: 'Pork Cutlet', ja: 'とんかつ', zh: '炸猪排' },
  '돈가스': { ko: '돈가스', en: 'Pork Cutlet', ja: 'とんかつ', zh: '炸猪排' },
  '소불고기': { ko: '소불고기', en: 'Beef Bulgogi', ja: '牛プルコギ', zh: '牛肉烤肉' },
  '돼지불고기': { ko: '돼지불고기', en: 'Pork Bulgogi', ja: '豚プルコギ', zh: '猪肉烤肉' },
  '불고기': { ko: '불고기', en: 'Bulgogi', ja: 'プルコギ', zh: '烤肉' },
  'Bulgogi': { ko: '불고기', en: 'Bulgogi', ja: 'プルコギ', zh: '烤肉' },
  '제육볶음': { ko: '제육볶음', en: 'Spicy Pork', ja: '豚肉炒め', zh: '辣炒猪肉' },
  '제육': { ko: '제육', en: 'Spicy Pork', ja: '豚肉炒め', zh: '辣炒猪肉' },
  '우삼겹': { ko: '우삼겹', en: 'Beef Short Plate', ja: '牛バラ焼き', zh: '牛五花' },
  '삼겹살': { ko: '삼겹살', en: 'Pork Belly', ja: 'サムギョプサル', zh: '五花肉' },
  '대패삼겹': { ko: '대패삼겹', en: 'Thin Sliced Pork Belly', ja: '薄切り豚バラ', zh: '薄切五花肉' },
  '소갈비': { ko: '소갈비', en: 'Beef Ribs', ja: '牛カルビ', zh: '牛排骨' },
  '돼지갈비': { ko: '돼지갈비', en: 'Pork Ribs', ja: '豚カルビ', zh: '猪排骨' },
  '갈비': { ko: '갈비', en: 'Galbi', ja: 'カルビ', zh: '排骨' },
  '떡갈비': { ko: '떡갈비', en: 'Short Rib Patties', ja: 'トッカルビ', zh: '韩式肉饼' },
  '소고기': { ko: '소고기', en: 'Beef', ja: '牛肉', zh: '牛肉' },
  '돼지고기': { ko: '돼지고기', en: 'Pork', ja: '豚肉', zh: '猪肉' },
  '스팸': { ko: '스팸', en: 'SPAM', ja: 'スパム', zh: '世棒午餐肉' },
  '참치': { ko: '참치', en: 'Tuna', ja: 'ツナ', zh: '金枪鱼' },
  '통새우튀김': { ko: '통새우튀김', en: 'Crispy Jumbo Shrimp', ja: 'エビフライ', zh: '香酥炸虾' },
  '새우튀김': { ko: '새우튀김', en: 'Fried Shrimp', ja: 'エビフライ', zh: '炸虾' },
  '통새우': { ko: '통새우', en: 'Jumbo Shrimp', ja: '大エビ', zh: '整只大虾' },
  '새우': { ko: '새우', en: 'Shrimp', ja: '海老', zh: '鲜虾' },
  '연어': { ko: '연어', en: 'Salmon', ja: 'サーモン', zh: '三文鱼' },
  '오징어': { ko: '오징어', en: 'Squid', ja: 'イカ', zh: '鱿鱼' },
  '낙지': { ko: '낙지', en: 'Baby Octopus', ja: 'タコ', zh: '章鱼' },
  '순두부': { ko: '순두부', en: 'Soft Tofu', ja: 'スンドゥブ', zh: '嫩豆腐' },
  '두부': { ko: '두부', en: 'Tofu', ja: '豆腐', zh: '豆腐' },
  '스크램블에그': { ko: '스크램블에그', en: 'Scrambled Eggs', ja: 'スクランブルエッグ', zh: '滑嫩炒蛋' },
  '계란후라이': { ko: '계란후라이', en: 'Fried Egg', ja: '目玉焼き', zh: '煎蛋' },
  '계란': { ko: '계란', en: 'Egg', ja: '卵', zh: '鸡蛋' },
  '달걀': { ko: '달걀', en: 'Egg', ja: '卵', zh: '鸡蛋' },
  '치즈': { ko: '치즈', en: 'Cheese', ja: 'チーズ', zh: '芝士' },
  '김치제육': { ko: '김치제육', en: 'Kimchi Spicy Pork', ja: 'キムチ豚炒め', zh: '泡菜炒猪肉' },
  '김치나베': { ko: '김치나베', en: 'Kimchi Nabe', ja: 'キムチ鍋', zh: '泡菜锅' },
  '김치': { ko: '김치', en: 'Kimchi', ja: 'キムチ', zh: '泡菜' },
  '묵은지': { ko: '묵은지', en: 'Aged Kimchi', ja: '熟成キムチ', zh: '老泡菜' },
  '카레': { ko: '카레', en: 'Curry', ja: 'カレー', zh: '咖喱' },
  '짜장': { ko: '짜장', en: 'Black Bean', ja: 'ジャジャン', zh: '炸酱' },
  '해물': { ko: '해물', en: 'Seafood', ja: '海鮮', zh: '海鲜' },
  '야채': { ko: '야채', en: 'Vegetables', ja: '野菜', zh: '蔬菜' },
  '채소': { ko: '채소', en: 'Vegetables', ja: '野菜', zh: '蔬菜' },
  '라볶이': { ko: '라볶이', en: 'Rabokki', ja: 'ラポッキ', zh: '拉面炒年糕' },
  '떡볶이': { ko: '떡볶이', en: 'Tteokbokki', ja: 'トッポッキ', zh: '炒年糕' },
  '만두': { ko: '만두', en: 'Dumplings', ja: '餃子', zh: '饺子' },
  '군만두': { ko: '군만두', en: 'Pan-Fried Dumplings', ja: '焼き餃子', zh: '煎饺' },
  '어묵': { ko: '어묵', en: 'Fish Cake', ja: 'おでん', zh: '鱼糕' },
  '소시지': { ko: '소시지', en: 'Sausage', ja: 'ソーセージ', zh: '香肠' },
  '라면': { ko: '라면', en: 'Ramen', ja: 'ラーメン', zh: '拉面' },
  '우동': { ko: '우동', en: 'Udon', ja: 'うどん', zh: '乌冬面' },
  '국수': { ko: '국수', en: 'Noodles', ja: '麺', zh: '面条' },
  '쫄면': { ko: '쫄면', en: 'Chewy Noodles', ja: 'チョルミョン', zh: '筋道拌面' },
  '냉면': { ko: '냉면', en: 'Cold Noodles', ja: '冷麺', zh: '冷面' },
};

const MENU_SAUCES_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '치킨마요': { ko: '치킨마요', en: 'Chicken Mayo', ja: 'チキンマヨ', zh: '炸鸡蛋黄酱' },
  '참치마요': { ko: '참치마요', en: 'Tuna Mayo', ja: 'ツナマヨ', zh: '金枪鱼蛋黄酱' },
  '스팸마요': { ko: '스팸마요', en: 'Spam Mayo', ja: 'スパムマヨ', zh: '世棒午餐肉蛋黄酱' },
  '불닭마요': { ko: '불닭마요', en: 'Spicy Chicken Mayo', ja: '激辛チキンマヨ', zh: '火鸡蛋黄酱' },
  '데리야끼마요': { ko: '데리야끼마요', en: 'Teriyaki Mayo', ja: 'テリヤキマヨ', zh: '照烧蛋黄酱' },
  '데리야끼': { ko: '데리야끼', en: 'Teriyaki', ja: 'テリヤキ', zh: '照烧' },
  '마요': { ko: '마요', en: 'Mayo', ja: 'マヨ', zh: '蛋黄酱' },
  'Mayo': { ko: '마요', en: 'Mayo', ja: 'マヨ', zh: '蛋黄酱' },
  '간장': { ko: '간장', en: 'Soy Sauce', ja: '醤油', zh: '酱油' },
  '고추장': { ko: '고추장', en: 'Spicy Gochujang', ja: 'コチュジャン', zh: '韩式辣酱' },
  '된장': { ko: '된장', en: 'Doenjang', ja: '味噌', zh: '大酱' },
  '크림퐁당': { ko: '크림퐁당', en: 'Cream Fondue', ja: 'クリームフォンデュ', zh: '浓郁奶油' },
  '크림': { ko: '크림', en: 'Cream', ja: 'クリーム', zh: '奶油' },
  '갈릭': { ko: '갈릭', en: 'Garlic', ja: 'ガーリック', zh: '大蒜' },
  '칠리': { ko: '칠리', en: 'Chili', ja: 'チリ', zh: '甜辣' },
  '와사비': { ko: '와사비', en: 'Wasabi', ja: 'わさび', zh: '芥末' },
  '허니버터': { ko: '허니버터', en: 'Honey Butter', ja: 'ハニーバター', zh: '蜂蜜黄油' },
  '양념': { ko: '양념', en: 'Seasoned', ja: 'ヤンニョム', zh: '调味' },
};

const MENU_DISHTYPES_MAP: Record<string, Record<SupportedLanguage, string>> = {
  '도시락 세트': { ko: '도시락 세트', en: 'Bento Set', ja: 'お弁当セット', zh: '便当套餐' },
  '컵밥 세트': { ko: '컵밥 세트', en: 'Cupbap Set', ja: 'カップご飯セット', zh: '杯饭套餐' },
  '덮밥 세트': { ko: '덮밥 세트', en: 'Rice Bowl Set', ja: '丼セット', zh: '盖浇饭套餐' },
  '도시락': { ko: '도시락', en: 'Bento', ja: 'お弁当', zh: '便当' },
  '컵밥': { ko: '컵밥', en: 'Cupbap', ja: 'カップご飯', zh: '杯饭' },
  'Cupbap': { ko: '컵밥', en: 'Cupbap', ja: 'カップご飯', zh: '杯饭' },
  '덮밥': { ko: '덮밥', en: 'Rice Bowl', ja: '丼もの', zh: '盖浇饭' },
  '볶음밥': { ko: '볶음밥', en: 'Fried Rice', ja: 'チャーハン', zh: '炒饭' },
  '비빔밥': { ko: '비빔밥', en: 'Bibimbap', ja: 'ビビンバ', zh: '拌饭' },
  '김밥': { ko: '김밥', en: 'Gimbap', ja: 'キンパ', zh: '紫菜包饭' },
  '한상 세트': { ko: '한상 세트', en: 'Table Set', ja: '御膳セット', zh: '正餐套餐' },
  '세트': { ko: '세트', en: 'Set', ja: 'セット', zh: '套餐' },
  '정식': { ko: '정식', en: 'Table Set', ja: '定食', zh: '正餐定食' },
  '한상': { ko: '한상', en: 'Table', ja: '御膳', zh: '正餐' },
  '김치찌개': { ko: '김치찌개', en: 'Kimchi Stew', ja: 'キムチチゲ', zh: '泡菜汤' },
  '찌개': { ko: '찌개', en: 'Stew', ja: 'チゲ', zh: '浓汤' },
  '탕': { ko: '탕', en: 'Soup', ja: 'スープ', zh: '鲜汤' },
  '국': { ko: '국', en: 'Soup', ja: 'スープ', zh: '清汤' },
  '전골': { ko: '전골', en: 'Hot Pot', ja: '鍋', zh: '火锅' },
  '나베': { ko: '나베', en: 'Hot Pot', ja: '鍋', zh: '锅物' },
  '구이': { ko: '구이', en: 'Grilled', ja: '焼き', zh: '烤' },
  '볶음': { ko: '볶음', en: 'Stir-Fry', ja: '炒め', zh: '小炒' },
  '튀김': { ko: '튀김', en: 'Fried', ja: '揚げ物', zh: '炸物' },
  '반찬 4종 세트': { ko: '반찬 4종 세트', en: '4 Side Dishes Set', ja: 'おかず4種セット', zh: '4款小菜组合' },
  '수제 반찬': { ko: '수제 반찬', en: 'Handmade Side Dishes', ja: '自家製おかず', zh: '手工小菜' },
  '반찬': { ko: '반찬', en: 'Side Dish', ja: 'おかず', zh: '小菜' },
  '샐러드': { ko: '샐러드', en: 'Salad', ja: 'サラダ', zh: '沙拉' },
};

const ALL_FOOD_TERMS: Array<{ key: string; map: Record<string, Record<SupportedLanguage, string>> }> = [
  ...Object.keys(MENU_SIZE_MAP).map((k) => ({ key: k, map: MENU_SIZE_MAP })),
  ...Object.keys(MENU_DISHTYPES_MAP).map((k) => ({ key: k, map: MENU_DISHTYPES_MAP })),
  ...Object.keys(MENU_SAUCES_MAP).map((k) => ({ key: k, map: MENU_SAUCES_MAP })),
  ...Object.keys(MENU_INGREDIENTS_MAP).map((k) => ({ key: k, map: MENU_INGREDIENTS_MAP })),
  ...Object.keys(MENU_MODIFIERS_MAP).map((k) => ({ key: k, map: MENU_MODIFIERS_MAP })),
].sort((a, b) => b.key.length - a.key.length);

/**
 * Dynamic menu name translation engine
 * Automatically translates newly added or customized menu names into English, Japanese, and Chinese
 */
function dynamicTranslateMenuName(cleanName: string, targetLang: SupportedLanguage): string {
  const trimmed = cleanName.trim();
  if (!trimmed) return cleanName;

  // 0. Direct token match for portion sizes or tags (e.g. "메가", "라이트", "베이직", etc.)
  if (MENU_SIZE_MAP[trimmed]?.[targetLang]) {
    return MENU_SIZE_MAP[trimmed][targetLang];
  }
  if (TAG_TRANSLATIONS[trimmed]?.[targetLang]) {
    return TAG_TRANSLATIONS[trimmed][targetLang];
  }

  // 1. Direct dictionary match
  if (MENU_NAME_TRANSLATIONS[trimmed]?.[targetLang]) {
    return MENU_NAME_TRANSLATIONS[trimmed][targetLang];
  }

  // 2. Normalized match (e.g. "간장 Bulgogi Cupbap 라이트" -> "간장 불고기 컵밥 라이트")
  const normalized = normalizeKoreanText(trimmed);
  if (MENU_NAME_TRANSLATIONS[normalized]?.[targetLang]) {
    return MENU_NAME_TRANSLATIONS[normalized][targetLang];
  }

  // 3. Extract portion size (Light, Basic, Mega) if present
  let detectedSize: { en: string; ja: string; zh: string } | null = null;
  let coreName = trimmed;

  for (const sizeKey of Object.keys(MENU_SIZE_MAP)) {
    const regex = new RegExp(`\\s*${sizeKey}\\s*$`, 'i');
    if (regex.test(coreName)) {
      detectedSize = MENU_SIZE_MAP[sizeKey];
      coreName = coreName.replace(regex, '').trim();
      break;
    }
  }

  // Check if coreName matches in dictionary
  const normCore = normalizeKoreanText(coreName);
  const coreTrans =
    MENU_NAME_TRANSLATIONS[coreName]?.[targetLang] ||
    MENU_NAME_TRANSLATIONS[normCore]?.[targetLang];

  if (coreTrans && detectedSize) {
    if (targetLang === 'en') {
      return `${coreTrans} ${detectedSize.en}`.trim();
    }
    if (targetLang === 'ja') {
      return `${coreTrans} ${detectedSize.ja}`.trim();
    }
    if (targetLang === 'zh') {
      return `${coreTrans} ${detectedSize.zh}`.trim();
    }
  }

  // 4. Morpheme Decomposition for arbitrary custom menu name
  // Tokenize coreName into recognized Korean food terms
  let remaining = coreName;
  const matchedTokens: Array<{ ko: string; trans: Record<SupportedLanguage, string> }> = [];

  while (remaining.length > 0) {
    let matched = false;
    const trimmedRem = remaining.trim();

    for (const term of ALL_FOOD_TERMS) {
      if (trimmedRem.startsWith(term.key)) {
        matchedTokens.push({ ko: term.key, trans: term.map[term.key] });
        remaining = trimmedRem.slice(term.key.length).trim();
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Skip one character/word
      const nextSpace = trimmedRem.indexOf(' ');
      const unknownToken = nextSpace > 0 ? trimmedRem.slice(0, nextSpace) : trimmedRem;
      if (RAW_VOCABULARY[unknownToken]?.[targetLang]) {
        matchedTokens.push({ ko: unknownToken, trans: RAW_VOCABULARY[unknownToken] });
      } else {
        matchedTokens.push({
          ko: unknownToken,
          trans: { ko: unknownToken, en: unknownToken, ja: unknownToken, zh: unknownToken },
        });
      }
      remaining = nextSpace > 0 ? trimmedRem.slice(nextSpace).trim() : '';
    }
  }

  if (matchedTokens.length > 0) {
    let assembled = '';
    if (targetLang === 'en') {
      assembled = matchedTokens.map((t) => t.trans.en).join(' ');
      if (detectedSize) assembled += ` ${detectedSize.en}`;
    } else if (targetLang === 'ja') {
      assembled = matchedTokens.map((t) => t.trans.ja).join('');
      if (detectedSize) assembled += ` ${detectedSize.ja}`;
    } else {
      assembled = matchedTokens.map((t) => t.trans.zh).join('');
      if (detectedSize) assembled += ` ${detectedSize.zh}`;
    }
    return assembled.replace(/\s+/g, ' ').trim();
  }

  // 5. Fallback phrase replacement
  let translated = trimmed;
  for (const koreanPhrase of VOCABULARY_KEYS) {
    const transMap = RAW_VOCABULARY[koreanPhrase];
    if (translated.includes(koreanPhrase) && transMap[targetLang]) {
      translated = translated.replaceAll(koreanPhrase, ` ${transMap[targetLang]} `);
    }
  }
  return translated.replace(/\s+/g, ' ').trim() || trimmed;
}

/**
 * Translates a single plain text token (without tags)
 */
function translatePlainName(name: string, targetLang: SupportedLanguage): string {
  const trimmed = name.trim();
  if (!trimmed) return name;

  return dynamicTranslateMenuName(trimmed, targetLang);
}

/**
 * Translate a menu name automatically based on language
 * Supports:
 * - 100% full translation for Dosirak, Cupbap (all sizes: Light, Basic, Mega), and Set menus
 * - Dynamic decomposition for any newly registered or custom menu name
 * - Preserves style tags ([c:...], <span...>, etc.) with styling intact
 */
export function translateMenuName(name: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!name || targetLang === 'ko') return name;

  // If text contains style tags, handle tag preservation cleanly
  if (name.includes('[') || name.includes('<')) {
    const parts = splitByTags(name);
    // Find plain clean text without tags
    const cleanFullText = parts
      .filter((p) => p.type === 'text')
      .map((p) => p.val)
      .join('')
      .trim();

    // If clean text has an exact translation, translate whole string
    const fullTrans = dynamicTranslateMenuName(cleanFullText, targetLang);

    // If tag wrapped a specific single word like "라이트", "베이직", "메가"
    const taggedPart = parts.find(
      (p, idx) =>
        p.type === 'text' &&
        idx > 0 &&
        parts[idx - 1]?.type === 'tag' &&
        !parts[idx - 1].val.startsWith('[/') &&
        !parts[idx - 1].val.startsWith('</') &&
        p.val.trim().length > 0
    );
    if (taggedPart) {
      const taggedWord = taggedPart.val.trim();
      const taggedTrans =
        MENU_SIZE_MAP[taggedWord]?.[targetLang] ||
        TAG_TRANSLATIONS[taggedWord]?.[targetLang] ||
        translatePlainName(taggedWord, targetLang);

      if (taggedTrans && fullTrans.includes(taggedTrans)) {
        const openTag = parts.find((p) => p.type === 'tag' && !p.val.startsWith('[/') && !p.val.startsWith('</'))?.val || '';
        const closeTag = parts.find((p) => p.type === 'tag' && (p.val.startsWith('[/') || p.val.startsWith('</')))?.val || '';
        if (openTag && closeTag) {
          return fullTrans.replace(taggedTrans, `${openTag}${taggedTrans}${closeTag}`);
        }
      }
    }

    // Default per-chunk translation
    return parts
      .map((part) => {
        if (part.type === 'tag') return part.val;
        const leading = part.val.startsWith(' ') ? ' ' : '';
        const trailing = part.val.endsWith(' ') ? ' ' : '';
        const trans = translatePlainName(part.val, targetLang);
        return `${leading}${trans}${trailing}`;
      })
      .join('');
  }

  return dynamicTranslateMenuName(name, targetLang);
}

/**
 * Cleans up orphan Korean particles and grammars left over in foreign sentences
 */
function cleanForeignGrammar(text: string, targetLang: SupportedLanguage): string {
  if (targetLang === 'ko') return text;

  let cleaned = text;
  // Clean Korean particles when attached to English words
  cleaned = cleaned
    .replace(/([a-zA-Z0-9)])\s*(과|와|을|를|은|는|이|가|에|에서|으로|로|의|도|랑|이랑|하고|등)\b/g, '$1 ')
    .replace(/\b(과|와|을|를|은|는|이|가|에|에서|으로|로|의|도|랑|이랑|하고|등)\s+([a-zA-Z0-9])/g, ' $2')
    .replace(/\s*([,.~!?:;])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Translates a single plain description string (without tags)
 */
function translatePlainDesc(desc: string, targetLang: SupportedLanguage): string {
  const trimmed = desc.trim().replace(/^["']|["']$/g, '').trim();
  if (!trimmed) return desc;

  // 1. Exact dictionary match
  if (MENU_DESC_TRANSLATIONS[trimmed]?.[targetLang]) {
    return MENU_DESC_TRANSLATIONS[trimmed][targetLang];
  }

  // 2. Normalized match (cleaning up any hybrid English tokens)
  const normalized = normalizeKoreanText(trimmed);
  if (MENU_DESC_TRANSLATIONS[normalized]?.[targetLang]) {
    return MENU_DESC_TRANSLATIONS[normalized][targetLang];
  }

  // 3. Default modal description ("매일 아침 신선한 재료로 정갈하게 조리한 정성 도시락")
  if (trimmed.includes('신선한 재료로 정갈하게') || trimmed.includes('정성 도시락')) {
    if (targetLang === 'en') return 'Wholesome bento neatly prepared every morning with fresh daily ingredients.';
    if (targetLang === 'ja') return '毎朝新鮮な食材で端正に手作りした真心のお弁当。';
    if (targetLang === 'zh') return '每日清晨选用新鲜食材精心烹制的暖心便当。';
  }

  // 4. Specific Cupbap description sentence matching (as shown in user screenshot)
  // Chicken Mayo Cupbap variations
  if (
    trimmed.includes('바삭한 순살') &&
    (trimmed.includes('치킨') || trimmed.includes('Chicken')) &&
    (trimmed.includes('데리야끼') || trimmed.includes('마요') || trimmed.includes('Mayo'))
  ) {
    const isLight = trimmed.includes('라이트') || trimmed.includes('소식좌') || trimmed.includes('Light');
    const isMega = trimmed.includes('메가') || trimmed.includes('대용량') || trimmed.includes('Mega');
    if (targetLang === 'en') {
      if (isLight) return 'Crispy boneless chicken and savory egg strips topped with generous sweet & savory teriyaki and mayo sauce over warm rice. Light portion customized for lighter appetites.';
      if (isMega) return 'Crispy boneless chicken and savory egg strips topped with generous sweet & savory teriyaki and mayo sauce over warm rice. Generous Mega portion packed with extra chicken and rice.';
      return 'Crispy boneless chicken and savory egg strips topped with generous sweet & savory teriyaki and mayo sauce over warm rice. Satisfying standard Basic portion.';
    }
    if (targetLang === 'ja') {
      if (isLight) return '温かいご飯の上にサクサクの骨なしチキンと香ばしい錦糸卵、甘じょっぱいテリヤキ＆マヨネーズソースをたっぷり。少食の方に嬉しいライトサイズ。';
      if (isMega) return '温かいご飯の上にサクサクの骨なしチキンと香ばしい錦糸卵、甘じょっぱいテリヤキ＆マヨネーズソースをたっぷり。チキンとご飯を惜しみなく大盛りにしたメガサイズ。';
      return '温かいご飯の上にサクサクの骨なしチキンと香ばしい錦糸卵、甘じょっぱいテリヤキ＆マヨネーズソースをたっぷり。しっかり満足な定番ベーシック。';
    }
    if (targetLang === 'zh') {
      if (isLight) return '在香热米饭上铺满外酥里嫩的无骨炸鸡、浓香蛋丝，淋上大量特制甜咸照烧酱与蛋黄酱。专为小胃口定制的轻量版。';
      if (isMega) return '在香热米饭上铺满外酥里嫩的无骨炸鸡、浓香蛋丝，淋上大量特制甜咸照烧酱与蛋黄酱。鸡肉与米饭超级加倍的超大特大碗。';
      return '在香热米饭上铺满外酥里嫩的无骨炸鸡、浓香蛋丝，淋上大量特制甜咸照烧酱与蛋黄酱。份量十足的经典正装版。';
    }
  }

  // Soy Sauce Bulgogi Cupbap variations
  if (
    (trimmed.includes('간장 양념') || trimmed.includes('간장') || trimmed.includes('Soy Sauce')) &&
    (trimmed.includes('불고기') || trimmed.includes('Bulgogi')) &&
    (trimmed.includes('아삭한 채소') || trimmed.includes('푸짐하게'))
  ) {
    const isLight = trimmed.includes('라이트') || trimmed.includes('소식좌') || trimmed.includes('Light');
    const isMega = trimmed.includes('메가') || trimmed.includes('대용량') || trimmed.includes('Mega');
    if (targetLang === 'en') {
      if (isLight) return 'Tender bulgogi marinated in sweet & savory soy sauce with crisp fresh vegetables, generously served over warm rice. Light portion customized for lighter appetites.';
      if (isMega) return 'Tender bulgogi marinated in sweet & savory soy sauce with crisp fresh vegetables, generously served over warm rice. Generous Mega portion packed with extra meat and rice.';
      return 'Tender bulgogi marinated in sweet & savory soy sauce with crisp fresh vegetables, generously served over warm rice. Satisfying standard Basic portion.';
    }
    if (targetLang === 'ja') {
      if (isLight) return '甘辛い特製醤油ダレがしっかり染み込んだ柔らかいプルコギとシャキシャキ野菜をご飯の上にたっぷり。少食の方にぴったりなライトサイズ。';
      if (isMega) return '甘辛い特製醤油ダレがしっかり染み込んだ柔らかいプルコギとシャキシャキ野菜をご飯の上にたっぷり。お肉もご飯も超大盛りのメガサイズ。';
      return '甘辛い特製醤油ダレがしっかり染み込んだ柔らかいプルコギとシャキシャキ野菜をご飯の上にたっぷり。しっかり満足な定番ベーシック。';
    }
    if (targetLang === 'zh') {
      if (isLight) return '鲜嫩多汁的特制甜咸酱油烤肉搭配爽脆时蔬，热腾腾地盖在米饭上。专为小胃口定制的轻量版。';
      if (isMega) return '鲜嫩多汁的特制甜咸酱油烤肉搭配爽脆时蔬，热腾腾地盖在米饭上。烤肉与米饭豪华加量的超大特大碗。';
      return '鲜嫩多汁的特制甜咸酱油烤肉搭配爽脆时蔬，热腾腾地盖在米饭上。份量十足的经典正装版。';
    }
  }

  // Gochujang Bulgogi Cupbap variations
  if (
    (trimmed.includes('고추장') || trimmed.includes('Gochujang')) &&
    (trimmed.includes('불고기') || trimmed.includes('Bulgogi'))
  ) {
    const isLight = trimmed.includes('라이트') || trimmed.includes('소식좌') || trimmed.includes('Light');
    const isMega = trimmed.includes('메가') || trimmed.includes('대용량') || trimmed.includes('Mega');
    if (targetLang === 'en') {
      if (isLight) return 'Fiery sweet & spicy gochujang bulgogi stir-fried with crisp fresh vegetables over warm rice. Light portion customized for lighter appetites.';
      if (isMega) return 'Fiery sweet & spicy gochujang bulgogi stir-fried with crisp fresh vegetables over warm rice. Generous Mega portion packed with extra meat and rice.';
      return 'Fiery sweet & spicy gochujang bulgogi stir-fried with crisp fresh vegetables over warm rice. Satisfying standard Basic portion.';
    }
    if (targetLang === 'ja') {
      if (isLight) return 'ピリ辛で甘旨い特製コチュジャンプルコギとシャキシャキ野菜を温かいご飯の上にたっぷり。少食の方にぴったりなライトサイズ。';
      if (isMega) return 'ピリ辛で甘旨い特製コチュジャンプルコギとシャキシャキ野菜を温かいご飯の上にたっぷり。お肉もご飯も超大盛りのメガサイズ。';
      return 'ピリ辛で甘旨이特製コチュジャンプルコギとシャキシャキ野菜を温かいご飯の上にたっぷり。しっかり満足な定番ベーシック。';
    }
    if (targetLang === 'zh') {
      if (isLight) return '香辣浓郁的特制韩式辣酱烤肉搭配爽口时蔬，热腾腾地盖在米饭上。专为小胃口定制的轻量版。';
      if (isMega) return '香辣浓郁的特制韩式辣酱烤肉搭配爽脆蔬菜，热腾腾地盖在香糯米饭上。烤肉与米饭超级加倍的超大特大碗。';
      return '香辣浓郁的特制韩式辣酱烤肉搭配爽口时蔬，热腾腾地盖在米饭上。份量十足的经典正装版。';
    }
  }

  // 5. Set Menu Descriptions
  if (trimmed.includes('김치찌개 한상 세트') || trimmed.includes('김치찌개 세트')) {
    if (targetLang === 'en') return 'Delightful set combo pairing flavorful main dish with authentic domestic kimchi stew table.';
    if (targetLang === 'ja') return '旨味たっぷりのメイン料理と本格国産キムチチゲが揃った満足セット。';
    if (targetLang === 'zh') return '主菜搭配正宗韩国国产辣泡菜汤与手工小菜的丰盛正餐套餐。';
  }

  // 6. Partial dictionary prefix/substring match
  for (const [key, transMap] of Object.entries(MENU_DESC_TRANSLATIONS)) {
    if (trimmed.startsWith(key) || key.startsWith(trimmed)) {
      return transMap[targetLang];
    }
  }

  // 7. Comprehensive length-sorted phrase replacement fallback
  let translated = trimmed;
  for (const koreanPhrase of VOCABULARY_KEYS) {
    const transMap = RAW_VOCABULARY[koreanPhrase];
    if (translated.includes(koreanPhrase) && transMap[targetLang]) {
      translated = translated.replaceAll(koreanPhrase, ` ${transMap[targetLang]} `);
    }
  }

  return cleanForeignGrammar(translated, targetLang) || trimmed;
}

/**
 * Translate menu description
 * Supports tag preservation so style tags inside descriptions remain styled
 */
export function translateMenuDesc(desc: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!desc || targetLang === 'ko') return desc;

  // If text contains style tags, first check if clean full text matches known full description
  if (desc.includes('[') || desc.includes('<')) {
    const parts = splitByTags(desc);
    const cleanFullText = parts
      .filter((p) => p.type === 'text')
      .map((p) => p.val)
      .join('')
      .trim();

    const fullTrans = translatePlainDesc(cleanFullText, targetLang);
    // If clean text found an authoritative translation
    if (fullTrans !== cleanFullText) {
      // If tag wrapped a key phrase like "소식좌를 위한 라이트" or "든든한 정량 베이직" or "대용량 메가"
      const taggedPart = parts.find((p) => p.type === 'text' && p.val.trim().length > 3);
      if (taggedPart) {
        const taggedText = taggedPart.val.trim();
        const taggedTrans =
          RAW_VOCABULARY[taggedText]?.[targetLang] ||
          TAG_TRANSLATIONS[taggedText]?.[targetLang];

        if (taggedTrans && fullTrans.includes(taggedTrans)) {
          const openTag = parts.find((p) => p.type === 'tag' && !p.val.startsWith('[/') && !p.val.startsWith('</'))?.val || '';
          const closeTag = parts.find((p) => p.type === 'tag' && (p.val.startsWith('[/') || p.val.startsWith('</')))?.val || '';
          if (openTag && closeTag) {
            return fullTrans.replace(taggedTrans, `${openTag}${taggedTrans}${closeTag}`);
          }
        }
      }
      return fullTrans;
    }

    // Per-part fallback
    return parts
      .map((part) => {
        if (part.type === 'tag') return part.val;
        return translatePlainDesc(part.val, targetLang);
      })
      .join('');
  }

  return translatePlainDesc(desc, targetLang);
}

/**
 * Translate menu tag
 */
export function translateMenuTag(tag: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!tag || targetLang === 'ko') return tag;

  const trimmed = tag.trim();
  if (TAG_TRANSLATIONS[trimmed] && TAG_TRANSLATIONS[trimmed][targetLang]) {
    return TAG_TRANSLATIONS[trimmed][targetLang];
  }

  let translated = trimmed;
  for (const koreanPhrase of VOCABULARY_KEYS) {
    const transMap = RAW_VOCABULARY[koreanPhrase];
    if (translated.includes(koreanPhrase) && transMap[targetLang]) {
      translated = translated.replaceAll(koreanPhrase, ` ${transMap[targetLang]} `);
    }
  }
  return cleanForeignGrammar(translated, targetLang) || trimmed;
}

/**
 * Get UI string helper
 */
export function getUIText(key: keyof (typeof UI_TRANSLATIONS)['ko'], lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  return UI_TRANSLATIONS[targetLang]?.[key] || UI_TRANSLATIONS['ko'][key] || '';
}

/**
 * Format price according to language
 */
export function formatPrice(price: number, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  const formattedNumber = price.toLocaleString('ko-KR');
  if (targetLang === 'en') {
    return `₩${formattedNumber}`;
  }
  if (targetLang === 'ja') {
    return `${formattedNumber}ウォン`;
  }
  if (targetLang === 'zh') {
    return `${formattedNumber}韩元`;
  }
  return `${formattedNumber}원`;
}

/**
 * Translate operating hours text (e.g. '영업중 : 11:00-17:00')
 */
export function translateHoursText(hours: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!hours || targetLang === 'ko') return hours;

  // Extract hours range e.g. 11:00-17:00
  const match = hours.match(/(\d{1,2}:\d{2}\s*[-~]\s*\d{1,2}:\d{2})/);
  const timeRange = match ? match[1] : hours;

  if (targetLang === 'en') {
    return `Open : ${timeRange}`;
  }
  if (targetLang === 'ja') {
    return `営業中 : ${timeRange}`;
  }
  if (targetLang === 'zh') {
    return `营业中 : ${timeRange}`;
  }
  return hours;
}

/**
 * Translate last order text (e.g. '(라스트오더 마감 30분전)')
 */
export function translateLastOrderText(lastOrder: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!lastOrder || targetLang === 'ko') return lastOrder;

  if (targetLang === 'en') {
    return '(Last order: 30 min before closing)';
  }
  if (targetLang === 'ja') {
    return '(ラストオーダー閉店30分前)';
  }
  if (targetLang === 'zh') {
    return '(打烊前30分钟截止点餐)';
  }
  return lastOrder;
}

/**
 * Translate store address (e.g. '경기 평택시 송탄로 219')
 */
export function translateAddress(address: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!address || targetLang === 'ko') return address;

  if (address.includes('송탄로 219') || address.includes('평택')) {
    if (targetLang === 'en') {
      return '219, Songtan-ro, Pyeongtaek-si, Gyeonggi-do, Korea';
    }
    if (targetLang === 'ja') {
      return '大韓民国 京畿道平沢市松炭路219';
    }
    if (targetLang === 'zh') {
      return '韩国京畿道平泽市松炭路219';
    }
  }

  return address;
}

/**
 * Translate daily notice content
 */
export function translateNoticeContent(content: string, lang?: SupportedLanguage | string): string {
  const targetLang = resolveLang(lang);
  if (!content || targetLang === 'ko') return content;

  const trimmed = content.trim();
  if (NOTICE_TRANSLATIONS[trimmed] && NOTICE_TRANSLATIONS[trimmed][targetLang]) {
    return NOTICE_TRANSLATIONS[trimmed][targetLang];
  }

  let translated = trimmed;
  for (const koreanPhrase of VOCABULARY_KEYS) {
    const transMap = RAW_VOCABULARY[koreanPhrase];
    if (translated.includes(koreanPhrase) && transMap[targetLang]) {
      translated = translated.replaceAll(koreanPhrase, ` ${transMap[targetLang]} `);
    }
  }
  return translated.replace(/\s+/g, ' ').trim() || trimmed;
}
