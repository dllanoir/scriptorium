---
wave: 3
depends_on: [2]
files_modified: ["index.html", "manifest.json", "sw.js", "src/app.js"]
autonomous: true
---

# Plan: Phase 3 - PWA & Offline Mode

## Objective
Transform Scriptorium into a Progressive Web App (PWA) with offline capabilities.

## Tasks

<task>
<id>1</id>
<title>Create Web App Manifest</title>
<description>Define the PWA metadata.</description>
<read_first>
- c:\Users\diogo\scriptorium\scriptorium\index.html
</read_first>
<action>
1. Create `manifest.json` in the root directory.
2. Define `name`, `short_name`, `start_url`, `display` ("standalone"), `background_color`, and `theme_color`.
3. Link `manifest.json` in the `<head>` of `index.html` (`<link rel="manifest" href="./manifest.json">`).
4. Set a placeholder configuration for icons (since actual icon files might be added later by the user).
</action>
<acceptance_criteria>
- `manifest.json` exists with standard PWA fields.
- `index.html` contains the manifest link.
</acceptance_criteria>
</task>

<task>
<id>2</id>
<title>Implement Service Worker</title>
<description>Create `sw.js` for caching strategies.</description>
<read_first>
- c:\Users\diogo\scriptorium\scriptorium\index.html
</read_first>
<action>
1. Create `sw.js` in the root directory.
2. Implement caching for the "App Shell" (local HTML, JS files) using `StaleWhileRevalidate`.
3. Implement `CacheFirst` for CDNs (Tailwind, Fonts).
4. Implement `NetworkFirst` with cache fallback for Supabase REST API `GET` requests (`https://*.supabase.co/rest/v1/*`), enabling offline read-only mode.
</action>
<acceptance_criteria>
- `sw.js` exists and handles `install`, `activate`, and `fetch` events.
- Supabase requests are cached.
</acceptance_criteria>
</task>

<task>
<id>3</id>
<title>Register Service Worker and Adjust CSP</title>
<description>Initialize the PWA in the main application logic.</description>
<read_first>
- c:\Users\diogo\scriptorium\scriptorium\src\app.js
- c:\Users\diogo\scriptorium\scriptorium\index.html
</read_first>
<action>
1. Add `'self'` to the `connect-src` directive in the CSP meta tag inside `index.html` to ensure `sw.js` can perform local fetches without issues.
2. Add Service Worker registration code (`navigator.serviceWorker.register`) at the top of `attachEventListeners` or initialization flow in `src/app.js`.
</action>
<acceptance_criteria>
- Service worker registers successfully in the browser console.
- Application functions normally.
</acceptance_criteria>
</task>

## Verification
- Disconnect the network locally (or mock it in Playwright if needed) and verify that the `http-server` still serves the UI and the cached Supabase data via the Service Worker.
