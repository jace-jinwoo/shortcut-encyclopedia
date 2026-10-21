import type { Metadata } from 'next';
import Link from 'next/link';
import { PROGRAMS } from '@/lib/shortcuts';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: '서비스 소개',
  description: `${SITE_NAME}는 VS Code, Figma, Photoshop, Excel, Chrome 단축키 치트시트를 제공하는 무료 웹 서비스입니다. 운영 원칙과 데이터 정확성 정책을 안내합니다.`,
  alternates: { canonical: '/about/' },
  openGraph: { url: '/about/', title: `서비스 소개 | ${SITE_NAME}` },
};

export default function AboutPage() {
  return (
    <article className="space-y-6 text-gray-700">
      <h1 className="text-3xl font-bold text-gray-900">서비스 소개</h1>
      <p>{SITE_NAME}는 주요 IT 프로그램의 단축키를 검색·필터·즐겨찾기·복사할 수 있는 무료 치트시트입니다. 회원가입이 없고 모든 처리는 브라우저 안에서 이루어집니다.</p>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">제공 프로그램</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {PROGRAMS.map((p) => (
            <li key={p.slug}><Link href={`/shortcuts/${p.slug}/`} className="text-brand-700 underline">{p.name}</Link> - {p.kind} ({p.status})</li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">데이터 정확성 정책</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5">
          <li>공식 문서를 직접 열어 확인한 단축키만 출처·검증 버전·확인일과 함께 수록합니다.</li>
          <li>공식 문서에 없거나 확인하지 못한 단축키는 임의로 만들지 않고 "미확인"으로 표시합니다.</li>
          <li>버전별 차이와 사용자 지정 가능성을 화면에 안내합니다. 이 사이트는 각 프로그램의 공식 사이트가 아닙니다.</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold text-gray-900">광고에 대해</h2>
        <p className="mt-2">운영을 위해 Google AdSense 광고를 게재할 수 있으며, 게재 시 "광고" 라벨로 구분합니다.</p>
      </section>
      <p>오류 제보와 제안은 <Link href="/contact/" className="text-brand-700 underline">문의 페이지</Link>를 이용해 주세요.</p>
    </article>
  );
}
