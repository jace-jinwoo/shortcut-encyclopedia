import raw from '@/data/shortcuts.json';

export type OS = 'windows' | 'macos';
export type Status = '확인됨' | '미확인';

export interface Program {
  slug: string;
  name: string;
  vendor: string;
  kind: string;
  docsUrl: string;
  verifiedVersion: string;
  checkedAt: string;
  status: Status;
}

export interface Shortcut {
  id: string;
  program: string;
  os: OS;
  category: string;
  keys: string;
  description: string;
  sourceUrl: string;
  verifiedVersion: string;
  checkedAt: string;
  status: Status;
}

export interface ShortcutData {
  schemaVersion: number;
  programs: Program[];
  shortcuts: Shortcut[];
}

export const DATA = raw as unknown as ShortcutData;
export const PROGRAMS: Program[] = DATA.programs;
export const SHORTCUTS: Shortcut[] = DATA.shortcuts;
export const OS_LABEL: Record<OS, string> = { windows: 'Windows', macos: 'macOS' };
export const FAVORITES_KEY = 'shortcut-favorites-v1';
export const OS_KEY = 'shortcut-os-v1';

export function getProgram(slug: string): Program | undefined {
  return PROGRAMS.find((p) => p.slug === slug);
}

export function shortcutsOf(program: string, list: Shortcut[] = SHORTCUTS): Shortcut[] {
  return list.filter((s) => s.program === program && s.status === '확인됨');
}

export function categoriesOf(list: Shortcut[]): string[] {
  return [...new Set(list.map((s) => s.category))].sort((a, b) => a.localeCompare(b, 'ko'));
}

/** 검색용 정규화: 소문자, 공백·+·- 제거, 맥 기호를 이름으로 치환 */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/⌘/g, 'cmd')
    .replace(/⌥/g, 'option')
    .replace(/⇧/g, 'shift')
    .replace(/⌃/g, 'ctrl')
    .replace(/\s+/g, '')
    .replace(/[+\-]/g, '');
}

export interface Filter {
  os: OS;
  category?: string;
  query?: string;
  program?: string;
  favoritesOnly?: boolean;
  favorites?: ReadonlySet<string>;
}

export function filterShortcuts(list: Shortcut[], f: Filter): Shortcut[] {
  const q = normalize(f.query ?? '');
  return list.filter((s) => {
    if (s.status !== '확인됨') return false;
    if (s.os !== f.os) return false;
    if (f.program && s.program !== f.program) return false;
    if (f.category && s.category !== f.category) return false;
    if (f.favoritesOnly && !f.favorites?.has(s.id)) return false;
    if (q && !normalize(`${s.keys}${s.description}${s.category}`).includes(q)) return false;
    return true;
  });
}

export function parseFavorites(json: string | null): string[] {
  if (!json) return [];
  try {
    const v: unknown = JSON.parse(json);
    return Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(favs: readonly string[], id: string): string[] {
  return favs.includes(id) ? favs.filter((x) => x !== id) : [...favs, id];
}

export function loadFavorites(): string[] {
  try {
    return parseFavorites(window.localStorage.getItem(FAVORITES_KEY));
  } catch {
    return [];
  }
}

export function saveFavorites(favs: readonly string[]): boolean {
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
    return true;
  } catch {
    return false;
  }
}

export function detectOS(ua: string): OS {
  return /Mac|iPhone|iPad/i.test(ua) ? 'macos' : 'windows';
}

/** 데이터 무결성 검사. 오류 메시지 배열(비어 있으면 정상) */
export function validateData(data: ShortcutData): string[] {
  const errs: string[] = [];
  const slugs = new Set<string>();
  const dateRe = /^\d{4}-\d{2}-\d{2}$/;
  for (const p of data.programs) {
    if (slugs.has(p.slug)) errs.push(`중복 프로그램: ${p.slug}`);
    slugs.add(p.slug);
    if (p.status === '확인됨' && !(p.docsUrl.startsWith('https://') && p.verifiedVersion && dateRe.test(p.checkedAt))) {
      errs.push(`프로그램 ${p.slug}: 확인됨이면 docsUrl/verifiedVersion/checkedAt 필요`);
    }
  }
  const ids = new Set<string>();
  for (const s of data.shortcuts) {
    if (ids.has(s.id)) errs.push(`중복 id: ${s.id}`);
    ids.add(s.id);
    if (!slugs.has(s.program)) errs.push(`${s.id}: 알 수 없는 프로그램 ${s.program}`);
    if (s.os !== 'windows' && s.os !== 'macos') errs.push(`${s.id}: os 오류`);
    if (!s.keys.trim() || !s.description.trim() || !s.category.trim()) errs.push(`${s.id}: 필수 필드 비어 있음`);
    if (s.status === '확인됨' && !(s.sourceUrl.startsWith('https://') && s.verifiedVersion && dateRe.test(s.checkedAt))) {
      errs.push(`${s.id}: 확인됨이면 sourceUrl(https)/verifiedVersion/checkedAt 필요`);
    }
  }
  return errs;
}
