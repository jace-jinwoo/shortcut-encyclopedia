'use client';

import { useEffect, useMemo, useState } from 'react';
import CopyButton from '@/components/CopyButton';
import {
  OS_KEY, OS_LABEL, categoriesOf, detectOS, filterShortcuts, loadFavorites, saveFavorites, toggleFavorite,
  type OS, type Program, type Shortcut,
} from '@/lib/shortcuts';

interface Props {
  /** 검증된(확인됨) 단축키 목록 */
  shortcuts: Shortcut[];
  programs: Program[];
  /** 지정하면 해당 프로그램만 표시 (프로그램 페이지) */
  fixedProgram?: string;
}

const chip = (on: boolean) =>
  `rounded-full border px-3 py-1 text-sm ${on ? 'border-brand-600 bg-brand-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-brand-50'}`;

export default function ShortcutBrowser({ shortcuts, programs, fixedProgram }: Props) {
  const [os, setOs] = useState<OS>('windows');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [program, setProgram] = useState(fixedProgram ?? '');
  const [favs, setFavs] = useState<string[]>([]);
  const [favOnly, setFavOnly] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => {
    setFavs(loadFavorites());
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(OS_KEY); } catch { /* 저장소 사용 불가 */ }
    setOs(saved === 'windows' || saved === 'macos' ? saved : detectOS(navigator.userAgent));
  }, []);

  const pool = useMemo(() => (fixedProgram ? shortcuts.filter((s) => s.program === fixedProgram) : shortcuts), [shortcuts, fixedProgram]);
  const categories = useMemo(() => categoriesOf(pool.filter((s) => (program ? s.program === program : true))), [pool, program]);
  const favSet = useMemo(() => new Set(favs), [favs]);
  const results = useMemo(
    () => filterShortcuts(pool, { os, query, category: category || undefined, program: program || undefined, favoritesOnly: favOnly, favorites: favSet }),
    [pool, os, query, category, program, favOnly, favSet],
  );
  const nameOf = (slug: string) => programs.find((p) => p.slug === slug)?.name ?? slug;

  function chooseOs(next: OS) {
    setOs(next);
    try { window.localStorage.setItem(OS_KEY, next); } catch { /* 무시 */ }
  }
  function toggleFav(id: string) {
    const next = toggleFavorite(favs, id);
    setFavs(next);
    setStorageOk(saveFavorites(next));
  }

  if (pool.length === 0) {
    return (
      <div role="status" className="rounded-lg border border-amber-300 bg-amber-50 p-5 text-amber-900">
        <p className="font-semibold">아직 검증된 단축키가 없습니다</p>
        <p className="mt-1 text-sm">공식 문서에서 직접 확인한 단축키만 수록하며, 현재 이 범위의 확인된 데이터가 없어 "미확인" 상태입니다. 임의로 작성한 단축키는 표시하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="sc-q" className="block text-sm font-medium text-gray-700">검색 (키 조합·설명)</label>
          <input id="sc-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 복사, ctrl+c"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand-600" />
        </div>
        <div role="group" aria-label="운영체제 선택" className="flex gap-2">
          {(['windows', 'macos'] as OS[]).map((o) => (
            <button key={o} type="button" aria-pressed={os === o} onClick={() => chooseOs(o)} className={chip(os === o)}>{OS_LABEL[o]}</button>
          ))}
        </div>
        <button type="button" aria-pressed={favOnly} onClick={() => setFavOnly(!favOnly)} className={chip(favOnly)}>★ 즐겨찾기만 ({favs.length})</button>
      </div>

      {!fixedProgram && (
        <div role="group" aria-label="프로그램 필터" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={program === ''} onClick={() => { setProgram(''); setCategory(''); }} className={chip(program === '')}>전체 프로그램</button>
          {programs.map((p) => (
            <button key={p.slug} type="button" aria-pressed={program === p.slug} onClick={() => { setProgram(p.slug); setCategory(''); }} className={chip(program === p.slug)}>{p.name}</button>
          ))}
        </div>
      )}
      {categories.length > 0 && (
        <div role="group" aria-label="기능 분류 필터" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={category === ''} onClick={() => setCategory('')} className={chip(category === '')}>전체 분류</button>
          {categories.map((c) => (
            <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)} className={chip(category === c)}>{c}</button>
          ))}
        </div>
      )}
      {!storageOk && <p role="alert" className="text-sm text-amber-800">브라우저 저장소를 사용할 수 없어 즐겨찾기가 이 세션에서만 유지됩니다.</p>}

      <p aria-live="polite" className="text-sm text-gray-600">{OS_LABEL[os]} 기준 {results.length}개</p>
      {results.length === 0 ? (
        <p className="rounded-md border border-gray-200 p-4 text-gray-600">조건에 맞는 단축키가 없습니다. 검색어·분류·운영체제를 바꿔 보세요.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
          {results.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center gap-3 p-3">
              <button type="button" aria-pressed={favSet.has(s.id)} aria-label={`${s.description} 즐겨찾기`} onClick={() => toggleFav(s.id)}
                className={`text-xl ${favSet.has(s.id) ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'}`}>★</button>
              <kbd className="rounded border border-gray-300 bg-gray-50 px-2 py-1 font-mono text-sm">{s.keys}</kbd>
              <div className="min-w-[10rem] flex-1">
                <p className="text-gray-900">{s.description}</p>
                <p className="text-xs text-gray-500">
                  {!fixedProgram && `${nameOf(s.program)} · `}{s.category} · v{s.verifiedVersion} · 확인 {s.checkedAt} ·{' '}
                  <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">출처</a>
                </p>
              </div>
              <CopyButton text={s.keys} label="복사" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
