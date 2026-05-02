# Roadmap: Scriptorium Modernization

**Goal:** Improve reliability, state management, and offline support without introducing a build pipeline.

## Phase 1: E2E Testing Foundation
**Goal:** Setup Playwright and cover critical flows before refactoring.
**Requirements:** REQ-2.1, REQ-2.2, REQ-2.3
**Status:** ⏳ Pending

## Phase 2: State Refactoring
**Goal:** Refactor the global `State` to be reactive and decouple the UI components.
**Requirements:** REQ-3.1, REQ-3.2
**Depends on:** Phase 1
**Status:** ⏳ Pending

## Phase 3: PWA & Offline Mode
**Goal:** Implement Service Workers for caching and offline capabilities.
**Requirements:** REQ-1.1, REQ-1.2, REQ-1.3
**Depends on:** Phase 2
**Status:** ⏳ Pending
