import type { Metadata } from 'next';
import Link from 'next/link';
import { PROGRAMS } from '@/lib/shortcuts';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '이용 안내',
  description: `${SITE_NAME} 사용 방법, 검증 상태 표시 방식, 버전 차이와 사용자 지정 단축키 주의사항을 안내합니다.`,
  alternates: { canonical: '/guide/' },
  openGraph: { url: '/guide/', title: `이용 안내 | ${SITE_NAME}` },
};

export default function GuidePage() {
  return (
    <article className="space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">이용 안내</h1>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">사용 방법</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>홈 또는 프로그램별 페이지에서 검색어를 입력하면 즉시 결과가 걸러집니다.</li>
          <li>Windows/macOS 전환, 기능 분류 필터, ★ 즐겨찾기(브라우저 localStorage), 키 조합 복사를 지원합니다.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">데이터 검증 정책</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>공식 문서에서 직접 확인한 단축키만 출처 URL, 검증 버전, 확인일과 함께 수록합니다.</li>
          <li>확인하지 못한 프로그램은 "미확인"으로 표시하며 기억에 의존한 단축키는 넣지 않습니다.</li>
          <li>단축키는 버전·운영체제·키보드 배열·사용자 지정에 따라 달라질 수 있으니 공식 문서와 함께 확인하세요.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">프로그램별 페이지</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {PROGRAMS.map((p) => (
            <li key={p.slug}><Link href={`/shortcuts/${p.slug}/`} className="text-brand-700 underline">{p.name} 단축키</Link> ({p.status})</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
