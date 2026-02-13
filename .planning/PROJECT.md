# Cal — 계산기 웹앱

## What This Is

깔끔하고 미니멀한 디자인의 웹 기반 계산기. 사칙연산, 퍼센트, 부호 전환을 지원하며 계산 기록을 보여준다. 키보드 입력도 가능하다. 프레임워크 없이 순수 HTML/CSS/JS로 만들어 GitHub Pages에 바로 배포한다.

## Core Value

기본 계산을 빠르고 정확하게 할 수 있어야 한다. 복잡한 설정 없이 열면 바로 쓸 수 있는 계산기.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 사칙연산 (+, -, ×, ÷)
- [ ] 퍼센트(%) 계산
- [ ] 부호 전환 (+/-)
- [ ] 소수점 입력
- [ ] 전체 지우기 (AC) 및 한 자리 지우기
- [ ] 계산 기록 표시 (이전 계산 결과 목록)
- [ ] 키보드 입력 지원
- [ ] 깔끔하고 미니멀한 UI 디자인
- [ ] GitHub Pages 배포

### Out of Scope

- 공학용 함수 (sin, cos, log 등) — v1은 기본 계산기에 집중
- 사용자 계정/로그인 — 불필요
- 서버 사이드 로직 — 정적 호스팅으로 충분
- 모바일 앱 — 웹앱으로 충분 (반응형으로 모바일 대응)

## Context

- 순수 HTML/CSS/JS로 구현 (빌드 도구 불필요)
- GitHub Pages로 정적 배포 (가장 간단한 배포 방식)
- 반응형 디자인으로 모바일에서도 사용 가능하게

## Constraints

- **Tech stack**: HTML/CSS/JS only — 빌드 단계 없이 바로 배포 가능하도록
- **Hosting**: GitHub Pages — 무료, 정적 파일만 서빙
- **Design**: 미니멀 — 군더더기 없는 깔끔한 UI

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 프레임워크 없이 vanilla JS | 빌드 불필요, 배포 최대한 단순화 | — Pending |
| GitHub Pages 배포 | 무료, 정적 호스팅, 가장 간단 | — Pending |

---
*Last updated: 2026-02-14 after initialization*
