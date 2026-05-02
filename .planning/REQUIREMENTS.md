# Requirements: Scriptorium Modernization

**Goal:** Improve reliability, state management, and offline support without introducing a build pipeline.

## 1. PWA & Offline Support
- **REQ-1.1:** Add `manifest.json` for installation.
- **REQ-1.2:** Implement a Service Worker (`sw.js`) to cache the App Shell (HTML, CSS, JS, Fonts).
- **REQ-1.3:** Allow read-only access to previously fetched Supabase data when offline.

## 2. Automated E2E Testing
- **REQ-2.1:** Setup Playwright in the repository.
- **REQ-2.2:** Write tests for the Authentication flow (Login/Logout).
- **REQ-2.3:** Write tests for the CRUD operations of Collections and Texts.

## 3. State & Architecture Refactoring
- **REQ-3.1:** Introduce a simple pub/sub or proxy mechanism for `State` to automatically trigger UI updates, replacing manual `UI.render...` calls.
- **REQ-3.2:** Componentize the code further to avoid a monolithic `app.js`.
