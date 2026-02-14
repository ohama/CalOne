# Phase 5: Polish and Deploy - Research

**Researched:** 2026-02-14
**Domain:** GitHub Pages deployment, CSS visual polish, production static site deployment
**Confidence:** HIGH

## Summary

This phase focuses on deploying a production-ready vanilla JavaScript calculator to GitHub Pages while ensuring visual polish and accessibility standards are met. The research confirms that the project's existing stack (vanilla JS with ES modules, no build process) is ideal for GitHub Pages deployment.

Key findings:
- **GitHub Pages native ES modules support**: Modern browsers (2026) fully support ES modules natively, and GitHub Pages serves them correctly with proper MIME types without requiring build steps or transpilation
- **GitHub Actions deployment**: Official actions/deploy-pages provides a standardized, single-job workflow for static sites requiring only contents:read, pages:write, and id-token:write permissions
- **Visual feedback standards**: Current CSS already implements industry best practices (150ms transitions, transform/opacity for performance, @media(hover:hover) guards)
- **Touch targets**: Existing buttons (60px mobile, 80px tablet+) exceed WCAG 2.2 Level AA minimum (24px) and meet iOS/Android best practices (44-48px)
- **Production checklist**: Static sites need favicon, meta tags, validation, and cross-browser testing before deployment

The calculator already meets most polish requirements. The primary work is setting up the GitHub Pages deployment workflow and adding production-ready meta tags/favicon.

**Primary recommendation:** Use official GitHub Actions (actions/configure-pages, actions/upload-pages-artifact, actions/deploy-pages) to deploy the existing source directory without build steps. Add minimal meta tags and favicon to meet production standards.

## Standard Stack

### Core Deployment Infrastructure

| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| GitHub Pages | Native | Static site hosting | Free, HTTPS included, official GitHub integration |
| GitHub Actions | actions/checkout@v5 | Repository checkout | Official GitHub action, required first step |
| actions/configure-pages@v5 | v5 | Setup Pages environment | Official, handles Pages-specific config |
| actions/upload-pages-artifact@v4 | v4 | Package deployment files | Official, creates compliant gzip/tar artifact |
| actions/deploy-pages@v4 | v4 | Deploy to Pages | Official, handles OIDC authentication |

### Supporting Tools (Optional)

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| gh-pages CLI | npm package | Manual deployment | CLI-based deployment workflow |
| peaceiris/actions-gh-pages | Community | Alternative deployer | More features, not needed for simple static sites |
| HTML validators | W3C | Pre-deploy validation | Quality assurance before production |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| GitHub Actions | Netlify/Vercel | More features (redirects, edge functions) but unnecessary complexity for static calculator |
| Native ES modules | Build step with Vite/Parcel | Bundling/minification, but adds complexity and defeats project's build-free design principle |
| Official actions | gh-pages npm CLI | Works but requires Node.js in workflow, less integrated |

**Installation:**
No packages to install. GitHub Actions are referenced in workflow YAML. Project already has ES modules configured (`type: "module"` in package.json).

## Architecture Patterns

### Recommended Project Structure

For static GitHub Pages deployment without build process:

```
project-root/
├── .github/
│   └── workflows/
│       ├── test.yml           # Existing CI testing
│       └── deploy.yml         # NEW: GitHub Pages deployment
├── css/
│   └── main.css               # Existing styles (already polished)
├── js/
│   ├── calculator.js          # ES module
│   ├── history.js             # ES module
│   └── main.js                # Entry point
├── index.html                 # Root HTML (needs meta tags added)
├── favicon.ico                # NEW: Production favicon
└── README.md
```

### Pattern 1: Single-Job Static Deployment

**What:** Deploy entire directory as-is to GitHub Pages using official actions
**When to use:** Static sites with no build process (vanilla HTML/CSS/JS)

**Example:**
```yaml
# Source: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

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

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Pattern 2: Production HTML Meta Tags

**What:** Essential meta tags for production static sites
**When to use:** All public-facing sites

**Example:**
```html
<!-- Source: https://frontendchecklist.io/ -->
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cal - Calculator</title>
  <meta name="description" content="Clean, minimal calculator with keyboard support and calculation history">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="stylesheet" href="css/main.css">
</head>
```

### Pattern 3: CSS Performance Transitions

**What:** Use transform and opacity for smooth animations
**When to use:** All button hover/active states

**Example:**
```css
/* Source: https://web.dev/learn/css/transitions */
.button {
  transition: filter 0.15s, transform 0.15s;
}

/* GPU-accelerated properties only */
.button:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}

/* Avoid: triggers layout recalculation */
.button-bad:active {
  width: calc(100% - 2px);  /* SLOW - causes reflow */
  margin-left: 1px;         /* SLOW - causes reflow */
}
```

### Anti-Patterns to Avoid

- **Building ES modules unnecessarily:** Native browser support for ES modules is universal in 2026. Don't add Webpack/Vite unless you need features like code splitting or minification for performance (this project doesn't).

- **Uploading SSL certificates:** GitHub Pages auto-generates Let's Encrypt certificates. You cannot and should not try to upload custom certificates.

- **Deploying node_modules/:** The workflow should exclude development dependencies. Use `path: '.'` with upload-pages-artifact but ensure .gitignore prevents node_modules from being committed.

- **Hover-only interactions:** Don't make functionality only accessible via hover states. The project correctly uses @media (hover: hover) to conditionally apply hover styles only on devices with hover capability.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GitHub Pages deployment | Custom FTP/rsync scripts | GitHub Actions official actions | Handles OIDC auth, artifact packaging, deployment status, environment URLs automatically |
| HTTPS/SSL setup | Manual certificate management | GitHub Pages built-in Let's Encrypt | Free, auto-renewing, zero configuration required |
| Favicon generation | Manual PNG/ICO creation | Favicon generators or design tools | Need multiple sizes (16, 32, 180, 192), correct formats, and proper compression |
| Cross-browser testing | Manual testing in multiple browsers | BrowserStack, real device testing | Modern ES modules work everywhere, but test Safari, mobile Safari, Chrome, Firefox, Edge |
| HTML/CSS validation | Manual code review | W3C validators | Catches malformed markup, accessibility issues, deprecated attributes |

**Key insight:** GitHub's official actions ecosystem handles the complex parts of static site deployment (OIDC tokens, artifact compression, deployment orchestration). Using community actions or custom scripts replicates effort and misses security/reliability features.

## Common Pitfalls

### Pitfall 1: GitHub Pages Repository Settings Not Configured

**What goes wrong:** Workflow succeeds but site doesn't deploy or returns 404

**Why it happens:** GitHub Pages requires enabling in repository settings. The workflow can run successfully but Pages won't serve files if not enabled in Settings → Pages → Build and deployment → "GitHub Actions" source.

**How to avoid:**
1. Go to repository Settings → Pages
2. Under "Build and deployment", set Source to "GitHub Actions" (not "Deploy from a branch")
3. This enables the pages:write permission to work correctly

**Warning signs:** Workflow shows green checkmark but site URL returns 404, or "Settings → Pages" shows "Your site is ready to be published" but no URL appears.

### Pitfall 2: Aggressive Browser Favicon Caching

**What goes wrong:** After adding/updating favicon, users still see old icon or no icon for hours or days

**Why it happens:** Browsers cache favicons extremely aggressively at the URL level, separate from normal HTTP caching headers. Changing the file doesn't clear the cache.

**How to avoid:**
- Use versioned URLs during development: `/favicon.ico?v=2026-02-14`
- Or use content-addressed filenames: `/favicon-abc123.ico`
- Test in incognito/private browsing mode
- For production: Accept that updates take time to propagate (24-48 hours)

**Warning signs:** Local HTML shows `<link rel="icon">` but browser tab shows generic icon or old icon. Hard refresh (Ctrl+Shift+R) doesn't fix it.

### Pitfall 3: ES Module MIME Type Issues

**What goes wrong:** JavaScript files load but modules fail with "Failed to load module script" or MIME type errors

**Why it happens:** Server must send `Content-Type: text/javascript` or `application/javascript` for ES modules. Some servers incorrectly send `text/plain`.

**How to avoid:**
- GitHub Pages automatically serves .js files with correct MIME type
- Verify in browser DevTools Network tab: check Response Headers for Content-Type
- If using custom server (not GitHub Pages), configure MIME types explicitly

**Warning signs:** Console errors mentioning "MIME type ('text/plain') is not a supported JavaScript MIME type" or modules that work locally but fail on deployment.

### Pitfall 4: Missing Permissions in Workflow

**What goes wrong:** Workflow fails with "Resource not accessible by integration" or "Insufficient permissions"

**Why it happens:** GitHub Actions requires explicit permissions for Pages deployment. Default token doesn't include pages:write or id-token:write.

**How to avoid:**
```yaml
permissions:
  contents: read      # Read repository
  pages: write        # Deploy to Pages
  id-token: write     # OIDC token for verification
```

**Warning signs:** Workflow fails at deploy-pages step with 403 or permissions error, despite checkout and upload steps succeeding.

### Pitfall 5: Touch Target Size Below Accessibility Threshold

**What goes wrong:** Mobile users struggle to tap buttons, high error rates, accessibility audits fail

**Why it happens:** Designers use desktop dimensions (e.g., 32px) without testing on physical mobile devices. WCAG 2.2 Level AA requires minimum 24×24 CSS pixels, but iOS recommends 44px and Android 48dp for comfortable use.

**How to avoid:**
- Mobile base: 44px minimum (matches iOS guidelines)
- Tablet+: Can increase to 60-80px for better comfort
- Test on real devices, not just browser DevTools device mode
- Current project already uses 60px mobile / 80px tablet — exceeds all standards

**Warning signs:** Users report "hard to tap buttons", accessibility audit tools flag touch targets, high accidental click rate on adjacent buttons.

## Code Examples

Verified patterns from official sources:

### Deploy Workflow - Complete Example

```yaml
# Source: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
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

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### CSS Button States - Performance Optimized

```css
/* Source: https://web.dev/learn/css/transitions */

/* Base button with performant transitions */
.button {
  height: 60px;
  border: none;
  background: #e0e0e0;
  cursor: pointer;
  /* Only animate GPU-accelerated properties */
  transition: filter 0.15s, transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}

/* Hover - only on capable devices */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    filter: brightness(0.95);
  }
}

/* Active - all devices */
.button:active {
  filter: brightness(0.9);
  transform: scale(0.98);  /* Avoids layout recalculation */
}

/* Focus - keyboard accessibility */
.button:focus-visible {
  outline: 2px solid #007AFF;
  outline-offset: -2px;
  z-index: 1;
}

/* Tablet and up - larger touch targets */
@media (min-width: 768px) {
  .button {
    height: 80px;
    font-size: 1.5rem;
  }
}
```

### Production HTML Head

```html
<!-- Source: https://frontendchecklist.io/ -->
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- SEO -->
  <title>Cal - Calculator</title>
  <meta name="description" content="Clean, minimal calculator with keyboard support and calculation history">

  <!-- Favicon - modern browsers prefer SVG, fallback to ICO -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Styles -->
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <!-- Content -->

  <!-- ES Module - works natively in all modern browsers -->
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### Favicon Files Needed

```
# Source: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs

Root directory:
├── favicon.ico              # 32x32, fallback for old browsers
├── favicon.svg              # Modern browsers, scalable
├── favicon-32x32.png        # Standard size
└── apple-touch-icon.png     # 180x180, iOS home screen
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual FTP deployment | GitHub Actions workflows | ~2019 | Automated, versioned, rollback-capable deployments |
| Branch-based Pages (gh-pages) | Actions-based deployment | 2022 | No extra branch needed, cleaner repo |
| Build step for ES modules | Native browser support | 2020+ | Zero-config deployment for modern JS |
| Multiple favicon sizes (10+) | SVG + 3 PNGs | 2021+ | Simpler, smaller file count, scalable |
| Manual SSL certificates | Let's Encrypt auto-cert | 2018+ | Free HTTPS for all Pages sites |
| WCAG 2.1 (44px touch targets) | WCAG 2.2 (24px minimum, AA) | 2023 | More flexible but 44px still recommended |
| Hover-always CSS | @media (hover: hover) | 2018+ | Better mobile UX, no sticky hover states |

**Deprecated/outdated:**
- **gh-pages npm package:** Still works but Actions workflow is now preferred (more integrated, no local dependencies)
- **Jekyll processing:** GitHub Pages defaults to Jekyll unless you add `.nojekyll` file. For vanilla JS projects, add this file to prevent Jekyll from ignoring files starting with underscore.
- **Branch deployment:** "Deploy from a branch" still works but "GitHub Actions" source is recommended for modern workflows
- **ICO-only favicons:** Still supported but SVG-first approach is modern standard

## Open Questions

Things that couldn't be fully resolved:

1. **Custom domain setup**
   - What we know: GitHub Pages supports free custom domains with auto-SSL via Let's Encrypt
   - What's unclear: Whether this project will use username.github.io/cal or a custom domain
   - Recommendation: Start with default github.io URL, document custom domain setup in README if needed later

2. **Minification for production**
   - What we know: Project philosophy is "build-free deployment"
   - What's unclear: Whether CSS/JS minification would provide meaningful performance benefit for this small calculator (< 500 KB total)
   - Recommendation: Deploy unminified first, measure real-world performance. Project is already small enough (3 JS files, 1 CSS file) that minification impact is minimal.

3. **Analytics and monitoring**
   - What we know: GitHub Pages doesn't provide built-in analytics
   - What's unclear: Whether user analytics/error tracking is desired for this project
   - Recommendation: Skip analytics for v1 unless specifically requested. Project is a demonstration calculator, not a service requiring monitoring.

## Sources

### Primary (HIGH confidence)

- [GitHub Docs - Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) - Official deployment workflow structure
- [GitHub actions/deploy-pages](https://github.com/actions/deploy-pages) - Official deployment action documentation
- [GitHub Docs - Securing GitHub Pages with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) - SSL/TLS setup
- [W3C WCAG 2.2 SC 2.5.5 - Target Size Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) - Touch target accessibility standards
- [MDN - JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) - ES modules browser support
- [web.dev - CSS Transitions](https://web.dev/learn/css/transitions) - Performance-optimized transition patterns

### Secondary (MEDIUM confidence)

- [Evil Martians - How to Favicon in 2021](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) - Modern favicon setup (2021, still current in 2026)
- [Frontend Checklist](https://frontendchecklist.io/) - Production deployment checklist (community-maintained)
- [DevToolbox - CSS Transforms & Transitions Guide 2026](https://devtoolbox.dedyn.io/blog/css-transforms-transitions-guide) - Performance best practices
- [Smashing Magazine - Accessible Target Sizes](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/) - Touch target UX research

### Tertiary (LOW confidence)

- [WebSearch: "minimal clean UI design calculator 2026 trends"](https://medium.com/design-bootcamp/top-ui-ux-trends-to-watch-in-2026-379a955ce591) - Design trends (opinion-based, not technical requirement)
- [WebSearch: "GitHub Pages ES modules browser support"](https://github.com/MicahZoltu/browser-es-modules-template) - Community examples (confirms technical feasibility but not authoritative)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official GitHub documentation and established Actions ecosystem
- Architecture: HIGH - Simple static deployment, well-documented official patterns
- Pitfalls: MEDIUM - Based on common issues from community discussions and GitHub issue threads, not exhaustive testing
- Visual polish: HIGH - CSS already implements documented best practices (verified against current source code)
- Touch targets: HIGH - Existing implementation (60px/80px) exceeds WCAG 2.2 Level AA (24px) and platform recommendations (44-48px)

**Research date:** 2026-02-14
**Valid until:** 2026-08-14 (6 months) - GitHub Actions and Pages are stable infrastructure; CSS standards evolve slowly; WCAG 2.2 is current standard through 2026
