# Integrations

## Supabase
- **Authentication**: Email/Password auth (`supabase.auth.signInWithPassword`, `signOut`, `getUser`, `onAuthStateChange`).
- **Database**:
  - `collections` table: stores user collections (id, name, icon).
  - `texts` table: stores text notes (id, title, collectionId, content, created_at).
- **Integration Layer**: `src/api/supabase.js` initializes the Supabase client using CDN SDK. `src/api/index.js` abstracts the API methods for CRUD operations.
