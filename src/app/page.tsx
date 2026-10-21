import Link from 'next/link';
import AdSlot from '@/components/AdSlot';
import ShortcutBrowser from '@/components/ShortcutBrowser';
import JsonLd from '@/components/JsonLd';
import { NOTICES } from '@/data/content';
import { PROGRAMS, SHORTCUTS, shortcutsOf } from '@/lib/shortcuts';
import { SITE_NAME, SITE_TAGLINE, absoluteUrl } from '@/lib/site';

export default function HomePage() {
  const verified = SHORTCUTS.filter((s) => s.status === '확인됨');
  return (
    <div className="space-y-10">
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: absoluteUrl('/'), inLanguage: 'ko' }} />
      <section>
        <h1 className="text-3xl font-bold text-gray-900">{SITE_NAME}</h1>
        <p className="mt-2 text-gray-700">{SITE_TAGLINE}.</p>
        <p className="mt-2 rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900" role="note">
          단축키는 프로그램 버전과 사용자 지정에 따라 다를 수 있습니다. 공식 문서에서 확인한 항목만 수록하며, 확인하지 못한 항목은 "미확인"으로 표시합니다.
        </p>
      </section>

      <section aria-labelledby="search-h">
        <h2 id="search-h" className="mb-3 text-xl font-semibold">전체 검색 · 카테고리 탐색</h2>
        <ShortcutBrowser shortcuts={verified} programs={PROGRAMS} />
      </section>

      <AdSlot placement="home" />

      <section aria-labelledby="pop-h">
        <h2 id="pop-h" className="mb-3 text-xl font-semibold">인기 도구</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAMS.map((p) => {
            const n = shortcutsOf(p.slug).length;
            return (
              <li key={p.slug}>
                <Link href={`/shortcuts/${p.slug}/`} className="block rounded-lg border border-gray-200 p-4 hover:border-brand-600 hover:bg-brand-50">
                  <span className="text-lg font-semibold text-brand-700">{p.name}</span>
                  <span className="mt-1 block text-sm text-gray-600">{p.vendor} · {p.kind}</span>
                  <span className="mt-2 block text-sm text-gray-700">{n > 0 ? `검증된 단축키 ${n}개` : '미확인 - 아직 검증된 단축키가 없습니다'}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="news-h">
        <h2 id="news-h" className="mb-3 text-xl font-semibold">최신 안내</h2>
        <ul className="space-y-3">
          {NOTICES.map((n) => (
            <li key={n.title} className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">{n.date}</p>
              <h3 className="font-semibold text-gray-900">{n.title}</h3>
              <p className="mt-1 text-sm text-gray-700">{n.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
