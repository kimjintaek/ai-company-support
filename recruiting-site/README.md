# Daon Insurance Recruiting Site

독립 Next.js 앱입니다. 기존 정책자금 플랫폼과 별도 Vercel 프로젝트로 배포하도록 구성합니다.

## Local development

```bash
cd recruiting-site
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Vercel deployment

기존 GitHub 저장소 `kimjintaek/ai-company-support`를 별도 Vercel 프로젝트로 Import한 뒤 다음과 같이 설정합니다.

- Root Directory: `recruiting-site`
- Framework Preset: Next.js
- Build Command: `npm run build`
- Install Command: `npm install`

기존 정책자금 플랫폼의 프로젝트 설정, 환경변수, 도메인은 변경하지 않습니다.

## Current scope

- 공개형 보험설계사 파트너 모집 랜딩페이지
- 기업영업 홍보지원 안내
- 채널별 콘텐츠 지원 안내
- 참여 절차 및 FAQ

회원 인증, AI 콘텐츠 생성, 지원자 접수 저장, 파트너별 링크 추적은 후속 단계에서 별도 설계·구현합니다. 현재 페이지는 이 기능들이 이미 동작한다고 표시하지 않습니다.
