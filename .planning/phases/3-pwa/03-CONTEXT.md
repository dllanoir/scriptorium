# Phase 3: PWA & Offline Mode - Context

**Status:** Ready for planning
**Source:** ROADMAP.md

<domain>
## Phase Boundary
Implement Service Workers for caching and offline capabilities, and add a web app manifest for installability.
</domain>

<decisions>
## Implementation Decisions

### PWA Configuration
- [REQ-1.1] Add `manifest.json` for installation.
- [REQ-1.2] Implement a Service Worker (`sw.js`) to cache the App Shell (HTML, CSS, JS, Fonts).
- [REQ-1.3] Allow read-only access to previously fetched Supabase data when offline.

### the agent's Discretion
To satisfy offline data access without altering the frontend logic, the Service Worker will intercept all Supabase `GET` requests using a `NetworkFirst` strategy. If the network is unavailable, it will serve the last cached response. We will also cache static assets (CDNs, fonts) using `StaleWhileRevalidate` or `CacheFirst` strategies.
</decisions>
