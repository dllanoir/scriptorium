# Phase 2: State Refactoring - Context

**Status:** Ready for planning
**Source:** ROADMAP.md

<domain>
## Phase Boundary
Refactor the global `State` to be reactive and decouple the UI components.
</domain>

<decisions>
## Implementation Decisions

### State
- [REQ-3.1] Introduce a simple proxy mechanism for State to automatically trigger UI updates, replacing manual UI.render... calls.
- [REQ-3.2] Componentize the code further to avoid a monolithic app.js.

### the agent's Discretion
We will use an ES6 `Proxy` wrapper around the global `State` object. This allows us to intercept property assignments (e.g. `State.activeTextId = 1`) and automatically notify listeners without having to change all the assignment syntax throughout the application. We will then subscribe the `UI` rendering functions to these state changes in `app.js` and remove direct UI calls from `Controllers`.
</decisions>
