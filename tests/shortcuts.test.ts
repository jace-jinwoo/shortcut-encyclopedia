import { describe, expect, it } from 'vitest';
import {
  DATA, PROGRAMS, detectOS, filterShortcuts, normalize, parseFavorites, shortcutsOf, toggleFavorite, validateData,
  type Shortcut, type ShortcutData,
} from '@/lib/shortcuts';

const mk = (o: Partial<Shortcut>): Shortcut => ({
  id: 't-1', program: 'vscode', os: 'windows', category: '편집', keys: 'Ctrl+C', description: '복사',
  sourceUrl: 'https://example.com/doc', verifiedVersion: '1.0', checkedAt: '2026-10-19', status: '확인됨', ...o,
});

describe('데이터', () => {
  it('실제 데이터가 스키마를 통과하고 5개 프로그램을 포함한다', () => {
    expect(validateData(DATA)).toEqual([]);
    expect(PROGRAMS.map((p) => p.slug)).toEqual(['vscode', 'figma', 'photoshop', 'excel', 'chrome']);
  });
  it('확인됨인데 출처/버전/확인일이 없으면 오류', () => {
    const bad: ShortcutData = { ...DATA, shortcuts: [mk({ sourceUrl: '', verifiedVersion: '' })] };
    expect(validateData(bad).length).toBeGreaterThan(0);
  });
  it('알 수 없는 프로그램·중복 id 검출', () => {
    const bad: ShortcutData = { ...DATA, shortcuts: [mk({}), mk({ program: 'nope' })] };
    expect(validateData(bad).length).toBe(2);
  });
});

describe('필터·검색', () => {
  const list = [
    mk({ id: 'a' }),
    mk({ id: 'b', os: 'macos', keys: '⌘C' }),
    mk({ id: 'c', category: '탐색', keys: 'Ctrl+P', description: '파일 열기' }),
    mk({ id: 'd', status: '미확인' }),
    mk({ id: 'e', program: 'excel', keys: 'Ctrl+Shift+L', description: '필터' }),
  ];
  it('OS 전환', () => {
    expect(filterShortcuts(list, { os: 'macos' }).map((s) => s.id)).toEqual(['b']);
  });
  it('미확인 항목은 제외', () => {
    expect(filterShortcuts(list, { os: 'windows' }).map((s) => s.id)).not.toContain('d');
  });
  it('실시간 검색은 키 조합 표기 차이를 무시', () => {
    expect(filterShortcuts(list, { os: 'windows', query: 'ctrl p' }).map((s) => s.id)).toEqual(['c']);
    expect(filterShortcuts(list, { os: 'macos', query: 'cmd+c' }).map((s) => s.id)).toEqual(['b']);
    expect(filterShortcuts(list, { os: 'windows', query: '열기' }).map((s) => s.id)).toEqual(['c']);
  });
  it('카테고리·프로그램·즐겨찾기 필터', () => {
    expect(filterShortcuts(list, { os: 'windows', category: '탐색' }).map((s) => s.id)).toEqual(['c']);
    expect(filterShortcuts(list, { os: 'windows', program: 'excel' }).map((s) => s.id)).toEqual(['e']);
    expect(filterShortcuts(list, { os: 'windows', favoritesOnly: true, favorites: new Set(['a']) }).map((s) => s.id)).toEqual(['a']);
  });
  it('shortcutsOf 는 확인됨만 반환', () => {
    expect(shortcutsOf('vscode', list).map((s) => s.id)).toEqual(['a', 'b', 'c']);
  });
  it('normalize', () => {
    expect(normalize('Ctrl + Shift-L')).toBe('ctrlshiftl');
    expect(normalize('⌘⇧P')).toBe('cmdshiftp');
  });
});

describe('즐겨찾기·OS 감지', () => {
  it('parse 는 손상된 JSON 에도 안전', () => {
    expect(parseFavorites(null)).toEqual([]);
    expect(parseFavorites('{bad')).toEqual([]);
    expect(parseFavorites('{"a":1}')).toEqual([]);
    expect(parseFavorites('["a","a",3,"b"]')).toEqual(['a', 'b']);
  });
  it('toggle', () => {
    expect(toggleFavorite(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggleFavorite(['a', 'b'], 'a')).toEqual(['b']);
  });
  it('detectOS', () => {
    expect(detectOS('Mozilla/5.0 (Macintosh; Intel Mac OS X)')).toBe('macos');
    expect(detectOS('Mozilla/5.0 (Windows NT 10.0)')).toBe('windows');
  });
});
