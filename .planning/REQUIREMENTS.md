# Requirements: Cal — 계산기 웹앱

**Defined:** 2026-02-14
**Core Value:** 기본 계산을 빠르고 정확하게 할 수 있어야 한다

## v1 Requirements

### Calculation

- [ ] **CALC-01**: 사칙연산 (+, -, ×, ÷) 수행
- [ ] **CALC-02**: 퍼센트(%) 계산
- [ ] **CALC-03**: 부호 전환 (+/-)
- [ ] **CALC-04**: 소수점 입력 (중복 입력 방지)
- [ ] **CALC-05**: 0으로 나누기 에러 처리
- [ ] **CALC-06**: 부동소수점 오차 보정 (0.1+0.2=0.3)

### Input

- [ ] **INPT-01**: 숫자 버튼 (0-9) 입력
- [ ] **INPT-02**: AC (전체 초기화) 버튼
- [ ] **INPT-03**: 백스페이스 (마지막 자리 삭제)
- [ ] **INPT-04**: 키보드 입력 지원 (숫자, 연산자, Enter, Escape, Backspace)
- [ ] **INPT-05**: 디스플레이 오버플로우 처리 (긴 숫자)

### History

- [ ] **HIST-01**: 계산 기록 목록 표시
- [ ] **HIST-02**: 기록 전체 삭제

### UI

- [ ] **UI-01**: 깔끔한 미니멀 디자인
- [ ] **UI-02**: CSS Grid 기반 버튼 레이아웃
- [ ] **UI-03**: 반응형 디자인 (모바일/데스크톱)
- [ ] **UI-04**: GitHub Pages 배포

## v2 Requirements

### Theme

- **DARK-01**: 다크모드 (시스템 감지 + 수동 토글)

### History Enhanced

- **HIST-03**: 기록 localStorage 영구 저장
- **HIST-04**: 결과 클립보드 복사

### Accessibility

- **ACCS-01**: 스크린 리더 지원 (ARIA labels, live regions)

## Out of Scope

| Feature | Reason |
|---------|--------|
| 공학용 함수 (sin, cos, log) | 기본 계산기에 집중 |
| 메모리 기능 (M+, M-, MR, MC) | 미니멀 디자인과 충돌 |
| 연산 반복 (= 연타) | v1에서는 단순 동작 우선 |
| 서버 사이드 로직 | 정적 호스팅으로 충분 |
| 모바일 앱 | 웹앱 반응형으로 충분 |
| OAuth / 사용자 계정 | 불필요 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CALC-01 | TBD | Pending |
| CALC-02 | TBD | Pending |
| CALC-03 | TBD | Pending |
| CALC-04 | TBD | Pending |
| CALC-05 | TBD | Pending |
| CALC-06 | TBD | Pending |
| INPT-01 | TBD | Pending |
| INPT-02 | TBD | Pending |
| INPT-03 | TBD | Pending |
| INPT-04 | TBD | Pending |
| INPT-05 | TBD | Pending |
| HIST-01 | TBD | Pending |
| HIST-02 | TBD | Pending |
| UI-01 | TBD | Pending |
| UI-02 | TBD | Pending |
| UI-03 | TBD | Pending |
| UI-04 | TBD | Pending |

**Coverage:**
- v1 requirements: 17 total
- Mapped to phases: 0
- Unmapped: 17 ⚠️

---
*Requirements defined: 2026-02-14*
*Last updated: 2026-02-14 after initial definition*
