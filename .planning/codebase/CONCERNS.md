# Concerns

- **No Build Pipeline**: Since there is no bundler (Vite, Webpack) or minifier, the code is loaded exactly as authored. As the application grows, this will result in many network requests for ES modules, degrading initial load performance.
- **CDN Dependencies**: Critical libraries (Tailwind, Supabase, DOMPurify, Toastify) are loaded via CDN. If a CDN is down or blocked by a firewall, the application fails to load or function correctly.
- **Tailwind Runtime Compilation**: Tailwind is loaded via script tag (`https://cdn.tailwindcss.com`), which parses classes and injects styles at runtime in the browser. This is not recommended for production environments due to performance overhead.
- **Global State Mutation**: The `State` object is a mutable global variable. Complex interactions might lead to race conditions or inconsistent UI updates since there is no reactive framework (like React or Vue) to enforce state-driven rendering.
