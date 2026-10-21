import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import { PROGRAMS } from '@/lib/shortcuts';

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-bold text-brand-700">{SITE_NAME}</Link>
        <nav aria-label="주요 메뉴">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <li><Link href="/" className="text-gray-700 hover:text-brand-700">홈</Link></li>
            {PROGRAMS.map((p) => (
              <li key={p.slug}><Link href={`/shortcuts/${p.slug}/`} className="text-gray-700 hover:text-brand-700">{p.name}</Link></li>
            ))}
            <li><Link href="/guide/" className="text-gray-700 hover:text-brand-700">이용 안내</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <nav aria-label="사이트 정보">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li><Link href="/about/" className="hover:text-brand-700">서비스 소개</Link></li>
            <li><Link href="/guide/" className="hover:text-brand-700">이용 안내</Link></li>
            <li><Link href="/privacy/" className="hover:text-brand-700">개인정보처리방침</Link></li>
            <li><Link href="/terms/" className="hover:text-brand-700">이용약관</Link></li>
            <li><Link href="/contact/" className="hover:text-brand-700">문의</Link></li>
          </ul>
        </nav>
        <p className="mt-4 text-xs text-gray-500">
          © {SITE_NAME}. 단축키는 프로그램 버전·운영체제·사용자 지정에 따라 다를 수 있습니다. 공식 문서에서 확인하지 못한 항목은 수록하지 않고 "미확인"으로 표시합니다. 각 프로그램의 상표는 해당 회사의 소유이며 이 사이트는 공식 사이트가 아닙니다.
        </p>
      </div>
    </footer>
  );
}
