---
created: 2026-02-14
description: 빌드 없는 바닐라 JS 프로젝트를 GitHub Pages에 배포할 때 빠지는 함정들
---

# GitHub Pages 바닐라 JS 배포

빌드 단계 없는 정적 사이트를 GitHub Actions로 GitHub Pages에 배포할 때, 두 가지 비자명한 이슈가 있다.

## The Insight

GitHub Pages의 `actions/configure-pages`는 Pages가 미리 활성화되어 있어야 동작한다. 그리고 `username.github.io/repo-name/` 형태의 서브디렉토리 배포에서는 절대 경로(`/`)가 루트 도메인을 가리킨다.

## Why This Matters

모르면 이런 증상을 만난다:
1. **첫 배포가 실패** — "Get Pages site failed. Please verify that the repository has Pages enabled" 에러
2. **Favicon이 안 보임** — `/favicon.svg`가 `username.github.io/favicon.svg`(404)로 해석됨

## Recognition Pattern

- 빌드 도구 없는 프로젝트 (HTML/CSS/JS only)를 GitHub Pages에 처음 배포할 때
- 저장소 이름이 `username.github.io`가 아닌 일반 저장소일 때 (서브디렉토리 배포)

## The Approach

두 가지를 미리 처리한다: (1) configure-pages에 `enablement: true` 추가, (2) 모든 asset 경로를 상대 경로로.

### Step 1: 배포 워크플로우 작성

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5

      - name: Setup Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true  # 핵심: Pages를 자동으로 활성화

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: '.'  # 빌드 없으므로 루트 전체 업로드

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**핵심:** `enablement: true`가 없으면 Settings > Pages에서 수동으로 "GitHub Actions"를 선택해야 한다. 이 파라미터가 있으면 워크플로우가 자동으로 Pages를 활성화한다.

### Step 2: Asset 경로를 상대 경로로

```html
<!-- ❌ BAD: 절대 경로 — username.github.io/favicon.svg (404) -->
<link rel="icon" href="/favicon.svg">
<link rel="stylesheet" href="/css/main.css">

<!-- ✅ GOOD: 상대 경로 — username.github.io/repo-name/favicon.svg -->
<link rel="icon" href="./favicon.svg">
<link rel="stylesheet" href="./css/main.css">
```

JS의 `fetch`나 `import`도 마찬가지:

```javascript
// ❌ BAD
fetch('/api/data.json')

// ✅ GOOD
fetch('./api/data.json')
```

### Step 3: Push하면 끝

```bash
git push origin main
# → 워크플로우가 자동 실행
# → Pages 자동 활성화
# → https://username.github.io/repo-name/ 에서 접근 가능
```

## Example

실제 에러 → 수정 흐름:

```
# 1. 첫 push → Actions 탭에서 빨간 X
Error: Get Pages site failed. Please verify that the repository
has Pages enabled and configured to build using GitHub Actions,
or consider exploring the `enablement` parameter for this action.

# 2. deploy.yml에 enablement: true 추가 → 재push → 녹색 체크

# 3. 사이트 접속 → favicon 안 보임
#    DevTools Network 탭: /favicon.svg → 404
#    href="/favicon.svg" → href="./favicon.svg" 수정 → 해결
```

## 체크리스트

- [ ] `enablement: true` 추가됨
- [ ] 모든 asset 경로가 상대 경로 (`./` 또는 파일명만)
- [ ] `path: '.'`로 루트 전체 업로드 (빌드 없는 프로젝트)
- [ ] `permissions`에 `pages: write`, `id-token: write` 포함
