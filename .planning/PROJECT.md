# Scriptorium - Modernization

**Start Date:** 2026-05-02
**Status:** Active
**Primary Value:** A pure Vanilla JS "Digital Sanctuary" for reading and writing notes, maintaining a zero-build pipeline for GitHub Pages deployment.

## Context

Scriptorium is an existing web application built with vanilla JavaScript, Tailwind CSS (via CDN), and Supabase. The goal of this modernization effort is to enhance the application's robustness, offline capabilities, and maintainability without introducing a build step (e.g., Vite/Webpack). The project relies directly on ES modules in the browser.

## Core Pillars

1. **Zero-Build Pipeline:** Source code is pushed directly to GitHub Pages; no compilation, bundling, or transpilation steps.
2. **Offline-First (PWA):** The app must be resilient and usable offline via Service Workers and local caching.
3. **Quality Assurance:** E2E testing (via Playwright) ensures core flows don't break over time.

## Requirements

### Validated

- ✓ Vanilla JS ES Modules architecture
- ✓ Supabase integration for Auth and DB
- ✓ Tailwind CSS styling via CDN

### Active

- [ ] Add Service Worker for caching assets and offline reading capabilities (PWA).
- [ ] Implement Playwright E2E tests for core user flows (Login, Create Text, Edit Text).
- [ ] Refactor `State` object for better predictability and clean up DOM access patterns.

### Out of Scope

- [Vite/Webpack/Bundlers] — Maintaining the zero-build philosophy for raw GitHub Pages deployment.
- [Tailwind Build Step] — Staying with the CDN approach.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Retain CDN and raw ES Modules | Simplifies deployment to GitHub Pages (no Actions needed) | Pending |
| Use Playwright for tests | Runs externally against the DOM, requiring zero changes to the app's buildless nature | Pending |
| Add PWA Support | Aligns with the "sanctuary" concept, allowing reading disconnected from the web | Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-02 after initialization*
