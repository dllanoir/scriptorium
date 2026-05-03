# Conventions

- **Module System**: Uses native ES6 modules (`import`/`export`) directly in the browser without transpilation.
- **State Management**: Uses a simple global singleton object (`State` in `src/core/state.js`) to track active entities (user, active selection, loading states).
- **DOM Access**: Centralized DOM element references are stored in `src/core/dom.js`. Elements are prefixed with `DOM.` when accessed across the application.
- **Styling**: Utility-first CSS using Tailwind CSS classes directly in HTML and JS strings. Custom configuration is loaded at runtime via `src/core/tailwind-config.js`.
- **Event Handling**: Prefers attaching listeners in a centralized location (`app.js`) using event delegation to handle dynamic UI elements instead of individual component bindings.
