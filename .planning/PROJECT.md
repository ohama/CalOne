# Cal — 계산기 웹앱

## What This Is

깔끔하고 미니멀한 웹 계산기. 사칙연산, 퍼센트, 부호 전환, 계산 기록을 지원하며 키보드로도 조작 가능. 순수 HTML/CSS/JS로 빌드 없이 GitHub Pages에 배포. 93개 자동화 테스트와 CI/CD 파이프라인 포함.

**Live:** https://ohama.github.io/CalOne/

## Core Value

기본 계산을 빠르고 정확하게 할 수 있어야 한다. 복잡한 설정 없이 열면 바로 쓸 수 있는 계산기.

## Requirements

### Validated

- ✓ 사칙연산 (+, -, ×, ÷) — v1.0
- ✓ 퍼센트(%) 계산 — v1.0
- ✓ 부호 전환 (+/-) — v1.0
- ✓ 소수점 입력 — v1.0
- ✓ 전체 지우기 (AC) 및 한 자리 지우기 — v1.0
- ✓ 계산 기록 표시 (이전 계산 결과 목록) — v1.0
- ✓ 키보드 입력 지원 — v1.0
- ✓ 깔끔하고 미니멀한 UI 디자인 — v1.0
- ✓ GitHub Pages 배포 — v1.0

### Active

- [ ] 다크모드 (시스템 감지 + 수동 토글)
- [ ] 결과 클립보드 복사
- [ ] 스크린 리더 지원 (ARIA labels, live regions)

### Out of Scope

- 공학용 함수 (sin, cos, log 등) — 기본 계산기에 집중
- 메모리 기능 (M+, M-, MR, MC) — 미니멀 디자인과 충돌
- 사용자 계정/로그인 — 불필요
- 서버 사이드 로직 — 정적 호스팅으로 충분
- 모바일 앱 — 웹앱 반응형으로 충분

## Context

- 순수 HTML/CSS/JS, 빌드 도구 불필요
- GitHub Pages 정적 배포 (ohama.github.io/CalOne)
- 905 lines app code (JS/CSS/HTML), 1,187 lines tests
- 93 automated tests (Vitest + Playwright)
- GitHub Actions CI + deploy pipeline

## Constraints

- **Tech stack**: HTML/CSS/JS only — 빌드 단계 없이 바로 배포
- **Hosting**: GitHub Pages — 무료, 정적 파일만 서빙
- **Design**: 미니멀 — 군더더기 없는 깔끔한 UI

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 프레임워크 없이 vanilla JS | 빌드 불필요, 배포 최대한 단순화 | ✓ Good |
| GitHub Pages 배포 | 무료, 정적 호스팅, 가장 간단 | ✓ Good |
| State object pattern | 연산 체이닝 버그 방지 | ✓ Good |
| toFixed(10) + parseFloat() | 부동소수점 정밀도 수정 | ✓ Good |
| CSS Grid 버튼 레이아웃 | 표준 2D 레이아웃 | ✓ Good |
| Event delegation | 19개 개별 리스너 대비 성능 향상 | ✓ Good |
| Vitest + Playwright | 실제 브라우저 API 테스트 | ✓ Good |
| configure-pages enablement: true | 수동 설정 없이 Pages 자동 활성화 | ✓ Good |

---
*Last updated: 2026-02-14 after v1.0 milestone*
