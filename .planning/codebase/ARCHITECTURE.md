# Architecture

The application is a purely static Single Page Application (SPA) without a build step (no bundler). It runs directly in the browser using ES6 modules and relies heavily on external CDNs.

## Key Patterns
- **MVC-like Structure**: 
  - **Models/State**: `src/core/state.js` holds global application state (user, active text, etc.).
  - **Views/UI**: `src/components/` handles DOM manipulation and UI rendering (e.g., `text-item.js`, `reading-pane.js`).
  - **Controllers**: `src/core/controllers.js` coordinates between the UI, State, and API.
- **Service Layer**: `src/api/` isolates Supabase database and authentication calls, keeping data access out of the controllers.
- **Global Event Delegation**: Event listeners are attached globally in `src/app.js` and rely on event delegation (`e.target.closest()`) rather than binding to individual elements.
