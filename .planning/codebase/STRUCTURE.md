# Codebase Structure

```
├── index.html        # Entry point, loads CDNs and src/app.js
├── styles/           # CSS styles (base styles)
└── src/
    ├── api/          # Supabase client and API wrappers (index.js, supabase.js)
    ├── components/   # UI rendering modules (layout/, collection-item.js, reading-pane.js, text-item.js)
    ├── core/         # Core logic (controllers.js, dom.js references, state.js, settings.js, tailwind-config.js)
    ├── utils/        # Utility functions (e.g., toast wrapper in index.js)
    └── app.js        # Main initialization and global event listener setup
```
