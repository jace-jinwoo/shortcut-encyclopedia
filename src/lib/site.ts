export const SITE_NAME = '글로벌 IT 단축키 백과사전';
export const SITE_TAGLINE = 'VS Code, Figma, Photoshop, Excel, Chrome 단축키를 검색·필터·즐겨찾기·복사할 수 있는 치트시트';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://example.netlify.app').replace(/\/+$/, '');
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';
export const LAST_UPDATED = '2026-10-21';
/** 프로그램 페이지를 제외한 정적 페이지 경로 (sitemap, 검증 스크립트 공통) */
export const STATIC_PATHS = ['/', '/about/', '/guide/', '/privacy/', '/terms/', '/contact/'];

export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || '';
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' && ADSENSE_CLIENT !== '';

export const ADSENSE_SLOTS = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || '',
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL || '',
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || '',
} as const;

export type AdPlacement = keyof typeof ADSENSE_SLOTS;

export function absoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
