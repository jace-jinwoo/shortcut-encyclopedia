# 글로벌 IT 단축키 백과사전

VS Code, Figma, Photoshop, Excel, Chrome 단축키 치트시트 (Next.js App Router + TypeScript + Tailwind 3, 정적 내보내기). 서버/DB/로그인 없음.

## 페이지
`/`(검색·카테고리·인기 도구·최신 안내), `/shortcuts/{vscode,figma,photoshop,excel,chrome}/`, `/guide/`, `/about/`, `/privacy/`, `/terms/`, `/contact/`, `robots.txt`, `sitemap.xml`.
기능: 실시간 검색, 기능 분류 필터, Windows/macOS 전환, 즐겨찾기(localStorage, 실패 시 세션 한정), 키 조합 복사.

## 데이터 (`src/data/shortcuts.json`)
- `programs[]`: slug, name, vendor, kind, docsUrl, verifiedVersion, checkedAt, status(`확인됨`/`미확인`)
- `shortcuts[]`: id, program, os(`windows`/`macos`), category, keys, description, sourceUrl, verifiedVersion, checkedAt, status
- 공식 문서를 직접 열어 확인한 값만 `확인됨`으로 넣습니다. 확인하지 못한 프로그램은 빈 데이터로 두고 화면에 "아직 검증된 단축키가 없습니다"를 표시합니다.
- 갱신 절차: 공식 문서 확인 → shortcuts 추가(OS별 1항목) → programs 의 status/docsUrl/verifiedVersion/checkedAt 갱신 → `npm test` → `npm run build && npm run verify`.
- 프로그램 추가: programs 에 항목을 추가하면 라우트·sitemap·검증 스크립트에 자동 반영됩니다.

## 검증 현황
아래 "데이터 현황" 참고(최종 갱신 시 기록).

## 개발·배포
```
npm install
npm run dev
npm test            # vitest
npm run typecheck
npm run build       # out/ 생성
npm run verify      # 정적 경로·링크·메타·데이터 검증
```
Netlify: build `npm run build`, publish `out`(netlify.toml 포함). GitHub 저장소 연결 후 배포. 환경변수는 `.env.example` 참고(`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, AdSense는 승인 전 `false` 유지; 비활성 시 광고 코드는 렌더링되지 않음).

## 데이터 현황
2026-10-21 기준: 5개 프로그램 모두 **미확인**(검증된 단축키 0개). 공식 문서 WebFetch 시도(VS Code 문서 1회)가 권한 문제로 차단되어 이후 시도를 중단했고, 기억에 의존한 단축키는 넣지 않았습니다. 각 프로그램 페이지는 "아직 검증된 단축키가 없습니다"를 표시합니다. 구조·UI·테스트는 완성되어 있어 `shortcuts.json`에 확인된 항목만 추가하면 바로 반영됩니다.

미실행 검증: npm 레지스트리 차단으로 `npm install`/`test`/`typecheck`/`build`/`verify`를 실행하지 못했습니다(코드 정독으로만 점검).
