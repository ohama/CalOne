# Roadmap: Cal — 계산기 웹앱

## Overview

Cal is a minimal calculator web app built with vanilla JavaScript, delivering precise basic calculations through a clean interface. The roadmap progresses from core calculation logic to full-featured interface, following a dependency-driven approach: establish rock-solid calculation engine first, layer on UI and input methods, then polish for production deployment.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Core Calculator Engine** - Pure calculation logic and state management
- [ ] **Phase 2: Display and Button Interface** - Visual interface with button input
- [ ] **Phase 3: Keyboard Support** - Keyboard input and focus management
- [ ] **Phase 4: Calculation History** - History tracking with localStorage persistence
- [ ] **Phase 5: Polish and Deploy** - UI refinement and GitHub Pages deployment

## Phase Details

### Phase 1: Core Calculator Engine
**Goal**: Users can perform accurate calculations through JavaScript API
**Depends on**: Nothing (first phase)
**Requirements**: CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06, INPT-01, INPT-02, INPT-05
**Success Criteria** (what must be TRUE):
  1. Calculator performs basic arithmetic (+, -, ×, ÷) correctly for single and chained operations
  2. Calculator handles decimal input without accepting multiple decimal points
  3. Calculator displays "Error" for division by zero
  4. Calculator produces accurate results for floating-point operations (0.1 + 0.2 = 0.3)
  5. Calculator truncates or formats display when numbers exceed display width
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Core calculator engine with state management and all arithmetic operations

### Phase 2: Display and Button Interface
**Goal**: Users can interact with calculator through clickable button interface
**Depends on**: Phase 1
**Requirements**: INPT-03, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. User can see current input and calculation results in display area
  2. User can click number buttons (0-9) to input values
  3. User can click operator buttons (+, -, ×, ÷, =) to perform calculations
  4. User can click AC to clear calculator and backspace to delete last digit
  5. Calculator layout is responsive and works on mobile and desktop screens
**Plans**: TBD

Plans:
- [ ] 02-01: TBD during phase planning

### Phase 3: Keyboard Support
**Goal**: Users can operate calculator using keyboard without mouse
**Depends on**: Phase 2
**Requirements**: INPT-04
**Success Criteria** (what must be TRUE):
  1. User can type numbers (0-9) and operators (+, -, *, /) on keyboard to input
  2. User can press Enter to calculate result
  3. User can press Escape to clear calculator and Backspace to delete
  4. Calculator shows visible focus indicators when navigating with keyboard
**Plans**: TBD

Plans:
- [ ] 03-01: TBD during phase planning

### Phase 4: Calculation History
**Goal**: Users can review and track their calculation history
**Depends on**: Phase 1
**Requirements**: HIST-01, HIST-02
**Success Criteria** (what must be TRUE):
  1. User sees list of previous calculations with expressions and results
  2. User can clear entire calculation history with one click
  3. History persists across browser sessions using localStorage
**Plans**: TBD

Plans:
- [ ] 04-01: TBD during phase planning

### Phase 5: Polish and Deploy
**Goal**: Calculator is production-ready and publicly accessible
**Depends on**: Phase 2, Phase 3, Phase 4
**Requirements**: UI-04
**Success Criteria** (what must be TRUE):
  1. Calculator has clean, minimal visual design matching project aesthetic
  2. Button presses show visual feedback (hover, active states)
  3. Calculator is deployed to GitHub Pages with working public URL
  4. Touch targets are large enough for comfortable mobile use (minimum 44×44px)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD during phase planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Calculator Engine | 1/1 | Complete | 2026-02-14 |
| 2. Display and Button Interface | 0/TBD | Not started | - |
| 3. Keyboard Support | 0/TBD | Not started | - |
| 4. Calculation History | 0/TBD | Not started | - |
| 5. Polish and Deploy | 0/TBD | Not started | - |
