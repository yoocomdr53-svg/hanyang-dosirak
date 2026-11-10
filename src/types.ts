export type MenuCategory = string;
export const DEFAULT_CATEGORIES: string[] = ['도시락', '컵밥', '반찬'];

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: MenuCategory[];
  img: string;
  initialImg: string;
  desc: string;
  tag: string;
  isBest?: boolean;
  isRec?: boolean;
  isSoldOut: boolean;
  isVisible: boolean;
  nameColor?: string;
  nameFont?: string;
  nameFontSize?: string;
}

export interface DailyNoticeState {
  content: string;
  isVisible: boolean;
}

export interface StoreStatusState {
  isOpen: boolean;
  hoursText: string;
  lastOrderText: string;
  address: string;
}

export interface AppVersionInfo {
  version: string;
  versionCode: number;
  buildTime: number;
  releaseDate: string;
  title: string;
  notes: string[];
}
