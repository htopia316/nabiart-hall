# 나비아트홀 (Nabiart Hall)

나비아트홀 극단의 공식 홈페이지입니다. 공연 정보, 티켓 예매, 극장 대관, 후원 등 극단 운영에 필요한 기능을 제공하는 풀스택 웹 애플리케이션입니다.

## 주요 기능

- **공연 정보**: 현재 상영 중인 공연 및 공연 이력 조회
- **티켓 예매**: 좌석 선택부터 결제까지 원스톱 예매
- **극장 대관**: 대관 안내 및 문의 접수
- **후원**: 일시/정기 후원 및 후원자 명단 공개
- **공지사항**: 극단 소식 및 공지
- **관리자 페이지**: 공연/예매/프로필/공지 CRUD 관리
- **다국어 지원**: 한국어, 영어, 중국어

## 기술 스택

- **프론트엔드**: Next.js (App Router), TypeScript, Tailwind CSS
- **상태관리**: Zustand
- **다국어**: next-intl
- **백엔드/DB**: Supabase (Auth, Database, Storage)
- **배포**: Vercel

## 시작하기

### 환경 변수 설정

`.env.local.example`을 복사해 `.env.local`을 만들고 Supabase 정보를 입력하세요.

```bash
cp .env.local.example .env.local
```

### 개발 서버 실행

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 브랜치 전략

- `main`: 배포 브랜치
- `feature/T-XXX-description`: 기능 개발 브랜치

커밋 메시지는 Conventional Commits 형식을 따릅니다. (`feat:`, `fix:`, `chore:` 등)
