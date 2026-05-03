---
wave: 2
depends_on: [1]
files_modified: ["src/core/state.js", "src/app.js", "src/core/controllers.js"]
autonomous: true
---

# Plan: Phase 2 - State Refactoring

## Objective
Refactor the global `State` object using an ES6 Proxy to enable reactivity, and decouple the `Controllers` from the `UI` rendering logic.

## Tasks

<task>
<id>1</id>
<title>Implement Reactive Proxy State</title>
<description>Update `src/core/state.js` to export a Proxy-based state and a `subscribe` function.</description>
<read_first>
- c:\Users\diogo\scriptorium\scriptorium\src\core\state.js
</read_first>
<action>
1. Wrap the existing state object in a `Proxy`.
2. Intercept the `set` trap to update the value and call a `notify(prop, value)` function.
3. Implement `subscribe(listener)` to allow other modules to listen to state changes.
4. Export the Proxy as `State` and the `subscribe` function.
</action>
<acceptance_criteria>
- `State` behaves identically to consumers for getting/setting properties.
- Changes to `State` trigger subscribed listener functions with the changed property name.
</acceptance_criteria>
</task>

<task>
<id>2</id>
<title>Decouple Controllers</title>
<description>Remove manual UI rendering calls from `Controllers` and `Api`.</description>
<read_first>
- c:\Users\diogo\scriptorium\scriptorium\src\core\controllers.js
</read_first>
<action>
1. In `src/core/controllers.js`, remove all calls to `UI.renderCollections()`, `UI.renderTextList()`, `UI.renderTextContent()`, and `UI.updateAuthUI()`.
2. In `src/app.js` where `Api.onAuthStateChange` is called, set `State.user = session` instead of calling `UI.updateAuthUI(session)` directly.
</action>
<acceptance_criteria>
- `Controllers` no longer call `UI.render...` functions for data display.
</acceptance_criteria>
</task>

<task>
<id>3</id>
<title>Bind UI Subscriptions</title>
<description>Subscribe UI renders to state changes in `app.js`.</description>
<read_first>
- c:\Users\diogo\scriptorium\scriptorium\src\app.js
</read_first>
<action>
1. Import `subscribe` from `src/core/state.js` into `src/app.js`.
2. Implement a listener that checks which property changed.
3. If `prop === 'collections'` -> call `UI.renderCollections()`.
4. If `prop === 'texts'` or `prop === 'activeCollectionId'` -> call `UI.renderTextList()` and `UI.renderTextContent()`.
5. If `prop === 'activeTextId'` -> call `UI.renderTextContent()`.
6. If `prop === 'user'` -> call `UI.updateAuthUI(value)`.
</action>
<acceptance_criteria>
- The UI automatically updates when `State` properties are mutated.
- The application functions exactly as before.
</acceptance_criteria>
</task>

## Verification
- Serve the application and verify that clicking collections and texts still updates the UI correctly.
- Run `npx playwright test` to ensure E2E behavior hasn't regressed.

## Must-Haves
- `State` is a Proxy.
- `Controllers` do not manually call `UI.render...` for core data loops.
