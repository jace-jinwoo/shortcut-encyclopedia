import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import ShortcutBrowser from '@/components/ShortcutBrowser';
import { PROGRAM_FAQ } from '@/data/content';
import { PROGRAMS, getProgram, shortcutsOf } from '@/lib/shortcuts';
import { SITE_NAME, absoluteUrl } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ program: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ program: string }> }): Promise<Metadata> {
  const { program } = await params;
  const p = getProgram(program);
  if (!p) return {};
  const n = shortcutsOf(p.slug).length;
  const path = `/shortcuts/${p.slug}/`;
  return {
    title: `${p.name} 단축키 (Windows·macOS)`,
    description: n > 0
      ? `${p.name} 단축키 ${n}개를 Windows·macOS별로 검색·필터·복사하세요. 공식 문서 출처와 검증 버전을 함께 표시합니다.`
      : `${p.name} 단축키 치트시트. 공식 문서 확인 전이라 현재 검증된 단축키는 없으며 미확인 상태로 표시합니다.`,
    alternates: { canonical: path },
    openGraph: { url: path, title: `${p.name} 단축키 | ${SITE_NAME}` },
  };
}

export default async function ProgramPage({ params }: { params: Promise<{ program: string }> }) {
  const { program } = await params;
  const p = getProgram(program);
  if (!p) notFound();
  const list = shortcutsOf(p.slug);
  const faq = PROGRAM_FAQ(p.name);
  return (
    <article className="space-y-8">
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: `${p.name} 단축키`, item: absoluteUrl(`/shortcuts/${p.slug}/`) },
        ],
      }} />
      <header>
        <h1 className="text-3xl font-bold text-gray-900">{p.name} 단축키</h1>
        <p className="mt-2 text-gray-700">{p.vendor} {p.kind} {p.name}의 단축키를 Windows·macOS별로 검색하고 복사할 수 있습니다.</p>
        <dl className="mt-3 grid gap-1 text-sm text-gray-700 sm:grid-cols-3">
          <div><dt className="inline font-medium">상태: </dt><dd className="inline">{p.status}</dd></div>
          <div><dt className="inline font-medium">검증 버전: </dt><dd className="inline">{p.verifiedVersion || '미확인'}</dd></div>
          <div><dt className="inline font-medium">확인일: </dt><dd className="inline">{p.checkedAt || '미확인'}</dd></div>
        </dl>
      </header>

      <p className="rounded-md border border-brand-200 bg-brand-50 p-3 text-sm text-brand-900" role="note">
        버전 차이·사용자 지정 안내: 단축키는 {p.name} 버전, 운영체제, 키보드 배열, 사용자 지정 설정에 따라 다를 수 있습니다. 동작이 다르면 프로그램의 단축키 설정과 공식 문서를 확인하세요.
      </p>

      <ShortcutBrowser shortcuts={list} programs={PROGRAMS} fixedProgram={p.slug} />
      <AdSlot placement="tool" />

      <section aria-labelledby="use-h">
        <h2 id="use-h" className="text-xl font-semibold">사용 방법</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-700">
          <li>Windows 또는 macOS 버튼으로 운영체제를 고릅니다(브라우저가 기억합니다).</li>
          <li>검색창과 분류 버튼으로 원하는 단축키를 좁힙니다. 예: "복사", "ctrl+c".</li>
          <li>★ 로 즐겨찾기에 추가하고, "복사" 버튼으로 키 조합 텍스트를 복사합니다.</li>
        </ol>
      </section>

      <section aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-xl font-semibold">자주 묻는 질문</h2>
        <dl className="mt-2 space-y-3">
          {faq.map((f) => (
            <div key={f.q}><dt className="font-medium text-gray-900">{f.q}</dt><dd className="text-gray-700">{f.a}</dd></div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="src-h">
        <h2 id="src-h" className="text-xl font-semibold">공식 출처</h2>
        {p.docsUrl ? (
          <p className="mt-2 text-gray-700"><a href={p.docsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">{p.name} 공식 단축키 문서</a> (확인일 {p.checkedAt})</p>
        ) : (
          <p className="mt-2 text-gray-700">공식 문서 링크를 아직 확인하지 못했습니다(미확인).</p>
        )}
      </section>

      <nav aria-label="다른 프로그램" className="text-sm">
        <p className="font-medium text-gray-900">다른 프로그램 단축키</p>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {PROGRAMS.filter((o) => o.slug !== p.slug).map((o) => (
            <li key={o.slug}><Link href={`/shortcuts/${o.slug}/`} className="text-brand-700 underline">{o.name}</Link></li>
          ))}
          <li><Link href="/" className="text-brand-700 underline">홈</Link></li>
        </ul>
      </nav>
    </article>
  );
}
